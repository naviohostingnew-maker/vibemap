import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative import with .ts extension — node:test does not resolve the '@/' alias.
import { splitAccent } from '../lib/ui/accent.ts'

test('splitAccent: cyrillic sentence-initial accent at index 0 (case-sensitive)', () => {
  // Mirrors a 20Q seed accent_word — capitalised, first token.
  assert.deepEqual(splitAccent('Близкие или незнакомцы', 'Близкие'), {
    before: '',
    match: 'Близкие',
    after: ' или незнакомцы',
  })
})

test('splitAccent: latin accent inside cyrillic text (Welcome H1)', () => {
  assert.deepEqual(splitAccent('Привет, я Volly.', 'Volly'), {
    before: 'Привет, я ',
    match: 'Volly',
    after: '.',
  })
})

test('splitAccent: case-sensitive miss returns null', () => {
  assert.equal(splitAccent('Близкие или незнакомцы', 'близкие'), null)
})

test('splitAccent: absent accent returns null', () => {
  assert.equal(splitAccent('20 коротких вопросов', 'длинных'), null)
})

test('splitAccent: empty accent returns null', () => {
  assert.equal(splitAccent('что угодно', ''), null)
})

test('splitAccent: splits on first of multiple occurrences', () => {
  assert.deepEqual(splitAccent('Volly зовёт Volly', 'Volly'), {
    before: '',
    match: 'Volly',
    after: ' зовёт Volly',
  })
})
