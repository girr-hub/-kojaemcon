'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

const STATUSES = [
  { value: 'pending', label: '⏳ 검토중' },
  { value: 'published', label: '✅ 모집중' },
  { value: 'closed', label: '🔒 마감' },
  { value: 'cancelled', label: '❌ 취소' },
]

export default function StatusDropdown({ id, initialStatus }: { id: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    const { createBrowserClient } = await import('@supabase/ssr')
    const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error } = await sb.from('events').update({ status: newStatus }).eq('id', id)
    if (!error) setStatus(newStatus)
    else alert('변경 실패: ' + error.message)
    setLoading(false)
  }

  return (
    <select value={status} onChange={e => handleChange(e.target.value)} disabled={loading}
      style={{ borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid #E8E8E4', background: '#F8F8F6' }}>
      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  )
}
