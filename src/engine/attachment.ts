import type { BuddyState } from '../types.js';
import { effectiveAxes } from './personality.js';
import {
  ATTACH_PER_HOUR,
  ATTACH_PER_SUCCESS,
  ATTACH_PER_FAILURE,
  ATTACH_NEGLECT_DECAY,
  ATTACH_MAX,
  ATTACH_MULT_FLOOR,
  ATTACH_MULT_CEIL,
  HUNGER_PER_HOUR,
  HUNGER_MAX,
  HUNGER_HUNGRY_THRESHOLD,
  HUNGER_STARVING_THRESHOLD,
} from '../constants.js';

export type AttachmentTier = 'Wary' | 'Curious' | 'Warming' | 'Bonded' | 'Devoted' | 'Inseparable';
export type HungerTier = 'Full' | 'Peckish' | 'Hungry' | 'Starving';

export function attachmentTier(value: number): AttachmentTier {
  if (value >= 90) return 'Inseparable';
  if (value >= 75) return 'Devoted';
  if (value >= 55) return 'Bonded';
  if (value >= 35) return 'Warming';
  if (value >= 15) return 'Curious';
  return 'Wary';
}

export function hungerTier(value: number): HungerTier {
  if (value >= HUNGER_STARVING_THRESHOLD) return 'Starving';
  if (value >= HUNGER_HUNGRY_THRESHOLD) return 'Hungry';
  if (value >= 30) return 'Peckish';
  return 'Full';
}

// 0-5 filled hearts, for the status line.
export function hearts(value: number): number {
  return Math.max(0, Math.min(5, Math.floor(value / 20)));
}

// How readily this buddy bonds, driven by its (amplified) affection axis.
export function attachmentMultiplier(buddy: BuddyState): number {
  const affection = effectiveAxes(buddy).affection;
  return ATTACH_MULT_FLOOR + (ATTACH_MULT_CEIL - ATTACH_MULT_FLOOR) * (affection / 100);
}

export function gainAttachment(buddy: BuddyState, baseAmount: number): BuddyState {
  const amount = baseAmount * attachmentMultiplier(buddy);
  return { ...buddy, attachment: Math.min(ATTACH_MAX, buddy.attachment + amount) };
}

export function recordSuccess(buddy: BuddyState): BuddyState {
  const b = gainAttachment(buddy, ATTACH_PER_SUCCESS);
  return { ...b, sharedSuccesses: b.sharedSuccesses + 1 };
}

export function recordFailure(buddy: BuddyState): BuddyState {
  // Failures bond you MORE — surviving the pain together is the strongest glue.
  const b = gainAttachment(buddy, ATTACH_PER_FAILURE);
  return { ...b, sharedFailures: b.sharedFailures + 1 };
}

// Apply the passage of time: hunger rises; time together bonds; but a starving
// buddy that's been neglected loses a little faith in you.
export function applyTime(buddy: BuddyState, hours: number): BuddyState {
  let b: BuddyState = { ...buddy, hunger: Math.min(HUNGER_MAX, buddy.hunger + hours * HUNGER_PER_HOUR) };
  b = gainAttachment(b, hours * ATTACH_PER_HOUR);
  if (b.hunger >= HUNGER_STARVING_THRESHOLD) {
    b = { ...b, attachment: Math.max(0, b.attachment - hours * ATTACH_NEGLECT_DECAY) };
  }
  return b;
}

export function isHungry(buddy: BuddyState): boolean {
  return buddy.hunger >= HUNGER_HUNGRY_THRESHOLD;
}
