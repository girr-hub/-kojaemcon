import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'

export default async function Header() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: brand } = await sb.from('site_settings').select('value').eq('key','brand').single()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="headline-kr text-primary text-3xl">{brand?.value?.logo_play ?? 'ㅋㅈㅋ'}</span>
          <span className="sub-en uppercase text-xs tracking-widest text-ink/60 hidden sm:block">{brand?.value?.name ?? 'KOJAEMCON'}</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 sub-en uppercase text-sm">
          <Link href="/events" className="hover:text-primary transition">Events</Link>
          <Link href="/about" className="hover:text-primary transition hidden sm:block">About</Link>
          <Link href="/collab" className="hover:text-primary transition hidden sm:block">Collab</Link>
          <Link href="/collab" className="hover:text-primary transition hidden sm:block">Collab</Link>
          <Link href="/host/new" className="hover:text-primary transition hidden sm:block">Launch</Link>
          {user ? (
            <Link href="/my" className="bg-primary text-bg px-3 py-1 hover:opacity-90 transition">My</Link>
          ) : (
            <Link href="/login" className="bg-primary text-bg px-3 py-1 hover:opacity-90 transition">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
