import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// 모바일 결제 완료 후 returnUrl로 POST 요청이 들어옴
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) || await req.text().then(t => Object.fromEntries(new URLSearchParams(t)))

  const { transactionId, orderNumber, amount } = body

  const admin = supabaseAdmin()

  // 인증 토큰 발행
  const tokenRes = await fetch('https://standard.payup.co.kr/auth/v1/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: process.env.PAYUP_MID,
      apiKey: process.env.PAYUP_SECRET_KEY,
    }),
  }).then(r => r.json())

  if (tokenRes.status !== 'SUCCESS') {
    return NextResponse.redirect(new URL('/events?payment=fail', req.url))
  }

  const accessToken = tokenRes.data.accessToken

  // 결제 승인
  const payRes = await fetch('https://standard.payup.co.kr/api/v1/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': accessToken },
    body: JSON.stringify({ transactionId, merchatId: process.env.PAYUP_MID, orderNumber, amount }),
  }).then(r => r.json())

  if (payRes.status !== 'SUCCESS') {
    return NextResponse.redirect(new URL('/events?payment=fail', req.url))
  }

  // DB 업데이트
  const { data: order } = await admin.from('orders').select('*').eq('payment_id', orderNumber).single()
  if (!order) return NextResponse.redirect(new URL('/events?payment=fail', req.url))

  await admin.from('orders').update({ status: 'paid', payment_id: transactionId }).eq('payment_id', orderNumber)

  // 채팅방 처리
  let { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', order.event_id).maybeSingle()
  if (!room) {
    const { data: newRoom } = await admin.from('chat_rooms').insert({ event_id: order.event_id }).select('id').single()
    room = newRoom
  }
  if (room) {
    await admin.from('chat_members').upsert({ room_id: room.id, user_id: order.user_id }, { onConflict: 'room_id,user_id' })
  }

  return NextResponse.redirect(new URL(`/events?payment=success&event=${order.event_id}`, req.url))
}

export async function GET(req: Request) {
  return POST(req)
}
