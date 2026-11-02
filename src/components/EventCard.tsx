import Link from 'next/link'

export default function EventCard({ event }: { event: any }) {
  const isClosed = event.status === 'closed'
  const date = event.starts_at ? new Date(event.starts_at) : null
  const dateStr = date ? date.toLocaleString('en-US', { month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC' }) : ''

  return (
    <Link href={`/events/${event.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#FFFFFF', borderRadius: 14,
        overflow: 'hidden', border: '1px solid var(--border)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        opacity: isClosed ? 0.55 : 1,
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={e => { e.currentTarget.style.transform = '' }}
      >
        {/* 이미지 */}
        <div style={{ position: 'relative', aspectRatio: '3/2', background: 'linear-gradient(145deg, #2A2830, #3D3A4A)', overflow: 'hidden' }}>
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : null}

          {/* 가격 배지 좌상단 */}
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <span style={{
              background: 'var(--gold)', color: '#111',
              fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {event.is_free ? 'FREE' : `₩${Number(event.price_krw).toLocaleString()}`}
            </span>
          </div>

          {/* 카테고리 배지 우상단 */}
          {event.category && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <span style={{
                background: 'rgba(255,255,255,0.92)', color: '#444',
                fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6,
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                letterSpacing: '0.02em',
              }}>
                {event.category}
              </span>
            </div>
          )}

          {isClosed && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>CLOSED</span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div style={{ padding: '10px 12px 14px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {event.category || 'Event'}
          </div>
          <h3 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 13, letterSpacing: '-0.03em', lineHeight: 1.35,
            color: 'var(--text)', marginBottom: 4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any,
            minHeight: 34,
          }}>
            {event.title}
          </h3>
          <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 8, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            {dateStr}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              {event.is_free ? 'Free' : `₩${Number(event.price_krw).toLocaleString()}~`}
            </span>
            <button style={{
              background: 'var(--gold)', color: '#111',
              border: 'none', padding: '5px 12px', borderRadius: 8,
              fontSize: 10, fontWeight: 800,
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              cursor: 'pointer', letterSpacing: '-0.01em',
            }}>
              참가
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
