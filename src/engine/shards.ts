import {
  SHARDS_PER_HOUR,
  SHARDS_BUILD_SUCCESS,
  SHARDS_ERROR_STREAK_RESOLVED,
  SHARDS_DAILY_STREAK,
  SHARDS_WEEKLY_STREAK,
  SHARDS_FIRST_SESSION,
} from '../constants.js';

export function shardsForElapsedHours(hours: number): number {
  return Math.floor(hours * SHARDS_PER_HOUR);
}

export function shardsForBuild(): number {
  return SHARDS_BUILD_SUCCESS;
}

export function shardsForErrorStreakResolved(): number {
  return SHARDS_ERROR_STREAK_RESOLVED;
}

export function shardsForDailyStreak(): number {
  return SHARDS_DAILY_STREAK;
}

export function shardsForWeeklyStreak(): number {
  return SHARDS_WEEKLY_STREAK;
}

export function shardsForFirstSession(): number {
  return SHARDS_FIRST_SESSION;
}
