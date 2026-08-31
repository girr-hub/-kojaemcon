'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LEFT_TABS = [
  { href: '/', label: 'Home', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        fill={a?'#1A1A1A':'none'} stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )},
  { href: '/events', label: 'Events', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2.5" stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8"/>
      <path d="M3 9H21" stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8"/>
      <path d="M8 2V5M16 2V5" stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )},
]

const RIGHT_TABS = [
  { href: '/community', label: 'Community', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"
        fill={a?'#1A1A1A':'none'} stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )},
  { href: '/my', label: 'My', icon: (a: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={a?'#1A1A1A':'none'} stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8"/>
      <path d="M4 20C4 17 7.6 14 12 14C16.4 14 20 17 20 20" stroke={a?'#1A1A1A':'#C4C4C4'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )},
]

export default function BottomTabBar() {
  const pathname = usePathname()
  const [showHostMenu, setShowHostMenu] = useState(false)
  if (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/signup')) return null

  return (
    <>
      <div style={{ height: 76 }} />
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 9000,
        background: '#FFFFFF', borderTop: '1px solid #F0F0F0',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        {LEFT_TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, padding: '10px 0 8px',
              textDecoration: 'none', WebkitTapHighlightColor: 'transparent',
            }}>
              {tab.icon(active)}
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? '#1A1A1A' : '#C4C4C4', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {tab.label}
              </span>
            </Link>
          )
        })}

        {/* 중앙 Host 버튼 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 8, position: 'relative' }}>
          <button onClick={() => setShowHostMenu(prev => !prev)}
            style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#1A1A1A', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E9C000" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>

          {showHostMenu && (
            <>
              <div onClick={() => setShowHostMenu(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 8400 }} />
              <div style={{
                position: 'absolute', bottom: 64, left: '50%', transform: 'translateX(-50%)',
                background: '#FFFFFF', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid #F0F0F0', overflow: 'hidden', zIndex: 8500, width: 180,
              }}>
                <Link href="/host/new" onClick={() => setShowHostMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', textDecoration: 'none', borderBottom: '1px solid #F5F5F5' }}>
                  <span style={{ fontSize: 20 }}>🎪</span>
                  <div>
                    <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 13, color: '#1A1A1A' }}>Host Event</p>
                    <p style={{ fontSize: 11, color: '#9A9A9A' }}>일반 이벤트 개설</p>
                  </div>
                </Link>
                <Link href="/experience/new" onClick={() => setShowHostMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', textDecoration: 'none' }}>
                  <span style={{ fontSize: 20 }}>🌟</span>
                  <div>
                    <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 700, fontSize: 13, color: '#1A1A1A' }}>체험단 모집</p>
                    <p style={{ fontSize: 11, color: '#9A9A9A' }}>외국인 체험단 등록</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>

        {RIGHT_TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, padding: '10px 0 8px',
              textDecoration: 'none', WebkitTapHighlightColor: 'transparent',
            }}>
              {tab.icon(active)}
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? '#1A1A1A' : '#C4C4C4', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
