import { NextResponse } from 'next/server'
import { sendAdminNotification } from '@/lib/email'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { event_id, quantity = 1, ticket_type, friends_count = 1, amount, companion_info } = await req.json()
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'login required' }, { status: 401 })

  const admin = supabaseAdmin()

  const { data: event } = await admin.from('events').select('*').eq('id', event_id).single()
  if (!event) return NextResponse.json({ error: 'event not found' }, { status: 404 })

  // 솔드아웃 체크
  if (event.capacity && event.capacity > 0) {
    const { data: soldOrders } = await admin.from('orders')
      .select('quantity')
      .eq('event_id', event_id)
      .in('status', ['paid', 'free_confirmed'])
    const soldCount = (soldOrders ?? []).reduce((sum: number, o: any) => sum + (o.quantity ?? 1), 0)
    const requestedQty = ticket_type === 'with_friends' ? friends_count : (quantity ?? 1)
    if (soldCount + requestedQty > event.capacity) {
      return NextResponse.json({ error: 'Sorry, this event is sold out.' }, { status: 400 })
    }
  }

  // 중복 체크 (paid, free_confirmed만 막음 - pending은 재사용)
  const { data: existing } = await admin.from('orders')
    .select('id, status, payment_id')
    .eq('event_id', event_id)
    .eq('user_id', user.id)
    .in('status', ['paid', 'free_confirmed'])
    .maybeSingle()

  if (existing) {
    if (event.is_free) {
      return NextResponse.json({ free: true, ok: true, already: true })
    }
    return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 })
  }

  // 기존 pending 주문 재사용
  if (!event.is_free) {
    const { data: pendingOrder } = await admin.from('orders')
      .select('id, payment_id, amount_krw')
      .eq('event_id', event_id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle()
    if (pendingOrder) {
      return NextResponse.json({ free: false, payment_id: pendingOrder.payment_id })
    }
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

  // with_friends일 때 quantity = friends_count
  const finalQty = ticket_type === 'with_friends' ? friends_count : quantity

  const { data: newOrder, error: pendingErr } = await admin.from('orders').insert({
    event_id,
    user_id: user.id,
    quantity: finalQty,
    ticket_type: ticket_type || 'solo',
    amount_krw: amount ?? (event.price_krw * finalQty),
    status: 'pending',
    payment_id: paymentId,
    companion_info: ticket_type === 'with_friends' && companion_info?.length > 0
      ? companion_info
      : null,
  }).select('id').single()

  if (pendingErr) return NextResponse.json({ error: pendingErr.message }, { status: 500 })

  // Who's Coming 자동 추가 (with_friends + companion_info 있을 때)
  if (ticket_type === 'with_friends' && companion_info?.length > 0 && newOrder) {
    // 구매자 프로필 조회
    const { data: buyerProfile } = await admin
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const buyerName = buyerProfile?.display_name || 'Guest'

    const friendRows = (companion_info as Array<{name:string; gender:string; nationality:string; age:string}>).map(f => ({
      event_id,
      order_id: newOrder.id,
      user_id: null,
      display_name: `${buyerName}'s friend`,
      real_name: f.name,
      gender: f.gender,
      nationality: f.nationality,
      age: Number(f.age) || null,
      type: 'companion',
    }))

    // event_attendees 테이블에 동행자 추가 (없으면 조용히 스킵)
    await admin.from('event_attendees').insert(friendRows).then(() => {}).catch(() => {})
  }

  return NextResponse.json({ free: false, payment_id: paymentId })
}
