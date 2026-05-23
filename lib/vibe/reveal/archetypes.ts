import { ARCHETYPE_SLUGS, type ArchetypeSlug } from './parse'

// Display metadata for the 10 vibe archetypes (finalized taxonomy, claude_state
// decision 2026-05-23). The slug list is single-sourced in ./parse (beside the
// validator + DB CHECK); here we only attach a Russian name and the selection
// signal the LLM uses to choose. Record<ArchetypeSlug, …> makes the compiler
// require an entry for every slug and reject typos/extras — coverage is enforced
// at build time, so metadata and the enum can never drift.
const ARCHETYPE_META: Record<ArchetypeSlug, { name: string; signal: string }> = {
  quiet_evenings: { name: 'Хранитель тихих вечеров', signal: 'вечера дома, узкий круг, знакомые места, спокойный темп, ритуал' },
  midnight_wanderer: { name: 'Полуночный странник', signal: 'поздние вечера, городские места, динамика, открытость новому' },
  life_of_gathering: { name: 'Душа компании', signal: 'большие компании, людные места, динамика, вечера-события' },
  horizon_seeker: { name: 'Искатель горизонтов', signal: 'открытые/природные места, путешествия, динамика, исследование' },
  depth_seeker: { name: 'Ценитель глубины', signal: 'камерность, спокойствие, разговоры/идеи, узкий круг' },
  impression_collector: { name: 'Коллекционер впечатлений', signal: 'культурные места, искусство/стиль во вкусах, курируемость' },
  rhythm_architect: { name: 'Архитектор ритма', signal: 'план > спонтанность, структурный темп, повторяемые места, ритуал' },
  free_spirit: { name: 'Свободная душа', signal: 'открытость, креативные/выразительные вкусы, нелинейный темп, спонтанность' },
  warm_circle: { name: 'Тёплый круг', signal: 'близкий круг, тёплые вечера, баланс темпа, уютные места' },
  urban_romantic: { name: 'Городской романтик', signal: 'городские места но камерно, смакование, спокойно-динамичный микс' },
}

export type Archetype = { slug: ArchetypeSlug; name: string; signal: string }

// Canonical-ordered list (follows ARCHETYPE_SLUGS) for prompt rendering.
export const ARCHETYPES: readonly Archetype[] = ARCHETYPE_SLUGS.map((slug) => ({
  slug,
  ...ARCHETYPE_META[slug],
}))
