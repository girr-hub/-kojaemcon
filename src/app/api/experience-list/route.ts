import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const admin = supabaseAdmin()

  if (id) {
    const { data } = await admin.from('experience_events').select('*').eq('id', id).single()
    if (!data) return NextResponse.json(null)
    const { count } = await admin.from('experience_applications')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id)
    return NextResponse.json({ ...data, applicant_count: count ?? 0 })
  }

  const { data } = await admin.from('experience_events')
    .select('id, title, description, images, location, status, starts_at, capacity')
    .in('status', ['published', 'closed'])
    .order('created_at', { ascending: false })
    .limit(10)

  // 각 이벤트 신청 수 추가
  const eventsWithCount = await Promise.all((data ?? []).map(async (e: any) => {
    const { count } = await admin.from('experience_applications')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', e.id)
    return { ...e, applicant_count: count ?? 0 }
  }))

  return NextResponse.json(eventsWithCount)
}
