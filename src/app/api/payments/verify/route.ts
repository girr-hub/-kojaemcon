import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { payment_id } = await req.json()
  const admin = supabaseAdmin()

  const { data: order } = await admin.from('orders').select('*, events(*)')
    .eq('payment_id', payment_id).single()
  if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 })

  // 포트원에 결제 조회
  const res = await fetch(`https://api.portone.io/payments/${encodeURIComponent(payment_id)}`, {
    headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` },
  })
  const pay = await res.json()
  if (!res.ok) return NextResponse.json({ error: pay }, { status: 500 })

  const paidOk = pay.status === 'PAID' && pay.amount?.total === order.amount_krw
  if (!paidOk) {
    await admin.from('orders').update({ status: 'failed' }).eq('id', order.id)
    return NextResponse.json({ ok: false })
  }

  await admin.from('orders').update({ 
    status: 'paid', paid_at: new Date().toISOString() 
  }).eq('id', order.id)

  // 호스트 정산 레코드 생성 (host 이벤트만)
  if (order.events.source === 'host' && order.events.host_id) {
    const gross = order.amount_krw
    const fee = Math.round(gross * 0.04)
    await admin.from('payouts').insert({
      event_id: order.event_id,
      host_id: order.events.host_id,
      gross_krw: gross,
      fee_rate: 0.04,
      fee_krw: fee,
      net_krw: gross - fee,
      status: 'pending',
    })
  }

  return NextResponse.json({ ok: true })
}
