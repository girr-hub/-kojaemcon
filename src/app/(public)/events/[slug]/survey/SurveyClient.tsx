'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SurveyClient({ event }: { event: any }) {
  const [rating, setRating] = useState(0)
  const [recommend, setRecommend] = useState<boolean | null>(null)
  const [highlight, setHighlight] = useState('')
  const [improve, setImprove] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!rating) { alert('Please give a rating'); return }
    setLoading(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    const { error } = await sb.from('survey_responses').upsert({
      event_id: event.id, user_id: user?.id ?? null, rating, would_recommend: recommend, highlight, improve,
    }, { onConflict: 'event_id,user_id' })
    setLoading(false)
    if (!error) setDone(true)
    else alert('Error: ' + error.message)
  }

  if (done) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 24, color: '#0A0A0A', marginBottom: 8 }}>Thank you!</h2>
        <p style={{ fontSize: 14, color: '#6B6B6B' }}>Your feedback helps us make better events.</p>
      </div>
    </div>
  )

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!']

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '100px 24px 80px' }}>
        <div className="eyebrow">Feedback</div>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 32, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 6 }}>How was the event?</h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 32 }}>{event.title}</p>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 12 }}>Overall Rating *</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)} type="button"
                style={{ width: 52, height: 52, borderRadius: 12, fontSize: 22, cursor: 'pointer', border: 'none', background: rating >= s ? '#D4B33A' : '#F8F8F6', transition: 'all 0.15s' }}>
                ⭐
              </button>
            ))}
          </div>
          {rating > 0 && <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 8 }}>{ratingLabels[rating]}</p>}
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 12 }}>Would you recommend this?</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ v: true, l: '👍 Yes' }, { v: false, l: '👎 No' }].map(({ v, l }) => (
              <button key={String(v)} onClick={() => setRecommend(v)} type="button"
                style={{ padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  background: recommend === v ? '#0A0A0A' : '#F8F8F6', color: recommend === v ? '#fff' : '#0A0A0A',
                  border: recommend === v ? '1.5px solid #0A0A0A' : '1.5px solid #E8E8E4' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>What did you enjoy most?</label>
          <textarea className="input-base" rows={3} style={{ resize: 'none' }} placeholder="The people, the venue..." value={highlight} onChange={e => setHighlight(e.target.value)} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9A9A', display: 'block', marginBottom: 8 }}>What could be improved?</label>
          <textarea className="input-base" rows={3} style={{ resize: 'none' }} placeholder="Suggestions for next time..." value={improve} onChange={e => setImprove(e.target.value)} />
        </div>

        <button onClick={submit} disabled={loading || !rating} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 14 }}>
          {loading ? 'Submitting...' : 'Submit feedback →'}
        </button>
      </div>
    </div>
  )
}
