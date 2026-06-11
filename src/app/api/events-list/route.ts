import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createClient(
    'https://qbacbmyffpkiipngccpa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiYWNibXlmZnBraWlwbmdjY3BhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAzMTA3MCwiZXhwIjoyMDk2NjA3MDcwfQ.UAAiiQhLuRyoQg-pgVG3uMZD_iJV1aKBXUhBC5XhCYY',
    { auth: { persistSession: false } }
  )
  const { data } = await sb.from('events').select('*').eq('status','published').order('starts_at', { ascending: true }).limit(9)
  return NextResponse.json(data ?? [])
}
