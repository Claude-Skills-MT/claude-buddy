import { describe, it, expect } from 'vitest';
import {
  passiveXpForSeconds,
  burstXp,
  firstSessionBonus,
  applyXp,
  applyRosterXp,
} from '../src/engine/xp.js';
import type { XpContext } from '../src/types.js';
import { XP_FIRST_SESSION_BONUS } from '../src/constants.js';

const baseCtx: XpContext = {
  flowMinutes: 0,
  isPastMidnight: false,
  isFirstSessionOfDay: false,
  streakMultiplier: 1,
};

describe('passiveXpForSeconds', () => {
  it('returns floor of rate * seconds', () => {
    // 0.5 xp/sec * 60sec = 30
    expect(passiveXpForSeconds(60, baseCtx)).toBe(30);
  });

  it('applies flow multiplier when >= 45 min', () => {
    const ctx = { ...baseCtx, flowMinutes: 45 };
    expect(passiveXpForSeconds(60, ctx)).toBeGreaterThan(passiveXpForSeconds(60, baseCtx));
  });

  it('no flow multiplier when < 45 min', () => {
    const ctx = { ...baseCtx, flowMinutes: 44 };
    expect(passiveXpForSeconds(60, ctx)).toBe(passiveXpForSeconds(60, baseCtx));
  });

  it('applies midnight multiplier', () => {
    const ctx = { ...baseCtx, isPastMidnight: true };
    expect(passiveXpForSeconds(60, ctx)).toBeGreaterThan(passiveXpForSeconds(60, baseCtx));
  });

  it('streak multiplier stacks', () => {
    const ctx = { ...baseCtx, streakMultiplier: 3 };
    expect(passiveXpForSeconds(60, ctx)).toBe(passiveXpForSeconds(60, baseCtx) * 3);
  });
});

describe('burstXp', () => {
  it('error < build', () => {
    expect(burstXp('error', baseCtx)).toBeLessThan(burstXp('build', baseCtx));
  });

  it('test < error', () => {
    expect(burstXp('test', baseCtx)).toBeLessThan(burstXp('error', baseCtx));
  });

  it('midnight multiplier applies', () => {
    const ctx = { ...baseCtx, isPastMidnight: true };
    expect(burstXp('build', ctx)).toBeGreaterThan(burstXp('build', baseCtx));
  });
});

describe('firstSessionBonus', () => {
  it('returns constant bonus', () => {
    expect(firstSessionBonus()).toBe(XP_FIRST_SESSION_BONUS);
  });
});

describe('applyRosterXp', () => {
  const roster = [
    { buddyId: 'a', xp: 0 } as any,
    { buddyId: 'b', xp: 0 } as any,
    { buddyId: 'c', xp: 0 } as any,
  ];

  it('active buddy gets full XP', () => {
    const result = applyRosterXp(roster, 'a', 100);
    expect(result.find((b) => b.buddyId === 'a')!.xp).toBe(100);
  });

  it('roster buddies get 10% XP', () => {
    const result = applyRosterXp(roster, 'a', 100);
    expect(result.find((b) => b.buddyId === 'b')!.xp).toBe(10);
    expect(result.find((b) => b.buddyId === 'c')!.xp).toBe(10);
  });
});
