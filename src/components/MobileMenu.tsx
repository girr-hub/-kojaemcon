'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
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
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          width: 44, height: 44,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 5,
          background: 'transparent', border: 'none',
          cursor: 'pointer', padding: 0,
          WebkitTapHighlightColor: 'transparent',
          position: 'relative', zIndex: 51,
        }}
      >
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#12161A', borderRadius: 1, display: 'block' }} />
      </button>

      {/* Overlay — always in DOM, toggled with opacity + pointer-events */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99998,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          background: 'rgba(0,0,0,0.55)',
        }}
        onClick={() => setOpen(false)}
      />

      {/* Panel — always in DOM, slides in/out */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '82%', maxWidth: 340,
          zIndex: 99999,
          background: '#12161A',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #2a2f35', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', display: 'flex', flexDirection: 'column', lineHeight: 0.88 }}>
              <span style={{ fontSize: 13 }}>ㅋ</span>
              <span style={{ fontSize: 16, marginLeft: 2 }}>ㅈ</span>
              <span style={{ fontSize: 13 }}>ㅋ</span>
            </div>
            <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 17, color: '#E9C000', letterSpacing: '0.01em' }}>
              KOGEMCON
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              width: 36, height: 36, background: '#1e2328',
              border: 'none', borderRadius: '50%', fontSize: 20,
              cursor: 'pointer', color: '#E7E7E7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 8 }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: '15px 24px',
                fontSize: 15, fontWeight: 500,
                color: '#B0B0B0', textDecoration: 'none',
                borderBottom: '1px solid #1e2328',
                display: 'block',
                fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ padding: 20, borderTop: '1px solid #2a2f35', flexShrink: 0 }}>
          <Link
            href="/host/new"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#E9C000', color: '#12161A',
              fontFamily: 'PretendardVariable, Pretendard, sans-serif',
              fontSize: 14, fontWeight: 700,
              padding: '13px 26px', borderRadius: 100, textDecoration: 'none',
            }}
          >
            Host an Event →
          </Link>
        </div>
      </div>
    </>
  )
}
