import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// PC: SDK가 form을 submit하면 여기로 POST 요청이 들어옴
export async function POST(req: Request) {
  const formData = await req.formData()
  const transactionId = formData.get('transactionId') as string
  const orderNumber = formData.get('orderNumber') as string
  const amount = formData.get('amount') as string

  const result = await approvePayment(transactionId, orderNumber, amount)

  if (result.ok) {
    // 성공 시 성공 페이지로 리다이렉트
    return NextResponse.redirect(new URL(`/payment-success?order=${orderNumber}`, req.url))
  } else {
    return NextResponse.redirect(new URL(`/payment-fail?error=${encodeURIComponent(result.error || '결제 실패')}`, req.url))
  }
}

async function approvePayment(transactionId: string, orderNumber: string, amount: string) {
  const admin = supabaseAdmin()

  // 1. 토큰 발행
  const tokenRes = await fetch('https://standard.payup.co.kr/auth/v1/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: 'girr0711',
      apiKey: 'bba4fc3b5b7744d0a73dd9d4e94f4cc2',
    }),
  }).then(r => r.json())

  if (tokenRes.status !== 'SUCCESS') {
    return { ok: false, error: '토큰 발행 실패: ' + tokenRes.message }
  }

  const accessToken = tokenRes.data.accessToken

  // 2. 결제 승인
  const payRes = await fetch('https://standard.payup.co.kr/api/v1/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({
      transactionId,
      merchatId: 'girr0711',
      orderNumber,
      amount,
    }),
  }).then(r => r.json())

  if (payRes.status !== 'SUCCESS' || payRes.data?.responseCode !== '0000') {
    return { ok: false, error: '결제 승인 실패: ' + (payRes.data?.responseMsg || payRes.message) }
  }

  // 3. DB 업데이트
  const { data: order } = await admin.from('orders')
    .select('*')
    .eq('payment_id', orderNumber)
    .single()

  if (!order) return { ok: false, error: 'Order not found' }

  await admin.from('orders').update({
    status: 'paid',
    payment_id: payRes.data.transactionId,
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

  return { ok: true }
}

export { approvePayment }
