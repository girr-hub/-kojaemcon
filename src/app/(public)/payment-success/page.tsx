'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccess() {
  const params = useSearchParams()
  const order = params.get('order')

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, color: '#0A0A0A', marginBottom: 10 }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 28 }}>
          You&apos;re all set! Check the group chat for event updates.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/my" style={{ display: 'block', background: '#0A0A0A', color: '#E9C000', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
            View My Tickets →
          </Link>
          <Link href="/events" style={{ display: 'block', background: '#F8F8F6', color: '#6B6B6B', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  )
}
