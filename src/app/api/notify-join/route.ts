import { NextResponse } from 'next/server'
import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import { sendAdminNotification } from '@/lib/email'

export async function POST(req: Request) {
  const { event_id, event_title } = await req.json()
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ ok: false })

  const admin = supabaseAdmin()
  const { data: profile } = await admin.from('profiles')
    .select('display_name, email, nationality')
    .eq('id', user.id).single()

  await sendAdminNotification({
    subject: `[KOGEMCON] 무료 이벤트 참가 - ${event_title}`,
    html: `
      <h2>무료 이벤트 참가 알림 🎉</h2>
      <p><strong>이벤트:</strong> ${event_title}</p>
      <p><strong>유저:</strong> ${profile?.display_name || '-'} (${profile?.email})</p>
      <p><strong>국적:</strong> ${profile?.nationality || '-'}</p>
      <p><strong>상태:</strong> Free Confirmed</p>
      <p><strong>시간:</strong> ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
      <br/>
      <a href="https://kojaemcon.vercel.app/admin/orders">어드민에서 확인하기 →</a>
    `
  })

  return NextResponse.json({ ok: true })
}
