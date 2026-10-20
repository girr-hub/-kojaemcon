import { NextResponse } from 'next/server'
import { supabaseAdmin, supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'login required' }, { status: 401 })

  // admin 확인
  const admin = supabaseAdmin()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { id, payload } = await req.json()
  const { error } = id
    ? await admin.from('events').update(payload).eq('id', id)
    : await admin.from('events').insert(payload)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
