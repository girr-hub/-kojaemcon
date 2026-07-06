import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import MobileMenu from './MobileMenu'

export default async function Header() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <header style={{
      position: 'sticky', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(18,22,26,0.95)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #2a2f35',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Righteous, sans-serif', fontSize: 22, color: '#E9C000', lineHeight: 1, letterSpacing: '-0.01em' }}>
            KO<br style={{ lineHeight: 0 }}/>GEM<br style={{ lineHeight: 0 }}/>CON
          </span>
          <div style={{ width: 1, height: 32, background: '#2a2f35' }} />
          <span style={{ fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.04em', lineHeight: 1.4 }}>
            Find your<br/>Gems in Korea
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
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
              style={{ fontSize: 14, fontWeight: 500, color: '#B0B0B0', textDecoration: 'none', fontFamily: 'PretendardVariable, Pretendard, sans-serif' }}
              className="hover:text-[#E7E7E7] transition-colors">
              {label}
            </Link>
          ))}
          {user ? (
            <Link href="/my" style={{
              background: '#E9C000', color: '#0A0A0A', border: 'none',
              fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700,
              padding: '9px 22px', borderRadius: 100, textDecoration: 'none', cursor: 'pointer',
            }}>
              My
            </Link>
          ) : (
            <Link href="/login" style={{
              background: '#E9C000', color: '#0A0A0A', border: 'none',
              fontFamily: 'PretendardVariable, Pretendard, sans-serif', fontSize: 14, fontWeight: 700,
              padding: '9px 22px', borderRadius: 100, textDecoration: 'none', cursor: 'pointer',
            }}>
              Log In
            </Link>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <Link href="/my" style={{ background: '#E9C000', color: '#0A0A0A', padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>My</Link>
          ) : (
            <Link href="/login" style={{ background: '#E9C000', color: '#0A0A0A', padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
