import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'
import BuyButton from '@/components/BuyButton'
import ImageSlider from '@/components/ImageSlider'

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const sb = await supabaseServer()
    const { data: e } = await sb.from('events').select('*').eq('slug', slug).single()
    if (!e) return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ fontSize: 18, color: '#9A9A9A' }}>Event not found</p>
        <Link href="/events" style={{ color: '#E9C000', fontWeight: 700 }}>← Back to Events</Link>
      </div>
    )

    // remaining
    const { count: soldCount } = await sb.from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', e.id)
      .in('status', ['paid', 'free_confirmed'])
    const remaining = Math.max(0, (e.capacity ?? 0) - (soldCount ?? 0))

    // attendees
    let attendees: any[] = []
    try {
      const admin = supabaseAdmin()
      const { data: att } = await admin
        .from('orders')
        .select('user_id, profiles(display_name, nationality, avatar_url)')
        .eq('event_id', e.id)
        .in('status', ['paid', 'free_confirmed'])
      attendees = att ?? []
    } catch {
      try {
        const { data: att } = await sb
          .from('orders')
          .select('user_id, profiles(display_name, nationality, avatar_url)')
          .eq('event_id', e.id)
          .in('status', ['paid', 'free_confirmed'])
        attendees = att ?? []
      } catch {}
    }

    // 이미지 합치기
    const allImages = [...(e.detail_images ?? []), ...(e.images ?? [])].filter(Boolean)

    // 날짜 포맷
    const startDate = e.starts_at ? new Date(e.starts_at) : null
    const dateStr = startDate ? startDate.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC'
    }) : ''

    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: 100 }}>

        {/* 커버 이미지 */}
        {allImages.length > 0 ? (
          <ImageSlider images={allImages} />
        ) : e.cover_image_url ? (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
            <img src={e.cover_image_url} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ width: '100%', height: 240, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🎪</div>
        )}

        {/* 이벤트 정보 */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 제목 + 카테고리 */}
          <div>
            {e.category && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7A6100', background: '#FFFBEA', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 8 }}>
                {e.category}
              </span>
            )}
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 24, letterSpacing: '-0.04em', color: '#1A1A1A', lineHeight: 1.2, marginBottom: 8 }}>
              {e.title}
            </h1>
            {e.summary && <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>{e.summary}</p>}
          </div>

          {/* 날짜/장소/가격 */}
          <div style={{ background: '#F7F7F7', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dateStr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>📅</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{dateStr}</span>
              </div>
            )}
            {e.venue_name && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{e.venue_name}</p>
                  {e.venue_address && <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 2 }}>{e.venue_address}</p>}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🎫</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: e.is_free ? '#00C471' : '#1A1A1A' }}>
                  {e.is_free ? 'Free' : `₩${Number(e.price_krw).toLocaleString()}`}
                </span>
              </div>
              {e.capacity > 0 && (
                <span style={{ fontSize: 12, color: remaining <= 5 ? '#dc2626' : '#9A9A9A', fontWeight: 600 }}>
                  {remaining <= 0 ? '🔴 Sold out' : `${soldCount ?? 0} / ${e.capacity} joined`}
                </span>
              )}
            </div>
          </div>

          {/* 결제 버튼 */}
          <BuyButton event={e} remaining={remaining} />

          {/* 설명 */}
          {e.description_html && (
            <div>
              <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.03em' }}>About</h2>
              <div style={{ fontSize: 14, color: '#3D3D3D', lineHeight: 1.75 }}
                dangerouslySetInnerHTML={{ __html: e.description_html }} />
            </div>
          )}

          {/* 환불 정책 */}
          <div style={{ background: '#F7F7F7', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 8 }}>Refund Policy</h3>
            <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6 }}>
              Cancel 24+ hours before → full refund. Under 24 hours → no refund.
              For questions, <Link href="/cs" style={{ color: '#1A1A1A', fontWeight: 700 }}>contact CS →</Link>
            </p>
          </div>

          {/* Who's coming */}
          <div>
            <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.03em' }}>
              Who's coming ({attendees.length})
            </h2>
            {attendees.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9A9A9A' }}>No one yet — be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {attendees.map((a: any) => {
                  const name = a?.profiles?.display_name || 'Guest'
                  const nat = a?.profiles?.nationality || ''
                  const avatar = a?.profiles?.avatar_url || null
                  return (
                    <div key={a?.user_id || name} style={{ background: '#F7F7F7', padding: '6px 12px', borderRadius: 100, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #EBEBEB' }}>
                      {avatar ? (
                        <img src={avatar} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="" />
                      ) : (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E9C000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                          {(name[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                        {name}{nat ? \` · \${nat}\` : ''}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    )
  } catch (err) {
    console.error('EventDetail error:', err)
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
        <p style={{ fontSize: 16, color: '#1A1A1A', marginBottom: 8 }}>Something went wrong</p>
        <Link href="/events" style={{ color: '#E9C000', fontWeight: 700 }}>← Back to Events</Link>
      </div>
    )
  }
}
