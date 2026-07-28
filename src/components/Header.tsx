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
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', lineHeight: 0.85, display: 'flex', flexDirection: 'column', fontSize: 0 }}>
            <span style={{ fontSize: 12 }}>ㅋ</span>
            <span style={{ fontSize: 15, marginLeft: 2 }}>ㅈ</span>
            <span style={{ fontSize: 12 }}>ㅋ</span>
          </div>
          <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 17, color: '#1A1A1A', letterSpacing: '0.01em', lineHeight: 1 }}>KOGEMCON</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {user ? (
            <Link href="/my" style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E9C000 0%, #FFE44D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1A1A1A', textDecoration: 'none', boxShadow: '0 2px 6px rgba(233,192,0,0.35)' }}>
              {user.email?.[0].toUpperCase() ?? 'M'}
            </Link>
          ) : (
            <Link href="/login" style={{ background: 'linear-gradient(135deg, #E9C000 0%, #FFE44D 100%)', color: '#1A1A1A', padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none', boxShadow: '0 2px 6px rgba(233,192,0,0.3)' }}>Log In</Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
