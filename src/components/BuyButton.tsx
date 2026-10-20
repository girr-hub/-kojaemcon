'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

type TicketType = 'solo' | 'returning' | 'with_friends'
type CompanionInfo = { name: string; gender: string; nationality: string; age: string }

export default function BuyButton({ event, remaining }: { event: any; remaining: number }) {
  const [busy, setBusy] = useState(false)
  const [showNoshow, setShowNoshow] = useState(false)
  const [joined, setJoined] = useState(false)
  const [ticketType, setTicketType] = useState<TicketType>('solo')
  const [friendsCount, setFriendsCount] = useState(2)
  const [companionInfo, setCompanionInfo] = useState<CompanionInfo[]>([])
  const [soloQty, setSoloQty] = useState(1)
  const [returningQty, setReturningQty] = useState(1)
  const [subOption, setSubOption] = useState<string | null>(null)
  const [subOptionPrice, setSubOptionPrice] = useState<number>(0)
  const [bikeOption, setBikeOption] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountError, setDiscountError] = useState('')

  const TICKET_TYPES = [
    { id: 'solo', label: event.solo_label || 'Solo', emoji: '🙋', desc: event.solo_desc || 'Coming alone', price: event.price_solo || event.price_krw },
    { id: 'returning', label: event.returning_label || 'Returning', emoji: '🔄', desc: event.returning_desc || 'Visited before', price: event.price_returning || event.price_krw },
    { id: 'with_friends', label: event.friends_label || 'With Friends', emoji: '🧑‍🤝‍🧑', desc: event.friends_desc || 'Coming with friends', price: event.price_with_friends || event.price_krw },
  ].filter(t => {
    if (t.id === 'solo') return true
    if (t.id === 'returning') return event.price_returning || event.returning_label
    if (t.id === 'with_friends') return event.price_with_friends || event.friends_label
    return false
  })

  // friendsCount 변경 시 companionInfo 동기화 (구매자 제외 나머지)
  const handleFriendsCountChange = (n: number) => {
    const newCount = Math.max(1, Math.min(event.friends_max || 10, n))
    setFriendsCount(newCount)
    setCompanionInfo(prev => {
      const arr = [...prev]
      while (arr.length < newCount) arr.push({ name: '', gender: '', nationality: '', age: '' })
      return arr.slice(0, newCount)
    })
  }

  const getDiscountRate = () => {
    if (!discountApplied) return 0
    return 10 // 예시: 10% 할인
  }

  const applyDiscount = async () => {
    if (!discountCode.trim()) { setDiscountError('Enter a discount code'); return }
    const res = await fetch('/api/discount/check', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: discountCode, event_id: event.id }),
    }).then(r => r.json())
    if (res.valid) {
      setDiscountApplied(true)
      setDiscountError('')
    } else {
      setDiscountError(res.error || 'Invalid code')
      setDiscountApplied(false)
    }
  }

  const getBasePrice = () => {
    if (event.is_free) return 0
    if (!event.has_ticket_types) return event.price_krw * soloQty
    if (ticketType === 'returning') return (event.price_returning || event.price_krw) * returningQty + (subOptionPrice || 0) * returningQty
    if (ticketType === 'with_friends') return (event.price_with_friends || event.price_krw) * friendsCount + (subOptionPrice || 0) * friendsCount
    return (event.price_solo || event.price_krw) * soloQty + (subOptionPrice || 0) * soloQty
  }

  const getPrice = () => {
    const base = getBasePrice()
    if (discountApplied) return Math.floor(base * (1 - getDiscountRate() / 100))
    return base
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
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event_id: event.id,
        user_id: user.id,
        ticket_type: 'free',
        friends_count: 1,
        quantity: 1,
      }),
    }).then(r => r.json())

    if (prep.error) { alert(prep.error); setBusy(false); return }
    setShowNoshow(false)
    setBusy(false)
    setJoined(true)
  }

  const handlePaid = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return

    const totalAmount = getPrice()
    const qty = !event.has_ticket_types ? soloQty : ticketType === 'with_friends' ? friendsCount : ticketType === 'returning' ? returningQty : soloQty

    const prep = await fetch('/api/payments/prepare', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event_id: event.id,
        user_id: user.id,
        ticket_type: ticketType,
        friends_count: ticketType === 'with_friends' ? friendsCount : 1,
        quantity: qty,
        amount: totalAmount,
        sub_option: subOption || undefined,
        sub_option_price: subOptionPrice || undefined,
        bike_option: bikeOption || undefined,
        discount_code: discountApplied ? discountCode : undefined,
        companion_info: ticketType === 'with_friends' ? companionInfo : undefined,
      }),
    }).then(r => r.json())

    if (prep.error) { alert(prep.error); setBusy(false); return }

    const PortOne = await import('@portone/browser-sdk/v2')
    const result = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      paymentId: prep.payment_id,
      orderName: event.title,
      totalAmount,
      currency: 'KRW' as any,
      payMethod: 'CARD' as any,
    })

    if (result?.code) { alert(result.message); setBusy(false); return }

    const verify = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payment_id: prep.payment_id }),
    }).then(r => r.json())

    setBusy(false)
    if (verify.ok) setJoined(true)
    else alert('Payment verification failed')
  }

  if (remaining <= 0) return (
    <button disabled style={{ width:'100%', background:'#F8F8F6', color:'#C4C4C0', border:'1.5px solid #E8E8E4', borderRadius:100, padding:'14px 28px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:'not-allowed' }}>
      Sold Out
    </button>
  )

  const companionIncomplete = ticketType === 'with_friends' && companionInfo.some(c => !c.name || !c.gender || !c.nationality || !c.age)

  return (
    <>
      {/* 조인 완료 팝업 */}
      {joined && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} />
          <div style={{ position:'relative', background:'#fff', borderRadius:20, padding:32, maxWidth:360, width:'100%', zIndex:10, textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
            <h3 style={{ fontFamily:'Inter', fontWeight:900, fontSize:22, color:'#0A0A0A', marginBottom:8 }}>You&apos;re in!</h3>
            <p style={{ fontSize:14, color:'#6B6B6B', lineHeight:1.7, marginBottom:24 }}>
              Successfully joined <strong>{event.title}</strong>.<br/>
              Check the group chat for updates!
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <a href={`/chat/${event.id}`} style={{ display:'block', background:'#0A0A0A', color:'#E9C000', borderRadius:100, padding:'13px', fontFamily:'Inter', fontWeight:700, fontSize:14, textDecoration:'none' }}>
                Go to Chat →
              </a>
              <button onClick={() => setJoined(false)} style={{ background:'#F8F8F6', color:'#6B6B6B', border:'1.5px solid #E8E8E4', borderRadius:100, padding:'13px', fontFamily:'Inter', fontWeight:600, fontSize:14, cursor:'pointer' }}>
                Stay on this page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 노쇼 경고 */}
      {showNoshow && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={() => setShowNoshow(false)} />
          <div style={{ position:'relative', background:'#fff', borderRadius:16, padding:28, maxWidth:380, width:'100%', zIndex:10 }}>
            <div style={{ background:'#E9C000', borderRadius:'50%', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:14 }}>⚠️</div>
            <h3 style={{ fontFamily:'Inter', fontWeight:800, fontSize:18, color:'#0A0A0A', marginBottom:8 }}>No-show Policy</h3>
            <p style={{ fontSize:13, color:'#6B6B6B', lineHeight:1.7, marginBottom:20 }}>
              This is a free event. Please only register if you plan to attend.
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
        {/* 티켓 타입 */}
        {!event.is_free && event.has_ticket_types && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {TICKET_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setTicketType(t.id as TicketType)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:12, border:'1.5px solid', borderColor: ticketType === t.id ? '#0A0A0A' : '#E8E8E4', background: ticketType === t.id ? '#0A0A0A' : '#F8F8F6', cursor:'pointer', transition:'all 0.15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:20 }}>{t.emoji}</span>
                  <div style={{ textAlign:'left' }}>
                    <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:13, color: ticketType === t.id ? '#fff' : '#0A0A0A', margin:0 }}>{t.label}</p>
                    <p style={{ fontSize:11, color: ticketType === t.id ? 'rgba(255,255,255,0.6)' : '#9A9A9A', margin:0 }}>{t.desc}</p>
                  </div>
                </div>
                <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:14, color: ticketType === t.id ? '#E9C000' : '#0A0A0A' }}>
                  ₩{Number(t.price).toLocaleString()}{t.id === 'with_friends' ? '/person' : ''}
                </span>
              </button>
            ))}

            {/* 서브옵션 - solo */}
            {ticketType === 'solo' && event.solo_option1_name && (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>SELECT OPTION <span style={{color:'#dc2626'}}>*필수</span></p>
                {[{name:event.solo_option1_name, price:event.solo_option1_price},{name:event.solo_option2_name, price:event.solo_option2_price}].filter(o=>o.name).map(o=>(
                  <button key={o.name} type="button" onClick={()=>{setSubOption(o.name);setSubOptionPrice(o.price)}}
                    style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:subOption===o.name?'#1A1A1A':'#EBEBEB', background:subOption===o.name?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                    <span style={{ fontSize:13, fontWeight:600, color:subOption===o.name?'#fff':'#1A1A1A' }}>{o.name}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:subOption===o.name?'#E9C000':'#1A1A1A' }}>₩{Number(o.price).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 서브옵션 - returning */}
            {ticketType === 'returning' && event.returning_option1_name && (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>SELECT OPTION <span style={{color:'#dc2626'}}>*필수</span></p>
                {[{name:event.returning_option1_name, price:event.returning_option1_price},{name:event.returning_option2_name, price:event.returning_option2_price}].filter(o=>o.name).map(o=>(
                  <button key={o.name} type="button" onClick={()=>{setSubOption(o.name);setSubOptionPrice(o.price)}}
                    style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:subOption===o.name?'#1A1A1A':'#EBEBEB', background:subOption===o.name?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                    <span style={{ fontSize:13, fontWeight:600, color:subOption===o.name?'#fff':'#1A1A1A' }}>{o.name}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:subOption===o.name?'#E9C000':'#1A1A1A' }}>₩{Number(o.price).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 서브옵션 - with_friends */}
            {ticketType === 'with_friends' && event.friends_option1_name && (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>SELECT OPTION <span style={{color:'#dc2626'}}>*필수</span></p>
                {[{name:event.friends_option1_name, price:event.friends_option1_price},{name:event.friends_option2_name, price:event.friends_option2_price}].filter(o=>o.name).map(o=>(
                  <button key={o.name} type="button" onClick={()=>{setSubOption(o.name);setSubOptionPrice(o.price)}}
                    style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:subOption===o.name?'#1A1A1A':'#EBEBEB', background:subOption===o.name?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                    <span style={{ fontSize:13, fontWeight:600, color:subOption===o.name?'#fff':'#1A1A1A' }}>{o.name}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:subOption===o.name?'#E9C000':'#1A1A1A' }}>₩{Number(o.price).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 인원수 선택 (with_friends) */}
            {ticketType === 'with_friends' && (
              <div style={{ background:'#F8F8F6', border:'1.5px solid #E8E8E4', borderRadius:12, padding:'12px 16px' }}>
                <p style={{ fontSize:12, fontWeight:600, color:'#6B6B6B', marginBottom:8 }}>How many friends are coming? (not including you)</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button type="button" onClick={() => handleFriendsCountChange(friendsCount - 1)} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>−</button>
                  <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:20, minWidth:32, textAlign:'center' }}>{friendsCount}</span>
                  <button type="button" onClick={() => handleFriendsCountChange(friendsCount + 1)} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>+</button>
                </div>
                <p style={{ fontSize:13, fontWeight:800, color:'#0A0A0A', marginTop:8 }}>
                  Total: ₩{(Number(event.price_with_friends || event.price_krw) * friendsCount).toLocaleString()}
                </p>
              </div>
            )}

            {/* 동행자 정보 입력 폼 (with_friends, 구매자 제외) */}
            {ticketType === 'with_friends' && companionInfo.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A', margin:0 }}>
                  COMPANION INFO <span style={{color:'#dc2626'}}>*Required</span>
                </p>
                {companionInfo.map((c, i) => (
                  <div key={i} style={{ background:'#F8F8F6', border:'1.5px solid #E8E8E4', borderRadius:12, padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'#0A0A0A', margin:0 }}>Friend {i + 1}</p>
                    <input
                      placeholder="Full name *"
                      value={c.name}
                      onChange={e => { const a=[...companionInfo]; a[i]={...a[i],name:e.target.value}; setCompanionInfo(a) }}
                      style={{ padding:'9px 12px', borderRadius:8, border:`1.5px solid ${c.name ? '#E8E8E4' : '#E8E8E4'}`, fontSize:13, fontFamily:'PretendardVariable,Pretendard,sans-serif', outline:'none', background:'#fff' }}
                    />
                    <div style={{ display:'flex', gap:8 }}>
                      <select
                        value={c.gender}
                        onChange={e => { const a=[...companionInfo]; a[i]={...a[i],gender:e.target.value}; setCompanionInfo(a) }}
                        style={{ flex:1, padding:'9px 12px', borderRadius:8, border:'1.5px solid #E8E8E4', fontSize:13, background:'#fff', outline:'none', color: c.gender ? '#0A0A0A' : '#9A9A9A' }}>
                        <option value="">Gender *</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        placeholder="Age *"
                        type="number"
                        min="1" max="100"
                        value={c.age}
                        onChange={e => { const a=[...companionInfo]; a[i]={...a[i],age:e.target.value}; setCompanionInfo(a) }}
                        style={{ width:80, padding:'9px 12px', borderRadius:8, border:'1.5px solid #E8E8E4', fontSize:13, outline:'none', background:'#fff' }}
                      />
                    </div>
                    <input
                      placeholder="Nationality *"
                      value={c.nationality}
                      onChange={e => { const a=[...companionInfo]; a[i]={...a[i],nationality:e.target.value}; setCompanionInfo(a) }}
                      style={{ padding:'9px 12px', borderRadius:8, border:'1.5px solid #E8E8E4', fontSize:13, fontFamily:'PretendardVariable,Pretendard,sans-serif', outline:'none', background:'#fff' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 자전거 옵션 - 부여트립 전용 */}
        {event.slug === 'day-trip-to-buyeo-mudhgtqw' && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>🚲 BICYCLE <span style={{color:'#dc2626'}}>*Required</span></p>
            {["Yes, I'll ride a bike", "No, I'll skip the bike"].map(opt => (
              <button key={opt} type="button" onClick={() => setBikeOption(opt)}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:bikeOption===opt?'#1A1A1A':'#EBEBEB', background:bikeOption===opt?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                <span style={{ fontSize:13, fontWeight:600, color:bikeOption===opt?'#fff':'#1A1A1A' }}>{opt}</span>
                {bikeOption===opt && <span style={{ fontSize:16 }}>✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* 티켓 수량 (has_ticket_types 없을 때) */}
        {!event.is_free && !event.has_ticket_types && (
          <div style={{ background:'#F8F8F6', border:'1.5px solid #E8E8E4', borderRadius:12, padding:'12px 16px' }}>
            <p style={{ fontSize:12, fontWeight:600, color:'#6B6B6B', marginBottom:8 }}>How many tickets?</p>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button type="button" onClick={() => setSoloQty(Math.max(1, soloQty - 1))} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>−</button>
              <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:20, minWidth:32, textAlign:'center' }}>{soloQty}</span>
              <button type="button" onClick={() => setSoloQty(Math.min(10, soloQty + 1))} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>+</button>
            </div>
            <p style={{ fontSize:13, fontWeight:800, color:'#0A0A0A', marginTop:8 }}>
              Total: ₩{(Number(event.price_krw) * soloQty).toLocaleString()}
            </p>
          </div>
        )}

        {/* 할인코드 */}
        {!event.is_free && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ display:'flex', gap:8 }}>
              <input
                value={discountCode}
                onChange={e => { setDiscountCode(e.target.value); setDiscountApplied(false); setDiscountError('') }}
                placeholder="Discount code"
                style={{ flex:1, padding:'11px 14px', borderRadius:10, border:`1.5px solid ${discountApplied ? '#00C471' : discountError ? '#dc2626' : '#EBEBEB'}`, fontSize:14, fontFamily:'PretendardVariable,Pretendard,sans-serif', outline:'none' }}
              />
              <button type="button" onClick={applyDiscount}
                style={{ padding:'11px 16px', borderRadius:10, background:'#1A1A1A', color:'#fff', border:'none', fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                Apply
              </button>
            </div>
            {discountApplied && (
              <p style={{ fontSize:12, color:'#00C471', fontWeight:600 }}>✓ {getDiscountRate()}% discount applied!</p>
            )}
            {discountError && (
              <p style={{ fontSize:12, color:'#dc2626', fontWeight:600 }}>✗ {discountError}</p>
            )}
          </div>
        )}

        <button
          onClick={handleClick}
          disabled={
            busy ||
            (event.has_ticket_types && event.solo_option1_name && !subOption) ||
            (event.slug === 'day-trip-to-buyeo-mudhgtqw' && !bikeOption) ||
            companionIncomplete
          }
          style={{ width:'100%', background:'#1A1A1A', color:'#fff', border:'none', borderRadius:14, padding:'15px 28px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:busy?'not-allowed':'pointer', opacity:(busy || (event.has_ticket_types && event.solo_option1_name && !subOption) || (event.slug === 'day-trip-to-buyeo-mudhgtqw' && !bikeOption) || companionIncomplete)?0.5:1 }}>
          {busy ? 'Processing...' : event.is_free ? 'JOIN FREE' : (
            <span>
              Buy — ₩{Number(getPrice()).toLocaleString()}
              {discountApplied && (
                <span style={{ fontSize:11, marginLeft:6, textDecoration:'line-through', opacity:0.6 }}>
                  ₩{Number(getBasePrice()).toLocaleString()}
                </span>
              )}
            </span>
          )}
        </button>

        {!event.is_free && (
          <div style={{ background:'#F8F8F6', border:'1px solid #E8E8E4', borderRadius:10, padding:'10px 14px' }}>
            <p style={{ fontSize:11, color:'#6B6B6B', lineHeight:1.6, margin:0 }}>
              💳 <strong>Korean-issued cards only</strong> (credit & debit)<br/>
              For international cards, <a href="/cs" style={{ color:'#0A0A0A', fontWeight:700 }}>contact CS →</a>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
