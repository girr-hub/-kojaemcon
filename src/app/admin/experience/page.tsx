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
    .select('*, experience_events(title), profiles(email, display_name)')
    .order('created_at', { ascending: false })

  return <ExperienceAdminClient events={events ?? []} applications={applications ?? []} />
}
