'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState(0)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const sb = supabase()

    const { data: existing } = await sb
      .from('site_settings')
      .select('value')
      .eq('key', 'waitlist')
      .single()

    const list = (existing?.value as any[]) ?? []
    list.push({ email, name, created_at: new Date().toISOString() })

    await sb.from('site_settings').upsert({
      key: 'waitlist',
      value: list as any,
      updated_at: new Date().toISOString(),
    })

    setPosition(list.length)
    setDone(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(80px, 15vw, 200px)', letterSpacing: '-0.08em', color: 'rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>
          GET IN LINE
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: '#FFFFFF' }}>
            Ko<em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 34 }}>jaem</em>con
          </span>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFE500', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 1.5, background: '#FFE500' }} />
          Coming Soon
          <div style={{ width: 20, height: 1.5, background: '#FFE500' }} />
        </div>

        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(40px, 8vw, 72px)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#FFFFFF', marginBottom: 16 }}>
          GET IN<br />
          <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(46px, 9vw, 82px)' }}>
            line
          </em>
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 48, maxWidth: 360, margin: '20px auto 48px' }}>
          We&apos;re building something for the foreigner community in Korea.
          Be first in line — we&apos;ll notify you the moment we launch.
        </p>

        {done ? (
          <div style={{ background: '#FFE500', border: '1.5px solid #0A0A0A', borderRadius: 16, padding: '24px 32px', display: 'inline-block' }}>
            <p style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 6 }}>
              #{position}
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: '#0A0A0A' }}>
              You&apos;re in line! We&apos;ll email you at launch 🎉
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
                color: '#fff', borderRadius: 10, padding: '14px 16px',
                fontFamily: 'Inter', fontSize: 14, outline: 'none',
              }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
                color: '#fff', borderRadius: 10, padding: '14px 16px',
                fontFamily: 'Inter', fontSize: 14, outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#FFE500', color: '#0A0A0A', border: '1.5px solid #0A0A0A',
                borderRadius: 100, padding: '14px 28px',
                fontFamily: 'Inter', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Joining the line...' : 'Get in line →'}
            </button>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
              No spam. Just your launch notification.
            </p>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 64, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { n: '5,000+', l: 'Community' },
            { n: '50+', l: 'Events' },
            { n: '30+', l: 'Nationalities' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 32, letterSpacing: '-0.04em', color: '#FFE500' }}>{s.n}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
