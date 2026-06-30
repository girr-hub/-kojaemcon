import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = supabaseAdmin()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { event_id, subject, message, recipient_ids } = await req.json()
  if (!event_id || !subject || !message) {
    return NextResponse.json({ error: 'event_id, subject, message required' }, { status: 400 })
  }

  // 대상자 이메일 가져오기
  let targetUserIds = recipient_ids
  if (!targetUserIds || targetUserIds.length === 0) {
    const { data: orders } = await admin.from('orders')
      .select('user_id')
      .eq('event_id', event_id)
      .in('status', ['paid', 'free_confirmed'])
    targetUserIds = orders?.map((o: any) => o.user_id) ?? []
  }

  if (targetUserIds.length === 0) {
    return NextResponse.json({ error: 'No recipients found' }, { status: 400 })
  }

  // auth.users 에서 이메일 가져오기 (admin API)
  const emails: string[] = []
  for (const uid of targetUserIds) {
    const { data } = await admin.auth.admin.getUserById(uid)
    if (data?.user?.email) emails.push(data.user.email)
  }

  if (emails.length === 0) {
    return NextResponse.json({ error: 'No valid emails found' }, { status: 400 })
  }

  // RESEND_API_KEY가 설정되어 있으면 실제 발송, 없으면 로그만 남김
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({
      error: 'RESEND_API_KEY not configured. Add it to environment variables to enable sending.',
      would_send_to: emails,
    }, { status: 503 })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'KOJAEMCON <notifications@kojaemcon.com>',
        to: emails,
        subject,
        html: `<div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#0A0A0A;">${subject}</h2>
          <p style="color:#3A3A3A; line-height:1.7; white-space:pre-line;">${message}</p>
          <hr style="margin:24px 0; border:none; border-top:1px solid #E8E8E4;"/>
          <p style="color:#9A9A9A; font-size:12px;">Sent from KOJAEMCON</p>
        </div>`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: 'Email send failed: ' + err }, { status: 500 })
    }

    return NextResponse.json({ ok: true, sent_to: emails.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
