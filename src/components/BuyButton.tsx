'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as PortOne from '@portone/browser-sdk/v2'
import { supabase } from '@/lib/supabase/client'

export default function BuyButton({ event, remaining }: { event: any; remaining: number }) {
  const [busy, setBusy] = useState(false)
  const r = useRouter()

  const buy = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    if (remaining <= 0) { alert('Sold out'); setBusy(false); return }

    // 중복 신청 체크
    const { data: existing } = await sb.from('orders')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .in('status', ['paid', 'free_confirmed', 'pending'])
      .maybeSingle()

    if (existing) {
      alert('You have already registered for this event!')
      setBusy(false)
      return
    }

    const prep = await fetch('/api/payments/prepare', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, quantity: 1 }),
    }).then(r => r.json())

    if (prep.error) { alert(prep.error); setBusy(false); return }

    if (prep.free) {
      // 무료 이벤트 - 채팅방으로 바로 이동
      window.location.href = `/chat/${event.id}`
      return
    }

    // 유료 결제
    const result = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      paymentId: prep.payment_id,
      orderName: event.title,
      totalAmount: event.price_krw,
      currency: 'KRW' as any,
      payMethod: 'CARD',
      customer: { email: user.email },
      redirectUrl: `${location.origin}/my`,
    })

    if (result?.code) { alert(result.message); setBusy(false); return }

    const verify = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payment_id: prep.payment_id }),
    }).then(r => r.json())

    if (verify.ok) window.location.href = `/chat/${event.id}`
    else alert('Verification failed')
    setBusy(false)
  }

  return (
    <button onClick={buy} disabled={busy || remaining <= 0}
            className="w-full bg-primary text-bg py-4 sub-en uppercase font-bold tracking-wider disabled:opacity-30">
      {remaining <= 0 ? 'Sold out' : busy ? 'Processing...' : event.is_free ? 'RSVP free' : 'Buy ticket'}
    </button>
  )
}
