import { supabaseAdmin } from '@/lib/supabase/server'
import AdminMagazineClient from './AdminMagazineClient'

export default async function AdminMagazinePage() {
  const admin = supabaseAdmin()
  const { data: posts } = await admin.from('magazine_posts')
    .select('*')
    .order('created_at', { ascending: false })
  return <AdminMagazineClient posts={posts ?? []} />
}
