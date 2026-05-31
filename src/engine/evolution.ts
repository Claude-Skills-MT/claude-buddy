import type { BuddyState } from '../types.js';
import type { BuddyDef } from '../../data/buddies.js';
import {
  EVOLVE_THREE_STAGE_1,
  EVOLVE_THREE_STAGE_2,
  EVOLVE_TWO_STAGE_1,
  LEGENDARY_BAND_1_MAX,
  LEGENDARY_BAND_2_MAX,
  LEGENDARY_BAND_3_MAX,
  LEGENDARY_MAX_LEVEL,
} from '../constants.js';

export type LegendaryBand = 0 | 1 | 2 | 3;

export function legendaryBand(level: number): LegendaryBand {
  if (level <= LEGENDARY_BAND_1_MAX) return 0;
  if (level <= LEGENDARY_BAND_2_MAX) return 1;
  if (level <= LEGENDARY_BAND_3_MAX) return 2;
  return 3;
}

export function legendaryLevel(tameHours: number): number {
  return Math.min(Math.max(1, Math.floor(tameHours) + 1), LEGENDARY_MAX_LEVEL);
}

export function evolve(buddy: BuddyState, def: BuddyDef): BuddyState {
  if (def.evolutionType === 'three-stage') {
    let stage = buddy.evolutionStage;
    if (buddy.tameHours >= EVOLVE_THREE_STAGE_2) stage = 2;
    else if (buddy.tameHours >= EVOLVE_THREE_STAGE_1) stage = 1;

    if (stage === buddy.evolutionStage) return buddy;
    const form = def.forms[stage];
    const currentForm = form?.name ?? buddy.currentForm;
    const traitSecondary = stage >= 1 ? def.traitSecondary : undefined;
    return { ...buddy, evolutionStage: stage, currentForm, traitSecondary };
  }

  if (def.evolutionType === 'two-stage') {
    if (buddy.evolutionStage >= 1 || buddy.tameHours < EVOLVE_TWO_STAGE_1) return buddy;
    const form = def.forms[1];
    const currentForm = form?.name ?? buddy.currentForm;
    const traitSecondary = def.traitSecondary;
    return { ...buddy, evolutionStage: 1, currentForm, traitSecondary };
  }

  if (def.evolutionType === 'level-based') {
    const level = legendaryLevel(buddy.tameHours);
    const band = legendaryBand(level);
    const form = def.forms[band];
    const currentForm = form?.name ?? buddy.currentForm;
    const traitSecondary = band >= 1 ? def.traitSecondary : undefined;
    const traitTertiary = band >= 2 ? def.traitTertiary : undefined;
    const awakenedAt = band >= 3 && !buddy.awakenedAt ? new Date().toISOString() : buddy.awakenedAt;
    return { ...buddy, level, currentForm, traitSecondary, traitTertiary, awakenedAt };
  }

  return buddy;
}
