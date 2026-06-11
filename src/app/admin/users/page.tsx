import { supabaseAdmin } from '@/lib/supabase/server'

export default async function AdminUsers() {
  const sb = supabaseAdmin()
  const { data } = await sb.from('profiles').select('*').order('created_at', { ascending: false })
  return (
    <div>
      <h1 className="headline-en text-5xl uppercase mb-6">Users</h1>
      <table className="w-full sub-en text-sm">
        <thead><tr className="border-b border-ink/10 uppercase text-xs text-ink/50">
          <th className="text-left p-2">Name</th><th>Email</th><th>Nationality</th><th>Role</th><th>Joined</th>
        </tr></thead>
        <tbody>
          {data?.map((u:any) => (
            <tr key={u.id} className="border-b border-ink/5 hover:bg-surface">
              <td className="p-2">{u.display_name ?? '-'}</td>
              <td>{u.email}</td>
              <td className="text-center">{u.nationality}</td>
              <td className="text-center">
                <span className={`px-2 py-0.5 text-xs ${u.role==='admin'?'bg-primary text-bg':u.role==='host'?'bg-yellow-600':'bg-ink/10'}`}>
                  {u.role}
                </span>
              </td>
              <td className="text-center">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
