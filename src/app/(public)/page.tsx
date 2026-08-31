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
    Promise.all([
      fetch('/api/events-list').then(r => r.json()),
      fetch('/api/experience-list').then(r => r.json()),
    ]).then(([evts, exps]) => {
      const expMapped = (Array.isArray(exps) ? exps : []).map((e: any) => ({
        ...e,
        slug: null,
        experience_id: e.id,
        is_free: true,
        price_krw: 0,
        starts_at: null,
        venue_name: e.location,
        cover_image_url: e.images?.[0] || null,
        status: 'published',
        category: '체험단',
        capacity: e.capacity,
        remaining: e.capacity,
        isExperience: true,
      }))
      const all = [...(Array.isArray(evts) ? evts : []), ...expMapped]
      setEvents(all)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh' }}>

      {/* 헤더 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 18, color: '#1A1A1A', letterSpacing: '-0.04em' }}>
                Korea Events
              </p>
              <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>for the international community</p>
            </div>
            <Link href="/events"
              style={{ fontSize: 13, color: '#555', fontWeight: 500, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif', marginTop: 4 }}>
              See all
            </Link>
          </div>

          {/* 카테고리 */}
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 14, scrollbarWidth: 'none' as any }}>
            {CATEGORIES.map(c => (
              <Link key={c.l} href={`/events?category=${c.l.toLowerCase()}`}
                style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                <span style={{ fontSize: 24 }}>{c.e}</span>
                <span style={{ fontSize: 11, color: '#666', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 400 }}>{c.l}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 스폰서 배너 */}
      <SponsorBanner position="home" />

      {/* 구분 */}
      <div style={{ background: '#fff', marginTop: 8, borderTop: '1px solid #EFEFEF', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Upcoming</span>
          <Link href="/events" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }}>More</Link>
        </div>
      </div>

      {/* 이벤트 피드 */}
      <div style={{ background: '#fff' }}>
        {loading ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#CCC', fontSize: 13 }}>Loading...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#999' }}>No events yet</p>
          </div>
        ) : (
          <div>{events.slice(0, 6).map(e => <EventFeedCard key={e.id} event={e} />)}</div>
        )}
      </div>

      {/* 호스트 배너 */}
      <div style={{ background: '#fff', marginTop: 8, padding: '16px' }}>
        <div style={{ border: '1px solid #E8E8E8', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>Host an event</p>
            <p style={{ fontSize: 12, color: '#999' }}>Reach foreigners in Korea</p>
          </div>
          <Link href="/host/new"
            style={{ background: '#1A1A1A', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
            Start
          </Link>
        </div>
      </div>

    </div>
  )
}
