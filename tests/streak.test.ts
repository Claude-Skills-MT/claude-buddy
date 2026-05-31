import { describe, it, expect } from 'vitest';
import { updateStreak, streakMultiplier, comebackTier, comebackGift } from '../src/engine/streak.js';
import type { PlayerState } from '../src/types.js';

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    shardBalance: 100,
    resonanceShards: 0,
    pityEpicCounter: 0,
    pityLegendaryCounter: 0,
    streakDays: 1,
    lastSessionDate: '2024-01-01',
    rosterRoastFiredToday: false,
    comebackGiftGiven: false,
    midnightBuildDays: 0,
    totalPulls: 0,
    ...overrides,
  };
}

describe('updateStreak', () => {
  it('first session sets streak to 1', () => {
    const p = makePlayer({ lastSessionDate: '', streakDays: 0 });
    const { player, broke, daysMissed } = updateStreak(p, '2024-01-01');
    expect(player.streakDays).toBe(1);
    expect(broke).toBe(false);
    expect(daysMissed).toBe(0);
  });

  it('consecutive day increments streak', () => {
    const p = makePlayer({ lastSessionDate: '2024-01-01', streakDays: 3 });
    const { player, broke } = updateStreak(p, '2024-01-02');
    expect(player.streakDays).toBe(4);
    expect(broke).toBe(false);
  });

  it('same day does not increment', () => {
    const p = makePlayer({ lastSessionDate: '2024-01-01', streakDays: 5 });
    const { player, broke } = updateStreak(p, '2024-01-01');
    expect(player.streakDays).toBe(5);
    expect(broke).toBe(false);
  });

  it('missing 1 day breaks streak, daysMissed = 1', () => {
    const p = makePlayer({ lastSessionDate: '2024-01-01', streakDays: 7 });
    const { player, broke, daysMissed } = updateStreak(p, '2024-01-03');
    expect(broke).toBe(true);
    expect(daysMissed).toBe(1);
    expect(player.streakDays).toBe(1);
  });

  it('missing 29 days = 29 daysMissed', () => {
    const p = makePlayer({ lastSessionDate: '2024-01-01', streakDays: 10 });
    const { daysMissed } = updateStreak(p, '2024-01-31');
    expect(daysMissed).toBe(29);
  });
});

describe('streakMultiplier', () => {
  it('1 day = 1x', () => expect(streakMultiplier(1)).toBe(1));
  it('7 days = 7x', () => expect(streakMultiplier(7)).toBe(7));
  it('caps at 7 beyond 7 days', () => expect(streakMultiplier(30)).toBe(7));
});

describe('comebackTier', () => {
  it('0 days missed = none', () => expect(comebackTier(0)).toBe('none'));
  it('1 day missed = mild', () => expect(comebackTier(1)).toBe('mild'));
  it('2 days missed = roast', () => expect(comebackTier(2)).toBe('roast'));
  it('5 days missed = roast', () => expect(comebackTier(5)).toBe('roast'));
  it('6 days missed = savage', () => expect(comebackTier(6)).toBe('savage'));
  it('12 days missed = savage', () => expect(comebackTier(12)).toBe('savage'));
  it('13 days missed = cold', () => expect(comebackTier(13)).toBe('cold'));
  it('28 days missed = cold', () => expect(comebackTier(28)).toBe('cold'));
  it('29 days missed = devastation', () => expect(comebackTier(29)).toBe('devastation'));
  it('100 days missed = devastation', () => expect(comebackTier(100)).toBe('devastation'));
});

describe('comebackGift', () => {
  it('no gift for 1 day missed', () => {
    const p = makePlayer();
    const { shards } = comebackGift(1, p);
    expect(shards).toBe(0);
  });

  it('grants shards for 2+ days missed', () => {
    const p = makePlayer();
    const { shards, player } = comebackGift(2, p);
    expect(shards).toBeGreaterThan(0);
    expect(player.comebackGiftGiven).toBe(true);
    expect(player.shardBalance).toBe(p.shardBalance + shards);
  });

  it('does not grant twice if already given', () => {
    const p = makePlayer({ comebackGiftGiven: true });
    const { shards } = comebackGift(10, p);
    expect(shards).toBe(0);
  });

  it('more shards for longer absence', () => {
    const p = makePlayer();
    const short = comebackGift(3, p).shards;
    const long = comebackGift(35, p).shards;
    expect(long).toBeGreaterThanOrEqual(short);
  });
});
