import { supabaseAdmin } from '@/lib/supabase/server'
import AdminCSClient from './AdminCSClient'

export default async function AdminCSPage() {
  const admin = supabaseAdmin()
  const { data: tickets } = await admin.from('cs_tickets').select('*').order('created_at', { ascending: false })
  return <AdminCSClient tickets={tickets ?? []} />
}
