'use client'
import EventFeedCard from '@/components/EventFeedCard'
import SearchBar from '@/components/SearchBar'
import { EventListSkeleton } from '@/components/Skeletons'
import { NoEvents } from '@/components/EmptyStates'
import { useEffect, useState } from 'react'

const CATEGORIES = ['All', 'Party', 'Tour', 'Meetup', 'Language', 'Social', 'Culture', 'Sports', 'Other']

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')

  useEffect(() => {
    fetch('/api/events-list')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setEvents(d); setLoading(false) })
  }, [])

  const filtered = cat === 'All' ? events : events.filter(e => e.category?.toLowerCase() === cat.toLowerCase())

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7' }}>

      {/* 헤더 */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ padding: '16px 16px 12px' }}>
          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 20, color: '#1A1A1A', letterSpacing: '-0.04em', marginBottom: 12 }}>Events</h1>
          <SearchBar placeholder="Search events..." />
        </div>

        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' as any, borderTop: '1px solid #F0F0F0' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '12px 16px', fontSize: 13, fontWeight: cat === c ? 800 : 500, cursor: 'pointer', flexShrink: 0,
                background: 'none', color: cat === c ? '#1A1A1A' : '#9A9A9A', border: 'none',
                borderBottom: cat === c ? '2px solid #E9C000' : '2px solid transparent',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif', transition: 'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 이벤트 리스트 */}
      <div style={{ background: '#FFFFFF', marginTop: 8 }}>
        {loading ? <EventListSkeleton /> : filtered.length === 0 ? <NoEvents /> : (
          <div>{filtered.map(e => <EventFeedCard key={e.id} event={e} />)}</div>
        )}
      </div>
    </div>
  )
}
