import type { GameState } from '../types.js';
import type { Rng } from '../rng.js';
import { BUDDIES_BY_ID } from '../../data/buddies.js';
import { createInitialBuddyState } from '../state.js';
import {
  RESONANCE_ACCESSORY,
  RESONANCE_VARIANT,
  RESONANCE_FORCE_UNLOCK,
} from '../constants.js';

export type ResonanceUnlock = 'accessory' | 'variant' | 'force_unlock';

export function availableResonanceUnlocks(resonanceShards: number): ResonanceUnlock[] {
  const unlocks: ResonanceUnlock[] = [];
  if (resonanceShards >= RESONANCE_ACCESSORY) unlocks.push('accessory');
  if (resonanceShards >= RESONANCE_VARIANT) unlocks.push('variant');
  if (resonanceShards >= RESONANCE_FORCE_UNLOCK) unlocks.push('force_unlock');
  return unlocks;
}

export class ResonanceError extends Error {}

export function forceUnlock(state: GameState, buddyId: string, _rng: Rng): GameState {
  if (state.player.resonanceShards < RESONANCE_FORCE_UNLOCK) {
    throw new ResonanceError(
      `Need ${RESONANCE_FORCE_UNLOCK} resonance shards, have ${state.player.resonanceShards}`,
    );
  }
  const def = BUDDIES_BY_ID[buddyId];
  if (!def) throw new ResonanceError(`Unknown buddy: ${buddyId}`);
  if (state.roster.some((b) => b.buddyId === buddyId)) {
    throw new ResonanceError(`${buddyId} already in roster`);
  }

  const newBuddy = createInitialBuddyState(def);
  return {
    ...state,
    player: {
      ...state.player,
      resonanceShards: state.player.resonanceShards - RESONANCE_FORCE_UNLOCK,
    },
    roster: [...state.roster, newBuddy],
  };
}
