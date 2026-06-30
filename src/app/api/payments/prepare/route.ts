import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { event_id, quantity = 1 } = await req.json()
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'login required' }, { status: 401 })

  const admin = supabaseAdmin()

  const { data: event } = await admin.from('events').select('*').eq('id', event_id).single()
  if (!event) return NextResponse.json({ error: 'event not found' }, { status: 404 })

  // 중복 체크
  const { data: existing } = await admin.from('orders')
    .select('id, status')
    .eq('event_id', event_id)
    .eq('user_id', user.id)
    .in('status', ['paid', 'free_confirmed', 'pending'])
    .maybeSingle()

  if (existing) {
    if (event.is_free) {
      return NextResponse.json({ free: true, ok: true, already: true })
    }
    return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 })
  }

  if (event.is_free) {
    // 무료 이벤트 - 바로 confirmed 상태로 생성
    const { error: insertErr } = await admin.from('orders').insert({
      event_id,
      user_id: user.id,
      quantity,
      amount_krw: 0,
      status: 'free_confirmed',
    })
    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

    // 채팅방 즉시 생성 + 멤버 추가 (서버에서 바로 처리)
    let { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', event_id).maybeSingle()
    if (!room) {
      const { data: newRoom } = await admin.from('chat_rooms').insert({ event_id }).select('id').single()
      room = newRoom
    }
    if (room) {
      await admin.from('chat_members').upsert(
        { room_id: room.id, user_id: user.id },
        { onConflict: 'room_id,user_id' }
      )
    }

    return NextResponse.json({ free: true, ok: true })
  }

  // 유료 이벤트 - PortOne 결제 준비
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const { error: pendingErr } = await admin.from('orders').insert({
    event_id,
    user_id: user.id,
    quantity,
    amount_krw: event.price_krw * quantity,
    status: 'pending',
    payment_id: paymentId,
  })
  if (pendingErr) return NextResponse.json({ error: pendingErr.message }, { status: 500 })

  return NextResponse.json({ free: false, payment_id: paymentId })
}
