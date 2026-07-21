import { supabaseAdmin } from '@/lib/supabase/server'
import ERPDashboardClient from './ERPDashboardClient'

export default async function ERPPage() {
  const admin = supabaseAdmin()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // 오늘 방문자
  const { count: todayVisits } = await admin.from('page_visits')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', todayStart.toISOString())

  // 최근 30일 일별 방문자 (추세선용)
  const { data: dailyRaw } = await admin.from('page_visits')
    .select('visited_at')
    .gte('visited_at', thirtyDaysAgo.toISOString())
    .order('visited_at', { ascending: true })

  // 일별 집계
  const dailyMap: Record<string, number> = {}
  dailyRaw?.forEach((v: any) => {
    const d = new Date(v.visited_at)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyMap[key] = (dailyMap[key] || 0) + 1
  })

  // 지난 30일 날짜 배열 채우기 (비어있는 날은 0)
  const dailyVisits: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dailyVisits.push({ date: key, count: dailyMap[key] || 0 })
  }

  const totalLast30 = dailyVisits.reduce((s, d) => s + d.count, 0)
  const dailyAvg = Math.round(totalLast30 / 30)

  const { count: weekTotal } = await admin.from('page_visits')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', sevenDaysAgo.toISOString())
  const weeklyAvg = Math.round((weekTotal ?? 0) / 7)
  const monthlyAvg = dailyAvg

  // 유저 데이터
  const { data: profiles } = await admin.from('profiles').select('*')

  const nationalityMap: Record<string, number> = {}
  profiles?.forEach((p: any) => { const n = p.nationality || 'Unknown'; nationalityMap[n] = (nationalityMap[n] || 0) + 1 })

  const genderMap: Record<string, number> = {}
  profiles?.forEach((p: any) => { const g = p.gender || 'Not specified'; genderMap[g] = (genderMap[g] || 0) + 1 })

  const ageMap: Record<string, number> = {}
  const currentYear = new Date().getFullYear()
  profiles?.forEach((p: any) => {
    if (!p.birth_year) { ageMap['Not specified'] = (ageMap['Not specified'] || 0) + 1; return }
    const age = currentYear - p.birth_year
    const bracket = age < 20 ? '<20' : age < 25 ? '20-24' : age < 30 ? '25-29' : age < 35 ? '30-34' : age < 40 ? '35-39' : '40+'
    ageMap[bracket] = (ageMap[bracket] || 0) + 1
  })

  const referralMap: Record<string, number> = {}
  profiles?.forEach((p: any) => { const r = p.signup_referral || 'Unknown'; referralMap[r] = (referralMap[r] || 0) + 1 })

  const interestMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    try {
      const raw = p.referral_source
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      const interests = parsed?.interests ?? []
      interests.forEach((i: string) => { interestMap[i] = (interestMap[i] || 0) + 1 })
    } catch {}
  })

  const { data: events } = await admin.from('events')
    .select('id, title, starts_at, status')
    .order('starts_at', { ascending: false })
    .limit(50)

  return (
    <ERPDashboardClient
      todayVisits={todayVisits ?? 0}
      dailyAvg={dailyAvg}
      weeklyAvg={weeklyAvg}
      monthlyAvg={monthlyAvg}
      totalUsers={profiles?.length ?? 0}
      dailyVisits={dailyVisits}
      nationalityMap={nationalityMap}
      genderMap={genderMap}
      ageMap={ageMap}
      referralMap={referralMap}
      interestMap={interestMap}
      events={events ?? []}
    />
  )
}
