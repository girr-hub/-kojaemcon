'use client'
import Hero from '@/components/Hero'
import EventCard from '@/components/EventCard'
import { useEffect, useState } from 'react'

export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const hero = {
    title_en: 'FIND YOUR JAEMI IN KOREA',
    title_kr: '한국에서 너의 씬을 찾아라',
    subtitle: 'Events, tours & meetups for foreigners in Korea',
    cta: 'Explore Events'
  }

  useEffect(() => {
    fetch('/api/events-list').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setEvents(d)
    })
  }, [])

  return (
    <>
      <Hero data={hero} />
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="headline-en text-5xl md:text-7xl text-ink uppercase mb-12">Upcoming</h2>
        {events.length === 0 ? (
          <p className="text-ink/40 sub-en text-center py-20 text-xl">No upcoming events yet</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e: any) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </>
  )
}
