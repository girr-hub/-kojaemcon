'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'

export default function SurveyPage() {
  const params = useSearchParams()
  const eventId = params.get('event_id')
  const [event, setEvent] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!eventId) return
    supabase().from('events').select('title').eq('id', eventId).single()
      .then(({ data }) => setEvent(data))
  }, [eventId])

  const submit = async () => {
    if (!rating) { alert('Please select a rating'); return }
    setLoading(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    await sb.from('satisfaction_surveys').upsert({
      event_id: eventId, user_id: user?.id, rating, comment
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🙏</div>
        <h2 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 24, color: '#1A1A1A', marginBottom: 8 }}>Thank you!</h2>
        <p style={{ fontSize: 14, color: '#9A9A9A' }}>Your feedback helps us improve.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 22, color: '#1A1A1A', marginBottom: 6, letterSpacing: '-0.04em' }}>How was it? 🌟</h1>
        {event && <p style={{ fontSize: 14, color: '#9A9A9A', marginBottom: 24 }}>{event.title}</p>}

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', marginBottom: 12 }}>Overall Rating</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)}
                style={{ width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 22, background: rating >= n ? '#E9C000' : '#F0F0F0', transition: 'all 0.15s' }}>
                ⭐
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ textAlign: 'center', fontSize: 13, color: '#9A9A9A', marginTop: 8 }}>
              {['', 'Very Bad', 'Bad', 'Okay', 'Good', 'Excellent!'][rating]}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', marginBottom: 8 }}>Comments (optional)</p>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
            placeholder="Tell us what you liked or how we can improve..."
            style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif', outline: 'none', resize: 'none', boxSizing: 'border-box' as any }} />
        </div>

        <button onClick={submit} disabled={loading || !rating}
          style={{ width: '100%', padding: '14px', borderRadius: 12, background: rating ? '#1A1A1A' : '#F0F0F0', color: rating ? '#E9C000' : '#9A9A9A', border: 'none', fontWeight: 800, fontSize: 15, cursor: rating ? 'pointer' : 'default', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  )
}
