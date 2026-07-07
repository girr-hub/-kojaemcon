'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = orig }
    }
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
        style={{ width: 40, height: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, WebkitTapHighlightColor: 'transparent' }}>
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
      </button>

      {mounted && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s ease' }}
          onTransitionEnd={() => { if (!open) setMounted(false) }}>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '82%', maxWidth: 340, background: '#12161A', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.3)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)', overflowY: 'auto' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #2a2f35', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', lineHeight: 0.85, display: 'flex', flexDirection: 'column', fontSize: 0 }}>
                  <span style={{ fontSize: 14 }}>ㅋ</span>
                  <span style={{ fontSize: 17, marginLeft: 2 }}>ㅈ</span>
                  <span style={{ fontSize: 14 }}>ㅋ</span>
                </div>
                <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 18, color: '#E9C000' }}>KOGEMCON</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                style={{ width: 34, height: 34, background: '#1e2328', border: 'none', borderRadius: '50%', fontSize: 18, cursor: 'pointer', color: '#E7E7E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', flex: 1 }}>
              {links.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  style={{ padding: '16px 24px', fontSize: 15, fontWeight: 500, color: '#B0B0B0', textDecoration: 'none', borderBottom: '1px solid #1e2328', display: 'block', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div style={{ padding: 20, borderTop: '1px solid #2a2f35', flexShrink: 0 }}>
              <Link href="/host/new" onClick={() => setOpen(false)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E9C000', color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700, padding: '13px 26px', borderRadius: 100, textDecoration: 'none' }}>
                Host an Event →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
