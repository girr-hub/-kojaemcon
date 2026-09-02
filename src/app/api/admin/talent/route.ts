import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { action, id, status } = await req.json()
  const admin = supabaseAdmin()

  if (action === 'updateStatus') {
    await admin.from('talent_profiles').update({ status }).eq('id', id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
