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
    <div style={{ minHeight:'100vh', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <form onSubmit={submit} style={{ width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:16 }}>
        <h1 style={{ fontFamily:"PretendardVariable,Pretendard,sans-serif", fontWeight:900, fontSize:22, letterSpacing:"-0.04em" }}>Log In</h1>
        <div>
          <label >Email</label>
          <input className={input} type="email" placeholder="your@email.com" required
                 onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div>
          <label >Password</label>
          <input className={input} type="password" placeholder="••••••••" required
                 onChange={e=>setPassword(e.target.value)}/>
        </div>
        {err && <div >{err}</div>}
        <button type="submit" disabled={loading}
                className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px' }}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p >
          No account?{' '}
          <a href="/signup" className="text-primary hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  )
}
