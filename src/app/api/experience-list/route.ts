import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const admin = supabaseAdmin()
  const { data } = await admin.from('experience_events')
    .select('id, title, description, images, location, status')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(5)
  return NextResponse.json(data ?? [])
}
