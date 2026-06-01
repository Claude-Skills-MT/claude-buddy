import type { GameState, Rarity, PullKind } from '../types.js';
import type { BuddyDef } from '../../data/buddies.js';
import { BUDDIES_BY_RARITY, BUDDIES_BY_ID } from '../../data/buddies.js';
import type { Rng } from '../rng.js';
import {
  PULL_COST_COMMON,
  PULL_COST_RARE,
  PULL_COST_LEGENDARY,
  RARE_PULL_WEIGHTS,
  COMMON_PULL_WEIGHTS,
  PITY_EPIC_THRESHOLD,
  PITY_LEGENDARY_THRESHOLD,
  DUP_COMMON_UNCOMMON_SHARDS,
  DUP_COMMON_UNCOMMON_BOND_XP,
  DUP_RARE_EPIC_RESONANCE,
  DUP_LEGENDARY_RESONANCE,
  DUP_LEGENDARY_BONUS_LEVELS,
  LEGENDARY_MAX_LEVEL,
} from '../constants.js';
import { createInitialBuddyState } from '../state.js';

export class GachaError extends Error {}

export interface PullResult {
  def: BuddyDef;
  isDuplicate: boolean;
  refundShards: number;
  resonanceGained: number;
  bonusLevels: number;
}

function pullCost(kind: PullKind): number {
  switch (kind) {
    case 'common': return PULL_COST_COMMON;
    case 'rare': return PULL_COST_RARE;
    case 'legendary': return PULL_COST_LEGENDARY;
  }
}

function selectRarity(kind: PullKind, pityEpic: number, pityLeg: number, rng: Rng): Rarity {
  if (kind === 'legendary') return 'legendary';

  if (kind === 'common') {
    return rng.weighted([
      { item: 'common' as Rarity, weight: COMMON_PULL_WEIGHTS.common },
      { item: 'uncommon' as Rarity, weight: COMMON_PULL_WEIGHTS.uncommon },
    ]);
  }

  // rare pull — check pity first (counter = N-1 means the Nth pull fires the guarantee)
  if (pityLeg >= PITY_LEGENDARY_THRESHOLD - 1) return 'legendary';
  if (pityEpic >= PITY_EPIC_THRESHOLD - 1) return 'epic';

  return rng.weighted([
    { item: 'rare' as Rarity, weight: RARE_PULL_WEIGHTS.rare },
    { item: 'epic' as Rarity, weight: RARE_PULL_WEIGHTS.epic },
    { item: 'legendary' as Rarity, weight: RARE_PULL_WEIGHTS.legendary },
  ]);
}

function selectBuddy(rarity: Rarity, rng: Rng): BuddyDef {
  const pool = BUDDIES_BY_RARITY[rarity];
  if (!pool || pool.length === 0) throw new GachaError(`Empty pool for rarity ${rarity}`);
  return rng.pick(pool);
}

function handleDuplicate(
  state: GameState,
  def: BuddyDef,
): { state: GameState; result: Pick<PullResult, 'refundShards' | 'resonanceGained' | 'bonusLevels'> } {
  let refundShards = 0;
  let resonanceGained = 0;
  let bonusLevels = 0;

  let newState = state;

  if (def.rarity === 'common' || def.rarity === 'uncommon') {
    refundShards = DUP_COMMON_UNCOMMON_SHARDS;
    newState = {
      ...newState,
      player: { ...newState.player, shardBalance: newState.player.shardBalance + refundShards },
      roster: newState.roster.map((b) =>
        b.buddyId === def.id ? { ...b, xp: b.xp + DUP_COMMON_UNCOMMON_BOND_XP } : b,
      ),
    };
  } else if (def.rarity === 'rare' || def.rarity === 'epic') {
    resonanceGained = DUP_RARE_EPIC_RESONANCE;
    newState = {
      ...newState,
      player: { ...newState.player, resonanceShards: newState.player.resonanceShards + resonanceGained },
    };
  } else if (def.rarity === 'legendary') {
    resonanceGained = DUP_LEGENDARY_RESONANCE;
    bonusLevels = DUP_LEGENDARY_BONUS_LEVELS;
    newState = {
      ...newState,
      player: { ...newState.player, resonanceShards: newState.player.resonanceShards + resonanceGained },
      roster: newState.roster.map((b) =>
        b.buddyId === def.id
          ? { ...b, level: Math.min(b.level + bonusLevels, LEGENDARY_MAX_LEVEL) }
          : b,
      ),
    };
  }

  return { state: newState, result: { refundShards, resonanceGained, bonusLevels } };
}

export function pull(
  state: GameState,
  kind: PullKind,
  rng: Rng,
): { result: PullResult; state: GameState } {
  const cost = pullCost(kind);
  if (state.player.shardBalance < cost) {
    throw new GachaError(`Insufficient shards: need ${cost}, have ${state.player.shardBalance}`);
  }

  const rarity = selectRarity(
    kind,
    state.player.pityEpicCounter,
    state.player.pityLegendaryCounter,
    rng,
  );
  const def = selectBuddy(rarity, rng);

  // Deduct cost and update pity counters
  let newPlayer = {
    ...state.player,
    shardBalance: state.player.shardBalance - cost,
    totalPulls: state.player.totalPulls + 1,
    pityEpicCounter:
      rarity === 'epic' || rarity === 'legendary' ? 0 : state.player.pityEpicCounter + 1,
    pityLegendaryCounter:
      rarity === 'legendary' ? 0 : state.player.pityLegendaryCounter + 1,
  };

  let newState: GameState = { ...state, player: newPlayer };

  const isDuplicate = state.roster.some((b) => b.buddyId === def.id);

  if (isDuplicate) {
    const { state: ds, result } = handleDuplicate(newState, def);
    return {
      result: { def, isDuplicate: true, ...result },
      state: ds,
    };
  }

  // New buddy — add to roster
  const newBuddy = createInitialBuddyState(def);
  newState = { ...newState, roster: [...newState.roster, newBuddy] };

  return {
    result: { def, isDuplicate: false, refundShards: 0, resonanceGained: 0, bonusLevels: 0 },
    state: newState,
  };
}

// Expose for tests
export { selectRarity, selectBuddy, BUDDIES_BY_ID };
