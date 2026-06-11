import Link from 'next/link'

export default function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.slug}`} className="block bg-surface hover:border-primary border border-ink/10 transition group">
      {/* 이미지 */}
      <div className="relative aspect-video overflow-hidden bg-bg">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title}
               className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🎪</div>
        )}
        {/* 무료/가격 배지 */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 sub-en text-xs uppercase font-bold ${event.is_free ? 'bg-green-500 text-bg' : 'bg-primary text-bg'}`}>
            {event.is_free ? 'FREE' : `₩${Number(event.price_krw).toLocaleString()}`}
          </span>
        </div>
        {/* 카테고리 배지 */}
        {event.category && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 sub-en text-xs uppercase bg-bg/70 text-ink backdrop-blur">
              {event.category}
            </span>
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="p-4">
        <h3 className="headline-en text-xl uppercase mb-2 group-hover:text-primary transition line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 sub-en text-sm text-ink/60">
          {/* 날짜 */}
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{new Date(event.starts_at).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</span>
          </div>

          {/* 위치 */}
          {event.venue_name && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="truncate">{event.venue_name}</span>
            </div>
          )}

          {/* 잔여석 */}
          {event.event_stats && (
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>
                {event.event_stats.remaining > 0 
                  ? `${event.event_stats.remaining} spots left` 
                  : 'Sold out'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
