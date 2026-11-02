'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LEFT_TABS = [
  {
    href: '/', label: 'Home',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={a ? '#111111' : 'none'} stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/events', label: 'Events',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2.5" stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8"/>
        <path d="M3 9H21" stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8"/>
        <path d="M8 2V5M16 2V5" stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const RIGHT_TABS = [
  {
    href: '/community', label: 'Community',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"
          fill={a ? '#111111' : 'none'} stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/my', label: 'My',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill={a ? '#111111' : 'none'} stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8"/>
        <path d="M4 20C4 17 7.6 14 12 14C16.4 14 20 17 20 20" stroke={a ? '#111111' : '#BBBBBB'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
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
        background: 'rgba(248,248,248,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        {/* 왼쪽 탭 2개 */}
        {LEFT_TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '10px 0 10px', textDecoration: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}>
              {tab.icon(active)}
              <span style={{
                fontSize: 9, fontWeight: active ? 800 : 500,
                color: active ? 'var(--text)' : 'var(--text-5)',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                letterSpacing: '0.01em',
              }}>
                {tab.label}
              </span>
              {active && (
                <div style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', marginTop: -2 }} />
              )}
            </Link>
          )
        })}

        {/* 중앙 플러스 버튼 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 10, gap: 3, position: 'relative' }}>
          <button
            onClick={() => setShowHostMenu(prev => !prev)}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--gold)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: -14,
              boxShadow: '0 4px 16px rgba(245,196,0,0.5)',
              transition: 'transform 0.15s',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
          <span style={{
            fontSize: 9, fontWeight: 700, color: 'var(--text-4)',
            fontFamily: 'PretendardVariable, Pretendard, sans-serif',
            letterSpacing: '0.01em',
          }}>
            이벤트 등록
          </span>

          {/* 팝업 메뉴 */}
          {showHostMenu && (
            <>
              <div
                onClick={() => setShowHostMenu(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 8400 }}
              />
              <div style={{
                position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
                background: '#FFFFFF', borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                border: '1px solid var(--border)', overflow: 'hidden',
                zIndex: 8500, width: 190,
              }}>
                <Link href="/host/new" onClick={() => setShowHostMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 32, height: 32, background: '#F4F4F4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9H21"/><path d="M8 2V5M16 2V5"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 13, color: '#111111' }}>Host Event</p>
                    <p style={{ fontSize: 11, color: '#999', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>일반 이벤트 개설</p>
                  </div>
                </Link>
                <Link href="/experience/new" onClick={() => setShowHostMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', textDecoration: 'none' }}>
                  <div style={{ width: 32, height: 32, background: '#F4F4F4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 800, fontSize: 13, color: '#111111' }}>체험단 모집</p>
                    <p style={{ fontSize: 11, color: '#999', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>외국인 체험단 등록</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* 오른쪽 탭 2개 */}
        {RIGHT_TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '10px 0 10px', textDecoration: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}>
              {tab.icon(active)}
              <span style={{
                fontSize: 9, fontWeight: active ? 800 : 500,
                color: active ? 'var(--text)' : 'var(--text-5)',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
                letterSpacing: '0.01em',
              }}>
                {tab.label}
              </span>
              {active && (
                <div style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', marginTop: -2 }} />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
