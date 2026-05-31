import { describe, it, expect } from 'vitest';
import { BUDDIES, BUDDIES_BY_ID, BUDDIES_BY_RARITY } from '../data/buddies.js';
import { COMMENT_POOLS, CORE_TRIGGERS } from '../data/comments/index.js';

describe('buddies data', () => {
  it('has exactly 50 buddies', () => {
    expect(BUDDIES.length).toBe(50);
  });

  it('has correct rarity counts', () => {
    expect(BUDDIES_BY_RARITY.common.length).toBe(15);
    expect(BUDDIES_BY_RARITY.uncommon.length).toBe(12);
    expect(BUDDIES_BY_RARITY.rare.length).toBe(10);
    expect(BUDDIES_BY_RARITY.epic.length).toBe(8);
    expect(BUDDIES_BY_RARITY.legendary.length).toBe(5);
  });

  it('every buddy has correct forms count for its evolutionType', () => {
    for (const b of BUDDIES) {
      if (b.evolutionType === 'three-stage') {
        expect(b.forms.length, `${b.id} three-stage forms`).toBe(3);
      } else if (b.evolutionType === 'two-stage') {
        expect(b.forms.length, `${b.id} two-stage forms`).toBe(2);
      } else if (b.evolutionType === 'level-based') {
        expect(b.forms.length, `${b.id} level-based forms`).toBe(4);
      }
    }
  });

  it('every buddy has exactly 5 accessories', () => {
    for (const b of BUDDIES) {
      expect(b.accessoryIds.length, `${b.id} accessories`).toBe(5);
    }
  });

  it('all buddy ids are unique', () => {
    const ids = BUDDIES.map((b) => b.id);
    expect(new Set(ids).size).toBe(BUDDIES.length);
  });

  it('legendary buddies have awakenedName', () => {
    for (const b of BUDDIES_BY_RARITY.legendary) {
      expect(b.awakenedName, `${b.id} awakenedName`).toBeTruthy();
    }
  });

  it('BUDDIES_BY_ID lookup covers all buddies', () => {
    for (const b of BUDDIES) {
      expect(BUDDIES_BY_ID[b.id]).toBe(b);
    }
  });
});

describe('comment pools', () => {
  it('every trigger has at least 3 entries', () => {
    for (const trigger of Object.keys(COMMENT_POOLS) as (keyof typeof COMMENT_POOLS)[]) {
      expect(COMMENT_POOLS[trigger].length, `pool ${trigger}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('core triggers have at least 15 entries', () => {
    for (const trigger of CORE_TRIGGERS) {
      expect(COMMENT_POOLS[trigger].length, `core pool ${trigger}`).toBeGreaterThanOrEqual(15);
    }
  });

  it('streak_break_roast pool covers all severity tiers', () => {
    const pool = COMMENT_POOLS.streak_break_roast;
    const severities = pool.map((e) => e.severity).filter(Boolean);
    expect(severities).toContain('mild');
    expect(severities).toContain('roast');
    expect(severities).toContain('savage');
    expect(severities).toContain('cold');
    expect(severities).toContain('devastation');
  });
});
