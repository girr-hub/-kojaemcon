import EventForm from '@/components/EventForm'
import { supabaseAdmin } from '@/lib/supabase/server'

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = supabaseAdmin()
  const { data } = await sb.from('events').select('*').eq('id', id).single()
  if (!data) return <div className="p-12">Not found</div>
  return <EventForm mode="admin" initial={data}/>
}
