import { supabaseServer, supabaseAdmin } from '@/lib/supabase/server'
import FomoPopup from '@/components/FomoPopup'
import Link from 'next/link'
import BuyButton from '@/components/BuyButton'
import NotifyButton from '@/components/NotifyButton'
import ImageSlider from '@/components/ImageSlider'

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const sb = await supabaseServer()
    const admin = supabaseAdmin()
    const { data: e } = await admin.from('events').select('*').eq('slug', slug).single()
    if (!e) return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ fontSize: 18, color: 'var(--text-4)' }}>Event not found</p>
        <Link href="/events" style={{ color: 'var(--gold)', fontWeight: 700 }}>← Back to Events</Link>
      </div>
    )

    const { data: soldOrders } = await sb.from('orders')
      .select('quantity')
      .eq('event_id', e.id)
      .in('status', ['paid', 'free_confirmed'])
    const soldCount = (soldOrders ?? []).reduce((sum, o) => sum + (o.quantity ?? 1), 0)
    const remaining = Math.max(0, (e.capacity ?? 0) - soldCount)

    // pending ?몄썝 * 5 = 怨좊?以묒씤 ?щ엺??
    const { count: pendingCount } = await sb.from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', e.id)
      .eq('status', 'pending')
    const consideringCount = (pendingCount ?? 0)

    let attendees: any[] = []
    try {
      const admin = supabaseAdmin()
      const { data: att } = await admin
        .from('orders')
        .select('user_id, quantity, profiles(display_name, nationality, avatar_url)')
        .eq('event_id', e.id)
        .in('status', ['paid', 'free_confirmed'])
      // quantity만큼 확장: 2개 구매면 구매자 + friend 1
      const expanded: any[] = []
      for (const o of (att ?? [])) {
        expanded.push(o)
        for (let i = 1; i < (o.quantity ?? 1); i++) {
          expanded.push({ user_id: null, quantity: 1, profiles: { display_name: `${(o.profiles as any)?.display_name || 'Guest'}'s friend`, nationality: null, avatar_url: null } })
        }
      }
      attendees = expanded
    } catch {
      try {
        const { data: att } = await sb
          .from('orders')
          .select('user_id, quantity, profiles(display_name, nationality, avatar_url)')
          .eq('event_id', e.id)
          .in('status', ['paid', 'free_confirmed'])
        const expanded: any[] = []
        for (const o of (att ?? [])) {
          expanded.push(o)
          for (let i = 1; i < (o.quantity ?? 1); i++) {
            expanded.push({ user_id: null, quantity: 1, profiles: { display_name: `${(o.profiles as any)?.display_name || 'Guest'}'s friend`, nationality: null, avatar_url: null } })
          }
        }
        attendees = expanded
      } catch {}
    }

    // 커버 이미지 제외한 추가 이미지만
    const extraImages = [...(e.detail_images ?? []), ...(e.images ?? [])]
      .filter(Boolean)
      .filter((img: string) => img !== e.cover_image_url)
    const allImages = extraImages
    const startDate = e.starts_at ? new Date(e.starts_at) : null
    const dateStr = startDate ? startDate.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC'
    }) : ''

    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 100 }}>
        {consideringCount > 0 && <FomoPopup count={consideringCount} />}

        {/* 뒤로가기 헤더 */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(248,248,248,0.94)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Link href="/events" style={{ color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.04em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {e.title}
          </span>
        </div>

        {allImages.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {allImages.map((img: string, i: number) => (
              <img key={i} src={img} alt={`image-${i+1}`} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            ))}
          </div>
        ) : e.cover_image_url ? (
          <img src={e.cover_image_url} alt={e.title} style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: 220, background: 'linear-gradient(145deg, #2A2830, #3D3A4A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 32, color: 'var(--gold)', letterSpacing: '0.05em' }}>KOGEMCON</span>
          </div>
        )}

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            {e.category && (
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold-dark, #D4A900)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-block', marginBottom: 8, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {e.category}
              </span>
            )}
            <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1.25, marginBottom: 8 }}>
              {e.title}
            </h1>
            {e.summary && <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.65 }}>{e.summary}</p>}
          </div>

          {/* 날짜/장소/가격 카드 */}
          <div style={{ background: 'var(--surface, #FFFFFF)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border)' }}>
            {dateStr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gold-light, #FFF8D6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A900" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9H21M8 2v3M16 2v3"/></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{dateStr}</span>
              </div>
            )}
            {e.venue_name && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{e.venue_name}</p>
                  {e.venue_address && <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>{e.venue_address}</p>}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: e.is_free ? '#00C471' : 'var(--text)', fontFamily: 'PretendardVariable, Pretendard, sans-serif', letterSpacing: '-0.04em' }}>
                  {e.is_free ? 'Free' : (
                    (() => {
                      const prices = [
                        e.solo_option1_price || e.price_solo || e.price_krw,
                        e.returning_option1_price || e.price_returning || e.price_krw,
                        e.friends_option1_price || e.price_with_friends || e.price_krw,
                      ].filter(Boolean)
                      const minPrice = Math.min(...prices)
                      return `₩${Number(minPrice).toLocaleString()}~`
                    })()
                  )}
                </span>
              </div>
              {e.capacity > 0 && (
                <span style={{ fontSize: 12, color: remaining <= 5 ? '#dc2626' : 'var(--text-4)', fontWeight: 700, background: remaining <= 5 ? '#FEE2E2' : '#F4F4F4', padding: '4px 10px', borderRadius: 20 }}>
                  {remaining <= 0 ? 'Sold out' : `${remaining} spots left`}
                </span>
              )}
            </div>
          </div>

          <BuyButton event={e} remaining={remaining} />

          {e.description_html && (
            <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, border: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.03em' }}>About this event</h2>
              <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: e.description_html }} />
            </div>
          )}

          <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>Refund Policy</h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>
              10+ days before: full refund · 3–9 days before: 30% refund · Under 3 days: no refund.
              Questions? <Link href="/cs" style={{ color: 'var(--text)', fontWeight: 700, textDecoration: 'underline' }}>Contact CS</Link>
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.03em' }}>
              Who&apos;s coming ({attendees.length})
            </h2>
            {attendees.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No one yet — be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {attendees.map((a: any) => {
                  const name = a?.profiles?.display_name || 'Guest'
                  const nat = a?.profiles?.nationality || ''
                  const avatar = a?.profiles?.avatar_url || null
                  const key = a?.user_id || name
                  return (
                    <div key={key} style={{ background: '#F8F8F8', padding: '6px 12px', borderRadius: 100, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)' }}>
                      {avatar ? (
                        <img src={avatar} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="" />
                      ) : (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0, color: '#111' }}>
                          {(name[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', color: 'var(--text-3)' }}>{name}{nat ? ' · ' + nat : ''}</span>
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
        <p style={{ fontSize: 16, color: 'var(--text)', marginBottom: 16, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Something went wrong</p>
        <Link href="/events" style={{ color: 'var(--gold)', fontWeight: 700 }}>← Back to Events</Link>
      </div>
    )
  }
}
