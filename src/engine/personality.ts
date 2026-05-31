import type { AxisProfile, BuddyState, EmotionAxis } from '../types.js';
import type { Rng } from '../rng.js';
import { createRng, deriveSeed } from '../rng.js';
import { ARCHETYPES, ARCHETYPES_BY_ID } from '../../data/personalities.js';
import type { DialogueContext } from '../../data/personalities.js';
import { legendaryBand } from './evolution.js';
import {
  PERSONALITY_AMPLIFY_PER_STAGE,
  PERSONALITY_AMPLIFY_PER_BAND,
} from '../constants.js';

const AXES: EmotionAxis[] = ['sarcasm', 'stubbornness', 'affection', 'tenderness', 'leadership', 'responsibility'];

function clamp(v: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, v));
}

export interface RolledPersonality {
  personality: string;
  baseAxes: AxisProfile;
}

// Roll a personality for a buddy instance. Deterministic given the rng, so it's
// stable across loads (we seed from the buddyId) and reproducible in tests.
export function rollPersonality(rng: Rng): RolledPersonality {
  const archetype = rng.pick(ARCHETYPES);
  const baseAxes = {} as AxisProfile;
  for (const axis of AXES) {
    // jitter each axis ±10 so two stubborn buddies still feel like individuals
    const jitter = Math.round((rng.next() - 0.5) * 20);
    baseAxes[axis] = clamp(archetype.axes[axis] + jitter);
  }
  return { personality: archetype.id, baseAxes };
}

export function rollPersonalityForId(buddyId: string): RolledPersonality {
  return rollPersonality(createRng(deriveSeed('personality', buddyId)));
}

// How far a buddy has progressed, as an amplification factor >= 1.
function amplifyFactor(buddy: Pick<BuddyState, 'rarity' | 'evolutionStage' | 'level'>): number {
  if (buddy.rarity === 'legendary') {
    return 1 + PERSONALITY_AMPLIFY_PER_BAND * legendaryBand(buddy.level);
  }
  return 1 + PERSONALITY_AMPLIFY_PER_STAGE * buddy.evolutionStage;
}

// Evolution makes the personality MORE pronounced: axes pull away from the neutral
// midpoint of 50. High axes climb toward 100, low axes sink toward 0.
export function effectiveAxes(buddy: Pick<BuddyState, 'rarity' | 'evolutionStage' | 'level' | 'baseAxes'>): AxisProfile {
  const factor = amplifyFactor(buddy);
  const out = {} as AxisProfile;
  for (const axis of AXES) {
    out[axis] = clamp(Math.round(50 + (buddy.baseAxes[axis] - 50) * factor));
  }
  return out;
}

export function dominantAxis(axes: AxisProfile): EmotionAxis {
  let best: EmotionAxis = 'affection';
  for (const axis of AXES) {
    if (axes[axis] > axes[best]) best = axis;
  }
  return best;
}

export function archetypeName(personality: string): string {
  return ARCHETYPES_BY_ID[personality]?.name ?? 'Unknown';
}

export function archetypeDescriptor(personality: string): string {
  return ARCHETYPES_BY_ID[personality]?.descriptor ?? 'one of a kind';
}

export function archetypeExemplar(personality: string): string {
  return ARCHETYPES_BY_ID[personality]?.exemplar ?? '';
}

function substitute(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k as string] ?? `{${k}}`));
}

// Pull a context-appropriate line in the buddy's personality voice. Returns null
// when the archetype has nothing for that context (caller falls back to generic pools).
export function personalityLine(
  personality: string,
  context: DialogueContext,
  vars: Record<string, string | number>,
  rng: Rng,
): string | null {
  const arch = ARCHETYPES_BY_ID[personality];
  const pool = arch?.lines[context];
  if (!pool || pool.length === 0) return null;
  return substitute(rng.pick(pool), vars);
}

export { AXES };
