'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const sb = supabase()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) { setErr(error.message); setLoading(false); return }
    window.location.href = '/events'
  }

  const input = "w-full bg-surface border border-ink/10 text-ink px-4 py-3 focus:border-primary outline-none sub-en"

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="headline-en text-5xl text-ink uppercase mb-8">Log In</h1>
        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Email</label>
          <input className={input} type="email" placeholder="your@email.com" required
                 onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div>
          <label className="sub-en text-xs text-ink/50 uppercase tracking-wider mb-1 block">Password</label>
          <input className={input} type="password" placeholder="••••••••" required
                 onChange={e=>setPassword(e.target.value)}/>
        </div>
        {err && <div className="text-red-400 sub-en text-sm">{err}</div>}
        <button type="submit" disabled={loading}
                className="w-full bg-primary text-bg py-4 sub-en uppercase font-bold tracking-wider hover:opacity-90 transition disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-center text-ink/40 sub-en text-sm">
          No account?{' '}
          <a href="/signup" className="text-primary hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  )
}
