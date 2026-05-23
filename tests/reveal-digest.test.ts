import { test } from 'node:test'
import assert from 'node:assert/strict'

// Relative import with .ts extension — node:test does not resolve the webpack '@/' alias.
import { buildVibeDigest, type RevealQuestion, type RevealAnswer } from '../lib/vibe/reveal/digest.ts'

const questions: RevealQuestion[] = [
  { id: 'q1', order_num: 1, category: 'evenings', text: 'Пятничный вечер?', options: [{ key: 'a', label: 'Шумный бар' }, { key: 'c', label: 'Тихий ужин дома' }] },
  { id: 'q2', order_num: 2, category: 'evenings', text: 'Вечер не пошёл?', options: [{ key: 'a', label: 'В одиночестве' }, { key: 'b', label: 'Зову близкого' }] },
  { id: 'q5', order_num: 5, category: 'people', text: 'Незнакомец в баре?', options: [{ key: 'a', label: 'Кайф' }, { key: 'd', label: 'Не моё' }] },
]

test('groups by category in canonical order, resolves answer_key -> label', () => {
  const answers: RevealAnswer[] = [
    { question_id: 'q1', answer_key: 'c' },
    { question_id: 'q2', answer_key: 'a' },
    { question_id: 'q5', answer_key: 'd' },
  ]
  const digest = buildVibeDigest(answers, questions)
  assert.equal(
    digest,
    'Вечера:\n— Пятничный вечер?: Тихий ужин дома\n— Вечер не пошёл?: В одиночестве\n\nЛюди:\n— Незнакомец в баре?: Не моё',
  )
})

test('orders questions within a category by order_num regardless of input order', () => {
  const shuffled: RevealQuestion[] = [questions[1], questions[0]]
  const digest = buildVibeDigest(
    [{ question_id: 'q1', answer_key: 'a' }, { question_id: 'q2', answer_key: 'b' }],
    shuffled,
  )
  // q1 (order 1) must precede q2 (order 2)
  assert.ok(digest.indexOf('Пятничный') < digest.indexOf('не пошёл'))
})

test('missing answer for a question degrades to a readable note (no throw)', () => {
  const digest = buildVibeDigest([{ question_id: 'q1', answer_key: 'c' }], questions)
  assert.match(digest, /Вечер не пошёл\?: \(нет ответа\)/)
})

test('unknown answer_key degrades to a readable note', () => {
  const digest = buildVibeDigest([{ question_id: 'q1', answer_key: 'z' }], questions)
  assert.match(digest, /Пятничный вечер\?: \(неизвестный вариант: z\)/)
})

test('unknown category still renders, after the known ones, under its raw name', () => {
  const qs: RevealQuestion[] = [
    ...questions,
    { id: 'qx', order_num: 99, category: 'mystery', text: 'Что-то новое?', options: [{ key: 'a', label: 'Да' }] },
  ]
  const digest = buildVibeDigest([{ question_id: 'qx', answer_key: 'a' }], qs)
  assert.match(digest, /mystery:\n— Что-то новое\?: Да/)
  assert.ok(digest.indexOf('Вечера:') < digest.indexOf('mystery:'))
})
