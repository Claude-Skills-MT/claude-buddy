import type { GameState, Trigger, Severity } from '../types.js';
import type { Rng } from '../rng.js';
import type { SessionState } from '../types.js';
import { COMMENT_POOLS } from '../../data/comments/index.js';
import type { CommentEntry } from '../../data/comments/index.js';
import {
  COMMENT_MIN_INTERVAL_SEC,
  COMMENT_MAX_INTERVAL_SEC,
  ROSTER_ROAST_CHANCE,
  ROSTER_ROAST_MIN_MINUTES,
} from '../constants.js';
import { commentFrequencyMultiplier } from './mood.js';

function secsSince(isoA: string, isoB: string): number {
  return (new Date(isoB).getTime() - new Date(isoA).getTime()) / 1000;
}

export function shouldComment(session: SessionState, nowIso: string, rng: Rng): boolean {
  const lastAt = session.lastCommentAt ?? session.sessionStart;
  const elapsed = secsSince(lastAt, nowIso);

  // Dynamic interval based on mood (not passed here — caller responsibility)
  const base = COMMENT_MIN_INTERVAL_SEC + rng.next() * (COMMENT_MAX_INTERVAL_SEC - COMMENT_MIN_INTERVAL_SEC);
  return elapsed >= base;
}

export function shouldCommentWithMood(
  session: SessionState,
  mood: GameState['roster'][0]['mood'],
  nowIso: string,
  rng: Rng,
): boolean {
  const lastAt = session.lastCommentAt ?? session.sessionStart;
  const elapsed = secsSince(lastAt, nowIso);
  const mult = commentFrequencyMultiplier(mood);
  const minInterval = COMMENT_MIN_INTERVAL_SEC / mult;
  const maxInterval = COMMENT_MAX_INTERVAL_SEC / mult;
  const threshold = minInterval + rng.next() * (maxInterval - minInterval);
  return elapsed >= threshold;
}

function substitute(
  text: string,
  vars: Record<string, string | number>,
): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key as string] ?? `{${key}}`));
}

function filterEntries(
  entries: CommentEntry[],
  rarity: string,
  trait: string,
  stage: number,
): CommentEntry[] {
  return entries.filter((e) => {
    if (e.rarity && !e.rarity.includes(rarity as never)) return false;
    if (e.trait && !e.trait.includes(trait)) return false;
    if (e.minStage !== undefined && stage < e.minStage) return false;
    return true;
  });
}

function filterBySeverity(entries: CommentEntry[], severity: Severity): CommentEntry[] {
  // For streak_break_roast: include entries matching the severity OR no severity (trait-specific)
  return entries.filter((e) => !e.severity || e.severity === severity);
}

export interface CommentContext {
  rarity: string;
  traitPrimary: string;
  evolutionStage: number;
  rosterName?: string;
  rosterTrait?: string;
  userName?: string;
  lang?: string;
  daysMissed?: number;
  severity?: Severity;
  shards?: number;
}

export function selectComment(
  triggers: Trigger[],
  ctx: CommentContext,
  rng: Rng,
): string | null {
  const vars: Record<string, string | number> = {
    name: ctx.userName ?? 'dev',
    lang: ctx.lang ?? 'your language',
    days: ctx.daysMissed ?? 0,
    rosterName: ctx.rosterName ?? 'your other buddy',
    rosterTrait: ctx.rosterTrait ?? 'whatever',
    shards: ctx.shards ?? 15,
  };

  for (const trigger of triggers) {
    const pool = COMMENT_POOLS[trigger];
    if (!pool || pool.length === 0) continue;

    let entries = filterEntries(pool, ctx.rarity, ctx.traitPrimary, ctx.evolutionStage);

    if (trigger === 'streak_break_roast' && ctx.severity) {
      entries = filterBySeverity(entries, ctx.severity);
      // Also include trait-specific entries that have no severity
      const traitSpecific = pool.filter((e) => !e.severity && e.trait?.includes(ctx.traitPrimary));
      entries = [...entries, ...traitSpecific];
    }

    if (entries.length === 0) continue;

    const entry = rng.pick(entries);
    return substitute(entry.text, vars);
  }
  return null;
}

export function canFireRosterRoast(state: GameState, nowIso: string): boolean {
  if (state.player.rosterRoastFiredToday) return false;
  if (state.roster.length < 2) return false;
  const sessionMinutes = secsSince(state.session.sessionStart, nowIso) / 60;
  return sessionMinutes >= ROSTER_ROAST_MIN_MINUTES;
}

export function rosterRoastRoll(rng: Rng): boolean {
  return rng.next() < ROSTER_ROAST_CHANCE;
}
