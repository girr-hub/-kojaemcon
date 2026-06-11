import { supabaseAdmin } from '@/lib/supabase/server'

export default async function Payouts() {
  const sb = supabaseAdmin()
  const { data } = await sb.from('payouts')
    .select('*, events(title), profiles(display_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="headline-en text-5xl uppercase mb-6">Payouts</h1>
      <table className="w-full sub-en text-sm">
        <thead><tr className="border-b border-ink/10 uppercase text-xs text-ink/50">
          <th className="text-left p-2">Event</th><th>Host</th><th>Gross</th><th>Fee 4%</th><th>Net</th><th>Status</th>
        </tr></thead>
        <tbody>
          {data?.map((p:any)=>(
            <tr key={p.id} className="border-b border-ink/5">
              <td className="p-2">{p.events?.title}</td>
              <td>{p.profiles?.display_name} ({p.profiles?.email})</td>
              <td>₩{p.gross_krw.toLocaleString()}</td>
              <td className="text-red-300">−₩{p.fee_krw.toLocaleString()}</td>
              <td className="text-primary">₩{p.net_krw.toLocaleString()}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
