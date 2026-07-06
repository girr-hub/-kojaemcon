import { supabaseAdmin } from '@/lib/supabase/server'
import SurveyClient from './SurveyClient'

export default async function SurveyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = supabaseAdmin()
  const { data: event } = await admin.from('events').select('id, title, ends_at').eq('slug', slug).single()
  if (!event) return <div style={{ padding: 48, textAlign: 'center' }}>Event not found</div>
  return <SurveyClient event={event} />
}
