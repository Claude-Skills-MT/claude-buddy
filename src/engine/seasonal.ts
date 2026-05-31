import type { PlayerState } from '../types.js';

export type SeasonalEvent = 'debug_week' | 'midnight_build_complete' | 'streak_lord';

// Debug Week: first full week of each month (Mon-Sun)
function isDebugWeek(nowIso: string): boolean {
  const d = new Date(nowIso);
  const dom = d.getDate();
  return dom >= 1 && dom <= 7;
}

export function activeSeasonalEvents(nowIso: string, player: PlayerState): SeasonalEvent[] {
  const events: SeasonalEvent[] = [];
  if (isDebugWeek(nowIso)) events.push('debug_week');
  if (player.midnightBuildDays >= 3) events.push('midnight_build_complete');
  if (player.streakDays >= 30) events.push('streak_lord');
  return events;
}

export interface GachaModifiers {
  chaoticDropBoost: boolean;
  guaranteedLegendary: boolean;
}

export function gachaModifiers(events: SeasonalEvent[]): GachaModifiers {
  return {
    chaoticDropBoost: events.includes('debug_week'),
    guaranteedLegendary: events.includes('streak_lord'),
  };
}
