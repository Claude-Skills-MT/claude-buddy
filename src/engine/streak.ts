import type { PlayerState, Severity } from '../types.js';
import { STREAK_MAX_MULTIPLIER } from '../constants.js';

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const msPerDay = 86_400_000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export interface StreakResult {
  player: PlayerState;
  broke: boolean;
  daysMissed: number;
}

export function updateStreak(player: PlayerState, today: string): StreakResult {
  if (!player.lastSessionDate) {
    return {
      player: { ...player, streakDays: 1, lastSessionDate: today },
      broke: false,
      daysMissed: 0,
    };
  }

  const days = daysBetween(player.lastSessionDate, today);

  if (days === 0) {
    // Same day — no change
    return { player, broke: false, daysMissed: 0 };
  }

  if (days === 1) {
    // Consecutive day
    const streakDays = Math.min(player.streakDays + 1, 999);
    const newPlayer = { ...player, streakDays, lastSessionDate: today };
    return { player: newPlayer, broke: false, daysMissed: 0 };
  }

  // Missed at least one day
  const daysMissed = days - 1;
  const newPlayer = { ...player, streakDays: 1, lastSessionDate: today };
  return { player: newPlayer, broke: true, daysMissed };
}

export function streakMultiplier(days: number): number {
  return Math.max(1, Math.min(days, STREAK_MAX_MULTIPLIER));
}

export function comebackTier(daysMissed: number): Severity {
  if (daysMissed <= 0) return 'none';
  if (daysMissed === 1) return 'mild';
  if (daysMissed <= 5) return 'roast';
  if (daysMissed <= 12) return 'savage';
  if (daysMissed <= 28) return 'cold';
  return 'devastation';
}

export interface ComebackGift {
  shards: number;
  player: PlayerState;
}

export function comebackGift(daysMissed: number, player: PlayerState): ComebackGift {
  if (daysMissed < 2 || player.comebackGiftGiven) {
    return { shards: 0, player };
  }
  let shards = 15;
  if (daysMissed >= 7) shards = 25;
  if (daysMissed >= 30) shards = 50;
  return {
    shards,
    player: {
      ...player,
      shardBalance: player.shardBalance + shards,
      comebackGiftGiven: true,
    },
  };
}
