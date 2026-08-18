import { supabaseAdmin } from '@/lib/supabase/server'
import BannersClient from './BannersClient'

export default async function BannersPage() {
  const admin = supabaseAdmin()
  const { data: banners } = await admin.from('sponsor_banners')
    .select('*').order('sort_order').order('created_at', { ascending: false })
  return <BannersClient banners={banners ?? []} />
}
