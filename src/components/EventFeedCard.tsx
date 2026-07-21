import Link from 'next/link'

export default function EventFeedCard({ event }: { event: any }) {
  const date = new Date(event.starts_at)
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <Link href={`/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #F0F0EC',
        overflow: 'hidden',
      }}>
        {/* Cover image — 1:1 ratio */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#F5F5F0', overflow: 'hidden' }}>
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, opacity: 0.15 }}>🎪</div>
          )}

          {/* Date badge top-left */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#FFFFFF', borderRadius: 10,
            padding: '6px 10px', textAlign: 'center',
            minWidth: 44, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#E9C000', letterSpacing: '0.1em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{month}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#12161A', lineHeight: 1, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{day}</div>
          </div>

          {/* Price badge top-right */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: event.is_free ? '#E9C000' : '#12161A',
            color: event.is_free ? '#12161A' : '#FFFFFF',
            borderRadius: 100, padding: '4px 10px',
            fontSize: 11, fontWeight: 700,
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
          }}>
            {event.is_free ? 'FREE' : `₩${Number(event.price_krw).toLocaleString()}`}
          </div>

          {/* Category bottom overlay */}
          {event.category && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
              padding: '20px 14px 10px',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              }}>
                {event.category}
              </span>
            </div>
          )}
        </div>

        {/* Info below image */}
        <div style={{ padding: '14px 16px 16px' }}>
          <h3 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 16,
            letterSpacing: '-0.02em', lineHeight: 1.3,
            color: '#12161A', marginBottom: 6,
          }}>
            {event.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B6B6B', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              <span>🕐</span>
              <span>{time}</span>
            </div>
            {event.venue_name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B6B6B', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                <span>📍</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue_name}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              fontSize: 15, fontWeight: 800, color: '#E9C000',
            }}>
              {event.is_free ? 'Free' : `₩${Number(event.price_krw).toLocaleString()}`}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#FFFFFF',
              background: '#12161A', padding: '6px 14px', borderRadius: 100,
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            }}>
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
