import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createClient(
    'https://qbacbmyffpkiipngccpa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiYWNibXlmZnBraWlwbmdjY3BhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAzMTA3MCwiZXhwIjoyMDk2NjA3MDcwfQ.UAAiiQhLuRyoQg-pgVG3uMZD_iJV1aKBXUhBC5XhCYY',
    { auth: { persistSession: false } }
  )
  const now = new Date().toISOString()
  const { data: upcoming } = await sb.from('events')
    .select('id, title, slug, cover_image_url, starts_at, ends_at, is_free, price_krw, category, status, venue_name, capacity, has_ticket_types, price_solo, price_returning, price_with_friends, solo_option1_price, returning_option1_price, friends_option1_price')
    .in('status', ['published'])
    .gte('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(10)

  const { data: past } = await sb.from('events')
    .select('id, title, slug, cover_image_url, starts_at, ends_at, is_free, price_krw, category, status, venue_name, capacity, has_ticket_types, price_solo, price_returning, price_with_friends, solo_option1_price, returning_option1_price, friends_option1_price')
    .in('status', ['published', 'closed'])
    .lt('starts_at', now)
    .order('starts_at', { ascending: false })
    .limit(10)

  const data = [...(upcoming ?? []), ...(past ?? [])]

  // 각 이벤트 잔여석 계산
  const eventsWithRemaining = await Promise.all((data ?? []).map(async (event: any) => {
    const { count } = await sb.from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event.id)
      .in('status', ['paid', 'free_confirmed'])
    return { ...event, sold: count ?? 0, remaining: Math.max(0, (event.capacity ?? 0) - (count ?? 0)) }
  }))
  return NextResponse.json(eventsWithRemaining)
}
