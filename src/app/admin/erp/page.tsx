import { supabaseAdmin } from '@/lib/supabase/server'
import ERPDashboardClient from './ERPDashboardClient'

export const revalidate = 0

export default async function ERPPage() {
  const admin = supabaseAdmin()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // 방문자
  const { count: todayVisits } = await admin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart.toISOString())
  const { data: dailyRaw } = await admin.from('page_visits').select('visited_at').gte('visited_at', thirtyDaysAgo.toISOString()).order('visited_at', { ascending: true })
  const dailyMap: Record<string, number> = {}
  dailyRaw?.forEach((v: any) => {
    const d = new Date(v.visited_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyMap[key] = (dailyMap[key] || 0) + 1
  })
  const dailyVisits: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyVisits.push({ date: key, count: dailyMap[key] || 0 })
  }
  const totalLast30 = dailyVisits.reduce((s, d) => s + d.count, 0)
  const dailyAvg = Math.round(totalLast30 / 30)
  const { count: weekTotal } = await admin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', sevenDaysAgo.toISOString())
  const weeklyAvg = Math.round((weekTotal ?? 0) / 7)

  // 페이지별 방문
  const { data: pageVisitRaw } = await admin.from('page_visits').select('page').gte('visited_at', thirtyDaysAgo.toISOString())
  const pageMap: Record<string, number> = {}
  pageVisitRaw?.forEach((v: any) => { const p = v.page || '/'; pageMap[p] = (pageMap[p] || 0) + 1 })

  // 유저
  const { data: profiles } = await admin.from('profiles').select('*').order('created_at', { ascending: false })
  const nationalityMap: Record<string, number> = {}
  profiles?.forEach((p: any) => { const n = p.nationality || 'Unknown'; nationalityMap[n] = (nationalityMap[n] || 0) + 1 })
  const genderMap: Record<string, number> = {}
  profiles?.forEach((p: any) => { const g = p.gender || 'Unknown'; genderMap[g] = (genderMap[g] || 0) + 1 })
  const ageMap: Record<string, number> = {}
  const currentYear = now.getFullYear()
  profiles?.forEach((p: any) => {
    if (!p.birth_year) { ageMap['Unknown'] = (ageMap['Unknown'] || 0) + 1; return }
    const age = currentYear - p.birth_year
    const b = age < 20 ? '<20' : age < 25 ? '20-24' : age < 30 ? '25-29' : age < 35 ? '30-34' : age < 40 ? '35-39' : '40+'
    ageMap[b] = (ageMap[b] || 0) + 1
  })
  const interestMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    try {
      const parsed = typeof p.referral_source === 'string' ? JSON.parse(p.referral_source) : p.referral_source
      const interests = parsed?.interests ?? []
      interests.forEach((i: string) => { interestMap[i] = (interestMap[i] || 0) + 1 })
    } catch {}
  })

  // 신규 가입 (최근 30일)
  const newUsers30 = profiles?.filter(p => new Date(p.created_at) > thirtyDaysAgo).length ?? 0
  const newUsers7 = profiles?.filter(p => new Date(p.created_at) > sevenDaysAgo).length ?? 0

  // 일별 가입자
  const signupMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    const d = new Date(p.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (new Date(p.created_at) > thirtyDaysAgo) signupMap[key] = (signupMap[key] || 0) + 1
  })
  const dailySignups: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailySignups.push({ date: key, count: signupMap[key] || 0 })
  }

  // 이벤트
  const { data: events } = await admin.from('events').select('id, title, starts_at, status, capacity, is_free, price_krw').order('starts_at', { ascending: false }).limit(50)

  // 주문
  const { data: allOrders } = await admin.from('orders')
    .select('*, events(id, title), profiles(display_name, email, real_name, nationality, gender, birth_date, phone)')
    .order('created_at', { ascending: false })

  // 매출 계산
  const paidOrders = allOrders?.filter(o => o.status === 'paid') ?? []
  const totalRevenue = paidOrders.reduce((s, o) => s + (o.amount_krw || 0), 0)
  const todayRevenue = paidOrders.filter(o => new Date(o.created_at) > todayStart).reduce((s, o) => s + (o.amount_krw || 0), 0)
  const monthRevenue = paidOrders.filter(o => new Date(o.created_at) > thirtyDaysAgo).reduce((s, o) => s + (o.amount_krw || 0), 0)

  // 이벤트별 매출
  const revenueByEvent: Record<string, number> = {}
  paidOrders.forEach((o: any) => {
    const t = o.events?.title || 'Unknown'
    revenueByEvent[t] = (revenueByEvent[t] || 0) + (o.amount_krw || 0)
  })

  // CS
  const { data: csTickets } = await admin.from('cs_tickets').select('*').order('created_at', { ascending: false }).limit(100)
  const openCs = csTickets?.filter(c => c.status === 'open').length ?? 0
  const { count: totalCs } = await admin.from('cs_tickets').select('*', { count: 'exact', head: true })

  // 체험단
  const { data: experiences } = await admin.from('experience_events').select('id, title, status, capacity, created_at').order('created_at', { ascending: false })
  const { data: expApplications } = await admin.from('experience_applications').select('*, experience_events(title)').order('created_at', { ascending: false })

  return (
    <ERPDashboardClient
      todayVisits={todayVisits ?? 0}
      dailyAvg={dailyAvg}
      weeklyAvg={weeklyAvg}
      monthlyAvg={dailyAvg}
      totalUsers={profiles?.length ?? 0}
      newUsers30={newUsers30}
      newUsers7={newUsers7}
      dailyVisits={dailyVisits}
      dailySignups={dailySignups}
      nationalityMap={nationalityMap}
      genderMap={genderMap}
      ageMap={ageMap}
      interestMap={interestMap}
      pageMap={pageMap}
      events={events ?? []}
      allOrders={allOrders ?? []}
      totalRevenue={totalRevenue}
      todayRevenue={todayRevenue}
      monthRevenue={monthRevenue}
      revenueByEvent={revenueByEvent}
      csTickets={csTickets ?? []}
      openCs={openCs}
      totalCs={totalCs ?? 0}
      experiences={experiences ?? []}
      expApplications={expApplications ?? []}
      referralMap={{}}
    />
  )
}
