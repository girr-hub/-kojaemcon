import Link from 'next/link'

export default function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="card-base group">
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#1e2328', overflow: 'hidden' }}>
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.2 }}>🎪</div>
        )}
        {/* Badge */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span className="badge badge-yellow">
            {event.is_free ? 'FREE' : `₩${Number(event.price_krw).toLocaleString()}`}
          </span>
        </div>
        {event.category && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span style={{ background: 'rgba(18,22,26,0.8)', color: '#E7E7E7', padding: '3px 8px', borderRadius: 100, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {event.category}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{
          fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 15,
          letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 8, color: '#E7E7E7',
        }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: '#888' }}>
            📅 {new Date(event.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          {event.venue_name && (
            <div style={{ fontSize: 12, color: '#888' }}>📍 {event.venue_name}</div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700, color: '#E9C000' }}>
            {event.is_free ? 'Free' : `₩${Number(event.price_krw).toLocaleString()}`}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
