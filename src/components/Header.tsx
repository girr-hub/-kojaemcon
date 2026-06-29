import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'

export default async function Header() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: brand } = await sb.from('site_settings').select('value').eq('key', 'brand').single()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E8E8E4',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 8, textDecoration: 'none' }}>
          <span className="wordmark" style={{ fontSize: 18 }}>
            Ko<em>jaem</em>con
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/events" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }}
            className="hover:text-[#0A0A0A] transition-colors">
            Events
          </Link>
          <Link href="/about" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }}
            className="hover:text-[#0A0A0A] transition-colors hidden sm:block">
            About
          </Link>
          <Link href="/collab" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }}
            className="hover:text-[#0A0A0A] transition-colors hidden sm:block">
            Collab
          </Link>
          <Link href="/talent" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }}
            className="hover:text-[#0A0A0A] transition-colors hidden sm:block">
            Talent
          </Link>
          <Link href="/host/new" style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B', textDecoration: 'none' }}
            className="hover:text-[#0A0A0A] transition-colors hidden md:block">
            Host
          </Link>
          {user ? (
            <Link href="/my" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>
              My
            </Link>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }}>
              Log in →
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
