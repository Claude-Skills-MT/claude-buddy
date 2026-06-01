import type { BuddyState, BondFlag } from '../types.js';
import type { BuddyDef } from '../../data/buddies.js';
import {
  BOND_NAME_XP,
  BOND_RARE_POOL_XP,
  BOND_ACCESSORY_XP,
  BOND_MEMORY_XP,
} from '../constants.js';

const MILESTONE_ORDER: { flag: BondFlag; threshold: number; accessoryIndex: number | null }[] = [
  { flag: 'name', threshold: BOND_NAME_XP, accessoryIndex: 0 },
  { flag: 'rarePool', threshold: BOND_RARE_POOL_XP, accessoryIndex: 1 },
  { flag: 'accessory', threshold: BOND_ACCESSORY_XP, accessoryIndex: 2 },
  { flag: 'memory', threshold: BOND_MEMORY_XP, accessoryIndex: 3 },
];

export function bondMilestonesFor(xp: number): BondFlag[] {
  return MILESTONE_ORDER.filter((m) => xp >= m.threshold).map((m) => m.flag);
}

export function applyBond(buddy: BuddyState, def: BuddyDef): BuddyState {
  const flags = bondMilestonesFor(buddy.xp);
  const newFlags = flags.filter((f) => !buddy.bondMilestones.includes(f));
  if (newFlags.length === 0) return buddy;

  const accessoriesToAdd: string[] = [];
  for (const milestone of MILESTONE_ORDER) {
    if (newFlags.includes(milestone.flag) && milestone.accessoryIndex !== null) {
      const acc = def.accessoryIds[milestone.accessoryIndex];
      if (acc && !buddy.accessoriesUnlocked.includes(acc)) {
        accessoriesToAdd.push(acc);
      }
    }
  }

  return {
    ...buddy,
    bondMilestones: flags,
    accessoriesUnlocked: [...buddy.accessoriesUnlocked, ...accessoriesToAdd],
  };
}
