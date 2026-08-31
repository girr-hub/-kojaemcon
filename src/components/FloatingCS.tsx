'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingCS() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/chat')) return null

  return (
    <Link href="/cs"
      style={{
        position: 'fixed',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8000,
        background: '#1A1A1A',
        color: '#E9C000',
        borderRadius: 20,
        padding: '10px 8px',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        writingMode: 'vertical-rl',
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'PretendardVariable, Pretendard, sans-serif',
        letterSpacing: '0.05em',
      }}>
      💬 CS
    </Link>
  )
}
