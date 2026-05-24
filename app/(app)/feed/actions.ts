'use server'

import { redirect } from 'next/navigation'
import { createRouteClient } from '@/lib/supabase/server'
import { FEED_CARDS } from '@/lib/vibe/feed/cards'

// Ф4 like toggle (decision Ф4). A like writes to vibe_memories so Volly's memory grows
// from feed signal — the "AI that learns about you" USP made tangible. card_id arrives
// from the client, but archetype/title are NEVER trusted from it: they are looked up
// server-side from the static FEED_CARDS by card_id (an unknown id is rejected). content
// is the card title (vibe_memories.content is NOT NULL; the title is the meaningful
// "what was liked"). Idempotency rides the partial unique index user_feed_like_uniq
// (user_id, metadata->>card_id) WHERE source='feed_like' — supabase .upsert({onConflict})
// can't target a partial/expression index, so a like is an .insert() that swallows the
// 23505 unique-violation as "already liked". unlike is a delete by (user_id, card_id).
// No revalidatePath: LikeButton holds optimistic state and the page (dynamic, auth
// cookies) re-reads vibe_memories on the next navigation.
export async function toggleFeedLike(cardId: string, liked: boolean) {
  const card = FEED_CARDS.find((c) => c.id === cardId)
  if (!card) throw new Error(`toggleFeedLike: unknown card_id ${JSON.stringify(cardId)}`)

  const supabase = createRouteClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (liked) {
    // unlike — remove this card's feed_like memory.
    const { error } = await supabase
      .schema('vibemap')
      .from('vibe_memories')
      .delete()
      .eq('user_id', user.id)
      .eq('metadata->>source', 'feed_like')
      .eq('metadata->>card_id', cardId)
    if (error) throw error
  } else {
    // like — idempotent insert; the partial unique index dedups, so swallow 23505.
    const { error } = await supabase
      .schema('vibemap')
      .from('vibe_memories')
      .insert({
        user_id: user.id,
        memory_type: 'semantic',
        content: card.title,
        metadata: { source: 'feed_like', card_id: cardId, archetype: card.archetype },
      })
    if (error && error.code !== '23505') throw error
  }
}
