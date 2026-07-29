import Link from 'next/link'

export default function EventFeedCard({ event }: { event: any }) {
  const isClosed = event.status === 'closed'
  const date = new Date(event.starts_at)
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const day = Number(date.toLocaleString('en-US', { day: 'numeric', timeZone: 'UTC' }))
  const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' })

  return (
    <Link href={`/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{ background: '#FFFFFF', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', borderBottom: '1px solid #F5F5F5', opacity: isClosed ? 0.65 : 1 }}>
        <div style={{ width: 96, height: 96, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: '#F7F7F7', position: 'relative' }}>
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, opacity: 0.25 }}>🎪</div>
          )}
          {isClosed && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>CLOSED</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {event.category && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#7A6100', background: '#FFFBEA', padding: '2px 7px', borderRadius: 6, display: 'inline-block', marginBottom: 5 }}>
              {event.category}
            </span>
          )}
          <h3 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em', lineHeight: 1.35, color: '#1A1A1A', marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#6B6B6B' }}>📅 {month} {day} · {time}</span>
            {event.venue_name && <span style={{ fontSize: 12, color: '#6B6B6B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {event.venue_name}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: event.is_free ? '#00C471' : '#1A1A1A', letterSpacing: '-0.03em' }}>
              {event.is_free ? 'Free' : `₩${Number(event.price_krw).toLocaleString()}`}
            </span>
            {!isClosed && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7A6100', background: '#E9C000', padding: '4px 10px', borderRadius: 7,  }}>
                Join →
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
