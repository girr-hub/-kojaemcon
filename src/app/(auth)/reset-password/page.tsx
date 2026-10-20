'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { alert('Passwords do not match'); return }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return }
    setBusy(true)
    const sb = supabase()
    const { error } = await sb.auth.updateUser({ password })
    setBusy(false)
    if (error) { alert(error.message); return }
    setDone(true)
    setTimeout(() => { window.location.href = '/login' }, 2000)
  }

  const inputStyle: React.CSSProperties = { width:'100%', border:'1.5px solid #E8E8E4', borderRadius:10, padding:'12px 14px', fontSize:14, fontFamily:'Inter', outline:'none', boxSizing:'border-box' }
  const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:600, color:'#0A0A0A', marginBottom:4, display:'block' }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F8F6', padding:16 }}>
      <div style={{ background:'#fff', border:'1.5px solid #E8E8E4', borderRadius:20, padding:32, maxWidth:400, width:'100%' }}>
        <h1 style={{ fontFamily:'Inter', fontWeight:900, fontSize:22, color:'#0A0A0A', marginBottom:8 }}>Set new password</h1>
        <p style={{ fontSize:13, color:'#6B6B6B', marginBottom:24 }}>Choose a new password for your account.</p>

        {done ? (
          <div style={{ background:'#F0FDF4', border:'1.5px solid #86EFAC', borderRadius:12, padding:20, textAlign:'center' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
            <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:15, color:'#166534' }}>Password updated! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={labelStyle}>New password</label>
              <input style={inputStyle} type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Confirm password</label>
              <input style={inputStyle} type="password" placeholder="Repeat new password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" disabled={busy} style={{ background:'#0A0A0A', color:'#fff', border:'none', borderRadius:100, padding:'13px', fontFamily:'Inter', fontWeight:700, fontSize:14, cursor:busy?'not-allowed':'pointer', opacity:busy?0.6:1 }}>
              {busy ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
