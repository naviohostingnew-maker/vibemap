import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// No Database generics — supabase-js v2 quirk for non-public schemas (vibemap).
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For server components / pages / layouts.
export const createServerClient = () => {
  const cookieStore = cookies()
  return createSupabaseServerClient(URL, ANON, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server components can't write cookies — middleware refreshes the session instead.
        }
      },
    },
  })
}

// For API route handlers (cookies are writable here).
export const createRouteClient = () => {
  const cookieStore = cookies()
  return createSupabaseServerClient(URL, ANON, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        )
      },
    },
  })
}
