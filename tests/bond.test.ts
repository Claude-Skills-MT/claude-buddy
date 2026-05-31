import { describe, it, expect } from 'vitest';
import { bondMilestonesFor, applyBond } from '../src/engine/bond.js';
import { BUDDIES_BY_ID } from '../data/buddies.js';
import { createInitialBuddyState } from '../src/state.js';

describe('bondMilestonesFor', () => {
  it('no milestones below 500', () => {
    expect(bondMilestonesFor(499)).toHaveLength(0);
  });

  it('name milestone at 500', () => {
    expect(bondMilestonesFor(500)).toContain('name');
  });

  it('rarePool at 1500', () => {
    const flags = bondMilestonesFor(1500);
    expect(flags).toContain('name');
    expect(flags).toContain('rarePool');
  });

  it('accessory at 3000', () => {
    expect(bondMilestonesFor(3000)).toContain('accessory');
  });

  it('memory at 5000', () => {
    const flags = bondMilestonesFor(5000);
    expect(flags).toHaveLength(4);
    expect(flags).toContain('memory');
  });
});

describe('applyBond', () => {
  const def = BUDDIES_BY_ID['glitchlet']!;

  it('no change below first milestone', () => {
    const buddy = { ...createInitialBuddyState(def), xp: 400 };
    const result = applyBond(buddy, def);
    expect(result.bondMilestones).toHaveLength(0);
    expect(result.accessoriesUnlocked).toHaveLength(0);
  });

  it('unlocks first accessory at name milestone', () => {
    const buddy = { ...createInitialBuddyState(def), xp: 500 };
    const result = applyBond(buddy, def);
    expect(result.bondMilestones).toContain('name');
    expect(result.accessoriesUnlocked.length).toBeGreaterThan(0);
  });

  it('does not re-add already unlocked accessories', () => {
    const buddy = { ...createInitialBuddyState(def), xp: 500,
      bondMilestones: ['name' as const], accessoriesUnlocked: [def.accessoryIds[0]!] };
    const result = applyBond(buddy, def);
    expect(result.accessoriesUnlocked).toHaveLength(1);
  });

  it('all 4 accessories unlocked at 5000 xp', () => {
    const buddy = { ...createInitialBuddyState(def), xp: 5000 };
    const result = applyBond(buddy, def);
    expect(result.bondMilestones).toHaveLength(4);
    expect(result.accessoriesUnlocked).toHaveLength(4);
  });
});
