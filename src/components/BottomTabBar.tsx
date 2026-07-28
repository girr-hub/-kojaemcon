'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Home', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill={a?'#E9C000':'none'} stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { href: '/events', label: 'Events', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2.5" stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8"/><path d="M3 9H21" stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8"/><path d="M8 2V5M16 2V5" stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8" strokeLinecap="round"/><circle cx="8" cy="14" r="1.2" fill={a?'#E9C000':'#BBBBBB'}/><circle cx="12" cy="14" r="1.2" fill={a?'#E9C000':'#BBBBBB'}/><circle cx="16" cy="14" r="1.2" fill={a?'#E9C000':'#BBBBBB'}/></svg> },
  { href: '/community', label: 'Community', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" fill={a?'#E9C000':'none'} stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { href: '/magazine', label: 'Magazine', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8"/><path d="M8 8H16M8 12H16M8 16H12" stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { href: '/my', label: 'My', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill={a?'#E9C000':'none'} stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8"/><path d="M4 20C4 17 7.6 14 12 14C16.4 14 20 17 20 20" stroke={a?'#E9C000':'#BBBBBB'} strokeWidth="1.8" strokeLinecap="round"/></svg> },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/signup')) return null
  return (
    <>
      <div style={{ height: 68 }} />
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 9000, background: '#FFFFFF', borderTop: '1px solid #F0F0F0', paddingBottom: 'env(safe-area-inset-bottom)', display: 'flex' }}>
        {TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '8px 0 6px', textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}>
              {tab.icon(active)}
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? '#1A1A1A' : '#BBBBBB', letterSpacing: '-0.01em' }}>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
