import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { payment_id, payup_result } = await req.json()
  const admin = supabaseAdmin()

  const { data: order } = await admin.from('orders')
    .select('*')
    .eq('payment_id', payment_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!payup_result || payup_result.resultCode !== '0000') {
    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
  }

  // 페이업 서명 검증
  const mid = process.env.PAYUP_MID!
  const secretKey = process.env.PAYUP_SECRET_KEY!
  const tid = payup_result.tid || ''
  const amount = payup_result.amount || payup_result.payAmt || ''

  const signData = `${mid}${tid}${amount}${secretKey}`
  const signature = crypto.createHash('sha256').update(signData).digest('hex')

  if (payup_result.signature && payup_result.signature !== signature) {
    return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 })
  }

  // 금액 검증
  const paidAmount = Number(amount)
  if (paidAmount !== order.amount_krw) {
    await admin.from('orders').update({ status: 'failed' }).eq('payment_id', payment_id)
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  // 결제 완료
  await admin.from('orders').update({
    status: 'paid',
    payment_id: tid || payment_id,
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
