import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { payment_id, payup_result } = await req.json()
  const admin = supabaseAdmin()

  // 주문 조회
  const { data: order } = await admin.from('orders')
    .select('*')
    .eq('payment_id', payment_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // 페이업 결제 검증
  // resultCode '0000' = 성공
  if (!payup_result || payup_result.resultCode !== '0000') {
    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
  }

  // 금액 검증
  const paidAmount = Number(payup_result.amount || payup_result.payAmt || 0)
  if (paidAmount !== order.amount_krw) {
    await admin.from('orders').update({ status: 'failed' }).eq('payment_id', payment_id)
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  // 결제 완료 처리
  await admin.from('orders').update({
    status: 'paid',
    payment_id: payup_result.tid || payment_id,
  }).eq('payment_id', payment_id)

  // 채팅방 생성 + 멤버 추가
  let { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', order.event_id).maybeSingle()
  if (!room) {
    const { data: newRoom } = await admin.from('chat_rooms').insert({ event_id: order.event_id }).select('id').single()
    room = newRoom
  }
  if (room) {
    await admin.from('chat_members').upsert(
      { room_id: room.id, user_id: order.user_id },
      { onConflict: 'room_id,user_id' }
    )
  }

  return NextResponse.json({ ok: true })
}
