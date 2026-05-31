import type { Rarity, EvolutionType } from '../src/types.js';

export interface FormDef {
  stage: number;
  name: string;
  aura?: string;
}

export interface BuddyDef {
  id: string;
  rarity: Rarity;
  evolutionType: EvolutionType;
  forms: FormDef[];
  traitPrimary: string;
  traitSecondary?: string;
  traitTertiary?: string;
  accessoryIds: string[];
  awakenedName?: string;
}

export const BUDDIES: readonly BuddyDef[] = [
  // ─── COMMON (15) — 3 stage ───────────────────────────────────────────────
  {
    id: 'glitchlet',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Glitchlet' }, { stage: 1, name: 'Glitchin' }, { stage: 2, name: 'Glitchara' }],
    traitPrimary: 'Chaotic',
    accessoryIds: ['glitch-sparks', 'glitch-halo', 'glitch-wings', 'glitch-static', 'glitch-crown'],
  },
  {
    id: 'loopup',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Loopup' }, { stage: 1, name: 'Loopex' }, { stage: 2, name: 'Looprime' }],
    traitPrimary: 'Obsessive',
    accessoryIds: ['loop-ring', 'loop-spiral', 'loop-chains', 'loop-vortex', 'loop-infinity'],
  },
  {
    id: 'nullpup',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Nullpup' }, { stage: 1, name: 'Nullfang' }, { stage: 2, name: 'Nullvex' }],
    traitPrimary: 'Sarcastic',
    accessoryIds: ['null-collar', 'null-shard', 'null-eyes', 'null-void', 'null-crown'],
  },
  {
    id: 'byteling',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Byteling' }, { stage: 1, name: 'Bytewulf' }, { stage: 2, name: 'Bytestorm' }],
    traitPrimary: 'Gruff',
    accessoryIds: ['byte-claws', 'byte-armor', 'byte-storm-cape', 'byte-fang', 'byte-crown'],
  },
  {
    id: 'stackit',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Stackit' }, { stage: 1, name: 'Stackor' }, { stage: 2, name: 'Stackrux' }],
    traitPrimary: 'Anxious',
    accessoryIds: ['stack-brace', 'stack-belt', 'stack-overflow-hat', 'stack-runes', 'stack-crown'],
  },
  {
    id: 'pingling',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Pingling' }, { stage: 1, name: 'Pingsor' }, { stage: 2, name: 'Pingmoth' }],
    traitPrimary: 'Curious',
    accessoryIds: ['ping-antenna', 'ping-wings', 'ping-sensor', 'ping-trail', 'ping-halo'],
  },
  {
    id: 'tabbit',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Tabbit' }, { stage: 1, name: 'Tabbex' }, { stage: 2, name: 'Tabberon' }],
    traitPrimary: 'Restless',
    accessoryIds: ['tab-ears', 'tab-dash', 'tab-rocket', 'tab-trail', 'tab-blaze'],
  },
  {
    id: 'scopin',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Scopin' }, { stage: 1, name: 'Scopara' }, { stage: 2, name: 'Scopinth' }],
    traitPrimary: 'Methodical',
    accessoryIds: ['scope-lens', 'scope-grid', 'scope-map', 'scope-compass', 'scope-crown'],
  },
  {
    id: 'craslet',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Craslet' }, { stage: 1, name: 'Crashor' }, { stage: 2, name: 'Crashveil' }],
    traitPrimary: 'Nihilistic',
    accessoryIds: ['crash-splinter', 'crash-veil', 'crash-shroud', 'crash-sigil', 'crash-crown'],
  },
  {
    id: 'boolup',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Boolup' }, { stage: 1, name: 'Boolara' }, { stage: 2, name: 'Boolstrike' }],
    traitPrimary: 'Blunt',
    accessoryIds: ['bool-badge', 'bool-bolt', 'bool-strike-ring', 'bool-charge', 'bool-crown'],
  },
  {
    id: 'varlet',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Varlet' }, { stage: 1, name: 'Varkon' }, { stage: 2, name: 'Varkonis' }],
    traitPrimary: 'Forgetful',
    accessoryIds: ['var-tag', 'var-knot', 'var-rune', 'var-sigil', 'var-crown'],
  },
  {
    id: 'loglet',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Loglet' }, { stage: 1, name: 'Loghorn' }, { stage: 2, name: 'Logvast' }],
    traitPrimary: 'Stoic',
    accessoryIds: ['log-band', 'log-horn', 'log-tome', 'log-sigil', 'log-crown'],
  },
  {
    id: 'patchkin',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Patchkin' }, { stage: 1, name: 'Patchor' }, { stage: 2, name: 'Patchrend' }],
    traitPrimary: 'Nurturing',
    accessoryIds: ['patch-bandage', 'patch-kit', 'patch-weave', 'patch-blossom', 'patch-crown'],
  },
  {
    id: 'driftin',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Driftin' }, { stage: 1, name: 'Driftex' }, { stage: 2, name: 'Driftveil' }],
    traitPrimary: 'Melancholic',
    accessoryIds: ['drift-ribbon', 'drift-mist', 'drift-veil', 'drift-tear', 'drift-crown'],
  },
  {
    id: 'forklet',
    rarity: 'common', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Forklet' }, { stage: 1, name: 'Forksin' }, { stage: 2, name: 'Forkrune' }],
    traitPrimary: 'Unpredictable',
    accessoryIds: ['fork-tine', 'fork-brand', 'fork-rune', 'fork-lightning', 'fork-crown'],
  },

  // ─── UNCOMMON (12) — 3 stage ─────────────────────────────────────────────
  {
    id: 'hexcub',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Hexcub' }, { stage: 1, name: 'Hexbear' }, { stage: 2, name: 'Hexlord' }],
    traitPrimary: 'Gruff',
    accessoryIds: ['hex-claw', 'hex-mane', 'hex-sigil', 'hex-crown', 'hex-throne'],
  },
  {
    id: 'compilot',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Compilot' }, { stage: 1, name: 'Compilex' }, { stage: 2, name: 'Compilon' }],
    traitPrimary: 'Stoic',
    accessoryIds: ['comp-badge', 'comp-visor', 'comp-core', 'comp-sigil', 'comp-crown'],
  },
  {
    id: 'mergekit',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Mergekit' }, { stage: 1, name: 'Mergehorn' }, { stage: 2, name: 'Mergevast' }],
    traitPrimary: 'Diplomatic',
    accessoryIds: ['merge-band', 'merge-horn', 'merge-seal', 'merge-sigil', 'merge-crown'],
  },
  {
    id: 'cachekin',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Cachekin' }, { stage: 1, name: 'Cachorn' }, { stage: 2, name: 'Cacheveil' }],
    traitPrimary: 'Hoarder',
    accessoryIds: ['cache-pouch', 'cache-horn', 'cache-vault', 'cache-sigil', 'cache-crown'],
  },
  {
    id: 'threadlet',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Threadlet' }, { stage: 1, name: 'Threadex' }, { stage: 2, name: 'Threadrend' }],
    traitPrimary: 'Hyperactive',
    accessoryIds: ['thread-spool', 'thread-whirl', 'thread-rend', 'thread-storm', 'thread-crown'],
  },
  {
    id: 'parsekin',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Parsekin' }, { stage: 1, name: 'Parseron' }, { stage: 2, name: 'Parserune' }],
    traitPrimary: 'Analytical',
    accessoryIds: ['parse-lens', 'parse-grid', 'parse-rune', 'parse-sigil', 'parse-crown'],
  },
  {
    id: 'buildur',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Buildur' }, { stage: 1, name: 'Buildrak' }, { stage: 2, name: 'Buildrex' }],
    traitPrimary: 'Disciplined',
    accessoryIds: ['build-wrench', 'build-rack', 'build-crown', 'build-forge', 'build-throne'],
  },
  {
    id: 'hooklet',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Hooklet' }, { stage: 1, name: 'Hookvex' }, { stage: 2, name: 'Hookvast' }],
    traitPrimary: 'Clingy',
    accessoryIds: ['hook-clasp', 'hook-chain', 'hook-vex', 'hook-vast', 'hook-crown'],
  },
  {
    id: 'queuepup',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Queuepup' }, { stage: 1, name: 'Queuefang' }, { stage: 2, name: 'Queuestrike' }],
    traitPrimary: 'Patient',
    accessoryIds: ['queue-tag', 'queue-fang', 'queue-line', 'queue-sigil', 'queue-crown'],
  },
  {
    id: 'refactix',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Refactix' }, { stage: 1, name: 'Refaktor' }, { stage: 2, name: 'Refakthorn' }],
    traitPrimary: 'Perfectionist',
    accessoryIds: ['refact-lens', 'refact-chisel', 'refact-horn', 'refact-sigil', 'refact-crown'],
  },
  {
    id: 'lintlet',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Lintlet' }, { stage: 1, name: 'Linthorn' }, { stage: 2, name: 'Lintveil' }],
    traitPrimary: 'Judgmental',
    accessoryIds: ['lint-monocle', 'lint-horn', 'lint-veil', 'lint-sigil', 'lint-crown'],
  },
  {
    id: 'depseed',
    rarity: 'uncommon', evolutionType: 'three-stage',
    forms: [{ stage: 0, name: 'Depseed' }, { stage: 1, name: 'Depvine' }, { stage: 2, name: 'Depforest' }],
    traitPrimary: 'Parasitic',
    accessoryIds: ['dep-tendril', 'dep-vine', 'dep-canopy', 'dep-sigil', 'dep-crown'],
  },

  // ─── RARE (10) — 2 stage ─────────────────────────────────────────────────
  {
    id: 'asyncwing',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Asyncwing' }, { stage: 1, name: 'Asyncrend' }],
    traitPrimary: 'Impatient',
    accessoryIds: ['async-feather', 'async-rend', 'async-gust', 'async-sigil', 'async-crown'],
  },
  {
    id: 'kernfox',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Kernfox' }, { stage: 1, name: 'Kernveil' }],
    traitPrimary: 'Territorial',
    accessoryIds: ['kern-tail', 'kern-veil', 'kern-brand', 'kern-sigil', 'kern-crown'],
  },
  {
    id: 'proxlet',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Proxlet' }, { stage: 1, name: 'Proxhorn' }],
    traitPrimary: 'Deceptive',
    accessoryIds: ['prox-mask', 'prox-horn', 'prox-mirror', 'prox-sigil', 'prox-crown'],
  },
  {
    id: 'cryptkin',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Cryptkin' }, { stage: 1, name: 'Cryptvast' }],
    traitPrimary: 'Paranoid',
    accessoryIds: ['crypt-key', 'crypt-vast', 'crypt-cipher', 'crypt-sigil', 'crypt-crown'],
  },
  {
    id: 'dockerpup',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Dockerpup' }, { stage: 1, name: 'Dockerstrike' }],
    traitPrimary: 'Isolated',
    accessoryIds: ['docker-container', 'docker-strike', 'docker-net', 'docker-sigil', 'docker-crown'],
  },
  {
    id: 'pipeling',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Pipeling' }, { stage: 1, name: 'Pipehorn' }],
    traitPrimary: 'Relentless',
    accessoryIds: ['pipe-joint', 'pipe-horn', 'pipe-flow', 'pipe-sigil', 'pipe-crown'],
  },
  {
    id: 'shellcub',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Shellcub' }, { stage: 1, name: 'Shellrend' }],
    traitPrimary: 'Blunt',
    accessoryIds: ['shell-claw', 'shell-rend', 'shell-carapace', 'shell-sigil', 'shell-crown'],
  },
  {
    id: 'regexwing',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Regexwing' }, { stage: 1, name: 'Regexveil' }],
    traitPrimary: 'Obsessive',
    accessoryIds: ['regex-pattern', 'regex-veil', 'regex-web', 'regex-sigil', 'regex-crown'],
  },
  {
    id: 'daemonlet',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Daemonlet' }, { stage: 1, name: 'Daemonvast' }],
    traitPrimary: 'Eerie',
    accessoryIds: ['daemon-flicker', 'daemon-vast', 'daemon-lantern', 'daemon-sigil', 'daemon-crown'],
  },
  {
    id: 'heapkin',
    rarity: 'rare', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Heapkin' }, { stage: 1, name: 'Heaphorn' }],
    traitPrimary: 'Gluttonous',
    accessoryIds: ['heap-sack', 'heap-horn', 'heap-overflow', 'heap-sigil', 'heap-crown'],
  },

  // ─── EPIC (8) — 2 stage ──────────────────────────────────────────────────
  {
    id: 'voidpup',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Voidpup' }, { stage: 1, name: 'Voidstrike' }],
    traitPrimary: 'Nihilistic',
    traitSecondary: 'Eerie',
    accessoryIds: ['void-collar', 'void-strike-aura', 'void-echo', 'void-sigil', 'void-crown'],
  },
  {
    id: 'signalfox',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Signalfox' }, { stage: 1, name: 'Signalveil' }],
    traitPrimary: 'Prophetic',
    traitSecondary: 'Eerie',
    accessoryIds: ['signal-wave', 'signal-veil', 'signal-tower', 'signal-sigil', 'signal-crown'],
  },
  {
    id: 'kernelith',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Kernelith' }, { stage: 1, name: 'Kernelord' }],
    traitPrimary: 'Authoritative',
    traitSecondary: 'Territorial',
    accessoryIds: ['kern-stone', 'kern-lord-crown', 'kern-monolith', 'kern-sigil', 'kern-throne'],
  },
  {
    id: 'entropix',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Entropix' }, { stage: 1, name: 'Entrophorn' }],
    traitPrimary: 'Chaotic',
    traitSecondary: 'Unpredictable',
    accessoryIds: ['entropy-spark', 'entropy-horn', 'entropy-storm', 'entropy-sigil', 'entropy-crown'],
  },
  {
    id: 'spectrex',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Spectrex' }, { stage: 1, name: 'Spectrhorn' }],
    traitPrimary: 'Eerie',
    traitSecondary: 'Melancholic',
    accessoryIds: ['spectr-wave', 'spectr-horn', 'spectr-prism', 'spectr-sigil', 'spectr-crown'],
  },
  {
    id: 'recursix',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Recursix' }, { stage: 1, name: 'Recurshorn' }],
    traitPrimary: 'Obsessive',
    traitSecondary: 'Anxious',
    accessoryIds: ['recur-loop', 'recur-horn', 'recur-spiral', 'recur-sigil', 'recur-crown'],
  },
  {
    id: 'latenclaw',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Latenclaw' }, { stage: 1, name: 'Latenvast' }],
    traitPrimary: 'Impatient',
    traitSecondary: 'Relentless',
    accessoryIds: ['laten-claw', 'laten-vast', 'laten-pulse', 'laten-sigil', 'laten-crown'],
  },
  {
    id: 'drifthorn',
    rarity: 'epic', evolutionType: 'two-stage',
    forms: [{ stage: 0, name: 'Drifthorn' }, { stage: 1, name: 'Driftvast' }],
    traitPrimary: 'Melancholic',
    traitSecondary: 'Stoic',
    accessoryIds: ['drifthorn-mist', 'driftvast-veil', 'drift-elegy', 'drift-sigil', 'drift-throne'],
  },

  // ─── LEGENDARY (5) — level-based ─────────────────────────────────────────
  {
    id: 'nullgod',
    rarity: 'legendary', evolutionType: 'level-based',
    forms: [
      { stage: 0, name: 'Nullgod' },
      { stage: 1, name: 'Nullgod' },
      { stage: 2, name: 'Nullgod' },
      { stage: 3, name: 'Nullgod Unbound', aura: 'void-pulse' },
    ],
    traitPrimary: 'Chaotic',
    traitSecondary: 'Nihilistic',
    traitTertiary: 'Eerie',
    awakenedName: 'Nullgod Unbound',
    accessoryIds: ['nullgod-shard', 'nullgod-aura', 'nullgod-rift', 'nullgod-sigil', 'nullgod-throne'],
  },
  {
    id: 'compileris',
    rarity: 'legendary', evolutionType: 'level-based',
    forms: [
      { stage: 0, name: 'Compileris' },
      { stage: 1, name: 'Compileris' },
      { stage: 2, name: 'Compileris' },
      { stage: 3, name: 'Compileris Prime', aura: 'forge-glow' },
    ],
    traitPrimary: 'Disciplined',
    traitSecondary: 'Stoic',
    traitTertiary: 'Authoritative',
    awakenedName: 'Compileris Prime',
    accessoryIds: ['comp-core', 'comp-prime-badge', 'comp-forge', 'comp-sigil', 'comp-throne'],
  },
  {
    id: 'voidmere',
    rarity: 'legendary', evolutionType: 'level-based',
    forms: [
      { stage: 0, name: 'Voidmere' },
      { stage: 1, name: 'Voidmere' },
      { stage: 2, name: 'Voidmere' },
      { stage: 3, name: 'Voidmere Eternal', aura: 'silence-aura' },
    ],
    traitPrimary: 'Melancholic',
    traitSecondary: 'Eerie',
    traitTertiary: 'Stoic',
    awakenedName: 'Voidmere Eternal',
    accessoryIds: ['voidmere-mist', 'voidmere-echo', 'voidmere-pool', 'voidmere-sigil', 'voidmere-throne'],
  },
  {
    id: 'hexathorn',
    rarity: 'legendary', evolutionType: 'level-based',
    forms: [
      { stage: 0, name: 'Hexathorn' },
      { stage: 1, name: 'Hexathorn' },
      { stage: 2, name: 'Hexathorn' },
      { stage: 3, name: 'Hexathorn Ancient', aura: 'rune-fire' },
    ],
    traitPrimary: 'Territorial',
    traitSecondary: 'Analytical',
    traitTertiary: 'Gruff',
    awakenedName: 'Hexathorn Ancient',
    accessoryIds: ['hex-thorn', 'hex-ancient-rune', 'hex-ward', 'hex-sigil', 'hex-throne'],
  },
  {
    id: 'driftmare',
    rarity: 'legendary', evolutionType: 'level-based',
    forms: [
      { stage: 0, name: 'Driftmare' },
      { stage: 1, name: 'Driftmare' },
      { stage: 2, name: 'Driftmare' },
      { stage: 3, name: 'Driftmare Risen', aura: 'lost-time-glow' },
    ],
    traitPrimary: 'Melancholic',
    traitSecondary: 'Unpredictable',
    traitTertiary: 'Nihilistic',
    awakenedName: 'Driftmare Risen',
    accessoryIds: ['driftmare-wisp', 'driftmare-sorrow', 'driftmare-tide', 'driftmare-sigil', 'driftmare-throne'],
  },
];

export const BUDDIES_BY_ID: Readonly<Record<string, BuddyDef>> = Object.fromEntries(
  BUDDIES.map((b) => [b.id, b]),
);

export const BUDDIES_BY_RARITY: Readonly<Record<Rarity, readonly BuddyDef[]>> = {
  common: BUDDIES.filter((b) => b.rarity === 'common'),
  uncommon: BUDDIES.filter((b) => b.rarity === 'uncommon'),
  rare: BUDDIES.filter((b) => b.rarity === 'rare'),
  epic: BUDDIES.filter((b) => b.rarity === 'epic'),
  legendary: BUDDIES.filter((b) => b.rarity === 'legendary'),
};
