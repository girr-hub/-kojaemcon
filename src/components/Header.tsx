'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const sb = supabase()
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(248,248,248,0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52 }}>
        {/* 로고 */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 7, height: 7, background: 'var(--gold)', borderRadius: '50%', marginBottom: 6, flexShrink: 0 }} />
          <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 17, color: 'var(--text)', letterSpacing: '0.01em', lineHeight: 1 }}>
            KOGEMCON
          </span>
        </Link>

        {/* 우측 액션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <Link href="/my" style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: 'var(--text)', textDecoration: 'none',
            }}>
              {user.email?.[0].toUpperCase() ?? 'M'}
            </Link>
          ) : (
            <Link href="/login" style={{
              background: 'var(--gold)', color: 'var(--text)',
              padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none',
            }}>
              Log In
            </Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
