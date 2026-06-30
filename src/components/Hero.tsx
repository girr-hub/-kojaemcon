'use client'
import Link from 'next/link'

export default function Hero({ data }: {
  data?: { title_en?: string; title_kr?: string; subtitle?: string; cta?: string } | null
}) {
  return (
    <section className="relative overflow-hidden bg-[#F8F8F6]" style={{ borderBottom: '1px solid #E8E8E4' }}>
      {/* Ghost text background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(100px, 18vw, 240px)',
          letterSpacing: '-0.08em',
          color: '#E8E8E4',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}>
          KOJAEMCON
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-0 grid lg:grid-cols-2 gap-12 items-end">
        {/* Left */}
        <div className="pb-16">
          {/* ㅋㅈㅋ logo badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(72px, 12vw, 124px)',
              letterSpacing: '-0.12em',
              color: '#0A0A0A',
              WebkitTextStroke: '2px #0A0A0A',
              display: 'inline-block',
            }}>
              ㅋㅈㅋ
            </span>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', color: '#0A0A0A' }}>
              KOJAEMCON
            </span>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A' }}>
              Events · Tours · Meetups · Culture
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 88px)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#0A0A0A' }}>
            FIND YOUR
            <br />
            <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(56px, 9vw, 100px)' }}>
              Jaemi
            </em>
            <br />
            IN KOREA
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.65, marginTop: 18, marginBottom: 24, maxWidth: 420 }}>
            {data?.subtitle || 'Events, tours & meetups for foreigners in Korea. Workers, students — your scene is right here.'}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Link href="/events" className="btn-primary">
              Explore Events →
            </Link>
            <Link href="/host/new" className="btn-outline">
              Launch your event
            </Link>
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div className="hidden lg:flex items-end justify-center pb-0">
          <div style={{
            width: 220, background: '#0A0A0A', borderRadius: '24px 24px 0 0',
            border: '1.5px solid #E8E8E4', padding: 14, display: 'flex',
            flexDirection: 'column', gap: 10, height: 280,
          }}>
            <div style={{ background: '#D4B33A', borderRadius: 12, padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>PARTY</span>
              <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#0A0A0A' }}>Hongdae<br/>Foreigner<br/>Meetup</span>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 16, flex: 0.7, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555' }}>TOUR</span>
              <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 900, letterSpacing: '-0.02em', color: '#D4B33A' }}>Seoul Night Walk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background: '#0A0A0A', padding: '10px 0', overflow: 'hidden', marginTop: 0 }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite', fontFamily: 'Inter', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B33A' }}>
          {Array(8).fill('PARTY · TOUR · MEETUP · LANGUAGE · CULTURE · FOOD ·').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
