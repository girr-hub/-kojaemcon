'use client'
import EventCard from '@/components/EventCard'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="sub-en text-primary text-sm tracking-widest uppercase mb-2">Discover</p>
        <h1 className="headline-en text-6xl md:text-7xl uppercase">ALL EVENTS</h1>
      </div>
      {loading ? (
        <p className="text-ink/40 sub-en text-xl text-center py-20">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-ink/40 sub-en text-xl text-center py-20">No events found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e: any) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
