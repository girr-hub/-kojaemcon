'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function FomoPopup({ count }: { count: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || count <= 0) return null

  return createPortal(
    <>
      <style>{`
        @keyframes fomoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .fomo-popup {
          position: fixed !important;
          bottom: 76px !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 99999 !important;
          pointer-events: none;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          animation: fomoFloat 3s ease-in-out infinite;
        }
      `}</style>
      <div className="fomo-popup">
        <div style={{
          background: 'rgba(26,26,26,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#fff',
          borderRadius: 100,
          padding: '10px 20px',
          fontSize: 13,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          fontFamily: 'PretendardVariable, Pretendard, sans-serif',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>👀</span>
          <span>
            <strong style={{ color: '#E9C000' }}>{count} people</strong> are considering this!
          </span>
        </div>
      </div>
    </>,
    document.body
  )
}
