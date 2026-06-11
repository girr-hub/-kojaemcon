'use client'

export default function EventMap({ 
  lat, lng, venueName, venueAddress 
}: { 
  lat?: number | null
  lng?: number | null
  venueName?: string | null
  venueAddress?: string | null
}) {
  if (!lat || !lng) {
    // 좌표 없으면 주소로 검색
    if (!venueAddress && !venueName) return null
    const query = encodeURIComponent(venueAddress ?? venueName ?? '')
    return (
      <div className="mt-8">
        <h3 className="headline-en text-2xl uppercase mb-4">Location</h3>
        <div className="aspect-video w-full bg-surface overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${query}&output=embed`}
          />
        </div>
        {venueAddress && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 sub-en text-sm text-primary hover:underline"
          >
            📍 {venueAddress} — Google Maps에서 열기 →
          </a>
        )}
      </div>
    )
  }

  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`

  return (
    <div className="mt-8">
      <h3 className="headline-en text-2xl uppercase mb-4">Location</h3>
      <div className="aspect-video w-full bg-surface overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
        />
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 sub-en text-sm text-primary hover:underline"
      >
        📍 {venueAddress ?? venueName} — Google Maps에서 열기 →
      </a>
    </div>
  )
}
