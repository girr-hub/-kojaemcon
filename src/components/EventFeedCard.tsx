import Link from 'next/link'

export default function EventFeedCard({ event }: { event: any }) {
  const isClosed = event.status === 'closed'
  const date = event.starts_at ? new Date(event.starts_at) : null
  const dateStr = date ? date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC'
  }) : ''
  const timeStr = date ? date.toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC'
  }) : ''

  const prices = [
    event.solo_option1_price,
    event.returning_option1_price,
    event.friends_option1_price,
    event.price_solo,
    event.price_returning,
    event.price_with_friends,
    event.price_krw,
  ].filter((p: any) => p && p > 0)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const soldOut = event.capacity > 0 && event.remaining <= 0

  return (
    <Link href={event.isExperience ? `/experience/${event.experience_id}` : `/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{
        background: '#FFFFFF',
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        borderBottom: '1px solid #F2F2F2',
        opacity: isClosed ? 0.55 : 1,
      }}>
        {/* 이미지 */}
        <div style={{ width: 96, height: 96, flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: '#EFEFEF', position: 'relative' }}>
          {event.cover_image_url
            ? <img src={event.cover_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: '#E8E8E8' }} />
          }
          {isClosed && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>CLOSED</span>
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {event.category && (
            <span style={{ fontSize: 11, color: '#999', fontFamily: 'PretendardVariable, Pretendard, sans-serif', display: 'block', marginBottom: 3 }}>
              {event.category}
            </span>
          )}
          <h3 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 15,
            letterSpacing: '-0.02em', lineHeight: 1.35,
            color: '#1A1A1A', marginBottom: 6,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any
          }}>
            {event.title}
          </h3>

          <p style={{ fontSize: 12, color: '#999', marginBottom: 2, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {dateStr}{timeStr ? ` · ${timeStr}` : ''}
          </p>
          {event.venue_name && (
            <p style={{ fontSize: 12, color: '#999', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              {event.venue_name}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              {event.is_free ? 'Free' : `From ₩${Number(minPrice).toLocaleString()}`}
            </span>

            {isClosed ? (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#999', background: '#F0F0F0', padding: '5px 10px', borderRadius: 6, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                Closed
              </span>
            ) : soldOut ? (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#999', background: '#F0F0F0', padding: '5px 10px', borderRadius: 6, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                Sold out
              </span>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#1A1A1A', padding: '5px 10px', borderRadius: 6, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                Join
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
