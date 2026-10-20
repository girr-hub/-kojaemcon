import { supabaseAdmin } from '@/lib/supabase/server'
import ERPDashboardClient from './ERPDashboardClient'

export const revalidate = 0

export default async function ERPPage() {
  const admin = supabaseAdmin()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const { count: todayVisits } = await admin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart.toISOString())
  const { data: dailyRaw } = await admin.from('page_visits').select('visited_at').gte('visited_at', ninetyDaysAgo.toISOString()).order('visited_at', { ascending: true })
  const dailyMap: Record<string, number> = {}
  dailyRaw?.forEach((v: any) => {
    const d = new Date(v.visited_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyMap[key] = (dailyMap[key] || 0) + 1
  })
  const dailyVisits: { date: string; count: number }[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyVisits.push({ date: key, count: dailyMap[key] || 0 })
  }
  const totalLast90 = dailyVisits.reduce((s, d) => s + d.count, 0)
  const dailyAvg = Math.round(totalLast90 / 90)
  const { count: weekTotal } = await admin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', sevenDaysAgo.toISOString())
  const weeklyAvg = Math.round((weekTotal ?? 0) / 7)

  const { data: pageVisitRaw } = await admin.from('page_visits').select('page').gte('visited_at', thirtyDaysAgo.toISOString())
  const pageMap: Record<string, number> = {}
  pageVisitRaw?.forEach((v: any) => { const p = v.page || '/'; pageMap[p] = (pageMap[p] || 0) + 1 })

  const { data: hourlyVisitRaw } = await admin.from('page_visits').select('visited_at').gte('visited_at', thirtyDaysAgo.toISOString())
  const hourlyVisitMap: Record<number, number> = {}
  for (let h = 0; h < 24; h++) hourlyVisitMap[h] = 0
  hourlyVisitRaw?.forEach((v: any) => {
    const h = new Date(v.visited_at).getHours()
    hourlyVisitMap[h] = (hourlyVisitMap[h] || 0) + 1
  })

  const weekdayNames = ['일', '월', '화', '수', '목', '금', '토']
  const weekdayVisitMap: Record<string, number> = { '일': 0, '월': 0, '화': 0, '수': 0, '목': 0, '금': 0, '토': 0 }
  hourlyVisitRaw?.forEach((v: any) => {
    const w = new Date(v.visited_at).getDay()
    weekdayVisitMap[weekdayNames[w]] = (weekdayVisitMap[weekdayNames[w]] || 0) + 1
  })

  const { data: visitData } = await admin.from('page_visits').select('page, duration_seconds').gte('visited_at', thirtyDaysAgo.toISOString()).gt('duration_seconds', 0)
  const durationByPage: Record<string, { total: number; count: number }> = {}
  visitData?.forEach((v: any) => {
    if (!durationByPage[v.page]) durationByPage[v.page] = { total: 0, count: 0 }
    durationByPage[v.page].total += v.duration_seconds
    durationByPage[v.page].count += 1
  })
  const avgDurationByPage = Object.fromEntries(
    Object.entries(durationByPage).map(([k, v]) => [k, Math.round((v as any).total / (v as any).count)])
  )
  const totalVisits30 = pageVisitRaw?.length ?? 0
  const { data: dailyUVRaw } = await admin
    .from('page_visits')
    .select('visited_at, session_id, user_id')
    .gte('visited_at', ninetyDaysAgo.toISOString())

  const dailyUVMapSet: Record<string, Set<string>> = {}
  dailyUVRaw?.forEach((v: any) => {
    const d = new Date(v.visited_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (!dailyUVMapSet[key]) dailyUVMapSet[key] = new Set()
    dailyUVMapSet[key].add(v.session_id || v.user_id || 'anon')
  })
  const dailyUV: { date: string; count: number }[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyUV.push({ date: key, count: dailyUVMapSet[key]?.size || 0 })
  }

  const todayUVSet = new Set<string>()
  dailyUVRaw?.filter((v: any) => new Date(v.visited_at) >= todayStart).forEach((v: any) => {
    todayUVSet.add(v.session_id || v.user_id || 'anon')
  })
  const todayUV = todayUVSet.size

  const monthlyUVMapSet: Record<string, Set<string>> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    monthlyUVMapSet[key] = new Set()
  }
  dailyUVRaw?.forEach((v: any) => {
    const d = new Date(v.visited_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    if (key in monthlyUVMapSet) monthlyUVMapSet[key].add(v.session_id || v.user_id || 'anon')
  })
  const monthlyUV: Record<string, number> = Object.fromEntries(
    Object.entries(monthlyUVMapSet).map(([k, v]) => [k, (v as Set<string>).size])
  )

  const thirtyDayVisitsAll = dailyUVRaw?.filter((v: any) => new Date(v.visited_at) >= thirtyDaysAgo) ?? []
  const loggedInVisits = thirtyDayVisitsAll.filter((v: any) => !!v.user_id).length
  const anonVisits = thirtyDayVisitsAll.filter((v: any) => !v.user_id).length
  const loginRatioMap = { loggedIn: loggedInVisits, anonymous: anonVisits }

  const anonPageMap: Record<string, number> = {}
  dailyUVRaw?.filter((v: any) => !v.user_id && new Date(v.visited_at) >= thirtyDaysAgo).forEach((v: any) => {
    const p = (v as any).page || '/'
    anonPageMap[p] = (anonPageMap[p] || 0) + 1
  })

  const uvSet30 = new Set<string>()
  thirtyDayVisitsAll.forEach((v: any) => {
    uvSet30.add(v.session_id || v.user_id || 'anon')
  })
  const funnelData = {
    visitors: uvSet30.size,
    signups: newUsers30,
    paid: 0,
    visitToSignup: uvSet30.size > 0 ? Math.round((newUsers30 / uvSet30.size) * 1000) / 10 : 0,
    signupToPaid: 0,
  }

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

  const newUsers30 = profiles?.filter(p => new Date(p.created_at) > thirtyDaysAgo).length ?? 0
  const newUsers7 = profiles?.filter(p => new Date(p.created_at) > sevenDaysAgo).length ?? 0

  const signupMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    const d = new Date(p.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (new Date(p.created_at) > ninetyDaysAgo) signupMap[key] = (signupMap[key] || 0) + 1
  })
  const dailySignups: { date: string; count: number }[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailySignups.push({ date: key, count: signupMap[key] || 0 })
  }

  const { data: events } = await admin.from('events').select('id, title, starts_at, status, capacity, is_free, price_krw, language, category').order('starts_at', { ascending: false }).limit(50)

  const { data: allOrders } = await admin.from('orders')
    .select('*, events(id, title, price_krw, language, category), profiles(id, display_name, email, real_name, nationality, gender, birth_date, phone, created_at)')
    .order('created_at', { ascending: false })

  const paidOrders = allOrders?.filter((o: any) => o.status === 'paid') ?? []
  const freeOrders = allOrders?.filter((o: any) => o.status === 'free_confirmed') ?? []
  const cancelledOrders = allOrders?.filter((o: any) => o.status === 'cancelled') ?? []

  const totalRevenue = (allOrders ?? [])
    .filter((o: any) => ['paid', 'free_confirmed'].includes(o.status))
    .reduce((s: number, o: any) => {
      if (o.status === 'paid') return s + (o.amount_krw || 0)
      return s + (o.events?.price_krw || 0)
    }, 0)
  const todayRevenue = paidOrders.filter((o: any) => new Date(o.created_at) > todayStart).reduce((s: number, o: any) => s + (o.amount_krw || 0), 0)
  const monthRevenue = paidOrders.filter((o: any) => new Date(o.created_at) > thirtyDaysAgo).reduce((s: number, o: any) => s + (o.amount_krw || 0), 0)

  const revenueByEvent: Record<string, number> = {}
  paidOrders.forEach((o: any) => {
    const t = o.events?.title || 'Unknown'
    revenueByEvent[t] = (revenueByEvent[t] || 0) + (o.amount_krw || 0)
  })

  const avgOrderValue = paidOrders.length > 0 ? Math.round(paidOrders.reduce((s: number, o: any) => s + (o.amount_krw || 0), 0) / paidOrders.length) : 0

  const weekdayOrderMap: Record<string, number> = { '일': 0, '월': 0, '화': 0, '수': 0, '목': 0, '금': 0, '토': 0 }
  paidOrders.forEach((o: any) => {
    const w = new Date(o.created_at).getDay()
    weekdayOrderMap[weekdayNames[w]] = (weekdayOrderMap[weekdayNames[w]] || 0) + 1
  })

  const hourlyOrderMap: Record<number, number> = {}
  for (let h = 0; h < 24; h++) hourlyOrderMap[h] = 0
  paidOrders.forEach((o: any) => {
    const h = new Date(o.created_at).getHours()
    hourlyOrderMap[h] = (hourlyOrderMap[h] || 0) + 1
  })

  const monthlyRevenueMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    monthlyRevenueMap[key] = 0
  }
  paidOrders.forEach((o: any) => {
    const d = new Date(o.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    if (key in monthlyRevenueMap) monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + (o.amount_krw || 0)
  })

  const nationalityRevMap: Record<string, { total: number; count: number }> = {}
  paidOrders.forEach((o: any) => {
    const nat = o.profiles?.nationality || 'Unknown'
    if (!nationalityRevMap[nat]) nationalityRevMap[nat] = { total: 0, count: 0 }
    nationalityRevMap[nat].total += o.amount_krw || 0
    nationalityRevMap[nat].count += 1
  })
  const nationalityAvgOrder: Record<string, number> = Object.fromEntries(
    Object.entries(nationalityRevMap).map(([k, v]) => [k, Math.round((v as any).total / (v as any).count)])
  )

  const genderPurchaseMap: Record<string, { total: number; purchased: number }> = {}
  profiles?.forEach((p: any) => {
    const g = p.gender || 'Unknown'
    if (!genderPurchaseMap[g]) genderPurchaseMap[g] = { total: 0, purchased: 0 }
    genderPurchaseMap[g].total += 1
  })
  paidOrders.forEach((o: any) => {
    const g = o.profiles?.gender || 'Unknown'
    if (!genderPurchaseMap[g]) genderPurchaseMap[g] = { total: 0, purchased: 0 }
    genderPurchaseMap[g].purchased += 1
  })

  const profileFirstOrderMap: Record<string, string> = {}
  paidOrders.forEach((o: any) => {
    const pid = o.profiles?.id
    if (!pid) return
    if (!profileFirstOrderMap[pid] || o.created_at < profileFirstOrderMap[pid]) {
      profileFirstOrderMap[pid] = o.created_at
    }
  })
  const profileOrderDays: number[] = []
  profiles?.forEach((p: any) => {
    const firstOrder = profileFirstOrderMap[p.id]
    if (!firstOrder) return
    const days = Math.round((new Date(firstOrder).getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    if (days >= 0 && days < 365) profileOrderDays.push(days)
  })
  const avgDaysToFirstPurchase = profileOrderDays.length > 0 ? Math.round(profileOrderDays.reduce((a, b) => a + b, 0) / profileOrderDays.length) : 0

  const purchaseCountPerUser: Record<string, number> = {}
  paidOrders.forEach((o: any) => {
    const pid = o.profiles?.id
    if (!pid) return
    purchaseCountPerUser[pid] = (purchaseCountPerUser[pid] || 0) + 1
  })
  const repurchaseUsers = Object.values(purchaseCountPerUser).filter(c => c >= 2).length
  const buyerCount = Object.keys(purchaseCountPerUser).length
  const repurchaseRate = buyerCount > 0 ? Math.round((repurchaseUsers / buyerCount) * 100) : 0

  const totalOrderCount = (allOrders?.length ?? 0)
  const cancelRate = totalOrderCount > 0 ? Math.round((cancelledOrders.length / totalOrderCount) * 100) : 0

  const funnelPaid30 = paidOrders.filter((o: any) => new Date(o.created_at) >= thirtyDaysAgo).length
  funnelData.paid = funnelPaid30
  funnelData.signupToPaid = newUsers30 > 0 ? Math.round((funnelPaid30 / newUsers30) * 1000) / 10 : 0

  const languageRevenueMap: Record<string, number> = {}
  paidOrders.forEach((o: any) => {
    const lang = o.events?.language || 'Unknown'
    languageRevenueMap[lang] = (languageRevenueMap[lang] || 0) + (o.amount_krw || 0)
  })

  const categoryRevenueMap: Record<string, number> = {}
  paidOrders.forEach((o: any) => {
    const cat = o.events?.category || 'Unknown'
    categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + (o.amount_krw || 0)
  })

  const { data: csTickets } = await admin.from('cs_tickets').select('*').order('created_at', { ascending: false }).limit(100)
  const openCs = csTickets?.filter((c: any) => c.status === 'open').length ?? 0
  const { count: totalCs } = await admin.from('cs_tickets').select('*', { count: 'exact', head: true })

  const csCategoryMap: Record<string, number> = {}
  csTickets?.forEach((c: any) => { const cat = c.category || 'Unknown'; csCategoryMap[cat] = (csCategoryMap[cat] || 0) + 1 })

  const resolvedWithReply = csTickets?.filter((c: any) => c.replied_at && c.created_at) ?? []
  const avgResponseHours = resolvedWithReply.length > 0
    ? Math.round(resolvedWithReply.reduce((s: number, c: any) => {
        const diff = (new Date(c.replied_at).getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60)
        return s + diff
      }, 0) / resolvedWithReply.length * 10) / 10
    : 0

  const { data: experiences } = await admin.from('experience_events').select('id, title, status, capacity, created_at').order('created_at', { ascending: false })
  const { data: expApplications } = await admin.from('experience_applications').select('*, experience_events(title)').order('created_at', { ascending: false })
  const { data: surveys } = await admin.from('satisfaction_surveys').select('*, events(title)').order('created_at', { ascending: false }).limit(100)

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
      hourlyVisitMap={hourlyVisitMap}
      weekdayVisitMap={weekdayVisitMap}
      avgDurationByPage={avgDurationByPage}
      totalVisits30={totalVisits30}
      events={events ?? []}
      allOrders={allOrders ?? []}
      totalRevenue={totalRevenue}
      todayRevenue={todayRevenue}
      monthRevenue={monthRevenue}
      revenueByEvent={revenueByEvent}
      avgOrderValue={avgOrderValue}
      weekdayOrderMap={weekdayOrderMap}
      hourlyOrderMap={hourlyOrderMap}
      monthlyRevenueMap={monthlyRevenueMap}
      nationalityAvgOrder={nationalityAvgOrder}
      genderPurchaseMap={genderPurchaseMap}
      avgDaysToFirstPurchase={avgDaysToFirstPurchase}
      repurchaseRate={repurchaseRate}
      cancelRate={cancelRate}
      languageRevenueMap={languageRevenueMap}
      categoryRevenueMap={categoryRevenueMap}
      csTickets={csTickets ?? []}
      openCs={openCs}
      totalCs={totalCs ?? 0}
      csCategoryMap={csCategoryMap}
      avgResponseHours={avgResponseHours}
      experiences={experiences ?? []}
      expApplications={expApplications ?? []}
      referralMap={{}}
      dailyUV={dailyUV}
      todayUV={todayUV}
      monthlyUV={monthlyUV}
      loginRatioMap={loginRatioMap}
      anonPageMap={anonPageMap}
      funnelData={funnelData}
      surveys={surveys ?? []}
    />
  )
}
