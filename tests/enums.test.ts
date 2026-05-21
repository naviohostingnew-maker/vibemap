import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative import with .ts extension — node:test does not resolve the webpack '@/' alias.
import {
  QUESTION_CATEGORIES,
  ANSWER_KEYS,
  VIBE_PROFILE_STATUSES,
} from '../lib/supabase/enums.ts'

const noDupes = (arr: readonly string[]) => new Set(arr).size === arr.length

test('QUESTION_CATEGORIES: 5 unique, exact values matching DB CHECK', () => {
  assert.equal(QUESTION_CATEGORIES.length, 5)
  assert.ok(noDupes(QUESTION_CATEGORIES))
  assert.deepEqual([...QUESTION_CATEGORIES], ['evenings', 'people', 'places', 'tastes', 'pace'])
})

test('ANSWER_KEYS: exactly a,b,c,d in order', () => {
  assert.equal(ANSWER_KEYS.length, 4)
  assert.ok(noDupes(ANSWER_KEYS))
  assert.deepEqual([...ANSWER_KEYS], ['a', 'b', 'c', 'd'])
})

test('VIBE_PROFILE_STATUSES: 4 unique status-machine states', () => {
  assert.equal(VIBE_PROFILE_STATUSES.length, 4)
  assert.ok(noDupes(VIBE_PROFILE_STATUSES))
  assert.deepEqual([...VIBE_PROFILE_STATUSES], ['pending', 'generating', 'ready', 'failed'])
})
