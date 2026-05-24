import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { ARCHETYPES } from '@/lib/vibe/reveal/archetypes'
import { feedCardsForArchetype } from '@/lib/vibe/feed/cards'
import type { ArchetypeSlug } from '@/lib/vibe/reveal/parse'
import { FeedCard } from '@/components/feed/FeedCard'

// /feed — the recommendation surface (decision Ф1=A). Self-gates like /reveal: auth ->
// onboarding finished -> ready vibe-profile, else redirect where the user needs to be.
// 1.3.2.B.1 renders the archetype's static card set; each card's Volly comment comes
// from the user_feed_comments row (card_id -> text). No comments row yet -> every slot
// shimmers. The comment generation (POST /api/vibe/feed) is wired in 1.3.2.B.2; the Ф4
// like read is wired in 1.3.2.B.3 (liked is false for all cards here).
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
  const cards = feedCardsForArchetype(profile.archetype as ArchetypeSlug)

  // Volly's per-card comments (card_id -> text). Absent until POST /api/vibe/feed runs
  // (1.3.2.B.2); until then every card's slot shimmers.
  const { data: commentsRow } = await supabase
    .schema('vibemap')
    .from('user_feed_comments')
    .select('comments')
    .eq('user_id', user.id)
    .maybeSingle()
  const comments = (commentsRow?.comments ?? {}) as Record<string, string>

  return (
    <main className="mx-auto min-h-screen max-w-md px-[26px] pt-16">
      <h1 className="font-display text-4xl leading-none text-ink">Лента</h1>
      {meta && <p className="mt-2 font-body text-sm text-ink-70">Идеи под ваш вайб · {meta.name}</p>}

      <div className="mt-7 space-y-5">
        {cards.map((card) => (
          <FeedCard key={card.id} card={card} comment={comments[card.id]} liked={false} />
        ))}
      </div>
    </main>
  )
}
