'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const CATEGORIES = [
  { id: 'photography', label: '📸 Photography' },
  { id: 'videography', label: '🎬 Videography' },
  { id: 'dj', label: '🎧 DJ / Music' },
  { id: 'mc', label: '🎤 MC / Host' },
  { id: 'design', label: '🎨 Design' },
  { id: 'translation', label: '🌐 Translation / Interpreter' },
  { id: 'tour-guide', label: '🗺 Tour Guide' },
  { id: 'chef', label: '👨‍🍳 Chef / Catering' },
  { id: 'fitness', label: '💪 Fitness / Sports' },
  { id: 'marketing', label: '📱 Social Media / Marketing' },
  { id: 'performance', label: '🎭 Performance / Dance' },
  { id: 'other', label: '✨ Other' },
]

export default function TalentPage() {
  const [f, setF] = useState({
    name: '', email: '', nationality: '', bio: '',
    instagram: '', portfolio: '', categories: [] as string[],
    available: true,
  })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const toggleCat = (id: string) => {
    setF(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id],
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (f.categories.length === 0) { setErr('Please select at least one category'); return }
    setLoading(true)
    const sb = supabase()

    const { data: existing } = await sb.from('site_settings').select('value').eq('key', 'talent_roster').single()
    const roster = (existing?.value as any[]) ?? []
    roster.push({ ...f, created_at: new Date().toISOString(), id: crypto.randomUUID() })

    await sb.from('site_settings').upsert({
      key: 'talent_roster',
      value: roster as any,
      updated_at: new Date().toISOString(),
    })

    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#F8F8F6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ background: '#D4B33A', border: '1.5px solid #0A0A0A', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
          🎉
        </div>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 32, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 12 }}>
          You&apos;re in the roster!
        </h2>
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.65 }}>
          We&apos;ll reach out when there&apos;s an opportunity that matches your skills. Thank you for joining the KOJAEMCON talent network!
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div className="eyebrow">Talent Network</div>

        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#0A0A0A', marginBottom: 16 }}>
          Join Our{' '}
          <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(46px, 7vw, 74px)' }}>
            Talent
          </em>
          {' '}Roster
        </h1>

        <p style={{ fontSize: 15, color: '#6B6B6B', lineHeight: 1.65, marginBottom: 48, maxWidth: 480 }}>
          Are you a photographer, DJ, tour guide, chef, or any other creative?
          Register and we&apos;ll connect you with KOJAEMCON events that need your skills.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Name *</label>
              <input className="input-base" placeholder="Your full name" required
                     value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Email *</label>
              <input className="input-base" type="email" placeholder="your@email.com" required
                     value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Nationality</label>
            <input className="input-base" placeholder="e.g. American, French, Japanese..."
                   value={f.nationality} onChange={e => setF({ ...f, nationality: e.target.value })} />
          </div>

          {/* Categories */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 12 }}>
              Skills / Categories * (select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: f.categories.includes(cat.id) ? '#D4B33A' : '#F8F8F6',
                    color: '#0A0A0A',
                    border: f.categories.includes(cat.id) ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>About you *</label>
            <textarea
              className="input-base"
              placeholder="Tell us about your experience, what you do, and what makes you great..."
              required rows={5}
              style={{ resize: 'none' }}
              value={f.bio}
              onChange={e => setF({ ...f, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Instagram</label>
              <input className="input-base" placeholder="@yourhandle"
                     value={f.instagram} onChange={e => setF({ ...f, instagram: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Portfolio / Website</label>
              <input className="input-base" placeholder="https://yourportfolio.com"
                     value={f.portfolio} onChange={e => setF({ ...f, portfolio: e.target.value })} />
            </div>
          </div>

          {err && <p style={{ color: '#dc2626', fontSize: 13 }}>{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: 14, justifyContent: 'center', borderRadius: 100 }}
          >
            {loading ? 'Submitting...' : 'Join the talent roster →'}
          </button>

          <p style={{ fontSize: 12, color: '#9A9A9A', textAlign: 'center' }}>
            We review all applications and reach out within 48 hours.
          </p>
        </form>
      </div>
    </div>
  )
}
