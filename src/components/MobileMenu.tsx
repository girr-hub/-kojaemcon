'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/collab', label: 'Collab' },
    { href: '/talent', label: 'Talent' },
    { href: '/host/new', label: 'Host an Event' },
    { href: '/refund-policy', label: 'Refund Policy' },
  ]

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          width: 36, height: 36, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}
        aria-label="Open menu"
      >
        <span style={{ width: 20, height: 2, background: '#0A0A0A', borderRadius: 1 }} />
        <span style={{ width: 20, height: 2, background: '#0A0A0A', borderRadius: 1 }} />
        <span style={{ width: 20, height: 2, background: '#0A0A0A', borderRadius: 1 }} />
      </button>

      {/* Slide-in menu */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: 320,
            background: '#FFFFFF', display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px', borderBottom: '1px solid #E8E8E4' }}>
              <span className="wordmark" style={{ fontSize: 17 }}>Ko<em>jaem</em>con</span>
              <button
                onClick={() => setOpen(false)}
                style={{ width: 32, height: 32, background: '#F8F8F6', border: 'none', borderRadius: '50%', fontSize: 18, cursor: 'pointer', color: '#0A0A0A' }}
              >
                ×
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', flex: 1, overflowY: 'auto' }}>
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '16px 24px', fontSize: 16, fontWeight: 600, color: '#0A0A0A',
                    textDecoration: 'none', borderBottom: '1px solid #F8F8F6',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div style={{ padding: 20, borderTop: '1px solid #E8E8E4' }}>
              <Link
                href="/host/new"
                onClick={() => setOpen(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                Launch your event →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
