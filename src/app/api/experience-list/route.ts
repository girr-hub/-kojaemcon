import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const admin = supabaseAdmin()

  if (id) {
    const { data } = await admin.from('experience_events').select('*').eq('id', id).single()
    return NextResponse.json(data ?? null)
  }

  const { data } = await admin.from('experience_events')
    .select('id, title, description, images, location, status, starts_at, capacity')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(5)
  return NextResponse.json(data ?? [])
}
