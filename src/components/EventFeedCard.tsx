import Link from 'next/link'

export default function EventFeedCard({ event }: { event: any }) {
  const isClosed = event.status === 'closed'
  const date = event.starts_at ? new Date(event.starts_at) : null
  const dateStr = date ? date.toLocaleString('en-US', { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' }) : ''
  const timeStr = date ? date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : ''

  const minPrice = event.solo_option1_price || event.price_solo || event.price_krw || 0

  return (
    <Link href={`/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{
        background: '#FFFFFF',
        padding: '16px',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        borderBottom: '1px solid #F2F2F2',
        opacity: isClosed ? 0.6 : 1,
      }}>
        {/* 이미지 */}
        <div style={{ width: 100, height: 100, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#F0F0F0' }}>
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#E8E8E8' }} />
          )}
        </div>

        {/* 텍스트 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 15,
            letterSpacing: '-0.02em', lineHeight: 1.4,
            color: '#1A1A1A', marginBottom: 5,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any
          }}>
            {event.title}
          </h3>

          <p style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>
            {dateStr}{timeStr ? ` · ${timeStr}` : ''}
          </p>
          {event.venue_name && (
            <p style={{ fontSize: 13, color: '#888', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.venue_name}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>
              {event.is_free ? 'Free' : `From ₩${Number(minPrice).toLocaleString()}`}
            </span>
            {event.capacity > 0 && (
              <span style={{ fontSize: 12, color: event.remaining <= 5 && event.remaining > 0 ? '#E55' : '#AAA' }}>
                {event.remaining <= 0 ? 'Sold out' : `${event.remaining} left`}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
