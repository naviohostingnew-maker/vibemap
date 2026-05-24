// Pure transform: the user's vibe-profile + their 6 archetype cards -> a Russian
// digest string fed to the feed-comment LLM as the user message. No DB, no I/O, no
// JSX — unit-testable via node:test (relative import). The route fetches the rows
// and the cards and hands them here; the prompt persona lives in ./prompt.

import type { FeedCard } from './cards'

export type FeedDigestProfile = {
  vibe_title: string
  vibe_summary: string
  traits: string[]
}

export function buildFeedDigest(profile: FeedDigestProfile, cards: FeedCard[]): string {
  const traits = profile.traits.length ? profile.traits.join(', ') : '—'
  const profileBlock = [
    'Вайб-профиль человека:',
    `- Заголовок: ${profile.vibe_title}`,
    `- Описание: ${profile.vibe_summary}`,
    `- Черты: ${traits}`,
  ].join('\n')

  const cardLines = cards.map((c) => `[${c.id}] ${c.title} (${c.kind}): ${c.body}`)
  const cardsBlock = ['Карточки-идеи (прокомментируй каждую; ключи JSON — их id):', ...cardLines].join(
    '\n',
  )

  return `${profileBlock}\n\n${cardsBlock}`
}
