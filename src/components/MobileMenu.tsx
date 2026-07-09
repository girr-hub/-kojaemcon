'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { href: '/events', label: 'Events' },
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About' },
    { href: '/collab', label: 'Collab' },
    { href: '/talent', label: 'Talent' },
    { href: '/host/new', label: 'Host an Event' },
    { href: '/cs', label: 'Support / CS' },
    { href: '/refund-policy', label: 'Refund Policy' },
  ]

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu"
        style={{ width: 44, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, WebkitTapHighlightColor: 'transparent', zIndex: 51, position: 'relative' }}>
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
      </button>

      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999999, display: 'flex' }}>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          {/* Panel */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '85vw', maxWidth: 340, height: '100%', background: '#1a1f26', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #2a2f35', flexShrink: 0, paddingTop: 'max(20px, env(safe-area-inset-top))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', display: 'flex', flexDirection: 'column', lineHeight: 0.88 }}>
                  <span style={{ fontSize: 13 }}>ㅋ</span>
                  <span style={{ fontSize: 16, marginLeft: 2 }}>ㅈ</span>
                  <span style={{ fontSize: 13 }}>ㅋ</span>
                </div>
                <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 17, color: '#E9C000' }}>KOGEMCON</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                style={{ width: 36, height: 36, background: '#2a2f35', border: 'none', borderRadius: '50%', fontSize: 20, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
            {/* Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {links.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  style={{ padding: '17px 24px', fontSize: 16, fontWeight: 500, color: '#E7E7E7', textDecoration: 'none', borderBottom: '1px solid #2a2f35', display: 'block', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* CTA */}
            <div style={{ padding: '20px', borderTop: '1px solid #2a2f35', flexShrink: 0, paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
              <Link href="/host/new" onClick={() => setOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E9C000', color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700, padding: '14px', borderRadius: 100, textDecoration: 'none' }}>
                Host an Event →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
