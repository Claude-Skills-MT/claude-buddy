import type { GameState, BuddyState, PlayerState, SessionState } from './types.js';
import type { BuddyDef } from '../data/buddies.js';
import { BUDDIES_BY_ID } from '../data/buddies.js';
import { STATE_VERSION } from './constants.js';

export function createInitialBuddyState(def: BuddyDef): BuddyState {
  const form = def.forms[0];
  return {
    buddyId: def.id,
    currentForm: form?.name ?? def.id,
    rarity: def.rarity,
    evolutionStage: 0,
    level: 1,
    tameHours: 0,
    xp: 0,
    traitPrimary: def.traitPrimary,
    traitSecondary: undefined,
    traitTertiary: undefined,
    mood: 'bored',
    moodSince: new Date().toISOString(),
    accessoriesUnlocked: [],
    bondMilestones: [],
  };
}

export function createInitialPlayerState(): PlayerState {
  return {
    shardBalance: 0,
    resonanceShards: 0,
    pityEpicCounter: 0,
    pityLegendaryCounter: 0,
    streakDays: 0,
    lastSessionDate: '',
    rosterRoastFiredToday: false,
    comebackGiftGiven: false,
    midnightBuildDays: 0,
    totalPulls: 0,
  };
}

export function createInitialSessionState(nowIso: string): SessionState {
  return {
    sessionStart: nowIso,
    sessionSwapCount: 0,
    swapDates: {},
    flowStartAt: undefined,
    lastCommentAt: undefined,
    errorStreakActive: false,
    eventIndex: 0,
  };
}

export function createInitialState(starterBuddyId: string, nowIso: string): GameState {
  const def = BUDDIES_BY_ID[starterBuddyId];
  if (!def) throw new Error(`Unknown buddy id: ${starterBuddyId}`);
  const buddy = createInitialBuddyState(def);
  return {
    version: STATE_VERSION,
    activeBuddy: starterBuddyId,
    roster: [buddy],
    player: createInitialPlayerState(),
    session: createInitialSessionState(nowIso),
  };
}
