import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import MobileMenu from './MobileMenu'

export default async function Header() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <header style={{
      position: 'sticky', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E8E8E4',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* KOGEMCON Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* ㅋㅈㅋ */}
          <div style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontWeight: 900, color: '#E9C000', lineHeight: 0.85, letterSpacing: '-0.04em', display: 'flex', flexDirection: 'column', fontSize: 0 }}>
            <span style={{ fontSize: 14 }}>ㅋ</span>
            <span style={{ fontSize: 17, marginLeft: 2 }}>ㅈ</span>
            <span style={{ fontSize: 14 }}>ㅋ</span>
          </div>
          {/* KOGEMCON */}
          <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 18, color: '#12161A', letterSpacing: '0.01em', lineHeight: 1 }}>
            KOGEMCON
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          {[
            ['Events', '/events'],
            ['About', '/about'],
            ['Collab', '/collab'],
            ['Community', '/community'],
            ['Support', '/cs'],
            ['Talent', '/talent'],
            ['Host', '/host/new'],
          ].map(([label, href]) => (
            <Link key={href} href={href}
              style={{ fontSize: 14, fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}
              className="hover:text-[#12161A] transition-colors">
              {label}
            </Link>
          ))}
          {user ? (
            <Link href="/my" style={{ background: '#E9C000', color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700, padding: '9px 22px', borderRadius: 100, textDecoration: 'none' }}>
              My
            </Link>
          ) : (
            <Link href="/login" style={{ background: '#E9C000', color: '#12161A', fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700, padding: '9px 22px', borderRadius: 100, textDecoration: 'none' }}>
              Log In
            </Link>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <Link href="/my" style={{ background: '#E9C000', color: '#12161A', padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>My</Link>
          ) : (
            <Link href="/login" style={{ background: '#E9C000', color: '#12161A', padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
