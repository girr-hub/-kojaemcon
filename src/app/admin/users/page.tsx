import { supabaseAdmin } from '@/lib/supabase/server'
import UsersClient from './UsersClient'

export default async function AdminUsers() {
  const admin = supabaseAdmin()
  const { data: users } = await admin
    .from('profiles')
    .select('*, orders(id, event_id, status, amount_krw, created_at, events(title))')
    .order('created_at', { ascending: false })
  return <UsersClient users={users ?? []} />
}
