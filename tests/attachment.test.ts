import { describe, it, expect } from 'vitest';
import {
  attachmentTier,
  hungerTier,
  hearts,
  attachmentMultiplier,
  gainAttachment,
  recordSuccess,
  recordFailure,
  applyTime,
  isHungry,
} from '../src/engine/attachment.js';
import { createInitialBuddyState } from '../src/state.js';
import { BUDDIES_BY_ID } from '../data/buddies.js';
import type { BuddyState } from '../src/types.js';

function buddy(overrides: Partial<BuddyState> = {}): BuddyState {
  return { ...createInitialBuddyState(BUDDIES_BY_ID['glitchlet']!), ...overrides };
}

describe('attachmentTier', () => {
  it('maps the ladder', () => {
    expect(attachmentTier(0)).toBe('Wary');
    expect(attachmentTier(15)).toBe('Curious');
    expect(attachmentTier(35)).toBe('Warming');
    expect(attachmentTier(55)).toBe('Bonded');
    expect(attachmentTier(75)).toBe('Devoted');
    expect(attachmentTier(90)).toBe('Inseparable');
  });
});

describe('hungerTier', () => {
  it('maps thresholds', () => {
    expect(hungerTier(0)).toBe('Full');
    expect(hungerTier(30)).toBe('Peckish');
    expect(hungerTier(70)).toBe('Hungry');
    expect(hungerTier(90)).toBe('Starving');
  });
});

describe('hearts', () => {
  it('0-5 by twenties', () => {
    expect(hearts(0)).toBe(0);
    expect(hearts(40)).toBe(2);
    expect(hearts(100)).toBe(5);
    expect(hearts(120)).toBe(5);
  });
});

describe('attachmentMultiplier', () => {
  it('higher affection bonds faster', () => {
    const cold = buddy({ baseAxes: { sarcasm: 50, stubbornness: 50, affection: 0, tenderness: 50, leadership: 50, responsibility: 50 } });
    const warm = buddy({ baseAxes: { sarcasm: 50, stubbornness: 50, affection: 100, tenderness: 50, leadership: 50, responsibility: 50 } });
    expect(attachmentMultiplier(warm)).toBeGreaterThan(attachmentMultiplier(cold));
  });
});

describe('gain helpers', () => {
  it('gainAttachment never exceeds 100', () => {
    const b = gainAttachment(buddy({ attachment: 99 }), 1000);
    expect(b.attachment).toBeLessThanOrEqual(100);
  });

  it('recordSuccess increments sharedSuccesses and attachment', () => {
    const b = recordSuccess(buddy());
    expect(b.sharedSuccesses).toBe(1);
    expect(b.attachment).toBeGreaterThan(0);
  });

  it('recordFailure increments sharedFailures and bonds MORE than a success', () => {
    const base = buddy();
    const succ = recordSuccess(base);
    const fail = recordFailure(base);
    expect(fail.sharedFailures).toBe(1);
    expect(fail.attachment).toBeGreaterThan(succ.attachment);
  });
});

describe('applyTime', () => {
  it('raises hunger over time', () => {
    const b = applyTime(buddy({ hunger: 0 }), 2);
    expect(b.hunger).toBeGreaterThan(0);
  });

  it('builds attachment over time', () => {
    const b = applyTime(buddy({ attachment: 0 }), 5);
    expect(b.attachment).toBeGreaterThan(0);
  });

  it('a starving, neglected buddy loses attachment', () => {
    const b = applyTime(buddy({ hunger: 95, attachment: 50 }), 3);
    expect(b.attachment).toBeLessThan(50);
  });

  it('hunger caps at 100', () => {
    const b = applyTime(buddy({ hunger: 90 }), 100);
    expect(b.hunger).toBe(100);
  });
});

describe('isHungry', () => {
  it('true at/over the hungry threshold', () => {
    expect(isHungry(buddy({ hunger: 70 }))).toBe(true);
    expect(isHungry(buddy({ hunger: 50 }))).toBe(false);
  });
});
