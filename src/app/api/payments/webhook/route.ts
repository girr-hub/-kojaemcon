import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const raw = await req.text()
  const sig = req.headers.get('webhook-signature') ?? ''
  // 검증 (포트원 V2 webhook 시그니처 방식에 맞춰)
  // 실제 운영에선 portone-sdk의 verify 함수 사용 권장

  const evt = JSON.parse(raw)
  const payment_id = evt?.data?.paymentId
  if (!payment_id) return NextResponse.json({ ok: true })

  const admin = supabaseAdmin()
  if (evt.type === 'Transaction.Paid') {
    await admin.from('orders').update({ status:'paid', paid_at:new Date().toISOString() })
      .eq('payment_id', payment_id).eq('status','pending')
  } else if (evt.type === 'Transaction.Cancelled') {
    await admin.from('orders').update({ status:'refunded' }).eq('payment_id', payment_id)
  }
  return NextResponse.json({ ok: true })
}
