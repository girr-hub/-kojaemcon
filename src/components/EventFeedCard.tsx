import Link from 'next/link'

export default function EventFeedCard({ event }: { event: any }) {
  const isClosed = event.status === 'closed'

  const date = event.starts_at ? new Date(event.starts_at) : null
  const dateStr = date ? date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC',
  }) : ''
  const timeStr = date ? date.toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC',
  }) : ''

  const prices = [
    event.solo_option1_price, event.returning_option1_price, event.friends_option1_price,
    event.price_solo, event.price_returning, event.price_with_friends, event.price_krw,
  ].filter((p: any) => p && p > 0)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const soldOut = event.capacity > 0 && event.remaining <= 0

  // D-day 계산
  let dday: string | null = null
  if (date && !isClosed) {
    const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff >= 0 && diff <= 7) dday = diff === 0 ? 'D-Day' : `D-${diff}`
  }

  return (
    <Link
      href={event.isExperience ? `/experience/${event.experience_id}` : `/events/${event.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article style={{
        background: '#FFFFFF',
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--border)',
        opacity: isClosed ? 0.5 : 1,
        transition: 'background 0.12s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
        onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
      >
        {/* 썸네일 */}
        <div style={{
          width: 100, height: 100, flexShrink: 0,
          borderRadius: 12, overflow: 'hidden',
          background: '#EFEFEF', position: 'relative',
        }}>
          {event.cover_image_url
            ? <img src={event.cover_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(145deg, #2A2830, #3D3A4A)' }} />
          }
          {/* 우상단: 제공언어 + 잔여석 + D-day */}
          <div style={{
            position: 'absolute', top: 6, right: 6,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3,
          }}>
            <div style={{ display: 'flex', gap: 3 }}>
              <span style={{
                fontSize: 9, fontWeight: 800,
                background: 'rgba(0,0,0,0.62)', color: '#fff',
                padding: '2px 6px', borderRadius: 4,
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                letterSpacing: '0.03em', backdropFilter: 'blur(4px)',
              }}>
                🌐 {event.language || 'English'}
              </span>
              {!isClosed && (event.capacity ?? 0) > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 800,
                  background: (event.remaining ?? 0) <= 5 ? 'rgba(220,38,38,0.82)' : 'rgba(0,0,0,0.62)',
                  color: '#fff',
                  padding: '2px 6px', borderRadius: 4,
                  fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                  letterSpacing: '0.03em', backdropFilter: 'blur(4px)',
                }}>
                  {(event.remaining ?? 0) <= 0 ? 'Sold out' : `${event.remaining} left`}
                </span>
              )}
            </div>
            {dday && (
              <span style={{
                background: 'var(--gold)', color: '#111',
                fontSize: 9, fontWeight: 800,
                padding: '2px 7px', borderRadius: 5,
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                letterSpacing: '0.04em',
              }}>
                {dday}
              </span>
            )}
          </div>
          {isClosed && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>CLOSED</span>
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {event.category && (
            <span style={{
              fontSize: 10, color: 'var(--gold-dark, #D4A900)',
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              display: 'inline-block', marginBottom: 3,
              fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {event.category}
            </span>
          )}
          <h3 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 14,
            letterSpacing: '-0.03em', lineHeight: 1.35,
            color: 'var(--text)', marginBottom: 5,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any,
          }}>
            {event.title}
          </h3>

          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 1, fontFamily: 'PretendardVariable, Pretendard, sans-serif', letterSpacing: '-0.01em' }}>
            {dateStr}{timeStr ? ` · ${timeStr}` : ''}
          </p>
          {event.venue_name && (
            <p style={{ fontSize: 11, color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'PretendardVariable, Pretendard, sans-serif', marginBottom: 8 }}>
              {event.venue_name}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              {event.is_free ? 'Free' : `₩${Number(minPrice).toLocaleString()}~`}
            </span>

            {isClosed ? (
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', background: '#F2F2F2', padding: '5px 10px', borderRadius: 7 }}>
                Closed
              </span>
            ) : soldOut ? (
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', background: '#F2F2F2', padding: '5px 10px', borderRadius: 7 }}>
                Sold out
              </span>
            ) : (
              <span style={{
                fontSize: 11, fontWeight: 800, color: '#111111',
                background: 'var(--gold)', padding: '5px 14px', borderRadius: 20,
                fontFamily: 'PretendardVariable, Pretendard, sans-serif', letterSpacing: '-0.01em',
              }}>
                Register
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
