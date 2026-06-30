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

    if (event.is_free) { setShowNoshow(true); return }
    await processPayment()
  }

  const processPayment = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return

    const prep = await fetch('/api/payments/prepare', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, quantity: 1 }),
    }).then(r => r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }

    const result = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      paymentId: prep.payment_id, orderName: event.title,
      totalAmount: event.price_krw, currency: 'KRW' as any,
      payMethod: 'CARD', customer: { email: user.email },
      redirectUrl: `${location.origin}/my`,
    })
    if (result?.code) { alert(result.message); setBusy(false); return }

    const verify = await fetch('/api/payments/verify', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payment_id: prep.payment_id }),
    }).then(r => r.json())
    if (verify.ok) window.location.href = `/chat/${event.id}`
    else alert('Verification failed')
    setBusy(false)
  }

  const confirmJoin = async () => {
    setShowNoshow(false)
    setBusy(true)
    // prepare API가 이제 order + chat room + member 까지 전부 서버에서 처리함
    const prep = await fetch('/api/payments/prepare', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, quantity: 1 }),
    }).then(r => r.json())

    if (prep.error) { alert(prep.error); setBusy(false); return }

    // 바로 채팅방으로 (서버에서 이미 다 준비됨)
    window.location.href = `/chat/${event.id}`
  }

  if (remaining <= 0) return (
    <button disabled style={{ width:'100%', background:'#F8F8F6', color:'#C4C4C0', border:'1.5px solid #E8E8E4', borderRadius:100, padding:'14px 28px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:'not-allowed' }}>
      Sold Out
    </button>
  )

  return (
    <>
      {showNoshow && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={() => setShowNoshow(false)} />
          <div style={{ position:'relative', background:'#fff', border:'1.5px solid #E8E8E4', borderRadius:16, padding:28, maxWidth:380, width:'100%', zIndex:10 }}>
            <div style={{ background:'#D4B33A', border:'1.5px solid #0A0A0A', borderRadius:'50%', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:14 }}>!</div>
            <h3 style={{ fontFamily:'Inter', fontWeight:900, fontSize:18, letterSpacing:'-0.03em', color:'#0A0A0A', marginBottom:10 }}>No-Show Policy</h3>
            <p style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.75, marginBottom:6 }}>This is a <strong style={{color:'#0A0A0A'}}>FREE</strong> event. By joining, you commit to attending.</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#dc2626', marginBottom:20 }}>No-shows are strictly not allowed.</p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setShowNoshow(false)} style={{ flex:1, border:'1.5px solid #E8E8E4', borderRadius:100, padding:'11px', fontFamily:'Inter', fontWeight:600, fontSize:13, cursor:'pointer', background:'#fff', color:'#0A0A0A' }}>Cancel</button>
              <button onClick={confirmJoin} disabled={busy} style={{ flex:1, background:'#0A0A0A', color:'#fff', border:'1.5px solid #0A0A0A', borderRadius:100, padding:'11px', fontFamily:'Inter', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                {busy ? 'Joining...' : 'I Agree — JOIN'}
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={handleClick} disabled={busy} style={{ width:'100%', background:'#0A0A0A', color:'#fff', border:'1.5px solid #0A0A0A', borderRadius:100, padding:'14px 28px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:busy?'not-allowed':'pointer', opacity:busy?0.6:1 }}>
        {busy ? 'Processing...' : event.is_free ? 'JOIN FREE' : `Buy — ₩${Number(event.price_krw).toLocaleString()}`}
      </button>
    </>
  )
}
