import { supabaseAdmin } from '@/lib/supabase/server'
import AdminOrdersClient from './AdminOrdersClient'

export default async function AdminOrders() {
  const sb = supabaseAdmin()
  const { data: orders } = await sb.from('orders')
    .select('*, events(id, title, starts_at), profiles(display_name, email, real_name)')
    .order('created_at', { ascending: false })

  const { data: events } = await sb.from('events')
    .select('id, title, starts_at, status, capacity')
    .order('starts_at', { ascending: false })
    .limit(50)

  return <AdminOrdersClient orders={orders ?? []} events={events ?? []} />
}
