import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative import with .ts extension — node:test does not resolve the webpack '@/' alias.
import { resolveStep, TOTAL_QUESTIONS } from '../lib/onboarding/steps.ts'

test('TOTAL_QUESTIONS = 20', () => {
  assert.equal(TOTAL_QUESTIONS, 20)
})

test('fresh user (0 answered) may only view step 1', () => {
  assert.deepEqual(resolveStep(0, 1), { kind: 'render', step: 1 })
  assert.deepEqual(resolveStep(0, 2), { kind: 'redirect', step: 1 })
})

test('mid-flow: next unanswered renders, earlier steps render (back-link)', () => {
  // answered 5 -> resume step = 6
  assert.deepEqual(resolveStep(5, 6), { kind: 'render', step: 6 }) // next unanswered
  assert.deepEqual(resolveStep(5, 3), { kind: 'render', step: 3 }) // back-link edit
  assert.deepEqual(resolveStep(5, 1), { kind: 'render', step: 1 })
})

test('skip-ahead beyond resume step redirects to resume step', () => {
  assert.deepEqual(resolveStep(5, 7), { kind: 'redirect', step: 6 })
  assert.deepEqual(resolveStep(5, 19), { kind: 'redirect', step: 6 })
})

test('below 1 / zero / negative redirects to resume step', () => {
  assert.deepEqual(resolveStep(5, 0), { kind: 'redirect', step: 6 })
  assert.deepEqual(resolveStep(5, -3), { kind: 'redirect', step: 6 })
})

test('non-integer / NaN redirects to resume step', () => {
  assert.deepEqual(resolveStep(5, 2.5), { kind: 'redirect', step: 6 })
  assert.deepEqual(resolveStep(5, Number.NaN), { kind: 'redirect', step: 6 })
})

test('last unanswered question (step 20) is reachable', () => {
  // answered 19 -> resume step = 20
  assert.deepEqual(resolveStep(19, 20), { kind: 'render', step: 20 })
  assert.deepEqual(resolveStep(19, 19), { kind: 'render', step: 19 })
})

test('all answered => complete (>= boundary incl. anomalous overflow)', () => {
  assert.deepEqual(resolveStep(20, 20), { kind: 'complete' })
  assert.deepEqual(resolveStep(20, 1), { kind: 'complete' })
  assert.deepEqual(resolveStep(21, 5), { kind: 'complete' }) // defensive >=
})
