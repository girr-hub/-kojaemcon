import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminEvents() {
  const sb = supabaseAdmin()
  const { data } = await sb.from('events').select('*, profiles(display_name)').order('created_at', { ascending: false })
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="headline-en text-5xl uppercase">Events</h1>
        <Link href="/admin/events/new" className="bg-primary text-bg px-4 py-2 sub-en uppercase">+ New</Link>
      </div>
      <table className="w-full sub-en text-sm">
        <thead className="text-ink/50 uppercase text-xs">
          <tr className="border-b border-ink/10">
            <th className="text-left p-2">Title</th><th>Source</th><th>Host</th>
            <th>Status</th><th>Starts</th><th>Price</th><th></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((e:any)=>(
            <tr key={e.id} className="border-b border-ink/5 hover:bg-surface">
              <td className="p-2">{e.title}</td>
              <td className="text-center">{e.source}</td>
              <td className="text-center">{e.profiles?.display_name ?? '-'}</td>
              <td className="text-center">
                <span className={`px-2 py-0.5 text-xs ${
                  e.status==='published'?'bg-primary text-bg':
                  e.status==='pending'?'bg-yellow-600':'bg-ink/10'
                }`}>{e.status}</span>
              </td>
              <td className="text-center">{new Date(e.starts_at).toLocaleDateString()}</td>
              <td className="text-center">{e.is_free?'FREE':`₩${e.price_krw.toLocaleString()}`}</td>
              <td className="text-right">
                <Link href={`/admin/events/${e.id}/edit`} className="text-primary underline">edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
