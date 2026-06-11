import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const supabaseServer = async () => {
  const store = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (k: string) => store.get(k)?.value,
        set: (k: string, v: string, o: any) => store.set({ name: k, value: v, ...o }),
        remove: (k: string, o: any) => store.set({ name: k, value: '', ...o }),
      },
    }
  )
}

export const supabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
