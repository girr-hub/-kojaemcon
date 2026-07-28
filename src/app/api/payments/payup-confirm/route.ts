import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { transactionId, orderNumber, amount } = await req.json()
  const admin = supabaseAdmin()

  // 1. 인증 토큰 발행
  const tokenRes = await fetch('https://standard.payup.co.kr/auth/v1/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: process.env.PAYUP_MID,
      apiKey: process.env.PAYUP_SECRET_KEY,
    }),
  }).then(r => r.json())

  if (tokenRes.status !== 'SUCCESS') {
    return NextResponse.json({ error: '토큰 발행 실패: ' + tokenRes.message }, { status: 400 })
  }

  const accessToken = tokenRes.data.accessToken

  // 2. 결제 승인 요청
  const payRes = await fetch('https://standard.payup.co.kr/api/v1/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({
      transactionId,
      merchatId: process.env.PAYUP_MID,
      orderNumber,
      amount,
    }),
  }).then(r => r.json())

  if (payRes.status !== 'SUCCESS') {
    return NextResponse.json({ error: '결제 승인 실패: ' + payRes.message }, { status: 400 })
  }

  // 3. DB 주문 업데이트
  const { data: order } = await admin.from('orders')
    .select('*')
    .eq('payment_id', orderNumber)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // 금액 검증
  if (Number(amount) !== order.amount_krw) {
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  await admin.from('orders').update({
    status: 'paid',
    payment_id: transactionId,
  }).eq('payment_id', orderNumber)

  // 4. 채팅방 생성 + 멤버 추가
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
