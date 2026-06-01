import { describe, it, expect } from 'vitest';
import { createRng, deriveSeed } from '../src/rng.js';

describe('createRng', () => {
  it('produces values in [0, 1)', () => {
    const rng = createRng(42);
    for (let i = 0; i < 100; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('is deterministic — same seed same sequence', () => {
    const a = createRng(12345);
    const b = createRng(12345);
    for (let i = 0; i < 20; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it('int returns values in [0, max)', () => {
    const rng = createRng(99);
    for (let i = 0; i < 50; i++) {
      const v = rng.int(10);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    }
  });

  it('pick selects from array', () => {
    const rng = createRng(7);
    const arr = ['a', 'b', 'c'] as const;
    for (let i = 0; i < 30; i++) {
      expect(arr).toContain(rng.pick(arr));
    }
  });

  it('weighted distributes roughly correctly', () => {
    const rng = createRng(1);
    const counts = { rare: 0, epic: 0, legendary: 0 };
    const items = [
      { item: 'rare' as const, weight: 60 },
      { item: 'epic' as const, weight: 35 },
      { item: 'legendary' as const, weight: 5 },
    ];
    for (let i = 0; i < 1000; i++) {
      counts[rng.weighted(items)]++;
    }
    expect(counts.rare).toBeGreaterThan(500);
    expect(counts.epic).toBeGreaterThan(200);
    expect(counts.legendary).toBeGreaterThan(20);
  });
});

describe('deriveSeed', () => {
  it('same inputs produce same seed', () => {
    expect(deriveSeed('glitchlet', '2024-01-01', 42)).toBe(deriveSeed('glitchlet', '2024-01-01', 42));
  });

  it('different inputs produce different seeds', () => {
    expect(deriveSeed('a', 1)).not.toBe(deriveSeed('a', 2));
  });
});
