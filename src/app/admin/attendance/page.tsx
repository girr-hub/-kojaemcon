import { supabaseAdmin } from '@/lib/supabase/server'
import AttendanceClient from './AttendanceClient'

export default async function AttendancePage() {
  const admin = supabaseAdmin()
  const { data: events } = await admin.from('events').select('id, title, starts_at').order('starts_at', { ascending: false }).limit(50)
  return <AttendanceClient events={events ?? []} />
}
