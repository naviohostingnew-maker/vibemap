import { z } from 'zod'

// Parser + Zod gate for the feed-comment LLM output. Mirrors lib/vibe/reveal/parse.ts:
// tolerant JSON extraction, strict validation, the route marks the row 'failed'
// rather than persisting garbage. Like reveal/parse.ts this module imports only the
// bare 'zod' specifier (no relative value import) so it loads standalone under
// node:test (--experimental-strip-types). The set of valid ids is the caller's
// `expectedIds` — the 6 cards of the user's archetype, derived from FEED_CARDS in the
// route; folding the global-vs-archetype distinction into one "unexpected" check keeps
// this module free of a cards.ts value import.

// Batch of comments: an object keyed by card_id, each value a non-empty string.
const feedCommentsSchema = z.record(z.string(), z.string().trim().min(1))

export type FeedComments = Record<string, string>
export type FeedParseResult =
  | { ok: true; comments: FeedComments }
  | { ok: false; error: string }

// Tolerant extraction (same shape as reveal/parse): strip a ```json fence if present,
// else fall back to the first '{' .. last '}' span. Strict JSON.parse still gates.
function extractJsonText(raw: string): string {
  const trimmed = raw.trim()
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = (fence ? fence[1] : trimmed).trim()
  if (body.startsWith('{') && body.endsWith('}')) return body
  const first = body.indexOf('{')
  const last = body.lastIndexOf('}')
  return first !== -1 && last > first ? body.slice(first, last + 1) : body
}

// `expectedIds` are the ids of the 6 cards of the user's archetype — the batch must
// cover exactly those: every key expected (an unknown id or one from another archetype
// is "unexpected"), none missing.
export function parseFeedComments(raw: string, expectedIds: string[]): FeedParseResult {
  let json: unknown
  try {
    json = JSON.parse(extractJsonText(raw))
  } catch {
    return { ok: false, error: 'invalid JSON' }
  }

  const result = feedCommentsSchema.safeParse(json)
  if (!result.success) {
    const error = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ')
    return { ok: false, error }
  }

  const keys = Object.keys(result.data)
  const expected = new Set(expectedIds)

  const unexpected = keys.filter((k) => !expected.has(k))
  if (unexpected.length) return { ok: false, error: `unexpected card_id: ${unexpected.join(', ')}` }

  const missing = expectedIds.filter((id) => !(id in result.data))
  if (missing.length) return { ok: false, error: `missing card_id: ${missing.join(', ')}` }

  return { ok: true, comments: result.data }
}
