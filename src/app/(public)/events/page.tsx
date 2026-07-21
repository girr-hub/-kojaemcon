'use client'
import EventFeedCard from '@/components/EventFeedCard'
import { useEffect, useState } from 'react'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events-list')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setEvents(d)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 py-6 md:py-12">
      <div className="mb-6 md:mb-10">
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E9C000', marginBottom: 6, fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>Discover</p>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 8vw, 64px)', color: '#12161A', letterSpacing: '-0.04em', lineHeight: 1 }}>ALL EVENTS</h1>
      </div>
      {loading ? (
        <p className="text-ink/40 sub-en text-xl text-center py-20">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-ink/40 sub-en text-xl text-center py-20">No events found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {events.map((e: any) => <EventFeedCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
