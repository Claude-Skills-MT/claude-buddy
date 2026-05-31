// XP rates
export const XP_PASSIVE_PER_SECOND = 0.5;
export const XP_BURST_ERROR = 15;
export const XP_BURST_BUILD = 25;
export const XP_BURST_TEST = 10;
export const XP_FLOW_MULTIPLIER = 1.5;
export const XP_FLOW_THRESHOLD_MINUTES = 45;
export const XP_MIDNIGHT_MULTIPLIER = 1.3;
export const XP_FIRST_SESSION_BONUS = 100;
export const XP_ROSTER_PASSIVE_FRACTION = 0.1;

// Shard rates
export const SHARDS_PER_HOUR = 10;
export const SHARDS_BUILD_SUCCESS = 2;
export const SHARDS_ERROR_STREAK_RESOLVED = 3;
export const SHARDS_DAILY_STREAK = 5;
export const SHARDS_WEEKLY_STREAK = 25;
export const SHARDS_FIRST_SESSION = 5;

// Gacha pull costs
export const PULL_COST_COMMON = 50;
export const PULL_COST_RARE = 150;
export const PULL_COST_LEGENDARY = 500;

// Gacha drop weights (rare pull)
export const RARE_PULL_WEIGHTS = { rare: 60, epic: 35, legendary: 5 };

// Gacha drop weights (common pull)
export const COMMON_PULL_WEIGHTS = { common: 70, uncommon: 30 };

// Pity thresholds
export const PITY_EPIC_THRESHOLD = 10;
export const PITY_LEGENDARY_THRESHOLD = 50;

// Duplicate refunds
export const DUP_COMMON_UNCOMMON_SHARDS = 30;
export const DUP_COMMON_UNCOMMON_BOND_XP = 50;
export const DUP_RARE_EPIC_RESONANCE = 1;
export const DUP_LEGENDARY_RESONANCE = 5;
export const DUP_LEGENDARY_BONUS_LEVELS = 5;

// Resonance unlock thresholds
export const RESONANCE_ACCESSORY = 50;
export const RESONANCE_VARIANT = 100;
export const RESONANCE_FORCE_UNLOCK = 200;

// Evolution thresholds (hours)
export const EVOLVE_THREE_STAGE_1 = 10;
export const EVOLVE_THREE_STAGE_2 = 35;
export const EVOLVE_TWO_STAGE_1 = 20;

// Legendary level bands
export const LEGENDARY_BAND_1_MAX = 20;
export const LEGENDARY_BAND_2_MAX = 50;
export const LEGENDARY_BAND_3_MAX = 80;
export const LEGENDARY_AWAKENED_MIN = 81;
export const LEGENDARY_MAX_LEVEL = 100;

// Bond milestones (xp)
export const BOND_NAME_XP = 500;
export const BOND_RARE_POOL_XP = 1500;
export const BOND_ACCESSORY_XP = 3000;
export const BOND_MEMORY_XP = 5000;

// Streak
export const STREAK_MAX_MULTIPLIER = 7;

// Release values
export const RELEASE_VALUE_COMMON = 20;
export const RELEASE_VALUE_UNCOMMON = 20;
export const RELEASE_VALUE_RARE = 60;
export const RELEASE_VALUE_EPIC = 120;

// Comment timing (seconds)
export const COMMENT_MIN_INTERVAL_SEC = 8 * 60;
export const COMMENT_MAX_INTERVAL_SEC = 20 * 60;

// Roster roast
export const ROSTER_ROAST_CHANCE = 0.2;
export const ROSTER_ROAST_MIN_MINUTES = 30;

// State version
export const STATE_VERSION = 1;
