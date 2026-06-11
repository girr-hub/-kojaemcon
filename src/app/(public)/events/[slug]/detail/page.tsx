import { supabaseServer } from '@/lib/supabase/server'
import { sanitizeHtml } from '@/lib/sanitize'

export default async function DetailPage({ params }: { params: { slug: string }}) {
  const sb = await supabaseServer()
  const { data: e } = await sb.from('events')
    .select('*').eq('slug', params.slug).eq('source','official').single()
  if (!e) return <div className="p-12">Not available</div>

  return (
    <article className="bg-bg">
      {e.detail_video_url && (
        <video src={e.detail_video_url} autoPlay muted loop playsInline 
               className="w-full h-[80vh] object-cover"/>
      )}
      <div className="max-w-3xl mx-auto px-6 py-16 prose prose-invert"
           dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.detail_page_html || '') }}/>
    </article>
  )
}
