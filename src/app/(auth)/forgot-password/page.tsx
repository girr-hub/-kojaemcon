'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setBusy(true)
    const sb = supabase()
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setBusy(false)
    if (error) { alert(error.message); return }
    setSent(true)
  }

  const inputStyle: React.CSSProperties = { width:'100%', border:'1.5px solid #E8E8E4', borderRadius:10, padding:'12px 14px', fontSize:14, fontFamily:'Inter', outline:'none', boxSizing:'border-box' }
  const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:600, color:'#0A0A0A', marginBottom:4, display:'block' }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F8F6', padding:16 }}>
      <div style={{ background:'#fff', border:'1.5px solid #E8E8E4', borderRadius:20, padding:32, maxWidth:400, width:'100%' }}>
        <a href="/login" style={{ fontSize:13, color:'#9A9A9A', textDecoration:'none', display:'block', marginBottom:20 }}>← Back to login</a>
        <h1 style={{ fontFamily:'Inter', fontWeight:900, fontSize:22, color:'#0A0A0A', marginBottom:8 }}>Forgot password?</h1>
        <p style={{ fontSize:13, color:'#6B6B6B', marginBottom:24 }}>Enter your email and we'll send you a reset link.</p>

        {sent ? (
          <div style={{ background:'#F0FDF4', border:'1.5px solid #86EFAC', borderRadius:12, padding:20, textAlign:'center' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>📬</div>
            <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:15, color:'#166534', marginBottom:4 }}>Check your email</p>
            <p style={{ fontSize:13, color:'#166534' }}>Reset link sent to <strong>{email}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={busy} style={{ background:'#0A0A0A', color:'#fff', border:'none', borderRadius:100, padding:'13px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:busy?'not-allowed':'pointer', opacity:busy?0.6:1 }}>
              {busy ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
