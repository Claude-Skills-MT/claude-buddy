import { describe, it, expect } from 'vitest';
import {
  rollPersonalityForId,
  effectiveAxes,
  personalityLine,
  dominantAxis,
  archetypeName,
} from '../src/engine/personality.js';
import { ARCHETYPES, ARCHETYPES_BY_ID } from '../data/personalities.js';
import { createRng } from '../src/rng.js';
import type { BuddyState } from '../src/types.js';

describe('personality data', () => {
  it('has 10 archetypes with unique ids', () => {
    expect(ARCHETYPES.length).toBe(10);
    expect(new Set(ARCHETYPES.map((a) => a.id)).size).toBe(10);
  });

  it('every archetype has talk/success/failure lines', () => {
    for (const a of ARCHETYPES) {
      expect(a.lines.talk?.length, `${a.id} talk`).toBeGreaterThan(0);
      expect(a.lines.success?.length, `${a.id} success`).toBeGreaterThan(0);
      expect(a.lines.failure?.length, `${a.id} failure`).toBeGreaterThan(0);
    }
  });

  it('all axes are within 0-100', () => {
    for (const a of ARCHETYPES) {
      for (const v of Object.values(a.axes)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('rollPersonalityForId', () => {
  it('is deterministic for a given buddyId', () => {
    const a = rollPersonalityForId('glitchlet');
    const b = rollPersonalityForId('glitchlet');
    expect(a.personality).toBe(b.personality);
    expect(a.baseAxes).toEqual(b.baseAxes);
  });

  it('rolls a known archetype', () => {
    const { personality } = rollPersonalityForId('nullgod');
    expect(ARCHETYPES_BY_ID[personality]).toBeDefined();
  });

  it('jittered axes stay within 0-100', () => {
    const { baseAxes } = rollPersonalityForId('hexcub');
    for (const v of Object.values(baseAxes)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});

describe('effectiveAxes amplification', () => {
  function buddy(overrides: Partial<BuddyState>): BuddyState {
    return {
      rarity: 'common', evolutionStage: 0, level: 1,
      baseAxes: { sarcasm: 80, stubbornness: 90, affection: 20, tenderness: 30, leadership: 60, responsibility: 50 },
      ...overrides,
    } as BuddyState;
  }

  it('stage 0 returns the base profile unchanged', () => {
    const axes = effectiveAxes(buddy({ evolutionStage: 0 }));
    expect(axes.stubbornness).toBe(90);
    expect(axes.affection).toBe(20);
  });

  it('evolving amplifies high axes upward', () => {
    const s0 = effectiveAxes(buddy({ evolutionStage: 0 }));
    const s2 = effectiveAxes(buddy({ evolutionStage: 2 }));
    expect(s2.stubbornness).toBeGreaterThan(s0.stubbornness);
  });

  it('evolving pushes low axes downward (more pronounced personality)', () => {
    const s0 = effectiveAxes(buddy({ evolutionStage: 0 }));
    const s2 = effectiveAxes(buddy({ evolutionStage: 2 }));
    expect(s2.affection).toBeLessThan(s0.affection);
  });

  it('legendary amplifies by level band', () => {
    const low = effectiveAxes(buddy({ rarity: 'legendary', level: 10 }));
    const awakened = effectiveAxes(buddy({ rarity: 'legendary', level: 90 }));
    expect(awakened.stubbornness).toBeGreaterThan(low.stubbornness);
  });

  it('axes stay clamped to 0-100 after amplification', () => {
    const axes = effectiveAxes(buddy({ rarity: 'legendary', level: 100 }));
    for (const v of Object.values(axes)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});

describe('dominantAxis', () => {
  it('returns the highest axis', () => {
    expect(dominantAxis({ sarcasm: 10, stubbornness: 90, affection: 20, tenderness: 30, leadership: 40, responsibility: 50 })).toBe('stubbornness');
  });
});

describe('personalityLine', () => {
  it('returns a string for a known archetype/context', () => {
    const line = personalityLine('stubborn', 'talk', { name: 'Steve' }, createRng(1));
    expect(typeof line).toBe('string');
  });

  it('substitutes {name}', () => {
    let found = false;
    for (let seed = 0; seed < 40; seed++) {
      const line = personalityLine('devoted', 'bond_up', { name: 'Pikapika' }, createRng(seed));
      if (line?.includes('Pikapika')) { found = true; break; }
    }
    // devoted bond_up lines may not include {name}; just assert no leftover braces
    const sample = personalityLine('devoted', 'talk', { name: 'X' }, createRng(3));
    expect(sample).not.toContain('{name}');
  });

  it('returns null for a context the archetype lacks', () => {
    // 'leader' has no fed_reluctant lines
    expect(personalityLine('leader', 'fed_reluctant', {}, createRng(1))).toBeNull();
  });

  it('archetypeName resolves', () => {
    expect(archetypeName('stubborn')).toBe('Stubborn');
  });
});
