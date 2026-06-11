import { supabaseAdmin } from '@/lib/supabase/server'

export default async function AdminOrders() {
  const sb = supabaseAdmin()
  const { data } = await sb.from('orders')
    .select('*, events(title), profiles(display_name, email)')
    .order('created_at', { ascending: false })
  return (
    <div>
      <h1 className="headline-en text-5xl uppercase mb-6">Orders</h1>
      <table className="w-full sub-en text-sm">
        <thead><tr className="border-b border-ink/10 uppercase text-xs text-ink/50">
          <th className="text-left p-2">Event</th><th>User</th><th>Amount</th><th>Qty</th><th>Status</th><th>Date</th>
        </tr></thead>
        <tbody>
          {data?.map((o:any) => (
            <tr key={o.id} className="border-b border-ink/5 hover:bg-surface">
              <td className="p-2">{o.events?.title}</td>
              <td>{o.profiles?.display_name} <span className="text-ink/40">({o.profiles?.email})</span></td>
              <td>{o.amount_krw === 0 ? 'FREE' : `₩${o.amount_krw.toLocaleString()}`}</td>
              <td className="text-center">{o.quantity}</td>
              <td className="text-center">
                <span className={`px-2 py-0.5 text-xs ${
                  o.status==='paid'||o.status==='free_confirmed'?'bg-primary text-bg':
                  o.status==='pending'?'bg-yellow-600':'bg-red-900'
                }`}>{o.status}</span>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
