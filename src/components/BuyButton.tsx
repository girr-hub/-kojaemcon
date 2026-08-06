'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

type TicketType = 'solo' | 'returning' | 'with_friends'

export default function BuyButton({ event, remaining }: { event: any; remaining: number }) {
  const [busy, setBusy] = useState(false)
  const [showNoshow, setShowNoshow] = useState(false)
  const [joined, setJoined] = useState(false)
  const [ticketType, setTicketType] = useState<TicketType>('solo')
  const [friendsCount, setFriendsCount] = useState(1)
  const [ticketQty, setTicketQty] = useState(1)
  const [subOption, setSubOption] = useState<string>('')
  const [subOptionPrice, setSubOptionPrice] = useState<number>(0)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountError, setDiscountError] = useState('')

  const VALID_CODES: Record<string, number> = {
    'KOGEMCON10': 10,
    'WELCOME10': 10,
    'FRIEND10': 10,
  }

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase()
    if (VALID_CODES[code]) {
      setDiscountApplied(true)
      setDiscountError('')
    } else {
      setDiscountApplied(false)
      setDiscountError('Invalid code')
    }
  }

  const getDiscountRate = () => {
    const code = discountCode.trim().toUpperCase()
    return discountApplied ? (VALID_CODES[code] || 0) : 0
  }

  // 페이업 SDK 로드 (운영)
  useEffect(() => {
    if (event.is_free) return
    if (document.getElementById('payup-sdk')) return
    const s = document.createElement('script')
    s.id = 'payup-sdk'
    s.src = 'https://standard.payup.co.kr/assets/js/payup_standard-1.0.js'
    document.head.appendChild(s)
  }, [event.is_free])

  // PC 콜백: 인증 완료 시 자동 호출됨
  useEffect(() => {
    (window as any).payupPaymentSubmit = (payForm: string) => {
      // SDK가 만든 form을 승인 URL로 submit
      const form = document.getElementById(payForm) as HTMLFormElement
      if (form) {
        form.action = '/api/payments/payup-confirm'
        form.method = 'POST'
        form.submit()
      }
    }
    ;(window as any).payupPaymentClose = () => {
      setBusy(false)
    }
  }, [])

  const getBasePrice = () => {
    if (event.is_free) return 0
    if (subOptionPrice > 0) return subOptionPrice
    if (!event.has_ticket_types) return event.price_krw
    if (ticketType === 'returning') return event.price_returning || event.price_krw
    if (ticketType === 'with_friends') return (event.price_with_friends || event.price_krw) * friendsCount
    return event.price_solo || event.price_krw
  }

  const getPrice = () => {
    const base = getBasePrice()
    const discount = getDiscountRate()
    return Math.floor(base * (1 - discount / 100))
  }

  const handleClick = async () => {
    const sb = supabase()
    const { data: { session } } = await sb.auth.getSession()
    const user = session?.user
    if (!user) { window.location.href = '/login'; return }
    if (remaining <= 0) { console.error('Sold out'); return }
    if (event.is_free) { setShowNoshow(true); return }
    await handlePaid(user)
  }

  const confirmJoin = async () => {
    setBusy(true)
    const sb = supabase()
    const { data: { session } } = await sb.auth.getSession()
    const user = session?.user
    if (!user) return
    const prep = await fetch('/api/payments/prepare', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_id: event.id }),
    }).then(r => r.json())
    if (prep.error) { alert(prep.error); setBusy(false); return }
    setShowNoshow(false)
    setBusy(false)
    setJoined(true)
  }

  const handlePaid = async (user: any) => {
    setBusy(true)
    const totalAmount = getPrice()

    // 주문 생성
    const prep = await fetch('/api/payments/prepare', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event_id: event.id,
        ticket_type: ticketType,
        friends_count: ticketType === 'with_friends' ? friendsCount : 1,
        amount: totalAmount,
      }),
    }).then(r => r.json())

    if (prep.error) { alert(prep.error); setBusy(false); return }

    // Meta Pixel - InitiateCheckout
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: totalAmount, currency: 'KRW', content_name: event.title
      })
    }
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const ticketLabel = ticketType === 'solo' ? 'Solo' : ticketType === 'returning' ? 'Returning' : `With Friends x${friendsCount}`

    // SDK 로드 대기
    let t = 0
    while (!(window as any).goPayupPay && t < 50) {
      await new Promise(r => setTimeout(r, 100))
      t++
    }
    if (!(window as any).goPayupPay) {
      console.error('결제 모듈을 불러올 수 없어요. 새로고침 후 다시 시도해주세요.')
      setBusy(false)
      return
    }

    const data: any = {
      merchantId: 'girr0711',
      itemName: `${event.title} (${ticketLabel})`,
      amount: String(totalAmount),
      userName: user.email ?? 'Guest',
      orderNumber: prep.payment_id,
    }

    if (isMobile) {
      data.returnUrl = `${window.location.origin}/api/payments/payup-return`
    }

    ;(window as any).goPayupPay(data)
    // PC는 payupPaymentSubmit 콜백에서 처리
    // 모바일은 returnUrl로 리다이렉트됨
    if (!isMobile) setBusy(false)
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
  ].sort((a, b) => b.price - a.price)

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
            {/* 서브옵션 - 필수 선택 */}
        {ticketType === 'solo' && event.solo_option1_name && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>SELECT OPTION <span style={{color:'#dc2626'}}>*필수</span></p>
            {[{name:event.solo_option1_name, price:event.solo_option1_price},{name:event.solo_option2_name, price:event.solo_option2_price}].filter(o=>o.name).map(o=>(
              <button key={o.name} type="button" onClick={()=>{setSubOption(o.name);setSubOptionPrice(o.price)}}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:subOption===o.name?'#1A1A1A':'#EBEBEB', background:subOption===o.name?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                <span style={{ fontSize:13, fontWeight:600, color:subOption===o.name?'#fff':'#1A1A1A' }}>{o.name}</span>
                <span style={{ fontSize:13, fontWeight:800, color:subOption===o.name?'#E9C000':'#1A1A1A' }}>
                  ₩{Number(o.price).toLocaleString()}
                  {o.name === '1박2일' && <span style={{fontSize:11, color:subOption===o.name?'rgba(233,192,0,0.8)':'#9A9A9A', marginLeft:4}}>(+₩35,000)</span>}
                  {o.name === '당일치기' && <span style={{fontSize:11, color:subOption===o.name?'rgba(233,192,0,0.8)':'#9A9A9A', marginLeft:4}}>(+₩0)</span>}
                </span>
              </button>
            ))}
          </div>
        )}
        {ticketType === 'returning' && event.returning_option1_name && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>SELECT OPTION <span style={{color:'#dc2626'}}>*필수</span></p>
            {[{name:event.returning_option1_name, price:event.returning_option1_price},{name:event.returning_option2_name, price:event.returning_option2_price}].filter(o=>o.name).map(o=>(
              <button key={o.name} type="button" onClick={()=>{setSubOption(o.name);setSubOptionPrice(o.price)}}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:subOption===o.name?'#1A1A1A':'#EBEBEB', background:subOption===o.name?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                <span style={{ fontSize:13, fontWeight:600, color:subOption===o.name?'#fff':'#1A1A1A' }}>{o.name}</span>
                <span style={{ fontSize:13, fontWeight:800, color:subOption===o.name?'#E9C000':'#1A1A1A' }}>
                  ₩{Number(o.price).toLocaleString()}
                  {o.name === '1박2일' && <span style={{fontSize:11, color:subOption===o.name?'rgba(233,192,0,0.8)':'#9A9A9A', marginLeft:4}}>(+₩35,000)</span>}
                  {o.name === '당일치기' && <span style={{fontSize:11, color:subOption===o.name?'rgba(233,192,0,0.8)':'#9A9A9A', marginLeft:4}}>(+₩0)</span>}
                </span>
              </button>
            ))}
          </div>
        )}
        {ticketType === 'with_friends' && event.friends_option1_name && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#9A9A9A' }}>SELECT OPTION <span style={{color:'#dc2626'}}>*필수</span></p>
            {[{name:event.friends_option1_name, price:event.friends_option1_price},{name:event.friends_option2_name, price:event.friends_option2_price}].filter(o=>o.name).map(o=>(
              <button key={o.name} type="button" onClick={()=>{setSubOption(o.name);setSubOptionPrice(o.price)}}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, border:'1.5px solid', borderColor:subOption===o.name?'#1A1A1A':'#EBEBEB', background:subOption===o.name?'#1A1A1A':'#F7F7F7', cursor:'pointer' }}>
                <span style={{ fontSize:13, fontWeight:600, color:subOption===o.name?'#fff':'#1A1A1A' }}>{o.name}</span>
                <span style={{ fontSize:13, fontWeight:800, color:subOption===o.name?'#E9C000':'#1A1A1A' }}>
                  ₩{Number(o.price).toLocaleString()}
                  {o.name === '1박2일' && <span style={{fontSize:11, color:subOption===o.name?'rgba(233,192,0,0.8)':'#9A9A9A', marginLeft:4}}>(+₩35,000)</span>}
                  {o.name === '당일치기' && <span style={{fontSize:11, color:subOption===o.name?'rgba(233,192,0,0.8)':'#9A9A9A', marginLeft:4}}>(+₩0)</span>}
                </span>
              </button>
            ))}
          </div>
        )}
        {ticketType === 'with_friends' && (
              <div style={{ background:'#F8F8F6', border:'1.5px solid #E8E8E4', borderRadius:12, padding:'12px 16px' }}>
                <p style={{ fontSize:12, fontWeight:600, color:'#6B6B6B', marginBottom:8 }}>How many people?</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button type="button" onClick={() => setFriendsCount(Math.max(1, friendsCount - 1))} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>−</button>
                  <span style={{ fontFamily:'Inter', fontWeight:800, fontSize:20, minWidth:32, textAlign:'center' }}>{friendsCount}</span>
                  <button type="button" onClick={() => setFriendsCount(Math.min(event.friends_max || 10, friendsCount + 1))} style={{ width:32, height:32, borderRadius:'50%', border:'1.5px solid #E8E8E4', background:'#fff', fontWeight:700, fontSize:16, cursor:'pointer' }}>+</button>
                </div>
                <p style={{ fontSize:13, fontWeight:800, color:'#0A0A0A', marginTop:8 }}>
                  Total: ₩{(Number(event.price_with_friends || event.price_krw) * friendsCount).toLocaleString()}
                </p>
              </div>
            )}
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

        <button onClick={handleClick} disabled={busy || (event.has_ticket_types && event.solo_option1_name && !subOption)}
          style={{ width:'100%', background:'#1A1A1A', color:'#fff', border:'none', borderRadius:14, padding:'15px 28px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:busy?'not-allowed':'pointer', opacity:busy?0.6:1 }}>
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
