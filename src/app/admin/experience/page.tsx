import { supabaseAdmin } from '@/lib/supabase/server'
import ExperienceAdminClient from './ExperienceAdminClient'

export default async function ExperienceAdminPage() {
  const admin = supabaseAdmin()
  const { data: events } = await admin
    .from('experience_events')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: applications } = await admin
    .from('experience_applications')
    .select('*')
    .order('created_at', { ascending: false })

  // user_id로 이메일 가져오기
  const userIds = [...new Set((applications ?? []).map((a: any) => a.user_id).filter(Boolean))]
  let emailMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, email')
      .in('id', userIds)
    profiles?.forEach((p: any) => { emailMap[p.id] = p.email })
  }

  // 이벤트 타이틀 매핑
  const eventIds = [...new Set((applications ?? []).map((a: any) => a.event_id).filter(Boolean))]
  let eventMap: Record<string, string> = {}
  if (eventIds.length > 0) {
    const { data: evts } = await admin
      .from('experience_events')
      .select('id, title')
      .in('id', eventIds)
    evts?.forEach((e: any) => { eventMap[e.id] = e.title })
  }

  const enriched = (applications ?? []).map((a: any) => ({
    ...a,
    profile_email: a.email || emailMap[a.user_id] || '',
    experience_events: { title: eventMap[a.event_id] || '' }
  }))

  return <ExperienceAdminClient events={events ?? []} applications={enriched} />
}
