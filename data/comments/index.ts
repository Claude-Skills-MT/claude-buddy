import type { Trigger, Rarity, Severity } from '../../src/types.js';

export interface CommentEntry {
  text: string;
  rarity?: Rarity[];
  trait?: string[];
  minStage?: number;
  severity?: Severity;
}

export type CommentPools = Record<Trigger, CommentEntry[]>;

import { morningPool } from './morning.js';
import { lateNightPool } from './late_night.js';
import { pastMidnightPool } from './past_midnight.js';
import { shortBurstPool } from './short_burst.js';
import { flowStatePool } from './flow_state.js';
import { marathonPool } from './marathon.js';
import { languageTagPool } from './language_tag.js';
import { errorStreakPool } from './error_streak.js';
import { buildSuccessPool } from './build_success.js';
import { testFailPool } from './test_fail.js';
import { idleNudgePool } from './idle_nudge.js';
import { rosterRoastPool } from './roster_roast.js';
import { streakBreakRoastPool } from './streak_break_roast.js';
import { comebackPool } from './comeback.js';

export const COMMENT_POOLS: CommentPools = {
  morning: morningPool,
  late_night: lateNightPool,
  past_midnight: pastMidnightPool,
  short_burst: shortBurstPool,
  flow_state: flowStatePool,
  marathon: marathonPool,
  language_tag: languageTagPool,
  error_streak: errorStreakPool,
  build_success: buildSuccessPool,
  test_fail: testFailPool,
  idle_nudge: idleNudgePool,
  roster_roast: rosterRoastPool,
  streak_break_roast: streakBreakRoastPool,
  comeback: comebackPool,
};

export const CORE_TRIGGERS: Trigger[] = [
  'streak_break_roast', 'build_success', 'error_streak', 'flow_state', 'morning', 'comeback',
];
