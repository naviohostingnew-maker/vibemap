import { z } from 'zod'

// Canonical list of valid archetype slugs — the contract the LLM output must
// satisfy, mirrored by the user_vibe_profile.archetype CHECK (migration 016).
// It lives here, beside the validator that enforces it, so this module keeps to
// bare-specifier imports only (zod) and stays loadable standalone by node:test
// (no '@/' alias, no extensionless relative imports). Display metadata (names,
// signals) hangs off these slugs in ./archetypes.
export const ARCHETYPE_SLUGS = [
  'quiet_evenings',
  'midnight_wanderer',
  'life_of_gathering',
  'horizon_seeker',
  'depth_seeker',
  'impression_collector',
  'rhythm_architect',
  'free_spirit',
  'warm_circle',
  'urban_romantic',
] as const

export type ArchetypeSlug = (typeof ARCHETYPE_SLUGS)[number]

// Structured Reveal output (decision Ф1б): the LLM must return exactly this shape.
// Zod is the gate — anything off-shape fails parsing, and the route marks the
// profile 'failed' rather than persisting garbage.
export const vibeProfileSchema = z.object({
  vibe_title: z.string().trim().min(1),
  vibe_summary: z.string().trim().min(1),
  traits: z.array(z.string().trim().min(1)).min(3).max(5),
  volly_note: z.string().trim().min(1),
  archetype: z.enum(ARCHETYPE_SLUGS),
})

export type VibeProfile = z.infer<typeof vibeProfileSchema>

export type ParseResult = { ok: true; profile: VibeProfile } | { ok: false; error: string }

// Tolerant extraction: the prompt forbids markdown, but models occasionally wrap
// JSON in a ```json fence or add a stray sentence. Strip a fence if present, else
// fall back to the first '{' .. last '}' span. Strict JSON.parse still gates validity.
function extractJsonText(raw: string): string {
  const trimmed = raw.trim()
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = (fence ? fence[1] : trimmed).trim()
  if (body.startsWith('{') && body.endsWith('}')) return body
  const first = body.indexOf('{')
  const last = body.lastIndexOf('}')
  return first !== -1 && last > first ? body.slice(first, last + 1) : body
}

export function parseVibeProfile(raw: string): ParseResult {
  let json: unknown
  try {
    json = JSON.parse(extractJsonText(raw))
  } catch {
    return { ok: false, error: 'invalid JSON' }
  }
  const result = vibeProfileSchema.safeParse(json)
  if (!result.success) {
    const error = result.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ')
    return { ok: false, error }
  }
  return { ok: true, profile: result.data }
}
