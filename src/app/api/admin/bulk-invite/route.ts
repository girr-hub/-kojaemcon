import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

const GUESTS = ['Amisha', 'Aya', 'Javokhir', 'Lyubava', 'Raveena', 'Shavira', 'Shohidullo', 'Jasper', 'Sophia', 'Daisy', 'Ethan']
const SECRET = process.env.ADMIN_BULK_SECRET || 'kojaemcon-bulk-2026'

export async function POST(req: Request) {
  const { secret, event_id } = await req.json()
  if (secret !== SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = supabaseAdmin()

  // 1. 이벤트 확인 — event_id 없으면 11/21 땅굴 포함 이벤트 자동 검색
  let event: { id: string; title: string; starts_at: string } | null = null

  if (event_id) {
    const { data } = await admin.from('events').select('id, title, starts_at').eq('id', event_id).single()
    event = data
  } else {
    // Nov 21 이벤트 중 제목에 땅굴 포함된 것 자동 검색
    const { data } = await admin
      .from('events')
      .select('id, title, starts_at')
      .gte('starts_at', '2026-11-21')
      .lt('starts_at', '2026-11-22')
      .ilike('title', '%땅굴%')
      .limit(1)
      .single()
    event = data

    // 땅굴 없으면 Nov 21 전체 이벤트 목록 반환
    if (!event) {
      const { data: all } = await admin
        .from('events')
        .select('id, title, starts_at')
        .gte('starts_at', '2026-11-21')
        .lt('starts_at', '2026-11-22')
      return NextResponse.json({
        error: '땅굴투어 이벤트를 찾지 못했습니다. event_id를 직접 지정해주세요.',
        nov21_events: all ?? []
      }, { status: 404 })
    }
  }

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
      status: 'free_confirmed',
      amount_krw: 0,
      quantity: 1
    }).select('id').single()

    if (error) results.push({ name, status: 'error', detail: error.message })
    else results.push({ name, status: 'created', detail: order.id })
  }

  return NextResponse.json({ event: event.title, event_id: event.id, results })
}
