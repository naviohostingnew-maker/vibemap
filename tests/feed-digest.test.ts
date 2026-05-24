import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative imports with .ts extension — node:test does not resolve the webpack '@/' alias.
import { buildFeedDigest } from '../lib/vibe/feed/digest.ts'
import { feedCardsForArchetype } from '../lib/vibe/feed/cards.ts'

const profile = {
  vibe_title: 'Свет в тихом окне',
  vibe_summary: 'Ты ценишь камерность и узкий круг. Вечера дома заряжают сильнее любой движухи.',
  traits: ['домашний', 'спокойный', 'верный кругу'],
}

test('includes the profile fields', () => {
  const digest = buildFeedDigest(profile, feedCardsForArchetype('quiet_evenings'))
  assert.match(digest, /Свет в тихом окне/)
  assert.match(digest, /камерность и узкий круг/)
  assert.match(digest, /домашний, спокойный, верный кругу/)
})

test('lists every card with its id, title and kind', () => {
  const cards = feedCardsForArchetype('quiet_evenings')
  const digest = buildFeedDigest(profile, cards)
  for (const c of cards) {
    assert.ok(digest.includes(`[${c.id}]`), `missing id ${c.id}`)
    assert.ok(digest.includes(c.title), `missing title ${c.title}`)
  }
})

test('empty traits degrade to a dash, no throw', () => {
  const digest = buildFeedDigest({ ...profile, traits: [] }, feedCardsForArchetype('quiet_evenings'))
  assert.match(digest, /Черты: —/)
})
