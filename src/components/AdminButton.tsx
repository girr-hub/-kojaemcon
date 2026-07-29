'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminButton() {
  const [show, setShow] = useState(false)
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const r = useRouter()

  const check = () => {
    if (pin === '2450') {
      r.push('/admin')
    } else {
      setErr(true)
      setPin('')
      setTimeout(() => setErr(false), 2000)
    }
  }

  return (
    <>
      <button
        onClick={() => setShow(true)}
        style={{ fontSize: 12, color: '#E7E7E7', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
      >
        Admin
      </button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => { setShow(false); setPin('') }}/>
          <div className="relative bg-[#1e1e1e] border border-ink/20 p-8 max-w-xs w-full z-10 text-center">
            <h3 className="headline-en text-2xl uppercase mb-6">Admin Access</h3>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="4-digit PIN"
              className="w-full bg-surface border border-ink/10 text-ink px-4 py-3 outline-none focus:border-primary sub-en text-center text-2xl tracking-widest mb-4"
              autoFocus
            />
            {err && <p className="text-red-400 sub-en text-sm mb-4">Wrong PIN</p>}
            <button onClick={check} className="w-full bg-primary text-bg py-3 sub-en uppercase font-bold">
              Enter
            </button>
          </div>
        </div>
      )}
    </>
  )
}
