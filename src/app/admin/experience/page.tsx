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

  const userIds = [...new Set((applications ?? []).map((a: any) => a.user_id).filter(Boolean))]
  let profileMap: Record<string, any> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, email, nationality, phone')
      .in('id', userIds)
    profiles?.forEach((p: any) => { profileMap[p.id] = p })
  }

  const eventTitleMap: Record<string, string> = {}
  events?.forEach((e: any) => { eventTitleMap[e.id] = e.title })

  const enriched = (applications ?? []).map((a: any) => ({
    ...a,
    profile_email: a.email || profileMap[a.user_id]?.email || '',
    profile_nationality: profileMap[a.user_id]?.nationality || '',
    profile_phone: profileMap[a.user_id]?.phone || '',
    experience_events: { title: eventTitleMap[a.event_id] || '' }
  }))

  return <ExperienceAdminClient events={events ?? []} applications={enriched} />
}
