import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { supabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { page, duration_seconds, session_id } = await req.json()
  const admin = supabaseAdmin()
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  await admin.from('page_visits').insert({
    page, duration_seconds, session_id, user_id: user?.id || null,
    visited_at: new Date().toISOString()
  })

  return NextResponse.json({ ok: true })
}
