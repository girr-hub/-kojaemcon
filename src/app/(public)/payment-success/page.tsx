'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function TrackPurchase() {
  const params = useSearchParams()
  const amount = params.get('amount') || '0'
  const orderId = params.get('order') || ''
  const eventName = params.get('event') || 'KOGEMCON Event'

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'Purchase', {
        currency: 'KRW',
        value: Number(amount),
        content_name: eventName,
        content_type: 'event_ticket',
        order_id: orderId,
      })
    }
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: Number(amount),
        currency: 'KRW',
        transaction_id: orderId,
      })
    }
  }, [amount, orderId, eventName])

  return null
}

function PaymentSuccessInner() {
  const params = useSearchParams()
  const amount = params.get('amount')
  const eventName = params.get('event')
  const kakaoUrl = params.get('kakao') ? decodeURIComponent(params.get('kakao')!) : ''

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <TrackPurchase />
      <div style={{ textAlign: 'center', maxWidth: 360, width: '100%' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, fontSize: 26, color: '#1A1A1A', marginBottom: 8, letterSpacing: '-0.04em' }}>
          Payment Successful!
        </h1>
        {eventName && (
          <p style={{ fontSize: 14, fontWeight: 600, color: '#E9C000', marginBottom: 6 }}>{eventName}</p>
        )}
        {amount && Number(amount) > 0 && (
          <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', marginBottom: 12 }}>
            {String.fromCharCode(8361)}{Number(amount).toLocaleString()}
          </p>
        )}
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 28 }}>
          You&apos;re all set! Check your email for confirmation.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {kakaoUrl && (
            <a href={kakaoUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#FAE100', color: '#1A1A1A', borderRadius: 14, padding: '14px', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1A1A1A"><path d="M12 2C6.477 2 2 5.477 2 9.5c0 2.572 1.53 4.836 3.875 6.197L4.5 20l4.688-2.344C10.049 17.88 11.007 18 12 18c5.523 0 10-3.477 10-7.5S17.523 2 12 2z"/></svg>
              Join Group Chat
            </a>
          )}
          <Link href="/my" style={{ display: 'block', background: '#1A1A1A', color: '#E9C000', borderRadius: 14, padding: '14px', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
            View My Tickets
          </Link>
          <Link href="/events" style={{ display: 'block', background: '#F7F7F7', color: '#6B6B6B', borderRadius: 14, padding: '14px', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <PaymentSuccessInner />
    </Suspense>
  )
}
