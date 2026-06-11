import EventForm from '@/components/EventForm'
import { supabaseServer } from '@/lib/supabase/server'

export default async function EditEvent({ params }: { params: { id: string }}) {
  const sb = await supabaseServer()
  const { data } = await sb.from('events').select('*').eq('id', params.id).single()
  if (!data) return <div className="p-12">Not found</div>
  return <EventForm mode="admin" initial={data}/>
}
