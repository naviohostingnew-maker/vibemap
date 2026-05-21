// Union types derived from schema `vibemap` CHECK constraints.
// Kept separate from generated types.ts (which has no enum unions for these fields).
// bookings.{kind,provider,status} intentionally left as string — no DB CHECK yet
// (schema-debt, claude_state.tasks/vibemap, target 0.2.0).

export type ExperienceKind = 'event' | 'restaurant' | 'hotel' | 'tour' | 'activity'

export type FriendSource = 'contacts' | 'invite' | 'shared_activity' | 'discovery_match'

export type FriendStatus = 'pending' | 'active' | 'blocked'

export type MatchOutcome = 'mutual_yes' | 'one_declined' | 'both_declined' | 'met' | 'closed'

// Applies to both matches.status_a and matches.status_b (identical CHECK sets).
export type MatchParticipantStatus = 'pending' | 'accepted' | 'declined'

export type RecommendationOutcome = 'ignored' | 'viewed' | 'booked' | 'rejected'

export type ReflectionFeeling = 'fire' | 'neutral' | 'not_clicked'

export type VibeMemoryType = 'episodic' | 'semantic' | 'procedural' | 'social'

// Onboarding layer (migration 015). CHECK-backed; runtime const arrays so server
// actions can validate (Zod) against the same source the types derive from.
export const QUESTION_CATEGORIES = ['evenings', 'people', 'places', 'tastes', 'pace'] as const
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number]

export const ANSWER_KEYS = ['a', 'b', 'c', 'd'] as const
export type AnswerKey = (typeof ANSWER_KEYS)[number]

export const VIBE_PROFILE_STATUSES = ['pending', 'generating', 'ready', 'failed'] as const
export type VibeProfileStatus = (typeof VIBE_PROFILE_STATUSES)[number]
