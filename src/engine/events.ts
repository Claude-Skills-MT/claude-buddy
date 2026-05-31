import type { GameState, PullKind, Trigger, Severity } from '../types.js';
import { BUDDIES_BY_ID } from '../../data/buddies.js';
import { createRng, deriveSeed } from '../rng.js';
import { createInitialState, createInitialSessionState } from '../state.js';
import { passiveXpForSeconds, burstXp, firstSessionBonus, applyRosterXp } from './xp.js';
import { shardsForElapsedHours, shardsForBuild, shardsForErrorStreakResolved, shardsForFirstSession } from './shards.js';
import { evolve } from './evolution.js';
import { applyBond } from './bond.js';
import { nextMoodFromVelocity, updateMood } from './mood.js';
import { updateStreak, streakMultiplier, comebackTier, comebackGift } from './streak.js';
import { recordSwap } from './swap.js';
import { pull } from './gacha.js';
import { release } from './release.js';
import { forceUnlock } from './resonance.js';
import {
  selectComment,
  canFireRosterRoast,
  rosterRoastRoll,
  shouldCommentWithMood,
} from './comments.js';
import { talkReply } from './talk.js';

export type PetEvent =
  | { type: 'session_start'; at: string; firstOfDay: boolean }
  | { type: 'tick'; at: string; elapsedSec: number }
  | { type: 'error_detected'; at: string }
  | { type: 'error_resolved'; at: string }
  | { type: 'build_success'; at: string }
  | { type: 'test_pass'; at: string }
  | { type: 'test_fail'; at: string }
  | { type: 'language_tag'; at: string; lang: string }
  | { type: 'swap_buddy'; at: string; toBuddyId: string }
  | { type: 'pull'; at: string; kind: PullKind }
  | { type: 'release'; at: string; buddyId: string; confirm: boolean }
  | { type: 'force_unlock'; at: string; buddyId: string }
  | { type: 'talk'; at: string; text: string }
  | { type: 'session_end'; at: string };

export interface ApplyResult {
  state: GameState;
  comment?: string;
  reply?: string;
}

function today(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function activeBuddy(state: GameState) {
  const b = state.roster.find((r) => r.buddyId === state.activeBuddy);
  if (!b) throw new Error(`Active buddy ${state.activeBuddy} not in roster`);
  return b;
}

function updateActiveBuddy(state: GameState, updater: (b: typeof state.roster[0]) => typeof state.roster[0]): GameState {
  return {
    ...state,
    roster: state.roster.map((b) => b.buddyId === state.activeBuddy ? updater(b) : b),
  };
}

function postEvolveBond(state: GameState): GameState {
  return {
    ...state,
    roster: state.roster.map((b) => {
      const def = BUDDIES_BY_ID[b.buddyId];
      if (!def) return b;
      const evolved = evolve(b, def);
      const bonded = applyBond(evolved, def);
      return bonded;
    }),
  };
}

function xpContext(state: GameState, nowIso: string) {
  const hour = new Date(nowIso).getHours();
  const isPastMidnight = hour >= 0 && hour < 5;
  const flowMinutes = state.session.flowStartAt
    ? (new Date(nowIso).getTime() - new Date(state.session.flowStartAt).getTime()) / 60000
    : 0;
  return {
    flowMinutes,
    isPastMidnight,
    isFirstSessionOfDay: false,
    streakMultiplier: streakMultiplier(state.player.streakDays),
  };
}

export function applyEvent(state: GameState, event: PetEvent): ApplyResult {
  const rng = createRng(deriveSeed(state.activeBuddy, state.session.sessionStart, state.session.eventIndex, event.type, event.at));
  let s = { ...state, session: { ...state.session, eventIndex: state.session.eventIndex + 1 } };

  switch (event.type) {
    case 'session_start': {
      const d = today(event.at);
      const { player: newPlayer, broke, daysMissed } = updateStreak(s.player, d);
      let comment: string | undefined;
      let playerAfterGift = newPlayer;

      if (broke && daysMissed > 0) {
        const severity: Severity = comebackTier(daysMissed);
        const triggers: Trigger[] = severity !== 'none' ? ['streak_break_roast'] : [];
        const ab = activeBuddy(s);
        if (triggers.length > 0) {
          comment = selectComment(triggers, {
            rarity: ab.rarity,
            traitPrimary: ab.traitPrimary,
            evolutionStage: ab.evolutionStage,
            daysMissed,
            severity,
          }, rng) ?? undefined;
        }
        // Comeback gift
        const gift = comebackGift(daysMissed, newPlayer);
        playerAfterGift = gift.player;
      }

      // First session of day shards + XP
      const shardsGained = event.firstOfDay ? shardsForFirstSession() : 0;
      const firstXp = event.firstOfDay ? firstSessionBonus() : 0;

      s = {
        ...s,
        session: createInitialSessionState(event.at),
        player: {
          ...playerAfterGift,
          shardBalance: playerAfterGift.shardBalance + shardsGained,
          rosterRoastFiredToday: false,
          comebackGiftGiven: broke ? playerAfterGift.comebackGiftGiven : false,
        },
      };

      if (firstXp > 0) {
        s = { ...s, roster: applyRosterXp(s.roster, s.activeBuddy, firstXp) };
      }

      s = postEvolveBond(s);

      if (event.firstOfDay && comment === undefined) {
        const hour = new Date(event.at).getHours();
        const trigger: Trigger = hour < 12 ? 'morning' : hour < 22 ? 'idle_nudge' : 'late_night';
        const ab = activeBuddy(s);
        comment = selectComment([trigger], {
          rarity: ab.rarity,
          traitPrimary: ab.traitPrimary,
          evolutionStage: ab.evolutionStage,
        }, rng) ?? undefined;
      }

      return { state: s, comment };
    }

    case 'tick': {
      const ctx = xpContext(s, event.at);
      const xpGained = passiveXpForSeconds(event.elapsedSec, ctx);
      const hoursGained = event.elapsedSec / 3600;
      const shardsGained = shardsForElapsedHours(hoursGained);

      s = {
        ...s,
        roster: s.roster.map((b) =>
          b.buddyId === s.activeBuddy
            ? { ...b, tameHours: b.tameHours + hoursGained, xp: b.xp + xpGained }
            : { ...b, xp: b.xp + Math.floor(xpGained * 0.1) },
        ),
        player: {
          ...s.player,
          shardBalance: s.player.shardBalance + shardsGained,
        },
      };

      // Update flow state tracking
      const flowMinutes = s.session.flowStartAt
        ? (new Date(event.at).getTime() - new Date(s.session.flowStartAt).getTime()) / 60000
        : 0;
      if (flowMinutes === 0 && !s.session.flowStartAt) {
        const sessionMinutes = (new Date(event.at).getTime() - new Date(s.session.sessionStart).getTime()) / 60000;
        if (sessionMinutes >= 45) {
          s = { ...s, session: { ...s.session, flowStartAt: s.session.sessionStart } };
        }
      }

      s = postEvolveBond(s);

      // Mood update
      const xpPerMin = xpGained / (event.elapsedSec / 60);
      const ab = activeBuddy(s);
      const newMood = nextMoodFromVelocity(ab.mood, xpPerMin);
      const moodUpdate = updateMood(ab, newMood, event.at);
      s = updateActiveBuddy(s, (b) => ({ ...b, ...moodUpdate }));

      // Comment check
      let comment: string | undefined;
      const abAfter = activeBuddy(s);
      if (shouldCommentWithMood(s.session, abAfter.mood, event.at, rng)) {
        const triggers: Trigger[] = [];
        const sessionMinutes = (new Date(event.at).getTime() - new Date(s.session.sessionStart).getTime()) / 60000;

        if (ctx.isPastMidnight) triggers.push('past_midnight');
        if (flowMinutes >= 45) triggers.push('flow_state');
        if (sessionMinutes >= 120) triggers.push('marathon');
        if (s.session.errorStreakActive) triggers.push('error_streak');

        // Roster roast check
        if (canFireRosterRoast(s, event.at) && rosterRoastRoll(rng)) {
          triggers.push('roster_roast');
          s = { ...s, player: { ...s.player, rosterRoastFiredToday: true } };
        }

        if (triggers.length === 0) triggers.push('idle_nudge');

        // Pick roster buddy for roast context
        const rosterBuddy = s.roster.find((b) => b.buddyId !== s.activeBuddy);
        const rosterDef = rosterBuddy ? BUDDIES_BY_ID[rosterBuddy.buddyId] : undefined;

        comment = selectComment(triggers, {
          rarity: abAfter.rarity,
          traitPrimary: abAfter.traitPrimary,
          evolutionStage: abAfter.evolutionStage,
          rosterName: rosterBuddy?.currentForm,
          rosterTrait: rosterDef?.traitPrimary,
        }, rng) ?? undefined;

        if (comment) {
          s = { ...s, session: { ...s.session, lastCommentAt: event.at } };
        }
      }

      return { state: s, comment };
    }

    case 'error_detected': {
      const ctx = xpContext(s, event.at);
      const xp = burstXp('error', ctx);
      s = {
        ...s,
        roster: s.roster.map((b) =>
          b.buddyId === s.activeBuddy ? { ...b, xp: b.xp + xp } : b,
        ),
        session: { ...s.session, errorStreakActive: true },
      };
      s = postEvolveBond(s);
      return { state: s };
    }

    case 'error_resolved': {
      const shards = s.session.errorStreakActive ? shardsForErrorStreakResolved() : 0;
      s = {
        ...s,
        session: { ...s.session, errorStreakActive: false },
        player: { ...s.player, shardBalance: s.player.shardBalance + shards },
      };
      return { state: s };
    }

    case 'build_success': {
      const ctx = xpContext(s, event.at);
      const xp = burstXp('build', ctx);
      const shards = shardsForBuild();
      s = {
        ...s,
        roster: s.roster.map((b) =>
          b.buddyId === s.activeBuddy ? { ...b, xp: b.xp + xp } : b,
        ),
        player: { ...s.player, shardBalance: s.player.shardBalance + shards },
      };
      s = postEvolveBond(s);
      const ab = activeBuddy(s);
      const comment = selectComment(['build_success'], {
        rarity: ab.rarity,
        traitPrimary: ab.traitPrimary,
        evolutionStage: ab.evolutionStage,
      }, rng) ?? undefined;
      return { state: s, comment };
    }

    case 'test_pass': {
      const ctx = xpContext(s, event.at);
      const xp = burstXp('test', ctx);
      s = {
        ...s,
        roster: s.roster.map((b) =>
          b.buddyId === s.activeBuddy ? { ...b, xp: b.xp + xp } : b,
        ),
      };
      return { state: s };
    }

    case 'test_fail': {
      const ab = activeBuddy(s);
      const comment = selectComment(['test_fail'], {
        rarity: ab.rarity,
        traitPrimary: ab.traitPrimary,
        evolutionStage: ab.evolutionStage,
      }, rng) ?? undefined;
      return { state: s, comment };
    }

    case 'language_tag': {
      const ab = activeBuddy(s);
      const comment = selectComment(['language_tag'], {
        rarity: ab.rarity,
        traitPrimary: ab.traitPrimary,
        evolutionStage: ab.evolutionStage,
        lang: event.lang,
      }, rng) ?? undefined;
      return { state: s, comment };
    }

    case 'swap_buddy': {
      if (!BUDDIES_BY_ID[event.toBuddyId]) return { state: s };
      if (!s.roster.find((b) => b.buddyId === event.toBuddyId)) return { state: s };
      if (s.activeBuddy === event.toBuddyId) return { state: s };

      const d = today(event.at);
      const fromId = s.activeBuddy;
      const { session: newSession, sulk } = recordSwap(s.session, d, fromId, event.toBuddyId);

      s = {
        ...s,
        activeBuddy: event.toBuddyId,
        session: newSession,
        roster: sulk
          ? s.roster.map((b) =>
              b.buddyId === fromId
                ? { ...b, mood: 'sulking', moodSince: event.at }
                : b,
            )
          : s.roster,
      };
      return { state: s };
    }

    case 'pull': {
      const { result, state: newState } = pull(s, event.kind, rng);
      return { state: newState };
    }

    case 'release': {
      const newState = release(s, event.buddyId, event.confirm);
      return { state: newState };
    }

    case 'force_unlock': {
      const newState = forceUnlock(s, event.buddyId, rng);
      return { state: newState };
    }

    case 'talk': {
      const ab = activeBuddy(s);
      const reply = talkReply(ab.rarity, ab.traitPrimary, ab.evolutionStage, event.text, rng);
      return { state: s, reply };
    }

    case 'session_end': {
      // Persist tameHours based on session duration
      const sessionHours = (new Date(event.at).getTime() - new Date(s.session.sessionStart).getTime()) / 3600000;
      s = updateActiveBuddy(s, (b) => ({ ...b, tameHours: b.tameHours + sessionHours }));
      s = postEvolveBond(s);
      return { state: s };
    }
  }
}

export { createInitialState };
