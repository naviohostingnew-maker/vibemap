import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative imports with .ts extension — node:test does not resolve the webpack '@/' alias.
import { parseFeedComments } from '../lib/vibe/feed/parse.ts'
import { feedCardsForArchetype } from '../lib/vibe/feed/cards.ts'

const EXPECTED = feedCardsForArchetype('quiet_evenings').map((c) => c.id)

// A valid batch: a comment for each of the 6 quiet_evenings cards.
const valid: Record<string, string> = Object.fromEntries(
  EXPECTED.map((id, i) => [id, `Комментарий Volly ${i + 1}`]),
)

test('valid batch parses and returns all 6 comments', () => {
  const r = parseFeedComments(JSON.stringify(valid), EXPECTED)
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(Object.keys(r.comments).length, 6)
})

test('extracts JSON wrapped in a ```json markdown fence', () => {
  const fenced = '```json\n' + JSON.stringify(valid) + '\n```'
  const r = parseFeedComments(fenced, EXPECTED)
  assert.equal(r.ok, true)
})

test('extracts JSON despite a stray preamble sentence', () => {
  const noisy = 'Вот комментарии: ' + JSON.stringify(valid)
  const r = parseFeedComments(noisy, EXPECTED)
  assert.equal(r.ok, true)
})

test('invalid JSON -> ok:false', () => {
  const r = parseFeedComments('{ not json', EXPECTED)
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /invalid JSON/)
})

test('missing a card_id -> ok:false', () => {
  const { [EXPECTED[0]]: _drop, ...rest } = valid
  void _drop
  const r = parseFeedComments(JSON.stringify(rest), EXPECTED)
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /missing card_id/)
})

test('unknown card_id (not a card at all) -> ok:false (unexpected)', () => {
  const r = parseFeedComments(JSON.stringify({ ...valid, 'not_a_card-99': 'x' }), EXPECTED)
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /unexpected card_id/)
})

test('valid id from a different archetype -> ok:false (unexpected)', () => {
  const otherId = feedCardsForArchetype('life_of_gathering')[0].id
  const r = parseFeedComments(JSON.stringify({ ...valid, [otherId]: 'x' }), EXPECTED)
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /unexpected card_id/)
})

test('empty / whitespace-only comment -> ok:false', () => {
  const r = parseFeedComments(JSON.stringify({ ...valid, [EXPECTED[0]]: '   ' }), EXPECTED)
  assert.equal(r.ok, false)
})
