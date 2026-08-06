'use client'

export default function FomoPopup({ count }: { count: number }) {
  if (count <= 0) return null

  return (
    <>
      <style>{`
        @keyframes fomoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: 76,
        left: 0,
        right: 0,
        zIndex: 8500,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        animation: 'fomoFloat 3s ease-in-out infinite',
      }}>
        <div style={{
          background: 'rgba(26,26,26,0.92)',
          backdropFilter: 'blur(8px)',
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
    </>
  )
}
