'use client'
import { usePathname } from 'next/navigation'

export default function FloatingCS() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/chat')) return null

  return (
    <a href="http://pf.kakao.com/_qxoNIn/chat" target="_blank" rel="noopener noreferrer"
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8000,
        background: '#FAE100',
        color: '#1A1A1A',
        borderRadius: '12px 0 0 12px',
        padding: '12px 8px',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        boxShadow: '-2px 0 12px rgba(0,0,0,0.1)',
        writingMode: 'horizontal-tb',
        fontSize: 11,
        fontWeight: 800,
        fontFamily: 'PretendardVariable, Pretendard, sans-serif',
        letterSpacing: '0.05em',
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A1A1A">
        <path d="M12 2C6.477 2 2 5.477 2 9.5c0 2.572 1.53 4.836 3.875 6.197L4.5 20l4.688-2.344C10.049 17.88 11.007 18 12 18c5.523 0 10-3.477 10-7.5S17.523 2 12 2z"/>
      </svg>
      CS
    </a>
  )
}
