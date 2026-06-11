'use client'
import * as PortOne from '@portone/browser-sdk/v2'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function BuyButton({ event, remaining }: { event: any; remaining: number }) {
  const [busy, setBusy] = useState(false)
  const r = useRouter()

  const buy = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { r.push('/login'); return }
    if (remaining <= 0) { alert('Sold out'); setBusy(false); return }

    // 1) 서버에 주문 prepare
    const prep = await fetch('/api/payments/prepare', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ event_id: event.id, quantity: 1 }),
    }).then(r=>r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }

    // 무료면 prepare에서 바로 free_confirmed 처리됨
    if (prep.free) { r.push(`/my`); return }

    // 2) 포트원 결제창
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

    // 3) 서버 검증
    const verify = await fetch('/api/payments/verify', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ payment_id: prep.payment_id }),
    }).then(r=>r.json())
    if (verify.ok) r.push('/my')
    else alert('Verification failed')
    setBusy(false)
  }

  return (
    <button onClick={buy} disabled={busy || remaining <= 0}
            className="w-full bg-primary text-bg py-4 sub-en uppercase font-bold tracking-wider disabled:opacity-30">
      {remaining <= 0 ? 'Sold out' : event.is_free ? 'RSVP free' : 'Buy ticket'}
    </button>
  )
}
