import { supabaseAdmin } from '@/lib/supabase/server'
import ERPDashboardClient from './ERPDashboardClient'

export default async function ERPPage() {
  const admin = supabaseAdmin()

  // 방문자 통계
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const { count: todayVisits } = await admin.from('page_visits')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', todayStart.toISOString())

  const { data: weekVisitsData } = await admin.from('page_visits')
    .select('visited_at')
    .gte('visited_at', weekAgo.toISOString())

  const { data: monthVisitsData } = await admin.from('page_visits')
    .select('visited_at')
    .gte('visited_at', monthAgo.toISOString())

  const weekAvg = weekVisitsData ? Math.round(weekVisitsData.length / 7) : 0
  const monthAvg = monthVisitsData ? Math.round(monthVisitsData.length / 30) : 0

  // 유저 데이터
  const { data: profiles } = await admin.from('profiles').select('*')

  // 국적별
  const nationalityMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    const n = p.nationality || 'Unknown'
    nationalityMap[n] = (nationalityMap[n] || 0) + 1
  })

  // 성별
  const genderMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    const g = p.gender || 'Not specified'
    genderMap[g] = (genderMap[g] || 0) + 1
  })

  // 나이대
  const ageMap: Record<string, number> = {}
  const currentYear = new Date().getFullYear()
  profiles?.forEach((p: any) => {
    if (!p.birth_year) { ageMap['Not specified'] = (ageMap['Not specified'] || 0) + 1; return }
    const age = currentYear - p.birth_year
    const bracket = age < 20 ? '<20' : age < 25 ? '20-24' : age < 30 ? '25-29' : age < 35 ? '30-34' : age < 40 ? '35-39' : '40+'
    ageMap[bracket] = (ageMap[bracket] || 0) + 1
  })

  // 유입경로
  const referralMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    const r = p.signup_referral || 'Unknown'
    referralMap[r] = (referralMap[r] || 0) + 1
  })

  // 취향 비율
  const interestMap: Record<string, number> = {}
  profiles?.forEach((p: any) => {
    try {
      const raw = p.referral_source
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      const interests = parsed?.interests ?? []
      interests.forEach((i: string) => { interestMap[i] = (interestMap[i] || 0) + 1 })
    } catch {}
  })

  // 이벤트 목록 (이메일 발송용)
  const { data: events } = await admin.from('events')
    .select('id, title, starts_at, status')
    .order('starts_at', { ascending: false })
    .limit(50)

  return (
    <ERPDashboardClient
      todayVisits={todayVisits ?? 0}
      weekAvg={weekAvg}
      monthAvg={monthAvg}
      totalUsers={profiles?.length ?? 0}
      nationalityMap={nationalityMap}
      genderMap={genderMap}
      ageMap={ageMap}
      referralMap={referralMap}
      interestMap={interestMap}
      events={events ?? []}
    />
  )
}
