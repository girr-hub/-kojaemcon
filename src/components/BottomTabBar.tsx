'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          fill={active ? '#E9C000' : 'none'} stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/events',
    label: 'Events',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8"/>
        <path d="M3 9H21" stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8"/>
        <path d="M8 2V5M16 2V5" stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="7" y="13" width="3" height="3" rx="0.5" fill={active ? '#E9C000' : '#9A9A9A'}/>
        <rect x="14" y="13" width="3" height="3" rx="0.5" fill={active ? '#E9C000' : '#9A9A9A'}/>
      </svg>
    ),
  },
  {
    href: '/community',
    label: 'Community',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
          fill={active ? '#E9C000' : 'none'} stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/magazine',
    label: 'Magazine',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H20V20H4V4Z" stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8" fill={active ? '#E9C000' : 'none'} fillOpacity="0.15"/>
        <path d="M8 9H16M8 12H16M8 15H12" stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/my',
    label: 'My',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill={active ? '#E9C000' : 'none'} stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8"/>
        <path d="M4 20C4 17.0 7.58172 14 12 14C16.4183 14 17 14 20 17" stroke={active ? '#E9C000' : '#9A9A9A'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/signup')) return null

  return (
    <>
      <div className="md:hidden" style={{ height: 80 }} />
      <nav className="md:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9000,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #E8E8E4',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex',
      }}>
        {TABS.map(tab => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, padding: '10px 0',
              textDecoration: 'none', WebkitTapHighlightColor: 'transparent',
            }}>
              {tab.icon(active)}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? '#E9C000' : '#9A9A9A',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
