import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative imports with .ts extension — node:test does not resolve the webpack '@/' alias.
import { FEED_CARDS, type FeedCardKind } from '../lib/vibe/feed/cards.ts'
import { ARCHETYPE_SLUGS } from '../lib/vibe/reveal/parse.ts'

const KINDS: readonly FeedCardKind[] = ['свидание', 'вечер', 'вылазка', 'кино', 'музыка', 'ритуал']

test('exactly 60 cards', () => {
  assert.equal(FEED_CARDS.length, 60)
})

test('exactly 6 cards per archetype, for all 10 archetypes', () => {
  for (const slug of ARCHETYPE_SLUGS) {
    const n = FEED_CARDS.filter((c) => c.archetype === slug).length
    assert.equal(n, 6, `archetype ${slug} has ${n} cards, expected 6`)
  }
})

test('every card archetype is a valid slug', () => {
  const valid = new Set<string>(ARCHETYPE_SLUGS)
  for (const c of FEED_CARDS) {
    assert.ok(valid.has(c.archetype), `invalid archetype: ${c.archetype}`)
  }
})

test('every card kind is one of the 6 kinds', () => {
  const valid = new Set<string>(KINDS)
  for (const c of FEED_CARDS) {
    assert.ok(valid.has(c.kind), `invalid kind on ${c.id}: ${c.kind}`)
  }
})

test('all ids are unique', () => {
  const ids = FEED_CARDS.map((c) => c.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('every id matches <archetype>-NN and agrees with its archetype field', () => {
  const re = /^([a-z_]+)-(\d{2})$/
  for (const c of FEED_CARDS) {
    const m = c.id.match(re)
    assert.ok(m, `id does not match <archetype>-NN: ${c.id}`)
    assert.equal(m![1], c.archetype, `id prefix ${m![1]} != archetype ${c.archetype}`)
  }
})

test('title and body are non-empty', () => {
  for (const c of FEED_CARDS) {
    assert.ok(c.title.trim().length > 0, `empty title on ${c.id}`)
    assert.ok(c.body.trim().length > 0, `empty body on ${c.id}`)
  }
})
