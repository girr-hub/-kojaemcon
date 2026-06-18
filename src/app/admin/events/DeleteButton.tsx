'use client'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const r = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const res = await fetch('/api/admin/delete-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      r.refresh()
    } else {
      const err = await res.json()
      alert(err.error)
    }
  }

  return (
    <button onClick={handleDelete}
            className="text-red-400 underline sub-en text-sm hover:text-red-300">
      Delete
    </button>
  )
}
