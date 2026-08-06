'use client'
import { useEffect, useState } from 'react'

export default function FomoPopup({ count }: { count: number }) {
  const [visible, setVisible] = useState(true)

  if (!visible || count <= 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(68px + env(safe-area-inset-bottom) + 12px)',
      left: 0, right: 0,
      zIndex: 8500,
      pointerEvents: 'none',
      display: 'flex', justifyContent: 'center',
      animation: 'fomoFloat 3s ease-in-out infinite',
    }}>
      <div style={{
        background: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(8px)',
        color: '#fff', borderRadius: 100, padding: '10px 20px',
        fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
        fontFamily: 'PretendardVariable, Pretendard, sans-serif',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>👀</span>
        <span>
          <strong style={{ color: '#E9C000' }}>{count} people</strong> are considering this right now!
        </span>
      </div>
      <style>{`
        @keyframes fomoFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
