import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import MobileMenu from './MobileMenu'

export default async function Header() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E8E8E4',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 8, textDecoration: 'none' }}>
          <span className="wordmark" style={{ fontSize: 18 }}>
            Ko<em>jaem</em>con
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/events" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#0A0A0A] transition-colors">
            Events
          </Link>
          <Link href="/about" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#0A0A0A] transition-colors">
            About
          </Link>
          <Link href="/collab" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#0A0A0A] transition-colors">
            Collab
          </Link>
          <Link href="/talent" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#0A0A0A] transition-colors">
            Talent
          </Link>
          <Link href="/host/new" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#0A0A0A] transition-colors">
            Host
          </Link>
          {user ? (
            <Link href="/my" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>My</Link>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>Log in →</Link>
          )}
        </nav>

        {/* Mobile Menu Button + Menu */}
        <div className="flex md:hidden items-center gap-3">
          {user ? (
            <Link href="/my" className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>My</Link>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>Log in</Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
