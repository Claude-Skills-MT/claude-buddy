import type { GameState, Rarity } from '../types.js';
import {
  RELEASE_VALUE_COMMON,
  RELEASE_VALUE_UNCOMMON,
  RELEASE_VALUE_RARE,
  RELEASE_VALUE_EPIC,
} from '../constants.js';

export function releaseValue(rarity: Rarity): number | null {
  switch (rarity) {
    case 'common': return RELEASE_VALUE_COMMON;
    case 'uncommon': return RELEASE_VALUE_UNCOMMON;
    case 'rare': return RELEASE_VALUE_RARE;
    case 'epic': return RELEASE_VALUE_EPIC;
    case 'legendary': return null;
  }
}

export class ReleaseError extends Error {}

export function release(state: GameState, buddyId: string, confirmTwice: boolean): GameState {
  const buddy = state.roster.find((b) => b.buddyId === buddyId);
  if (!buddy) throw new ReleaseError(`Buddy ${buddyId} not in roster`);
  if (buddy.rarity === 'legendary' && !confirmTwice) {
    throw new ReleaseError('Releasing a legendary requires double confirmation');
  }
  if (buddyId === state.activeBuddy) {
    throw new ReleaseError('Cannot release the active buddy');
  }

  const value = releaseValue(buddy.rarity) ?? 0;
  return {
    ...state,
    roster: state.roster.filter((b) => b.buddyId !== buddyId),
    player: {
      ...state.player,
      shardBalance: state.player.shardBalance + value,
    },
  };
}
