export { applyEvent, createInitialState } from './engine/events.js';
export type { PetEvent, ApplyResult } from './engine/events.js';
export { render, renderCollection } from './render.js';
export { loadState, saveState, statePath } from './persistence.js';
export { appraiseBuddy } from './engine/appraise.js';
export { attachmentTier, hungerTier, hearts } from './engine/attachment.js';
export { effectiveAxes, archetypeName } from './engine/personality.js';
export { chooseFoodForBuddy } from './engine/store.js';
export type { GameState, BuddyState, PlayerState, SessionState, Mood, Rarity, PullKind, Trigger, AxisProfile } from './types.js';
