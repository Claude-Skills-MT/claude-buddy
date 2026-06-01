import { describe, it, expect } from 'vitest';
import { applyEvent, createInitialState } from '../src/engine/events.js';
import { migrate } from '../src/persistence.js';
import type { GameState } from '../src/types.js';

function fresh(): GameState {
  const s = createInitialState('glitchlet', '2024-06-01T09:00:00Z');
  return { ...s, player: { ...s.player, shardBalance: 500 } };
}

describe('feed / buy_food events', () => {
  it('buy_food then feed lowers hunger and returns an in-voice reply', () => {
    let s = fresh();
    s = { ...s, roster: s.roster.map((b) => ({ ...b, hunger: 80 })) };
    s = applyEvent(s, { type: 'buy_food', at: '2024-06-01T09:01:00Z', foodId: 'byte-biscuit', qty: 1 }).state;
    const res = applyEvent(s, { type: 'feed', at: '2024-06-01T09:02:00Z', foodId: 'byte-biscuit' });
    expect(res.reply).toBeTruthy();
    expect(res.state.roster[0]!.hunger).toBeLessThan(80);
    expect(res.state.roster[0]!.timesFed).toBe(1);
  });

  it('feed with no foodId auto-picks from the pantry', () => {
    let s = fresh();
    s = applyEvent(s, { type: 'buy_food', at: '2024-06-01T09:01:00Z', foodId: 'glitchberry', qty: 1 }).state;
    const res = applyEvent(s, { type: 'feed', at: '2024-06-01T09:02:00Z' });
    expect(res.reply).toBeTruthy();
    expect(res.state.player.food['glitchberry']).toBe(0);
  });
});

describe('rename event', () => {
  it('sets a nickname on the active buddy', () => {
    const s = fresh();
    const res = applyEvent(s, { type: 'rename', at: '2024-06-01T09:01:00Z', nickname: 'Steve' });
    expect(res.state.roster[0]!.nickname).toBe('Steve');
  });

  it('clears the nickname when given empty string', () => {
    let s = fresh();
    s = applyEvent(s, { type: 'rename', at: '2024-06-01T09:01:00Z', nickname: 'Steve' }).state;
    s = applyEvent(s, { type: 'rename', at: '2024-06-01T09:02:00Z', nickname: '   ' }).state;
    expect(s.roster[0]!.nickname).toBeUndefined();
  });
});

describe('shared successes/failures via events', () => {
  it('build_success records a shared victory', () => {
    const s = fresh();
    const res = applyEvent(s, { type: 'build_success', at: '2024-06-01T09:05:00Z' });
    expect(res.state.roster[0]!.sharedSuccesses).toBe(1);
    expect(res.state.roster[0]!.attachment).toBeGreaterThan(0);
  });

  it('error_detected records a shared failure', () => {
    const s = fresh();
    const res = applyEvent(s, { type: 'error_detected', at: '2024-06-01T09:05:00Z' });
    expect(res.state.roster[0]!.sharedFailures).toBe(1);
  });

  it('test_fail records a failure and replies in voice', () => {
    const s = fresh();
    const res = applyEvent(s, { type: 'test_fail', at: '2024-06-01T09:05:00Z' });
    expect(res.state.roster[0]!.sharedFailures).toBe(1);
    expect(res.comment).toBeTruthy();
  });
});

describe('migration v1 -> v2', () => {
  it('backfills emotional fields while preserving progress', () => {
    const v1 = {
      version: 1,
      activeBuddy: 'glitchlet',
      roster: [{
        buddyId: 'glitchlet', currentForm: 'Glitchara', rarity: 'common',
        evolutionStage: 2, level: 1, tameHours: 42, xp: 3200,
        traitPrimary: 'Chaotic', mood: 'engaged', moodSince: '2024-01-01T00:00:00Z',
        accessoriesUnlocked: ['glitch-sparks'], bondMilestones: ['name', 'rarePool'],
      }],
      player: {
        shardBalance: 250, resonanceShards: 3, pityEpicCounter: 4, pityLegendaryCounter: 12,
        streakDays: 9, lastSessionDate: '2024-05-30', rosterRoastFiredToday: false,
        comebackGiftGiven: false, midnightBuildDays: 1, totalPulls: 20,
      },
      session: { sessionStart: '2024-05-30T10:00:00Z', sessionSwapCount: 0, swapDates: {}, errorStreakActive: false, eventIndex: 0 },
    };

    const migrated = migrate(v1);
    expect(migrated.version).toBe(2);
    // progress preserved
    expect(migrated.roster[0]!.xp).toBe(3200);
    expect(migrated.roster[0]!.tameHours).toBe(42);
    expect(migrated.player.shardBalance).toBe(250);
    // new fields backfilled
    expect(migrated.roster[0]!.personality).toBeTruthy();
    expect(migrated.roster[0]!.baseAxes).toBeDefined();
    expect(migrated.roster[0]!.attachment).toBe(0);
    expect(migrated.roster[0]!.hunger).toBe(0);
    expect(migrated.player.food).toEqual({});
  });

  it('v2 state passes through unchanged', () => {
    const s = createInitialState('glitchlet', '2024-06-01T09:00:00Z');
    expect(migrate(s)).toEqual(s);
  });
});
