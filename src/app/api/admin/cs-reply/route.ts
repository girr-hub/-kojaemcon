import { NextResponse } from 'next/server'
import { supabaseAdmin, supabaseServer } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'login required' }, { status: 401 })

  const { ticket_id, reply } = await req.json()
  const admin = supabaseAdmin()

  const { data: ticket } = await admin.from('cs_tickets').select('*').eq('id', ticket_id).single()
  if (!ticket) return NextResponse.json({ error: 'ticket not found' }, { status: 404 })

  await admin.from('cs_tickets').update({
    admin_reply: reply,
    status: 'resolved',
    replied_at: new Date().toISOString()
  }).eq('id', ticket_id)

  // 이메일 발송
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'KOGEMCON <hello@kojaemcon.com>',
      to: ticket.email,
      subject: `Re: ${ticket.subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1A1A1A">Hello ${ticket.name},</h2>
          <p style="color:#555">Thank you for reaching out to us. Here is our response to your inquiry:</p>
          <div style="background:#F8F8F6;border-radius:8px;padding:20px;margin:20px 0">
            <p style="color:#3A3A3A;white-space:pre-wrap">${reply}</p>
          </div>
          <p style="color:#9A9A9A;font-size:12px">If you have any further questions, please don't hesitate to contact us again.</p>
          <p style="color:#9A9A9A;font-size:12px">Best regards,<br/>KOGEMCON Team</p>
        </div>
      `
    })
  } catch (e) {
    console.error('Email send failed:', e)
  }

  return NextResponse.json({ ok: true })
}
