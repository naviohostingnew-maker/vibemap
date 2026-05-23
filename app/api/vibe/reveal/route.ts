import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'
import { getAnthropic, REVEAL_MODEL } from '@/lib/anthropic/client'
import { buildVibeDigest } from '@/lib/vibe/reveal/digest'
import { buildRevealSystemPrompt } from '@/lib/vibe/reveal/prompt'
import { parseVibeProfile } from '@/lib/vibe/reveal/parse'

// A 'generating' row newer than this is treated as an in-flight request — a second
// POST returns {status:'generating'} instead of firing the LLM again (anti-double-fire).
// Older than this = a stale/abandoned attempt, safe to regenerate over.
const GENERATING_TTL_MS = 2 * 60 * 1000

// POST /api/vibe/reveal — generates (or returns) the user's Reveal vibe-profile.
// Decision Ф3: synchronous LLM call in-request, status lifecycle pending ->
// generating -> ready|failed, no queue. The Reveal SCREEN (D.2) is a separate
// sprint; this is just the engine. No input body — the user is the session.
export async function POST() {
  const supabase = createRouteClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Gate: only a finished onboarding (20 answers) has anything to synthesize.
  const { data: userRow } = await supabase
    .schema('vibemap')
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', user.id)
    .single()
  if (!userRow?.onboarding_completed_at) {
    return NextResponse.json({ error: 'onboarding not completed' }, { status: 400 })
  }

  // Lifecycle branch on the current profile row.
  const { data: current } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .select('status, updated_at, vibe_title, vibe_summary, traits, volly_note, archetype')
    .eq('user_id', user.id)
    .maybeSingle()

  // Already done — idempotent, no LLM call.
  if (current?.status === 'ready') {
    return NextResponse.json({ status: 'ready', profile: current })
  }
  // In flight — don't double-fire.
  if (
    current?.status === 'generating' &&
    current.updated_at &&
    Date.now() - new Date(current.updated_at).getTime() < GENERATING_TTL_MS
  ) {
    return NextResponse.json({ status: 'generating' })
  }

  // Claim the slot: pending / failed / stale-generating -> generating.
  // upsert covers the (defensive) case of a missing row; RLS self-policy allows it.
  const { error: claimErr } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .upsert(
      { user_id: user.id, status: 'generating', updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  if (claimErr) {
    return NextResponse.json({ error: claimErr.message }, { status: 500 })
  }

  try {
    const { data: answers } = await supabase
      .schema('vibemap')
      .from('user_answers')
      .select('question_id, answer_key')
    const { data: questions } = await supabase
      .schema('vibemap')
      .from('questions')
      .select('id, order_num, category, text, options')

    if (!answers?.length || !questions?.length) {
      throw new Error('no answers or questions to synthesize')
    }

    const digest = buildVibeDigest(answers, questions)

    const response = await getAnthropic().messages.create({
      model: REVEAL_MODEL,
      max_tokens: 1024,
      system: buildRevealSystemPrompt(),
      messages: [{ role: 'user', content: digest }],
    })
    const text = response.content.map((block) => (block.type === 'text' ? block.text : '')).join('')

    const parsed = parseVibeProfile(text)
    if (!parsed.ok) {
      await markFailed(supabase, user.id, `parse: ${parsed.error}`)
      return NextResponse.json({ status: 'failed', error: parsed.error }, { status: 502 })
    }

    const p = parsed.profile
    const { error: writeErr } = await supabase
      .schema('vibemap')
      .from('user_vibe_profile')
      .update({
        vibe_title: p.vibe_title,
        vibe_summary: p.vibe_summary,
        traits: p.traits,
        volly_note: p.volly_note,
        archetype: p.archetype,
        failed_reason: null,
        status: 'ready',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
    if (writeErr) throw writeErr

    return NextResponse.json({ status: 'ready', profile: p })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[vibe/reveal] generation failed:', message)
    await markFailed(supabase, user.id, message)
    return NextResponse.json({ status: 'failed', error: message }, { status: 500 })
  }
}

// Marks the profile failed with a (truncated) reason. Best-effort: a write failure
// here is logged but never masks the original error returned to the caller.
async function markFailed(
  supabase: ReturnType<typeof createRouteClient>,
  userId: string,
  reason: string,
): Promise<void> {
  const { error } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .update({ status: 'failed', failed_reason: reason.slice(0, 500), updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) console.error('[vibe/reveal] markFailed write error:', error.message)
}
