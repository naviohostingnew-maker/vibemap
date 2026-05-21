import type { SupabaseClient, User } from '@supabase/supabase-js'

// Idempotently ensures a vibemap.users row exists for the authenticated user.
// All vibemap tables FK to vibemap.users.id; the row is synced here on first sight
// rather than via a db-trigger on the shared auth.users (avoids astro.handle_new_user
// coupling in the shared Prototype Lab). Safe to call on every auth touchpoint.
export async function ensureUserProvisioned(
  supabase: SupabaseClient,
  authUser: User,
): Promise<{ id: string; created: boolean }> {
  if (!authUser.email) {
    throw new Error(`auth user ${authUser.id} has no email — cannot provision vibemap.users`)
  }

  // ON CONFLICT (id) DO NOTHING RETURNING id: select() returns the inserted row,
  // or an empty array when the row already existed (ignoreDuplicates).
  const { data, error } = await supabase
    .schema('vibemap')
    .from('users')
    .upsert({ id: authUser.id, email: authUser.email }, { onConflict: 'id', ignoreDuplicates: true })
    .select('id')

  if (error) throw error

  return { id: authUser.id, created: (data?.length ?? 0) > 0 }
}
