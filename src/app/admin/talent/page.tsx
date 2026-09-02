import { supabaseAdmin } from '@/lib/supabase/server'
import TalentAdminClient from './TalentAdminClient'

export default async function TalentAdminPage() {
  const admin = supabaseAdmin()
  const { data: talents } = await admin
    .from('talent_profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return <TalentAdminClient talents={talents ?? []} />
}
