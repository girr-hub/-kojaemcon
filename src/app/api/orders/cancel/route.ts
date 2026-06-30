import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id, reason } = await req.json()
  if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  const admin = supabaseAdmin()

  // 본인 주문인지 확인
  const { data: order } = await admin.from('orders')
    .select('id, user_id, event_id, status')
    .eq('id', order_id)
    .single()

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status === 'cancelled') {
    return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
  }

  const { error } = await admin.from('orders').update({
    status: 'cancelled',
    cancel_reason: reason || null,
    cancelled_at: new Date().toISOString(),
  }).eq('id', order_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 채팅방 멤버에서도 제거
  const { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', order.event_id).maybeSingle()
  if (room) {
    await admin.from('chat_members').delete().eq('room_id', room.id).eq('user_id', user.id)
  }

  return NextResponse.json({ ok: true })
}
