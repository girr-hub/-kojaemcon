'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const CATS = [
  { id: 'general', label: '💬 General' },
  { id: 'ticket', label: '🎫 Ticket' },
  { id: 'refund', label: '💳 Refund' },
  { id: 'event', label: '📅 Event Issue' },
  { id: 'account', label: '👤 Account' },
  { id: 'other', label: '✨ Other' },
]

export default function CSPage() {
  const [f, setF] = useState({ name: '', email: '', category: 'general', subject: '', message: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    const { error } = await sb.from('cs_tickets').insert({ user_id: user?.id ?? null, ...f })
    setLoading(false)
    if (!error) setDone(true)
    else alert('Error: ' + error.message)
  }

  if (done) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 24, color: '#0A0A0A', marginBottom: 8 }}>Message received!</h2>
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.65 }}>We typically respond within 24–48 hours.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div className="eyebrow">Support</div>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 'clamp(36px,6vw,56px)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#0A0A0A', marginBottom: 12 }}>
          Contact <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(40px,7vw,64px)' }}>Us</em>
        </h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 40, lineHeight: 1.65 }}>
          Got a question or issue? We&apos;ll get back to you within 48 hours.
        </p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 6 }}>Name *</label>
              <input className="input-base" required placeholder="Your name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 6 }}>Email *</label>
              <input className="input-base" type="email" required placeholder="your@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>Category *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATS.map(c => (
                <button key={c.id} type="button" onClick={() => setF({ ...f, category: c.id })}
                  style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: f.category === c.id ? '#0A0A0A' : '#F8F8F6', color: f.category === c.id ? '#fff' : '#0A0A0A',
                    border: f.category === c.id ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4' }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 6 }}>Subject *</label>
            <input className="input-base" required placeholder="Brief description" value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 6 }}>Message *</label>
            <textarea className="input-base" required rows={6} style={{ resize: 'none' }}
              placeholder="Describe your issue in detail..." value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px', justifyContent: 'center', fontSize: 14 }}>
            {loading ? 'Sending...' : 'Submit inquiry →'}
          </button>
        </form>
      </div>
    </div>
  )
}
