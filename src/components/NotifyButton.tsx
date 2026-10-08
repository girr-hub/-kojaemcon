'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function NotifyButton({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const key = `notify_${eventId}`
    setSubscribed(!!localStorage.getItem(key))
  }, [eventId])

  const toggle = async () => {
    setLoading(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { window.location.href = '/login'; return }

    const key = `notify_${eventId}`
    if (subscribed) {
      await sb.from('event_notifications').delete().eq('event_id', eventId).eq('user_id', user.id)
      localStorage.removeItem(key)
      setSubscribed(false)
    } else {
      await sb.from('event_notifications').upsert({ event_id: eventId, user_id: user.id, email: user.email })
      localStorage.setItem(key, '1')
      setSubscribed(true)
    }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading}
      style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'PretendardVariable, Pretendard, sans-serif',
        background: subscribed ? '#F0F0F0' : '#E9C000', color: subscribed ? '#6B6B6B' : '#1A1A1A' }}>
      {loading ? '...' : subscribed ? '🔔 알림 신청됨 (취소하기)' : '🔔 오픈 알림 받기'}
    </button>
  )
}
