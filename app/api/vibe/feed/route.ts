import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'
import { getAnthropic, FEED_MODEL } from '@/lib/anthropic/client'
import { feedCardsForArchetype } from '@/lib/vibe/feed/cards'
import { buildFeedDigest } from '@/lib/vibe/feed/digest'
import { buildFeedCommentSystemPrompt } from '@/lib/vibe/feed/prompt'
import { parseFeedComments } from '@/lib/vibe/feed/parse'
import type { ArchetypeSlug } from '@/lib/vibe/reveal/parse'

// A 'generating' row newer than this is treated as in-flight — a second POST returns
// {status:'generating'} instead of firing the LLM again (anti-double-fire). Older =
// a stale/abandoned attempt, safe to regenerate over. Same TTL idiom as Reveal.
const GENERATING_TTL_MS = 2 * 60 * 1000

// POST /api/vibe/feed — generates (or returns) the per-user batch of Volly comments
// over the cards of the user's archetype. Decision Ф2: one Sonnet call per user, the
// batch is the personalizing layer over a static card set. Mirrors the Reveal engine:
// synchronous in-request call, status lifecycle pending -> generating -> ready|failed.
// The feed SCREEN is Sprint 1.3.2 — this is just the engine. No input body — the user
// is the session.
export async function POST() {
  const supabase = createRouteClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Gate: feed comments are downstream of Reveal — without a ready vibe-profile there
  // is no archetype to pick the card set, and no vibe to personalize against.
  const { data: profile } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .select('status, vibe_title, vibe_summary, traits, archetype')
    .eq('user_id', user.id)
    .maybeSingle()

  if (
    profile?.status !== 'ready' ||
    !profile.archetype ||
    !profile.vibe_title ||
    !profile.vibe_summary
  ) {
    return NextResponse.json({ error: 'vibe profile not ready' }, { status: 409 })
  }

  // Lifecycle branch on the current comments row.
  const { data: current } = await supabase
    .schema('vibemap')
    .from('user_feed_comments')
    .select('status, updated_at, comments')
    .eq('user_id', user.id)
    .maybeSingle()

  // Already done — idempotent, no LLM call.
  if (current?.status === 'ready' && current.comments) {
    return NextResponse.json({ status: 'ready', comments: current.comments })
  }
  // In flight — don't double-fire.
  if (
    current?.status === 'generating' &&
    current.updated_at &&
    Date.now() - new Date(current.updated_at).getTime() < GENERATING_TTL_MS
  ) {
    return NextResponse.json({ status: 'generating' })
  }

  // Claim the slot: pending / failed / stale-generating / missing -> generating.
  // upsert covers the (expected) missing-row case; RLS self-policy allows it.
  const { error: claimErr } = await supabase
    .schema('vibemap')
    .from('user_feed_comments')
    .upsert(
      { user_id: user.id, status: 'generating', updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  if (claimErr) {
    return NextResponse.json({ error: claimErr.message }, { status: 500 })
  }

  try {
    const cards = feedCardsForArchetype(profile.archetype as ArchetypeSlug)
    if (cards.length === 0) {
      throw new Error(`no cards for archetype ${profile.archetype}`)
    }

    const digest = buildFeedDigest(
      {
        vibe_title: profile.vibe_title,
        vibe_summary: profile.vibe_summary,
        traits: (profile.traits ?? []) as string[],
      },
      cards,
    )

    const response = await getAnthropic().messages.create({
      model: FEED_MODEL,
      max_tokens: 1536,
      system: buildFeedCommentSystemPrompt(),
      messages: [{ role: 'user', content: digest }],
    })
    const text = response.content.map((block) => (block.type === 'text' ? block.text : '')).join('')

    const parsed = parseFeedComments(
      text,
      cards.map((c) => c.id),
    )
    if (!parsed.ok) {
      await markFailed(supabase, user.id, `parse: ${parsed.error}`)
      return NextResponse.json({ status: 'failed', error: parsed.error }, { status: 502 })
    }

    const { error: writeErr } = await supabase
      .schema('vibemap')
      .from('user_feed_comments')
      .update({
        comments: parsed.comments,
        failed_reason: null,
        status: 'ready',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
    if (writeErr) throw writeErr

    return NextResponse.json({ status: 'ready', comments: parsed.comments })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[vibe/feed] generation failed:', message)
    await markFailed(supabase, user.id, message)
    return NextResponse.json({ status: 'failed', error: message }, { status: 500 })
  }
}

// Marks the comments row failed with a (truncated) reason. Best-effort: a write
// failure here is logged but never masks the original error returned to the caller.
async function markFailed(
  supabase: ReturnType<typeof createRouteClient>,
  userId: string,
  reason: string,
): Promise<void> {
  const { error } = await supabase
    .schema('vibemap')
    .from('user_feed_comments')
    .update({ status: 'failed', failed_reason: reason.slice(0, 500), updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) console.error('[vibe/feed] markFailed write error:', error.message)
}
