import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { sendAdminNotification } from '@/lib/email'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const admin = supabaseAdmin()
  const now = new Date()

  // 종료된 이벤트 중 만족도 조사 미발송된 것 찾기
  const { data: events } = await admin.from('events')
    .select('id, title, ends_at')
    .lt('ends_at', now.toISOString())
    .eq('survey_sent', false)
    .not('ends_at', 'is', null)

  if (!events?.length) return NextResponse.json({ ok: true, sent: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY!)
  let sent = 0

  for (const event of events) {
    // 해당 이벤트 참가자 이메일 가져오기
    const { data: orders } = await admin.from('orders')
      .select('profiles(email, display_name)')
      .eq('event_id', event.id)
      .in('status', ['paid', 'free_confirmed'])

    const emails = (orders ?? [])
      .map((o: any) => o.profiles?.email)
      .filter(Boolean)

    for (const email of emails) {
      await resend.emails.send({
        from: 'KOGEMCON <onboarding@resend.dev>',
        to: email,
        subject: `How was ${event.title}? Share your feedback 🌟`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1A1A1A;">How was ${event.title}?</h2>
            <p>Thank you for joining us! We'd love to hear your feedback.</p>
            <a href="https://kojaemcon.vercel.app/survey?event_id=${event.id}"
              style="display: inline-block; background: #1A1A1A; color: #E9C000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; margin: 16px 0;">
              Share Feedback →
            </a>
            <p style="color: #9A9A9A; font-size: 12px;">KOGEMCON · Find your Gems in Korea</p>
          </div>
        `
      })
      sent++
    }

    // 발송 완료 표시
    await admin.from('events').update({ survey_sent: true }).eq('id', event.id)
  }

  return NextResponse.json({ ok: true, sent })
}
