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
          <Link href="/my" style={{ display: 'block', background: '#1A1A1A', color: '#E9C000', borderRadius: 14, padding: '14px', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
            View My Tickets &rarr;
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
