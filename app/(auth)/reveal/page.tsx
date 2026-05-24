import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { RevealCard } from '@/components/reveal/RevealCard'
import { RevealGenerating } from '@/components/reveal/RevealGenerating'
import type { ArchetypeSlug } from '@/lib/vibe/reveal/parse'

// Reveal screen (server component). Self-gates like the other (auth) pages (no
// shared (auth)/layout — each page guards itself). Reads the user's vibe-profile
// and branches on status: ready -> the card; anything else -> the generating
// state, which triggers the engine and refreshes back here once ready. The screen
// is revisitable — a ready profile is "their" card. Decision Ф3/Ф4.
export default async function RevealPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Safety net — every vibemap table FKs to vibemap.users.id (idempotent).
  await ensureUserProvisioned(supabase, user)

  // Guard: Reveal only makes sense after the 20Q onboarding is finished.
  const { data: userRow } = await supabase
    .schema('vibemap')
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', user.id)
    .single()
  if (!userRow?.onboarding_completed_at) redirect('/onboarding/1')

  const { data: profile } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .select('status, vibe_title, vibe_summary, traits, volly_note, archetype')
    .eq('user_id', user.id)
    .maybeSingle()

  const ready =
    profile?.status === 'ready' &&
    profile.vibe_title &&
    profile.vibe_summary &&
    profile.volly_note &&
    profile.archetype

  return (
    <AuroraBackground>
      <main className="flex min-h-screen items-center justify-center px-[26px] py-7">
        {ready ? (
          <RevealCard
            vibeTitle={profile.vibe_title as string}
            vibeSummary={profile.vibe_summary as string}
            traits={(profile.traits ?? []) as string[]}
            vollyNote={profile.volly_note as string}
            archetype={profile.archetype as ArchetypeSlug}
          />
        ) : (
          <RevealGenerating />
        )}
      </main>
    </AuroraBackground>
  )
}
