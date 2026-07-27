'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type TicketType = 'solo' | 'returning' | 'with_friends'

export default function BuyButton({ event, remaining }: { event: any; remaining: number }) {
  const [busy, setBusy] = useState(false)
  const [showNoshow, setShowNoshow] = useState(false)
  const [ticketType, setTicketType] = useState<TicketType>('solo')
  const [friendsCount, setFriendsCount] = useState(2)

  const getPrice = () => {
    if (event.is_free) return 0
    if (!event.has_ticket_types) return event.price_krw
    if (ticketType === 'returning') return event.price_returning || event.price_krw
    if (ticketType === 'with_friends') return (event.price_with_friends || event.price_krw) * friendsCount
    return event.price_solo || event.price_krw
  }

  const handleClick = async () => {
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    if (remaining <= 0) { alert('Sold out'); return }
    if (event.is_free) { setShowNoshow(true); return }
    await handlePaid()
  }

  const confirmJoin = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const prep = await fetch('/api/payments/prepare', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, user_id: user.id }),
    }).then(r => r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }
    setShowNoshow(false)
    setBusy(false)
    window.location.href = `/chat/${event.id}`
  }

  const handlePaid = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const totalAmount = getPrice()
    const prep = await fetch('/api/payments/prepare', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, user_id: user.id, ticket_type: ticketType, friends_count: ticketType === 'with_friends' ? friendsCount : 1, amount: totalAmount }),
    }).then(r => r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }
    const PortOne = await import('@portone/browser-sdk/v2')
    const result = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      paymentId: prep.payment_id,
      orderName: event.title,
      totalAmount, currency: 'KRW' as any, payMethod: 'CARD' as any,
    })
    if (result?.code) { alert(result.message); setBusy(false); return }
    const verify = await fetch('/api/payments/verify', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payment_id: prep.payment_id }),
    }).then(r => r.json())
    setBusy(false)
    if (verify.ok) window.location.href = `/chat/${event.id}`
    else alert('Payment verification failed')
  }

  if (remaining <= 0) return (
    <button disabled style={{ width:'100%', background:'#F8F8F6', color:'#C4C4C0', border:'1.5px solid #E8E8E4', borderRadius:100, padding:'14px', fontFamily:'Inter', fontWeight:700, fontSize:14 }}>
      Sold Out
    </button>
  )

  const TICKET_TYPES = [
    { id: 'solo', label: 'Solo', emoji: '🙋', desc: 'Coming alone', price: event.price_solo || event.price_krw },
    { id: 'returning', label: 'Returning', emoji: '🔄', desc: 'Visited before', price: event.price_returning || event.price_krw },
    { id: 'with_friends', label: 'With Friends', emoji: '🧑‍🤝‍🧑', desc: 'Coming with friend(s)', price: event.price_with_friends || event.price_krw },
  ]

  return (
    <>
      {showNoshow && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={() => setShowNoshow(false)} />
          <div style={{ position:'relative', background:'#fff', border:'1.5px solid #E8E8E4', borderRadius:16, padding:28, maxWidth:380, width:'100%', zIndex:10 }}>
            <div style={{ background:'#E9C000', borderRadius:'50%', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:14 }}>⚠️</div>
            <h3 style={{ fontFamily:'Inter', fontWeight:800, fontSize:18, color:'#0A0A0A', marginBottom:8 }}>No-show Policy</h3>
            <p style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.7, marginBottom:20 }}>
              This is a free event. Please only register if you plan to attend. Repeated no-shows may affect your account.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setShowNoshow(false)} style={{ flex:1, border:'1.5px solid #E8E8E4', borderRadius:100, padding:'11px', fontFamily:'Inter', fontWeight:600, fontSize:13, cursor:'pointer', background:'#fff', color:'#0A0A0A' }}>Cancel</button>
              <button onClick={confirmJoin} disabled={busy} style={{ flex:1, background:'#0A0A0A', color:'#fff', border:'none', borderRadius:100, padding:'11px', fontFamily:'Inter', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                {busy ? 'Joining...' : "I'll be there ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {!event.is_free && event.has_ticket_types && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {TICKET_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setTicketType(t.id as TicketType)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1.5px solid', borderColor: ticketType === t.id ? '#0A0A0A' : '#E8E8E4', background: ticketType === t.id ? '#0A0A0A' : '#F8F8F6', cursor:'pointer', transition:'all 0.15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:20 }}>{t.emoji}</span>
                  <div style={{ textAlign:'left' }}>
                    <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:13, color: ticketType === t.id ? '#fff' : '#0A0A0A' }}>{t.label}</p>
                    <p style={{ fontSize:11, color: ticketType === t.id ? 'rgba(255,255,255,0.6)' : '#9A9A9A' }}>{t.desc}</p>
                  </div>
                </div>
                <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:14, color: ticketType === t.id ? '#E9C000' : '#0A0A0A' }}>
                  ₩{Number(t.price).toLocaleString()}{t.id === 'with_friends' ? '/person' : ''}
                </span>
              </button>
            ))}
            {ticketType === 'with_friends' && (
              <div style={{ background:'#F8F8F6', border:'1.5px solid #E8E8E4', borderRadius:12, padding:'12px 16px' }}>
                <p style={{ fontSize:12, fontWeight:600, color:'#6B6B6B', marginBottom:8 }}>How many people total? (including you)</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button type="button" onClick={() => setFriendsCount(Math.max(1, friendsCount - 1))} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>−</button>
                  <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:20, minWidth:32, textAlign:'center' }}>{friendsCount}</span>
                  <button type="button" onClick={() => setFriendsCount(Math.min(event.friends_max || 10, friendsCount + 1))} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>+</button>
                  <span style={{ fontSize:11, color:'#9A9A9A' }}>max {event.friends_max || 10}</span>
                </div>
                <p style={{ fontSize:13, fontWeight:800, color:'#0A0A0A', marginTop:8 }}>
                  Total: ₩{(Number(event.price_with_friends || event.price_krw) * friendsCount).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        <button onClick={handleClick} disabled={busy}
          style={{ width:'100%', background:'#0A0A0A', color:'#fff', border:'1.5px solid #0A0A0A', borderRadius:100, padding:'14px 28px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:busy?'not-allowed':'pointer', opacity:busy?0.6:1 }}>
          {busy ? 'Processing...' : event.is_free ? 'JOIN FREE' : `Buy — ₩${Number(getPrice()).toLocaleString()}`}
        </button>

        {!event.is_free && (
          <div style={{ background:'#F8F8F6', border:'1px solid #E8E8E4', borderRadius:10, padding:'10px 14px' }}>
            <p style={{ fontSize:11, color:'#6B6B6B', lineHeight:1.6 }}>
              💳 <strong>Korean-issued cards only</strong> (credit & debit card)<br/>
              For international cards, please <a href="/cs" style={{ color:'#0A0A0A', fontWeight:700 }}>contact CS →</a>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
