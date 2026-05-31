import type { BuddyState, XpContext } from '../types.js';
import {
  XP_PASSIVE_PER_SECOND,
  XP_BURST_ERROR,
  XP_BURST_BUILD,
  XP_BURST_TEST,
  XP_FLOW_MULTIPLIER,
  XP_FLOW_THRESHOLD_MINUTES,
  XP_MIDNIGHT_MULTIPLIER,
  XP_FIRST_SESSION_BONUS,
  XP_ROSTER_PASSIVE_FRACTION,
} from '../constants.js';

export function passiveXpForSeconds(secs: number, ctx: XpContext): number {
  let base = secs * XP_PASSIVE_PER_SECOND;
  if (ctx.flowMinutes >= XP_FLOW_THRESHOLD_MINUTES) base *= XP_FLOW_MULTIPLIER;
  if (ctx.isPastMidnight) base *= XP_MIDNIGHT_MULTIPLIER;
  base *= ctx.streakMultiplier;
  return Math.floor(base);
}

export function burstXp(kind: 'error' | 'build' | 'test', ctx: XpContext): number {
  const base =
    kind === 'error' ? XP_BURST_ERROR : kind === 'build' ? XP_BURST_BUILD : XP_BURST_TEST;
  let amount = base;
  if (ctx.isPastMidnight) amount *= XP_MIDNIGHT_MULTIPLIER;
  amount *= ctx.streakMultiplier;
  return Math.floor(amount);
}

export function firstSessionBonus(): number {
  return XP_FIRST_SESSION_BONUS;
}

export function applyXp(buddy: BuddyState, amount: number): BuddyState {
  return { ...buddy, xp: buddy.xp + amount };
}

export function applyRosterXp(
  roster: BuddyState[],
  activeId: string,
  activeAmount: number,
): BuddyState[] {
  const passiveAmount = Math.floor(activeAmount * XP_ROSTER_PASSIVE_FRACTION);
  return roster.map((b) =>
    b.buddyId === activeId
      ? applyXp(b, activeAmount)
      : applyXp(b, passiveAmount),
  );
}
