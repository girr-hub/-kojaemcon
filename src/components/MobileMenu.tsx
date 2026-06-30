'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [open])

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          width: 40, height: 40, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 5,
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: 0, flexShrink: 0, WebkitTapHighlightColor: 'transparent',
          position: 'relative', zIndex: 60,
        }}
        aria-label="Open menu"
      >
        <span style={{ width: 22, height: 2, background: '#0A0A0A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#0A0A0A', borderRadius: 1, display: 'block' }} />
        <span style={{ width: 22, height: 2, background: '#0A0A0A', borderRadius: 1, display: 'block' }} />
      </button>

      {mounted && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 0.25s ease',
          }}
          onTransitionEnd={() => { if (!open) setMounted(false) }}
        >
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '82%', maxWidth: 340,
              background: '#FFFFFF',
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              transform: open ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 20px', borderBottom: '1px solid #E8E8E4', flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 17, letterSpacing: '-0.04em', color: '#0A0A0A' }}>
                Ko<em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 20 }}>jaem</em>con
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  width: 34, height: 34, background: '#F8F8F6', border: 'none',
                  borderRadius: '50%', fontSize: 20, cursor: 'pointer', color: '#0A0A0A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1, padding: 0,
                }}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', flex: 1 }}>
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: '16px 24px', fontSize: 16, fontWeight: 600, color: '#0A0A0A',
                    textDecoration: 'none', borderBottom: '1px solid #F8F8F6',
                    display: 'block',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ padding: 20, borderTop: '1px solid #E8E8E4', flexShrink: 0 }}>
              <Link
                href="/host/new"
                onClick={() => setOpen(false)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 7, background: '#0A0A0A', color: '#FFFFFF', border: '1.5px solid #0A0A0A',
                  fontFamily: 'Inter', fontSize: 13, fontWeight: 700, padding: '13px 26px',
                  borderRadius: 100, textDecoration: 'none', letterSpacing: '-0.01em',
                  boxSizing: 'border-box',
                }}
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
