'use client'
import Hero from '@/components/Hero'
import EventCard from '@/components/EventCard'
import { useEffect, useState } from 'react'

export default function Home() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/events-list').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setEvents(d)
    })
  }, [])

  return (
    <>
      <Hero />
      <section style={{ background: '#12161A', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            fontWeight: 700, fontSize: 'clamp(24px,4vw,40px)',
            color: '#E7E7E7', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 40,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            Upcoming Events
            <div style={{ flex: 1, height: 1, background: '#2a2f35' }} />
          </h2>

          {events.length === 0 ? (
            <p style={{ color: '#555', fontSize: 15, textAlign: 'center', padding: '40px 0' }}>No upcoming events yet</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {events.map((e: any) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
