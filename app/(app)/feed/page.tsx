import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { ARCHETYPES } from '@/lib/vibe/reveal/archetypes'

// /feed — the recommendation surface (decision Ф1=A). Sprint 1.3.2.A ships the SHELL
// only: the page now EXISTS (it was a 404 that RevealCard's CTA already links to),
// self-gates, and renders inside the (app) bottom-nav shell. Card render + Volly
// comments + Ф4 likes are 1.3.2.B — this body is intentionally thin (header +
// placeholder) and makes NO call to /api/vibe/feed yet. Self-gate mirrors /reveal:
// auth -> onboarding finished -> ready vibe-profile, else redirect where the user
// needs to be (the archetype is what would pick the card set in 1.3.2.B).
export default async function FeedPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Safety net — every vibemap table FKs to vibemap.users.id (idempotent).
  await ensureUserProvisioned(supabase, user)

  // Guard: the feed only makes sense after the 20Q onboarding is finished.
  const { data: userRow } = await supabase
    .schema('vibemap')
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', user.id)
    .single()
  if (!userRow?.onboarding_completed_at) redirect('/onboarding/1')

  // Guard: no ready vibe-profile -> no archetype to anchor the feed -> send to Reveal.
  const { data: profile } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .select('status, archetype')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profile?.status !== 'ready' || !profile.archetype) redirect('/reveal')

  const meta = ARCHETYPES.find((a) => a.slug === profile.archetype)

  return (
    <main className="mx-auto min-h-screen max-w-md px-[26px] pt-16">
      <h1 className="font-display text-4xl leading-none text-ink">Лента</h1>
      {meta && <p className="mt-2 font-body text-sm text-ink-70">Идеи под ваш вайб · {meta.name}</p>}

      {/* Thin placeholder — the card render + Volly comments arrive in 1.3.2.B. */}
      <div className="mt-7 rounded-card border border-white bg-glass-bg p-7 text-center">
        <p className="font-body text-ink-70">Volly подбирает идеи под ваш вечер.</p>
        <p className="mt-1 font-body text-sm text-ink-50">Скоро здесь появятся карточки.</p>
      </div>
    </main>
  )
}
