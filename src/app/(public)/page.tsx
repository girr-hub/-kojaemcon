'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventCard from '@/components/EventCard'

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/events-list').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setEvents(d)
    })
  }, [])

  return (
    <>
      {/* Dark hero */}
      <section style={{ background: '#12161A', minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 24px' }}>
        {/* Ghost */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(200px, 35vw, 480px)', color: 'rgba(233,192,0,0.05)', lineHeight: 0.85, letterSpacing: '-0.08em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>ㅋ</span><span>ㅈ</span><span>ㅋ</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
            <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', lineHeight: 0.9, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>ㅋ</span>
              <span style={{ fontSize: 'clamp(44px, 7.5vw, 88px)', marginLeft: 8 }}>ㅈ</span>
              <span style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>ㅋ</span>
            </div>
            <div style={{ width: 1, height: 90, background: 'rgba(233,192,0,0.3)' }} />
            <div style={{ fontFamily: 'Righteous, sans-serif', fontSize: 'clamp(24px, 4.5vw, 52px)', color: '#E9C000', lineHeight: 1.05, letterSpacing: '0.02em' }}>
              KO<br />GEM<br />CON
            </div>
          </div>

          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 400, color: '#E7E7E7', textAlign: 'center', lineHeight: 1.3, marginBottom: 10 }}>
            Find your <span style={{ color: '#E9C000', fontWeight: 700 }}>Gems</span> in Korea
          </h1>
          <p style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#888', textAlign: 'center', marginBottom: 40 }}>
            Events, tours & meetups for <strong style={{ color: '#E7E7E7' }}>foreigners</strong> in Korea
          </p>

          <Link href="/events" style={{ background: '#E9C000', color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 16, fontWeight: 700, padding: '14px 40px', borderRadius: 100, textDecoration: 'none', display: 'inline-block' }}>
            Check out Events
          </Link>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#E9C000' }} />
      </section>

      {/* Upcoming Events - light */}
      <section style={{ background: '#FFFFFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 3vw, 28px)', color: '#12161A', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 20 }}>
            Upcoming Events
            <div style={{ flex: 1, height: 1, background: '#E8E8E4' }} />
          </h2>

          {events.length === 0 ? (
            <p style={{ color: '#9A9A9A', fontSize: 15, textAlign: 'center', padding: '40px 0' }}>No upcoming events yet</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {events.map((e: any) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: '#E9C000', padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', color: '#12161A', marginBottom: 12 }}>
            Got something going on?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(18,22,26,0.7)', marginBottom: 28 }}>
            Running events for the international community in Korea? List your event on KOGEMCON.
          </p>
          <Link href="/host/new" style={{ background: '#12161A', color: '#E9C000', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 15, fontWeight: 700, padding: '14px 36px', borderRadius: 100, textDecoration: 'none', display: 'inline-block' }}>
            Launch your event →
          </Link>
        </div>
      </section>
    </>
  )
}
