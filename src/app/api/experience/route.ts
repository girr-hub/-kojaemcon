import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { action } = body
  const admin = supabaseAdmin()

  if (action === 'create') {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    // 인증 실패시 body에서 user_id 받거나 스킵
    const hostId = user?.id || null

    const { title, description, location, capacity, images, available_dates } = body
    const { data, error } = await admin.from('experience_events').insert({
      host_id: hostId, title, description, location, capacity, images, available_dates, status: 'published'
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, event: data })
  }

  if (action === 'apply') {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    const applicantId = user?.id || null

    const { event_id, real_name, bank_name, account_number, account_phone, preferred_date, sns_accounts, companions, preferred_location } = body
    const { error } = await admin.from('experience_applications').insert({
      event_id, user_id: user.id, real_name, bank_name, account_number, account_phone,
      preferred_date, sns_accounts, companions, preferred_location
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'update') {
    const { id, ...updates } = body
    delete updates.action
    const { error } = await admin.from('experience_events').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete') {
    await admin.from('experience_applications').delete().eq('event_id', body.id)
    await admin.from('experience_events').delete().eq('id', body.id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
