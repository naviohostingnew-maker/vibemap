import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative import with .ts extension — node:test does not resolve the webpack '@/' alias.
import { parseVibeProfile } from '../lib/vibe/reveal/parse.ts'

const valid = {
  vibe_title: 'Тёплый свет на кухне',
  vibe_summary: 'Ты ценишь уют и узкий круг. Вечера дома заряжают сильнее любой движухи.',
  traits: ['домашний', 'верный узкому кругу', 'спокойный'],
  volly_note: 'Я уже вижу, что тебе важна камерность — буду беречь это.',
  archetype: 'quiet_evenings',
}

test('valid profile parses and returns typed data', () => {
  const r = parseVibeProfile(JSON.stringify(valid))
  assert.equal(r.ok, true)
  if (r.ok) {
    assert.equal(r.profile.archetype, 'quiet_evenings')
    assert.equal(r.profile.traits.length, 3)
  }
})

test('extracts JSON wrapped in a ```json markdown fence', () => {
  const fenced = '```json\n' + JSON.stringify(valid) + '\n```'
  const r = parseVibeProfile(fenced)
  assert.equal(r.ok, true)
})

test('extracts JSON despite a stray preamble sentence', () => {
  const noisy = 'Вот профиль: ' + JSON.stringify(valid)
  const r = parseVibeProfile(noisy)
  assert.equal(r.ok, true)
})

test('invalid JSON -> ok:false', () => {
  const r = parseVibeProfile('{ this is not json')
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /invalid JSON/)
})

test('archetype outside the enum -> ok:false', () => {
  const r = parseVibeProfile(JSON.stringify({ ...valid, archetype: 'spontaneous_master' }))
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /archetype/)
})

test('traits below 3 -> ok:false', () => {
  const r = parseVibeProfile(JSON.stringify({ ...valid, traits: ['один', 'два'] }))
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /traits/)
})

test('traits above 5 -> ok:false', () => {
  const r = parseVibeProfile(JSON.stringify({ ...valid, traits: ['1', '2', '3', '4', '5', '6'] }))
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /traits/)
})

test('missing required field -> ok:false', () => {
  const { volly_note, ...withoutNote } = valid
  void volly_note
  const r = parseVibeProfile(JSON.stringify(withoutNote))
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /volly_note/)
})

test('empty / whitespace-only string field -> ok:false', () => {
  const r = parseVibeProfile(JSON.stringify({ ...valid, vibe_title: '   ' }))
  assert.equal(r.ok, false)
  if (!r.ok) assert.match(r.error, /vibe_title/)
})
