'use client'
import Link from 'next/link'

export default function Hero({ data }: {
  data?: { title_en?: string; subtitle?: string; cta?: string } | null
}) {
  return (
    <section style={{ background: '#12161A', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 24px 0' }}>

      {/* Background ghost symbol */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden', opacity: 0.04 }}>
        <div style={{ fontFamily: 'Righteous, sans-serif', fontSize: 'clamp(200px, 40vw, 500px)', color: '#E9C000', lineHeight: 1, whiteSpace: 'nowrap', letterSpacing: '-0.05em' }}>
          ㅋㅈㅋ
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}>

        {/* ㅋㅈㅋ SVG Logo Symbol */}
        <div style={{ marginBottom: 32 }}>
          <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* ㅋ top */}
            <rect x="20" y="10" width="80" height="18" fill="#E9C000"/>
            <rect x="20" y="10" width="18" height="50" fill="#E9C000"/>
            <rect x="20" y="38" width="60" height="18" fill="#E9C000"/>
            {/* ㅈ middle */}
            <rect x="30" y="80" width="90" height="16" fill="#E9C000"/>
            <rect x="68" y="80" width="16" height="14" fill="#E9C000"/>
            <rect x="24" y="96" width="30" height="14" rx="2" style={{ transform: 'rotate(-15deg)', transformOrigin: '39px 103px' }} fill="#E9C000"/>
            <polygon points="24,96 54,96 44,118 14,118" fill="#E9C000"/>
            <polygon points="86,96 116,96 126,118 96,118" fill="#E9C000"/>
            {/* ㅋ bottom */}
            <rect x="20" y="136" width="80" height="16" fill="#E9C000"/>
            <rect x="20" y="136" width="16" height="50" fill="#E9C000"/>
            <rect x="20" y="162" width="55" height="16" fill="#E9C000"/>
            {/* KO GEM CON text */}
            <text x="108" y="158" fontFamily="Righteous, sans-serif" fontSize="20" fontWeight="700" fill="#E9C000">KO</text>
            <text x="108" y="178" fontFamily="Righteous, sans-serif" fontSize="20" fontWeight="700" fill="#E9C000">GEM</text>
            <text x="108" y="198" fontFamily="Righteous, sans-serif" fontSize="20" fontWeight="700" fill="#E9C000">CON</text>
          </svg>
        </div>

        {/* Slogan */}
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, Inter, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, color: '#E7E7E7', lineHeight: 1.2, marginBottom: 12 }}>
          Find your{' '}
          <span style={{ color: '#E9C000', fontWeight: 700 }}>Gems</span>
          {' '}in Korea
        </h1>

        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#B0B0B0', marginBottom: 36 }}>
          Events, tours & meetups for <strong style={{ color: '#E7E7E7' }}>foreigners</strong> in Korea
        </p>

        {/* CTA Button */}
        <Link href="/events" className="btn-primary" style={{ padding: '14px 36px', fontSize: 16, textDecoration: 'none' }}>
          Check out Events
        </Link>
      </div>

      {/* Yellow separator bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: '#E9C000' }} />
    </section>
  )
}
