import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/auth-helpers-nextjs'

// Browser client factory. Cookies are handled automatically in the browser.
// No Database generics — supabase-js v2 quirk for non-public schemas (vibemap).
export const createBrowserClient = () =>
  createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
