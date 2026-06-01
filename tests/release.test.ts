import { describe, it, expect } from 'vitest';
import { releaseValue, release, ReleaseError } from '../src/engine/release.js';
import { createInitialState, createInitialBuddyState } from '../src/state.js';
import { BUDDIES_BY_ID } from '../data/buddies.js';
import type { GameState } from '../src/types.js';

function stateWithBuddy(extraBuddyId: string): GameState {
  const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');
  const def = BUDDIES_BY_ID[extraBuddyId]!;
  return { ...s, roster: [...s.roster, createInitialBuddyState(def)] };
}

describe('releaseValue', () => {
  it('common = 20', () => expect(releaseValue('common')).toBe(20));
  it('uncommon = 20', () => expect(releaseValue('uncommon')).toBe(20));
  it('rare = 60', () => expect(releaseValue('rare')).toBe(60));
  it('epic = 120', () => expect(releaseValue('epic')).toBe(120));
  it('legendary = null', () => expect(releaseValue('legendary')).toBeNull());
});

describe('release', () => {
  it('removes buddy from roster', () => {
    const s = stateWithBuddy('compilot');
    const newState = release(s, 'compilot', false);
    expect(newState.roster.find((b) => b.buddyId === 'compilot')).toBeUndefined();
  });

  it('credits correct shard value', () => {
    const s = stateWithBuddy('compilot'); // uncommon = 20 shards
    const newState = release(s, 'compilot', false);
    expect(newState.player.shardBalance).toBe(s.player.shardBalance + 20);
  });

  it('throws for unknown buddy', () => {
    const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');
    expect(() => release(s, 'nonexistent', false)).toThrow(ReleaseError);
  });

  it('throws when releasing active buddy', () => {
    const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');
    expect(() => release(s, 'glitchlet', false)).toThrow(ReleaseError);
  });

  it('blocks legendary without double confirm', () => {
    const s = stateWithBuddy('nullgod');
    expect(() => release(s, 'nullgod', false)).toThrow('double confirmation');
  });

  it('allows legendary with double confirm', () => {
    const s = stateWithBuddy('nullgod');
    const newState = release(s, 'nullgod', true);
    expect(newState.roster.find((b) => b.buddyId === 'nullgod')).toBeUndefined();
  });

  it('rare credits 60 shards', () => {
    const s = stateWithBuddy('asyncwing'); // rare
    const newState = release(s, 'asyncwing', false);
    expect(newState.player.shardBalance).toBe(s.player.shardBalance + 60);
  });

  it('epic credits 120 shards', () => {
    const s = stateWithBuddy('voidpup'); // epic
    const newState = release(s, 'voidpup', false);
    expect(newState.player.shardBalance).toBe(s.player.shardBalance + 120);
  });
});
