// Pure transform: 20 onboarding answers + the question bank -> a human-readable
// Russian digest grouped by the 5 categories. This is what the Reveal LLM reads
// instead of raw answer_keys. No DB, no I/O, no JSX — unit-testable via node:test
// (relative import). The route fetches the rows and hands them here.

export type RevealOption = { key: string; label: string }
export type RevealQuestion = {
  id: string
  order_num: number
  category: string
  text: string
  options: RevealOption[]
}
export type RevealAnswer = { question_id: string; answer_key: string }

// Display order + Russian headings for the 5 fixed categories. An unknown
// category (schema drift) still renders, under its raw name, at the end.
const CATEGORY_ORDER = ['evenings', 'people', 'places', 'tastes', 'pace'] as const
const CATEGORY_TITLE: Record<string, string> = {
  evenings: 'Вечера',
  people: 'Люди',
  places: 'Места',
  tastes: 'Вкусы',
  pace: 'Темп',
}

// Resolves the chosen option's label for a question; defensive on a missing or
// unknown answer_key so a data gap degrades to a readable note, never a throw.
function resolveLabel(q: RevealQuestion, answerKey: string | undefined): string {
  if (answerKey === undefined) return '(нет ответа)'
  const opt = q.options.find((o) => o.key === answerKey)
  return opt ? opt.label : `(неизвестный вариант: ${answerKey})`
}

export function buildVibeDigest(answers: RevealAnswer[], questions: RevealQuestion[]): string {
  const answerByQuestion = new Map(answers.map((a) => [a.question_id, a.answer_key] as const))

  // Group questions by category, each sorted by its position in the flow.
  const byCategory = new Map<string, RevealQuestion[]>()
  for (const q of questions) {
    const bucket = byCategory.get(q.category)
    if (bucket) bucket.push(q)
    else byCategory.set(q.category, [q])
  }
  byCategory.forEach((bucket) => bucket.sort((a, b) => a.order_num - b.order_num))

  // Known categories first in canonical order, then any unexpected ones.
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => byCategory.has(c)),
    ...Array.from(byCategory.keys()).filter(
      (c) => !CATEGORY_ORDER.includes(c as (typeof CATEGORY_ORDER)[number]),
    ),
  ]

  const sections = orderedCategories.map((category) => {
    const title = CATEGORY_TITLE[category] ?? category
    const lines = byCategory
      .get(category)!
      .map((q) => `— ${q.text}: ${resolveLabel(q, answerByQuestion.get(q.id))}`)
    return `${title}:\n${lines.join('\n')}`
  })

  return sections.join('\n\n')
}
