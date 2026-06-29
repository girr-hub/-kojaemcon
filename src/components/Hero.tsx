'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const DEFAULT = {
  title_en: 'FIND YOUR',
  title_serif: 'Jaemi',
  title_en2: 'IN KOREA',
  subtitle: 'Events, tours & meetups for foreigners in Korea.',
  cta: 'Explore Events',
}

export default function Hero({ data }: {
  data?: { title_en?: string; title_kr?: string; subtitle?: string; cta?: string } | null
}) {
  return (
    <section className="relative overflow-hidden bg-[#F8F8F6]" style={{ borderBottom: '1px solid #E8E8E4' }}>
      {/* Ghost text background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(100px, 18vw, 240px)',
          letterSpacing: '-0.08em',
          color: '#E8E8E4',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}>
          KOJAEMCON
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-0 grid lg:grid-cols-2 gap-12 items-end">
        {/* Left */}
        <div className="pb-16">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div style={{ width: 20, height: 1.5, background: '#FFE500', border: '0.5px solid #0A0A0A' }} />
            <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A' }}>
              Events · Tours · Meetups · Culture
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(52px, 8vw, 88px)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#0A0A0A' }}
          >
            {data?.title_en?.split(' ')[0] || 'FIND YOUR'}
            <br />
            <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(60px, 9vw, 100px)' }}>
              Jaemi
            </em>
            <br />
            IN KOREA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.65, marginTop: 18, marginBottom: 24, maxWidth: 420 }}
          >
            {data?.subtitle || 'Events, tours & meetups for foreigners in Korea. Workers, students — your scene is right here.'}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/events" className="btn-primary">
              {data?.cta || 'Explore Events'} →
            </Link>
            <Link href="/host/new" className="btn-outline">
              Launch your event
            </Link>
          </motion.div>
        </div>

        {/* Right: Phone mockup */}
        <div className="hidden lg:flex items-end justify-center pb-0">
          <div style={{
            width: 220,
            background: '#0A0A0A',
            borderRadius: '24px 24px 0 0',
            border: '1.5px solid #E8E8E4',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            height: 280,
          }}>
            <div style={{ background: '#FFE500', borderRadius: 12, padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>PARTY</span>
              <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#0A0A0A' }}>Hongdae<br/>Foreigner<br/>Meetup</span>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 16, flex: 0.7, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555' }}>TOUR</span>
              <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 900, letterSpacing: '-0.02em', color: '#FFE500' }}>Seoul Night Walk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background: '#0A0A0A', borderTop: '1px solid #0A0A0A', padding: '10px 0', overflow: 'hidden', marginTop: 0 }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite', fontFamily: 'Inter', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFE500' }}>
          {Array(8).fill('PARTY · TOUR · MEETUP · LANGUAGE · CULTURE · FOOD ·').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
