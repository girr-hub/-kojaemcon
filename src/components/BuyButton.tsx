'use client'
import { useState } from 'react'
import * as PortOne from '@portone/browser-sdk/v2'
import { supabase } from '@/lib/supabase/client'

export default function BuyButton({ event, remaining }: { event: any; remaining: number }) {
  const [busy, setBusy] = useState(false)
  const [showNoshow, setShowNoshow] = useState(false)

  const handleClick = async () => {
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    if (remaining <= 0) { alert('Sold out'); return }

    const { data: existing } = await sb.from('orders')
      .select('id, status')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .in('status', ['paid', 'free_confirmed', 'pending'])
      .maybeSingle()

    if (existing) {
      window.location.href = `/chat/${event.id}`
      return
    }

    if (event.is_free) {
      setShowNoshow(true)
      return
    }

    await processPayment()
  }

  const processPayment = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return

    const prep = await fetch('/api/payments/prepare', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, quantity: 1 }),
    }).then(r => r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }

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

  const confirmJoin = async () => {
    setShowNoshow(false)
    setBusy(true)
    const prep = await fetch('/api/payments/prepare', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, quantity: 1 }),
    }).then(r => r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }
    if (prep.free) {
      window.location.href = `/chat/${event.id}`
      return
    }
    setBusy(false)
  }

  if (remaining <= 0) {
    return (
      <button disabled className="w-full bg-surface text-ink/40 py-4 sub-en uppercase tracking-wider cursor-not-allowed">
        Sold Out
      </button>
    )
  }

  return (
    <>
      {showNoshow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowNoshow(false)}/>
          <div className="relative bg-[#1e1e1e] border border-ink/20 p-8 max-w-sm w-full z-10">
            <h3 className="headline-en text-2xl uppercase mb-4 text-primary">No-Show Policy</h3>
            <p className="sub-en text-ink/80 leading-relaxed mb-2">
              This is a FREE event. By joining, you commit to attending.
            </p>
            <p className="sub-en text-white font-bold mb-6">
              No-shows are strictly not allowed. Repeated no-shows may result in account suspension.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowNoshow(false)}
                      className="flex-1 border border-ink/30 text-ink py-3 sub-en uppercase">
                Cancel
              </button>
              <button onClick={confirmJoin}
                      className="flex-1 bg-primary text-bg py-3 sub-en uppercase font-bold">
                I Agree - Join
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={handleClick} disabled={busy}
              className="w-full bg-primary text-bg py-4 sub-en uppercase font-bold tracking-wider disabled:opacity-30">
        {busy ? 'Processing...' : event.is_free ? 'JOIN FREE' : 'Buy ticket'}
      </button>
    </>
  )
}
