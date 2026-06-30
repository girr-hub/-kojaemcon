import { NextResponse } from 'next/server'
import { supabaseAdmin, supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { path, referrer } = await req.json()
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()

    const admin = supabaseAdmin()
    await admin.from('page_visits').insert({
      user_id: user?.id ?? null,
      path,
      referrer: referrer || null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
