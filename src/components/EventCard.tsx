import Link from 'next/link'

export default function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="card-base group">
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#F8F8F6', overflow: 'hidden' }}>
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.2 }}>
            🎪
          </div>
        )}
        {/* Price badge */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span className="badge badge-yellow">
            {event.is_free ? 'FREE' : `₩${Number(event.price_krw).toLocaleString()}`}
          </span>
        </div>
        {/* Category */}
        {event.category && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span className="badge badge-black">{event.category}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{
          fontFamily: 'Inter', fontWeight: 800, fontSize: 16,
          letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 8,
          color: '#0A0A0A', transition: 'color 0.15s',
        }} className="group-hover:text-[#6B6B6B]">
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#9A9A9A', lineHeight: 1.75 }}>
            📅 {new Date(event.starts_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
          {event.venue_name && (
            <div style={{ fontSize: 11, color: '#9A9A9A' }}>
              📍 {event.venue_name}
            </div>
          )}
          {event.event_stats && (
            <div style={{ fontSize: 11, color: '#9A9A9A' }}>
              👥 {event.event_stats.remaining > 0
                ? `${event.event_stats.remaining} spots left`
                : 'Sold out'}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            {event.is_free ? 'Free' : `₩${Number(event.price_krw).toLocaleString()}`}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {event.status === 'published' ? 'Book →' : event.status}
          </span>
        </div>
      </div>
    </Link>
  )
}
