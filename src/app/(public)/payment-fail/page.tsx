'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentFailInner() {
  const params = useSearchParams()
  const error = params.get('error') || '결제에 실패했어요'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>😔</div>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 28, color: '#0A0A0A', marginBottom: 10 }}>
          Payment Failed
        </h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 8 }}>
          {decodeURIComponent(error)}
        </p>
        <p style={{ fontSize: 13, color: '#9A9A9A', marginBottom: 28 }}>
          Please try again or contact CS for help.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/events" style={{ display: 'block', background: '#0A0A0A', color: '#fff', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
            Try Again
          </Link>
          <Link href="/cs" style={{ display: 'block', background: '#F8F8F6', color: '#6B6B6B', borderRadius: 100, padding: '13px', fontFamily: 'Inter', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
            Contact CS
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFail() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>}>
      <PaymentFailInner />
    </Suspense>
  )
}
