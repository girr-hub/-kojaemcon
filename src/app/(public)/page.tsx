'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventFeedCard from '@/components/EventFeedCard'
import SponsorBanner from '@/components/SponsorBanner'

const CATEGORIES = [
  { e: '🎉', l: 'Party' },
  { e: '🗺', l: 'Tour' },
  { e: '🤝', l: 'Meetup' },
  { e: '🗣', l: 'Language' },
  { e: '🍻', l: 'Social' },
  { e: '🎨', l: 'Culture' },
]

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events-list')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setEvents(d); setLoading(false) })
  }, [])

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh' }}>

      {/* 헤더 */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.04em' }}>Events in Korea</p>
              <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>For the international community</p>
            </div>
            <Link href="/events" style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #1A1A1A', paddingBottom: 1, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
              See all
            </Link>
          </div>

          {/* 카테고리 */}
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 14, scrollbarWidth: 'none' as any }}>
            {CATEGORIES.map(c => (
              <Link key={c.l} href={`/events?category=${c.l.toLowerCase()}`}
                style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {c.e}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#555', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>{c.l}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 스폰서 배너 */}
      <SponsorBanner position="home" />

      {/* 이벤트 피드 */}
      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F2F2F2' }}>
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 15, color: '#1A1A1A', letterSpacing: '-0.03em' }}>Upcoming</span>
          <Link href="/events" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>More</Link>
        </div>

        {loading ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #E9C000', borderTopColor: 'transparent', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#999' }}>No events yet</p>
          </div>
        ) : (
          <div>{events.slice(0, 6).map(e => <EventFeedCard key={e.id} event={e} />)}</div>
        )}
      </div>

      {/* 호스트 배너 */}
      <div style={{ background: '#FFFFFF', marginTop: 8, padding: '16px' }}>
        <div style={{ border: '1px solid #E8E8E8', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 3 }}>Host an event</p>
            <p style={{ fontSize: 13, color: '#999' }}>Reach foreigners in Korea</p>
          </div>
          <Link href="/host/new" style={{ background: '#1A1A1A', color: '#fff', fontSize: 13, fontWeight: 700, padding: '9px 16px', borderRadius: 8, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif', flexShrink: 0 }}>
            Start
          </Link>
        </div>
      </div>

    </div>
  )
}
