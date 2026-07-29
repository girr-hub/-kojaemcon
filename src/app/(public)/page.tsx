'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventFeedCard from '@/components/EventFeedCard'

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/events-list').then(r => r.json()).then(d => { if (Array.isArray(d)) setEvents(d); setLoading(false) })
  }, [])

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      {/* 상단 헤더 섹션 */}
      <div style={{ background: '#FFFFFF', padding: '16px 16px 12px', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 19, fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.04em', marginBottom: 2 }}>Find your Gems 💎</p>
            <p style={{ fontSize: 13, color: '#9A9A9A' }}>Events for foreigners in Korea</p>
          </div>
          <Link href="/events" style={{ background: '#E9C000', color: '#1A1A1A', fontSize: 12, fontWeight: 800, padding: '8px 16px', borderRadius: 10, textDecoration: 'none',  }}>See all</Link>
        </div>
        {/* 카테고리 */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' as any }}>
          {[{e:'🎉',l:'Party'},{e:'🗺',l:'Tour'},{e:'🤝',l:'Meetup'},{e:'🗣',l:'Language'},{e:'🍻',l:'Social'},{e:'🎨',l:'Culture'}].map(c => (
            <Link key={c.l} href={`/events?category=${c.l.toLowerCase()}`} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: '#F7F7F7', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.e}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#3D3D3D' }}>{c.l}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 이벤트 피드 */}
      <div style={{ background: '#FFFFFF' }}>
        <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>Upcoming 🔥</h2>
          <Link href="/events" style={{ fontSize: 13, color: '#9A9A9A' }}>More</Link>
        </div>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9A9A9A', fontSize: 14 }}>Loading...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎪</div>
            <p style={{ fontSize: 15, color: '#9A9A9A' }}>No events yet</p>
          </div>
        ) : (
          <div>{events.slice(0, 5).map(e => <EventFeedCard key={e.id} event={e} />)}</div>
        )}
      </div>

      {/* 호스팅 배너 */}
      <div style={{ padding: '16px', background: '#FFFFFF', borderTop: '1px solid #F0F0F0', marginTop: 8 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFFBEA 0%, #FFF9D6 100%)', borderRadius: 16, padding: '18px 16px', border: '1px solid #F5E87C', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#1A1A1A', marginBottom: 3, letterSpacing: '-0.02em' }}>Host an event!</p>
            <p style={{ fontSize: 12, color: '#6B6B6B' }}>Reach foreigners in Korea 🌍</p>
          </div>
          <Link href="/host/new" style={{ background: '#E9C000', color: '#1A1A1A', fontSize: 13, fontWeight: 800, padding: '9px 16px', borderRadius: 10, textDecoration: 'none',  flexShrink: 0 }}>Start</Link>
        </div>
      </div>
    </div>
  )
}
