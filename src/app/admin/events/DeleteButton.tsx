'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const r = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const sb = supabase()
    const { error } = await sb.from('events').delete().eq('id', id)
    if (error) { alert(error.message); return }
    r.refresh()
  }

  return (
    <button onClick={handleDelete}
            className="text-red-400 underline sub-en text-sm hover:text-red-300">
      Delete
    </button>
  )
}
