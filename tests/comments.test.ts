import { describe, it, expect } from 'vitest';
import { selectComment } from '../src/engine/comments.js';
import { createRng } from '../src/rng.js';
import type { CommentContext } from '../src/engine/comments.js';

const baseCtx: CommentContext = {
  rarity: 'common',
  traitPrimary: 'Chaotic',
  evolutionStage: 0,
};

describe('selectComment', () => {
  it('returns a string for known triggers', () => {
    const result = selectComment(['build_success'], baseCtx, createRng(1));
    expect(typeof result).toBe('string');
    expect(result!.length).toBeGreaterThan(0);
  });

  it('returns null for empty trigger list', () => {
    const result = selectComment([], baseCtx, createRng(1));
    expect(result).toBeNull();
  });

  it('substitutes {days} placeholder', () => {
    const ctx = { ...baseCtx, daysMissed: 7, severity: 'savage' as const };
    let found = false;
    for (let seed = 0; seed < 50; seed++) {
      const result = selectComment(['streak_break_roast'], ctx, createRng(seed));
      if (result?.includes('7')) { found = true; break; }
    }
    expect(found).toBe(true);
  });

  it('substitutes {lang} placeholder', () => {
    const ctx = { ...baseCtx, lang: 'TypeScript' };
    let found = false;
    for (let seed = 0; seed < 50; seed++) {
      const result = selectComment(['language_tag'], ctx, createRng(seed));
      if (result?.includes('TypeScript')) { found = true; break; }
    }
    expect(found).toBe(true);
  });

  it('streak_break_roast filters by severity', () => {
    // Mild severity entries only contain mild ones
    const ctx = { ...baseCtx, severity: 'mild' as const, daysMissed: 1 };
    for (let seed = 0; seed < 20; seed++) {
      const result = selectComment(['streak_break_roast'], ctx, createRng(seed));
      if (result) {
        // Should not contain devastation-specific content (days substitution with 1)
        expect(result).not.toMatch(/your streak died so long ago/);
      }
    }
  });

  it('is deterministic — same seed gives same comment', () => {
    const r1 = selectComment(['build_success'], baseCtx, createRng(77));
    const r2 = selectComment(['build_success'], baseCtx, createRng(77));
    expect(r1).toBe(r2);
  });

  it('roster_roast substitutes {rosterName}', () => {
    const ctx = { ...baseCtx, rosterName: 'Hexbear', rosterTrait: 'Gruff' };
    let found = false;
    for (let seed = 0; seed < 50; seed++) {
      const result = selectComment(['roster_roast'], ctx, createRng(seed));
      if (result?.includes('Hexbear')) { found = true; break; }
    }
    expect(found).toBe(true);
  });
});
