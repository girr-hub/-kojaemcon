import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { order_id, reason } = await req.json()
  if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  const admin = supabaseAdmin()

  const { data: order, error } = await admin.from('orders')
    .select('*, events(title), profiles(email, display_name)')
    .eq('id', order_id)
    .single()

  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.status === 'cancelled') return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })

  await admin.from('orders').update({
    status: 'cancelled',
    cancel_reason: reason || 'User refund request',
    cancelled_at: new Date().toISOString()
  }).eq('id', order_id)

  const resend = new Resend(process.env.RESEND_API_KEY!)

  // 어드민 알림 (한국어)
  await resend.emails.send({
    from: 'KOGEMCON <onboarding@resend.dev>',
    to: 'girr.official@gmail.com',
    subject: `[환불요청] ${order.events?.title} - ${order.profiles?.display_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>환불 요청이 접수됐습니다</h2>
        <p><b>이벤트:</b> ${order.events?.title}</p>
        <p><b>유저:</b> ${order.profiles?.display_name} (${order.profiles?.email})</p>
        <p><b>금액:</b> ₩${(order.amount_krw || 0).toLocaleString()}</p>
        <p><b>사유:</b> ${reason || '없음'}</p>
        <p><b>주문ID:</b> ${order_id}</p>
        <p style="color:#dc2626;">PayUp 어드민에서 직접 환불 처리해주세요.</p>
      </div>
    `
  })

  // 유저 알림 (영어)
  if (order.profiles?.email) {
    await resend.emails.send({
      from: 'KOGEMCON <onboarding@resend.dev>',
      to: order.profiles.email,
      subject: `Your refund request has been received — ${order.events?.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1A1A1A;">
          <h2 style="color: #1A1A1A;">Refund Request Received</h2>
          <p>Hi ${order.profiles.display_name},</p>
          <p>We've received your refund request. Our team will process it within 3–5 business days.</p>
          <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
            <tr><td style="padding:8px; color:#6B6B6B; font-size:13px;">Event</td><td style="padding:8px; font-weight:600; font-size:13px;">${order.events?.title}</td></tr>
            <tr style="background:#F9F9F9;"><td style="padding:8px; color:#6B6B6B; font-size:13px;">Refund Amount</td><td style="padding:8px; font-weight:600; font-size:13px;">₩${(order.amount_krw || 0).toLocaleString()}</td></tr>
            <tr><td style="padding:8px; color:#6B6B6B; font-size:13px;">Reason</td><td style="padding:8px; font-size:13px;">${reason || 'Not specified'}</td></tr>
          </table>
          <p style="font-size:13px; color:#6B6B6B;">If you have any questions, please contact us at <a href="mailto:girr.official@gmail.com">girr.official@gmail.com</a></p>
          <p style="font-size:12px; color:#9A9A9A; margin-top:24px;">KOGEMCON · Find your Gems in Korea 🇰🇷</p>
        </div>
      `
    })
  }

  return NextResponse.json({ ok: true })
}
