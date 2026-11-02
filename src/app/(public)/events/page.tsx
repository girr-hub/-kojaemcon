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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* 헤더 */}
      <div style={{
        background: 'rgba(248,248,248,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ padding: '14px 16px 0' }}>
          <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-0.05em', marginBottom: 10 }}>
            Events
          </h1>
          <SearchBar placeholder="이벤트 검색..." />
        </div>

        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 0, borderTop: '1px solid var(--border)', marginTop: 10 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '11px 16px', fontSize: 12,
              fontWeight: cat === c ? 800 : 500, cursor: 'pointer', flexShrink: 0,
              background: 'none', color: cat === c ? 'var(--text)' : 'var(--text-4)',
              border: 'none',
              borderBottom: `2px solid ${cat === c ? 'var(--gold)' : 'transparent'}`,
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              transition: 'all 0.12s', letterSpacing: '-0.01em',
            }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 이벤트 리스트 */}
      <div style={{ background: '#FFFFFF', marginTop: 8, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {loading ? <EventListSkeleton /> : filtered.length === 0 ? <NoEvents /> : (
          <div>{filtered.map(e => <EventFeedCard key={e.id} event={e} />)}</div>
        )}
      </div>
    </div>
  )
}
