import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { action } = body
  const admin = supabaseAdmin()

  if (action === 'create') {
    const { title, image_url, link_url, position, sort_order, is_active } = body
    const { data, error } = await admin.from('sponsor_banners')
      .insert({ title, image_url, link_url, position, sort_order, is_active })
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, banner: data })
  }

  if (action === 'toggle') {
    await admin.from('sponsor_banners').update({ is_active: body.is_active }).eq('id', body.id)
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete') {
    await admin.from('sponsor_banners').delete().eq('id', body.id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
