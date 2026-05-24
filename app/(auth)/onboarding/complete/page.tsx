import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { resolveStep, TOTAL_QUESTIONS } from '@/lib/onboarding/steps'

// Onboarding completion (server component). Reached as the target of submitAnswer's
// redirect() after the final question — a server-action soft-navigation needs an
// RSC-navigable page, so a route handler 404s here (it has no RSC payload) — or as
// recovery (a user with 20 answers whose completion never ran). No UI: every branch
// redirects. The mutations run idempotently in render, guarded by
// `onboarding_completed_at IS NULL` + an ON CONFLICT upsert, so a re-entry (or a
// React re-render) is safe.
export default async function OnboardingCompletePage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Safety net — every vibemap table FKs to vibemap.users.id (idempotent).
  await ensureUserProvisioned(supabase, user)

  // Already finished — idempotent exit.
  const { data: userRow } = await supabase
    .schema('vibemap')
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', user.id)
    .single()
  if (userRow?.onboarding_completed_at) redirect('/feed')

  // Guard against finishing a partial run. Reuse the tested step math: probing with
  // an out-of-range step yields 'complete' only when all questions are answered,
  // otherwise a redirect to the resume step.
  const { count } = await supabase
    .schema('vibemap')
    .from('user_answers')
    .select('*', { count: 'exact', head: true })
  const probe = resolveStep(count ?? 0, TOTAL_QUESTIONS + 1)
  if (probe.kind !== 'complete') redirect(`/onboarding/${probe.step}`)

  // Order matters: create the vibe-profile stub BEFORE marking completion.
  // onboarding_completed_at is the completion "commit" — while it is NULL a re-entry
  // repairs a missing profile; flipping it first would strand the profile if this
  // insert failed. upsert ignoreDuplicates keeps re-runs safe. Queue stub only —
  // no LLM work in this sprint.
  const { error: profileErr } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .upsert({ user_id: user.id, status: 'pending' }, { onConflict: 'user_id', ignoreDuplicates: true })
  if (profileErr) throw profileErr

  // Race guard: only the first completion flips the flag.
  const { error: completeErr } = await supabase
    .schema('vibemap')
    .from('users')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('id', user.id)
    .is('onboarding_completed_at', null)
  if (completeErr) throw completeErr

  redirect('/reveal')

  // Unreachable — every branch above redirects. Kept so the component has a return.
  return null
}
