export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type EvolutionType = 'three-stage' | 'two-stage' | 'level-based';
export type Mood = 'bored' | 'curious' | 'engaged' | 'excited' | 'overstimulated' | 'tired' | 'sulking' | 'betrayed';
export type PullKind = 'common' | 'rare' | 'legendary';
export type BondFlag = 'name' | 'rarePool' | 'accessory' | 'memory';

export type Severity = 'none' | 'mild' | 'roast' | 'savage' | 'cold' | 'devastation';

export type Trigger =
  | 'morning'
  | 'late_night'
  | 'past_midnight'
  | 'short_burst'
  | 'flow_state'
  | 'marathon'
  | 'language_tag'
  | 'error_streak'
  | 'build_success'
  | 'test_fail'
  | 'idle_nudge'
  | 'roster_roast'
  | 'streak_break_roast'
  | 'comeback';

// Emotional axes — the "layers" of a personality. 0-100 each.
export interface AxisProfile {
  sarcasm: number;
  stubbornness: number;
  affection: number;
  tenderness: number;
  leadership: number;
  responsibility: number;
}
export type EmotionAxis = keyof AxisProfile;

export interface BuddyState {
  buddyId: string;
  currentForm: string;
  rarity: Rarity;
  evolutionStage: number;
  level: number;
  tameHours: number;
  xp: number;
  traitPrimary: string;
  traitSecondary?: string;
  traitTertiary?: string;
  mood: Mood;
  moodSince: string;
  accessoriesUnlocked: string[];
  bondMilestones: BondFlag[];
  awakenedAt?: string;
  // ── Emotional attachment layer ──────────────────────────────
  nickname?: string;            // user-given name ("Steve") — overrides currentForm in display
  personality: string;         // archetype id (rolled per instance, like a Pokémon's nature)
  baseAxes: AxisProfile;       // rolled at creation; amplified by evolution at read-time
  attachment: number;          // 0-100 — the emotional bond
  sharedSuccesses: number;     // builds/tests passed together
  sharedFailures: number;      // errors/test fails survived together (these bond you MORE)
  hunger: number;              // 0 (full) .. 100 (starving) — rises over time, feeding lowers it
  timesFed: number;
  lastFedAt?: string;
}

export interface PlayerState {
  shardBalance: number;
  resonanceShards: number;
  pityEpicCounter: number;
  pityLegendaryCounter: number;
  streakDays: number;
  lastSessionDate: string;
  rosterRoastFiredToday: boolean;
  comebackGiftGiven: boolean;
  midnightBuildDays: number;
  totalPulls: number;
  food: Record<string, number>;  // foodId -> count owned
}

export interface SessionState {
  sessionStart: string;
  sessionSwapCount: number;
  swapDates: Record<string, number>;
  lastCommentAt?: string;
  lastComment?: string;
  lastTickAt?: string;
  flowStartAt?: string;
  errorStreakActive: boolean;
  eventIndex: number;
}

export interface GameState {
  version: number;
  activeBuddy: string;
  roster: BuddyState[];
  player: PlayerState;
  session: SessionState;
}

export interface XpContext {
  flowMinutes: number;
  isPastMidnight: boolean;
  isFirstSessionOfDay: boolean;
  streakMultiplier: number;
}
