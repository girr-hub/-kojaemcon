import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id, reason } = await req.json()
  if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  const admin = supabaseAdmin()

  const { data: order } = await admin.from('orders')
    .select('id, user_id, event_id, status, payment_id, amount_krw')
    .eq('id', order_id)
    .single()

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status === 'cancelled') {
    return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
  }

  if (order.status === 'paid' && order.payment_id && order.amount_krw > 0) {
    try {
      const payupRes = await fetch('https://api.payup.co.kr/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mid: process.env.PAYUP_MID || 'girr0711',
          tid: order.payment_id,
          cancelAmt: order.amount_krw,
        }),
      })
      const payupData = await payupRes.json()
      if (payupData.resultCode && payupData.resultCode !== '0000') {
        return NextResponse.json(
          { error: `PayUp 환불 실패: ${payupData.resultMsg || '알 수 없는 오류'}` },
          { status: 500 }
        )
      }
    } catch (e) {
      return NextResponse.json({ error: 'PayUp 환불 요청 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }

  const { error } = await admin.from('orders').update({
    status: 'cancelled',
    cancel_reason: reason || null,
    cancelled_at: new Date().toISOString(),
  }).eq('id', order_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', order.event_id).maybeSingle()
  if (room) {
    await admin.from('chat_members').delete().eq('room_id', room.id).eq('user_id', user.id)
  }

  const { data: fullOrder } = await admin.from('orders')
    .select('*, events(title), profiles(email, display_name)')
    .eq('id', order_id)
    .single()

  if (fullOrder) {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    await resend.emails.send({
      from: 'KOGEMCON <onboarding@resend.dev>',
      to: 'girr.official@gmail.com',
      subject: `[취소완료] ${fullOrder.events?.title} - ${fullOrder.profiles?.display_name}`,
      html: `<div style="font-family:sans-serif;"><h2>취소 처리 완료</h2><p><b>이벤트:</b> ${fullOrder.events?.title}</p><p><b>유저:</b> ${fullOrder.profiles?.display_name} (${fullOrder.profiles?.email})</p><p><b>금액:</b> ₩${(fullOrder.amount_krw || 0).toLocaleString()}</p><p><b>사유:</b> ${reason || '없음'}</p><p><b>tid:</b> ${order.payment_id || 'N/A'}</p>${order.payment_id && order.amount_krw > 0 ? '<p style="color:#16a34a;">✅ PayUp 자동 환불 완료</p>' : ''}</div>`
    }).catch(() => {})
    if (fullOrder.profiles?.email) {
      await resend.emails.send({
        from: 'KOGEMCON <onboarding@resend.dev>',
        to: fullOrder.profiles.email,
        subject: `Your booking has been cancelled — ${fullOrder.events?.title}`,
        html: `<div style="font-family:sans-serif; max-width:480px;"><h2>Booking Cancelled</h2><p>Hi ${fullOrder.profiles.display_name},</p><p>Your booking for <b>${fullOrder.events?.title}</b> has been cancelled.</p>${order.payment_id && order.amount_krw > 0 ? '<p>A refund has been processed and will appear within 3–5 business days.</p>' : ''}<p style="font-size:13px; color:#6B6B6B;">Questions? <a href="mailto:girr.official@gmail.com">girr.official@gmail.com</a></p></div>`
      }).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true })
}
