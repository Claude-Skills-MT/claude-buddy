import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import type { GameState, BuddyState } from './types.js';
import { createInitialState, createEmptyState } from './state.js';
import { STATE_VERSION } from './constants.js';
import { rollPersonalityForId } from './engine/personality.js';

const DEFAULT_BUDDY = 'glitchlet';

export function statePath(): string {
  return process.env['CLAUDE_BUDDY_STATE'] ?? join(homedir(), '.claude-buddy', 'state.json');
}

// Backfill the emotional-attachment fields onto a pre-v2 buddy without losing its
// progress. Personality is rolled deterministically from the buddyId so it's stable.
function backfillBuddy(raw: Partial<BuddyState> & { buddyId: string }): BuddyState {
  const rolled = rollPersonalityForId(raw.buddyId);
  return {
    ...raw,
    personality: raw.personality ?? rolled.personality,
    baseAxes: raw.baseAxes ?? rolled.baseAxes,
    attachment: raw.attachment ?? 0,
    sharedSuccesses: raw.sharedSuccesses ?? 0,
    sharedFailures: raw.sharedFailures ?? 0,
    hunger: raw.hunger ?? 0,
    timesFed: raw.timesFed ?? 0,
  } as BuddyState;
}

export function migrate(raw: unknown): GameState {
  if (typeof raw !== 'object' || raw === null) {
    return createInitialState(DEFAULT_BUDDY, new Date().toISOString());
  }
  const r = raw as Record<string, unknown>;
  const version = (r['version'] as number) ?? 0;

  if (version === STATE_VERSION) return raw as GameState;

  // v1 -> v2: add the emotional-attachment layer. Preserve all existing progress.
  if (version === 1 && Array.isArray(r['roster']) && typeof r['player'] === 'object') {
    const player = r['player'] as Record<string, unknown>;
    return {
      ...(raw as GameState),
      version: STATE_VERSION,
      roster: (r['roster'] as (Partial<BuddyState> & { buddyId: string })[]).map(backfillBuddy),
      player: { ...(player as unknown as GameState['player']), food: (player['food'] as Record<string, number>) ?? {} },
    };
  }

  // Unknown/older shape — start fresh.
  return createInitialState(DEFAULT_BUDDY, new Date().toISOString());
}

export function loadState(path?: string): GameState {
  const p = path ?? statePath();
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    return migrate(raw);
  } catch {
    // No state file yet — return empty state so the user goes through starter flow.
    return createEmptyState(new Date().toISOString());
  }
}

export function saveState(state: GameState, path?: string): void {
  const p = path ?? statePath();
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 2), 'utf8');
}
