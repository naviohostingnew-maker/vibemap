import { ARCHETYPE_SLUGS, type ArchetypeSlug } from './parse'

// Display metadata for the 10 vibe archetypes (finalized taxonomy, claude_state
// decision 2026-05-23). The slug list is single-sourced in ./parse (beside the
// validator + DB CHECK); here we attach a Russian name, the selection signal the
// LLM uses to choose, and the static hero image (Ф2=C: archetype -> one asset,
// no per-user runtime generation). Record<ArchetypeSlug, …> makes the compiler
// require an entry for every slug and reject typos/extras — coverage is enforced
// at build time, so metadata and the enum can never drift.
const ARCHETYPE_META: Record<ArchetypeSlug, { name: string; signal: string; image: string }> = {
  quiet_evenings: { name: 'Хранитель тихих вечеров', signal: 'вечера дома, узкий круг, знакомые места, спокойный темп, ритуал', image: '/archetypes/quiet_evenings.webp' },
  midnight_wanderer: { name: 'Полуночный странник', signal: 'поздние вечера, городские места, динамика, открытость новому', image: '/archetypes/midnight_wanderer.webp' },
  life_of_gathering: { name: 'Душа компании', signal: 'большие компании, людные места, динамика, вечера-события', image: '/archetypes/life_of_gathering.webp' },
  horizon_seeker: { name: 'Искатель горизонтов', signal: 'открытые/природные места, путешествия, динамика, исследование', image: '/archetypes/horizon_seeker.webp' },
  depth_seeker: { name: 'Ценитель глубины', signal: 'камерность, спокойствие, разговоры/идеи, узкий круг', image: '/archetypes/depth_seeker.webp' },
  impression_collector: { name: 'Коллекционер впечатлений', signal: 'культурные места, искусство/стиль во вкусах, курируемость', image: '/archetypes/impression_collector.webp' },
  rhythm_architect: { name: 'Архитектор ритма', signal: 'план > спонтанность, структурный темп, повторяемые места, ритуал', image: '/archetypes/rhythm_architect.webp' },
  free_spirit: { name: 'Свободная душа', signal: 'открытость, креативные/выразительные вкусы, нелинейный темп, спонтанность', image: '/archetypes/free_spirit.webp' },
  warm_circle: { name: 'Тёплый круг', signal: 'близкий круг, тёплые вечера, баланс темпа, уютные места', image: '/archetypes/warm_circle.webp' },
  urban_romantic: { name: 'Городской романтик', signal: 'городские места но камерно, смакование, спокойно-динамичный микс', image: '/archetypes/urban_romantic.webp' },
}

export type Archetype = { slug: ArchetypeSlug; name: string; signal: string; image: string }

// Canonical-ordered list (follows ARCHETYPE_SLUGS) for prompt rendering.
export const ARCHETYPES: readonly Archetype[] = ARCHETYPE_SLUGS.map((slug) => ({
  slug,
  ...ARCHETYPE_META[slug],
}))
