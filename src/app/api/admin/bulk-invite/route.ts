import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

const GUESTS = ['Amisha', 'Aya', 'Corinna', 'Javokhir', 'Lyubava', 'Raveena', 'Shavira', 'Wioletta']
const SECRET = process.env.ADMIN_BULK_SECRET || 'kojaemcon-bulk-2026'

export async function POST(req: Request) {
  const { secret, event_id } = await req.json()
  if (secret !== SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = supabaseAdmin()

  // 1. 이벤트 확인
  const { data: event } = await admin.from('events').select('id, title, starts_at').eq('id', event_id).single()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  // 2. 전체 프로필 로드
  const { data: profiles } = await admin.from('profiles').select('id, display_name, email')

  const results: { name: string; status: string; detail?: string }[] = []

  for (const name of GUESTS) {
    const profile = profiles?.find(p =>
      p.display_name?.toLowerCase().includes(name.toLowerCase())
    )

    if (!profile) {
      results.push({ name, status: 'no_profile' })
      continue
    }

    // 중복 체크
    const { data: existing } = await admin.from('orders')
      .select('id').eq('event_id', event.id).eq('user_id', profile.id).single()

    if (existing) {
      results.push({ name, status: 'already_registered', detail: existing.id })
      continue
    }

    const { data: order, error } = await admin.from('orders').insert({
      event_id: event.id,
      user_id: profile.id,
      status: 'paid',
      amount_krw: 0,
      quantity: 1,
      note: 'Free invite – staff added Nov 21 DMZ'
    }).select('id').single()

    if (error) results.push({ name, status: 'error', detail: error.message })
    else results.push({ name, status: 'created', detail: order.id })
  }

  return NextResponse.json({ event: event.title, results })
}
