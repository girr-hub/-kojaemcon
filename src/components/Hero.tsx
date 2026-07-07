'use client'
import Link from 'next/link'

export default function Hero({ data }: {
  data?: { subtitle?: string; cta?: string } | null
}) {
  return (
    <>
      {/* Dark hero section - per design asset */}
      <section style={{
        background: '#12161A',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 24px',
      }}>
        {/* Ghost ㅋㅈㅋ background */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(200px, 35vw, 480px)',
            color: 'rgba(233,192,0,0.05)',
            lineHeight: 0.85,
            letterSpacing: '-0.08em',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <span>ㅋ</span>
            <span>ㅈ</span>
            <span>ㅋ</span>
          </div>
        </div>

        {/* Logo Symbol + KOGEMCON */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
            {/* ㅋㅈㅋ symbol */}
            <div style={{
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              fontWeight: 900,
              color: '#E9C000',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>ㅋ</span>
              <span style={{ fontSize: 'clamp(48px, 8vw, 96px)', marginLeft: 8 }}>ㅈ</span>
              <span style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>ㅋ</span>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 100, background: 'rgba(233,192,0,0.3)' }} />

            {/* KOGEMCON */}
            <div style={{
              fontFamily: 'Righteous, sans-serif',
              fontSize: 'clamp(28px, 5vw, 56px)',
              color: '#E9C000',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
            }}>
              KO<br />GEM<br />CON
            </div>
          </div>

          {/* Slogan */}
          <h1 style={{
            fontFamily: 'PretendardVariable, Pretendard, Inter, sans-serif',
            fontSize: 'clamp(22px, 4vw, 42px)',
            fontWeight: 400,
            color: '#E7E7E7',
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: 10,
          }}>
            Find your <span style={{ color: '#E9C000', fontWeight: 700 }}>Gems</span> in Korea
          </h1>

          <p style={{
            fontSize: 'clamp(13px, 2vw, 17px)',
            color: '#888',
            textAlign: 'center',
            marginBottom: 40,
          }}>
            Events, tours & meetups for <strong style={{ color: '#E7E7E7' }}>foreigners</strong> in Korea
          </p>

          {/* CTA */}
          <Link href="/events" style={{
            background: '#E9C000', color: '#12161A', border: 'none',
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontSize: 16, fontWeight: 700,
            padding: '14px 40px', borderRadius: 100,
            textDecoration: 'none', cursor: 'pointer',
            display: 'inline-block',
          }}>
            Check out Events
          </Link>
        </div>

        {/* Yellow bottom bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#E9C000' }} />
      </section>

      {/* Upcoming Events section - light */}
      <section style={{ background: '#FFFFFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 'clamp(20px, 3vw, 32px)',
            color: '#12161A', textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 40,
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            Upcoming Events
            <div style={{ flex: 1, height: 1, background: '#E8E8E4' }} />
          </h2>

          {/* Events rendered by home page client */}
          <div id="events-grid" />
        </div>
      </section>
    </>
  )
}
