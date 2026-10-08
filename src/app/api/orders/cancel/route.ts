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

  // 본인 주문인지 확인
  const { data: order } = await admin.from('orders')
    .select('id, user_id, event_id, status')
    .eq('id', order_id)
    .single()

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status === 'cancelled') {
    return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
  }

  const { error } = await admin.from('orders').update({
    status: 'cancelled',
    cancel_reason: reason || null,
    cancelled_at: new Date().toISOString(),
  }).eq('id', order_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 채팅방 멤버에서도 제거
  const { data: room } = await admin.from('chat_rooms').select('id').eq('event_id', order.event_id).maybeSingle()
  if (room) {
    await admin.from('chat_members').delete().eq('room_id', room.id).eq('user_id', user.id)
  }

  // 이메일 알림 발송
  const { data: fullOrder } = await admin.from('orders')
    .select('*, events(title), profiles(email, display_name)')
    .eq('id', order_id)
    .single()

  if (fullOrder) {
    const resend = new Resend(process.env.RESEND_API_KEY!)

    // 어드민 알림
    await resend.emails.send({
      from: 'KOGEMCON <onboarding@resend.dev>',
      to: 'girr.official@gmail.com',
      subject: `[취소/환불요청] ${fullOrder.events?.title} - ${fullOrder.profiles?.display_name}`,
      html: `
        <div style="font-family:sans-serif; max-width:480px;">
          <h2>취소 요청이 접수됐습니다</h2>
          <p><b>이벤트:</b> ${fullOrder.events?.title}</p>
          <p><b>유저:</b> ${fullOrder.profiles?.display_name} (${fullOrder.profiles?.email})</p>
          <p><b>금액:</b> ₩${(fullOrder.amount_krw || 0).toLocaleString()}</p>
          <p><b>사유:</b> ${reason || '없음'}</p>
          <p><b>주문ID:</b> ${order_id}</p>
          <p style="color:#dc2626;">유료 결제건인 경우 PayUp 어드민에서 환불 처리해주세요.</p>
        </div>
      `
    }).catch(() => {})

    // 유저 알림 (영어)
    if (fullOrder.profiles?.email) {
      await resend.emails.send({
        from: 'KOGEMCON <onboarding@resend.dev>',
        to: fullOrder.profiles.email,
        subject: `Your booking has been cancelled — ${fullOrder.events?.title}`,
        html: `
          <div style="font-family:sans-serif; max-width:480px; margin:0 auto; color:#1A1A1A;">
            <h2>Booking Cancelled</h2>
            <p>Hi ${fullOrder.profiles.display_name},</p>
            <p>Your booking has been successfully cancelled.</p>
            <table style="width:100%; border-collapse:collapse; margin:16px 0;">
              <tr><td style="padding:8px; color:#6B6B6B; font-size:13px;">Event</td><td style="padding:8px; font-weight:600; font-size:13px;">${fullOrder.events?.title}</td></tr>
              <tr style="background:#F9F9F9;"><td style="padding:8px; color:#6B6B6B; font-size:13px;">Amount</td><td style="padding:8px; font-weight:600; font-size:13px;">₩${(fullOrder.amount_krw || 0).toLocaleString()}</td></tr>
              <tr><td style="padding:8px; color:#6B6B6B; font-size:13px;">Reason</td><td style="padding:8px; font-size:13px;">${reason || 'Not specified'}</td></tr>
            </table>
            <p style="font-size:13px; color:#6B6B6B;">If you paid for this booking, a refund will be processed within 3–5 business days.</p>
            <p style="font-size:13px; color:#6B6B6B;">Questions? Contact us at <a href="mailto:girr.official@gmail.com">girr.official@gmail.com</a></p>
            <p style="font-size:12px; color:#9A9A9A; margin-top:24px;">KOGEMCON · Find your Gems in Korea 🇰🇷</p>
          </div>
        `
      }).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true })
}
