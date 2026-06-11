import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { event_id, quantity = 1 } = await req.json()
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'login required' }, { status: 401 })

  const admin = supabaseAdmin()
  const { data: event } = await admin.from('events').select('*').eq('id', event_id).single()
  if (!event || event.status !== 'published') 
    return NextResponse.json({ error: 'unavailable' }, { status: 400 })

  // 잔량 확인
  const { data: stats } = await admin.from('event_stats').select('remaining').eq('event_id', event_id).single()
  if ((stats?.remaining ?? 0) < quantity)
    return NextResponse.json({ error: 'sold out' }, { status: 400 })

  const amount = event.is_free ? 0 : event.price_krw * quantity
  const payment_id = `kjc_${event_id.slice(0,8)}_${user.id.slice(0,8)}_${Date.now()}`

  const { data: order, error } = await admin.from('orders').insert({
    event_id, user_id: user.id, quantity, amount_krw: amount,
    status: event.is_free ? 'free_confirmed' : 'pending',
    payment_id, paid_at: event.is_free ? new Date().toISOString() : null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ 
    payment_id, order_id: order.id, free: event.is_free 
  })
}
