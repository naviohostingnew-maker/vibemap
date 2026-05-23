import Anthropic from '@anthropic-ai/sdk';

// Lazy singleton — the key is read at call time, not module load, so `next build`
// (page-data collection for /api/vibe) doesn't require ANTHROPIC_API_KEY. The old
// top-level throw + `new Anthropic(...)` broke the build in any environment without
// the key (latent since Sprint 0.3, masked locally by .env.local; surfaced on the
// Vercel deploy, where the personal-billing key is intentionally absent).
let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const VIBE_MODEL = 'claude-opus-4-7';

// Reveal vibe-profile generation runs on Sonnet (decision Ф1а: low-frequency,
// showcase-quality call — quality over economy). Kept as its own constant so
// tuning the Reveal model never shifts the Sprint-0 tool-use agent (VIBE_MODEL,
// Opus) and vice versa.
export const REVEAL_MODEL = 'claude-sonnet-4-6';
