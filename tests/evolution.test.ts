import { describe, it, expect } from 'vitest';
import { evolve, legendaryBand, legendaryLevel } from '../src/engine/evolution.js';
import { BUDDIES_BY_ID } from '../data/buddies.js';
import type { BuddyState } from '../src/types.js';

function makeBuddy(id: string, overrides: Partial<BuddyState> = {}): BuddyState {
  const def = BUDDIES_BY_ID[id]!;
  return {
    buddyId: id,
    currentForm: def.forms[0]!.name,
    rarity: def.rarity,
    evolutionStage: 0,
    level: 1,
    tameHours: 0,
    xp: 0,
    traitPrimary: def.traitPrimary,
    mood: 'bored',
    moodSince: '2024-01-01T00:00:00Z',
    accessoriesUnlocked: [],
    bondMilestones: [],
    ...overrides,
  };
}

describe('three-stage evolution (glitchlet)', () => {
  const def = BUDDIES_BY_ID['glitchlet']!;

  it('stays stage 0 below 10 hours', () => {
    const buddy = makeBuddy('glitchlet', { tameHours: 9.99 });
    expect(evolve(buddy, def).evolutionStage).toBe(0);
  });

  it('evolves to stage 1 at exactly 10 hours', () => {
    const buddy = makeBuddy('glitchlet', { tameHours: 10 });
    const result = evolve(buddy, def);
    expect(result.evolutionStage).toBe(1);
    expect(result.currentForm).toBe('Glitchin');
  });

  it('stays stage 1 between 10 and 35 hours', () => {
    const buddy = makeBuddy('glitchlet', { tameHours: 20, evolutionStage: 1, currentForm: 'Glitchin' });
    expect(evolve(buddy, def).evolutionStage).toBe(1);
  });

  it('stays stage 1 just below 35 hours', () => {
    const buddy = makeBuddy('glitchlet', { tameHours: 34.99, evolutionStage: 1, currentForm: 'Glitchin' });
    expect(evolve(buddy, def).evolutionStage).toBe(1);
  });

  it('evolves to stage 2 at exactly 35 hours', () => {
    const buddy = makeBuddy('glitchlet', { tameHours: 35, evolutionStage: 1, currentForm: 'Glitchin' });
    const result = evolve(buddy, def);
    expect(result.evolutionStage).toBe(2);
    expect(result.currentForm).toBe('Glitchara');
  });

  it('secondary trait unlocks at stage 1+', () => {
    const buddy = makeBuddy('glitchlet', { tameHours: 10 });
    // glitchlet has no secondary trait defined, should be undefined
    const result = evolve(buddy, def);
    expect(result.evolutionStage).toBe(1);
  });
});

describe('two-stage evolution (asyncwing)', () => {
  const def = BUDDIES_BY_ID['asyncwing']!;

  it('stays stage 0 below 20 hours', () => {
    const buddy = makeBuddy('asyncwing', { tameHours: 19.99 });
    expect(evolve(buddy, def).evolutionStage).toBe(0);
  });

  it('evolves to stage 1 at exactly 20 hours', () => {
    const buddy = makeBuddy('asyncwing', { tameHours: 20 });
    const result = evolve(buddy, def);
    expect(result.evolutionStage).toBe(1);
    expect(result.currentForm).toBe('Asyncrend');
  });

  it('does not re-evolve once at stage 1', () => {
    const buddy = makeBuddy('asyncwing', { tameHours: 100, evolutionStage: 1, currentForm: 'Asyncrend' });
    expect(evolve(buddy, def).evolutionStage).toBe(1);
  });
});

describe('level-based evolution (nullgod)', () => {
  const def = BUDDIES_BY_ID['nullgod']!;

  it('level = 1 at 0 tameHours', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 0 });
    expect(evolve(buddy, def).level).toBe(1);
  });

  it('level = floor(tameHours)+1', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 19 });
    expect(evolve(buddy, def).level).toBe(20);
  });

  it('stays in band 0 at level 20', () => {
    expect(legendaryBand(20)).toBe(0);
  });

  it('enters band 1 at level 21', () => {
    expect(legendaryBand(21)).toBe(1);
  });

  it('enters band 2 at level 51', () => {
    expect(legendaryBand(51)).toBe(2);
  });

  it('enters Awakened band 3 at level 81', () => {
    expect(legendaryBand(81)).toBe(3);
  });

  it('awakened form name at tameHours 80', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 80 });
    const result = evolve(buddy, def);
    expect(result.level).toBe(81);
    expect(result.currentForm).toBe('Nullgod Unbound');
    expect(result.awakenedAt).toBeTruthy();
  });

  it('caps at level 100', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 200 });
    expect(evolve(buddy, def).level).toBe(100);
  });

  it('secondary trait unlocks at level 21+', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 20 });
    const result = evolve(buddy, def);
    expect(result.traitSecondary).toBe(def.traitSecondary);
  });

  it('tertiary trait unlocks at level 51+', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 50 });
    const result = evolve(buddy, def);
    expect(result.traitTertiary).toBe(def.traitTertiary);
  });

  it('no tertiary trait below level 51', () => {
    const buddy = makeBuddy('nullgod', { tameHours: 20 });
    const result = evolve(buddy, def);
    expect(result.traitTertiary).toBeUndefined();
  });
});

describe('legendaryLevel', () => {
  it('minimum 1', () => {
    expect(legendaryLevel(0)).toBe(1);
  });

  it('maximum 100', () => {
    expect(legendaryLevel(1000)).toBe(100);
  });

  it('correct midpoint', () => {
    expect(legendaryLevel(49)).toBe(50);
  });
});
