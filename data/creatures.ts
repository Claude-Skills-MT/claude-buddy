// Kaomoji-style ASCII art for each buddy species.
// {f} in `mid` is replaced at render time with a 3-char mood face.

export interface CreatureDef {
  top: string;
  mid: string; // contains exactly one {f} placeholder
  bot: string;
}

export const MOOD_FACE: Record<string, string> = {
  bored:          '·_·',
  curious:        '·o·',
  engaged:        '^-^',
  excited:        '^v^',
  overstimulated: '@o@',
  tired:          '-_-',
  sulking:        '>.<',
  betrayed:       'ToT',
};

// ── archetypes ──────────────────────────────────────────────────────────────

const CAT: CreatureDef = {
  top: ' /\\_/\\ ',
  mid: '( {f} )',
  bot: '  > <  ',
};

const RABBIT: CreatureDef = {
  top: '(\\ .. /)',
  mid: ' ( {f}) ',
  bot: '  (uu)  ',
};

const GHOST: CreatureDef = {
  top: ' .---. ',
  mid: '( {f} )',
  bot: '/|~~~| ',
};

const DUCK: CreatureDef = {
  top: '   _   ',
  mid: '<( {f})',
  bot: "  ' '  ",
};

const ROBOT: CreatureDef = {
  top: '.-----.',
  mid: '|[{f}]|',
  bot: '|_____|',
};

const OWL: CreatureDef = {
  top: '/^,·,^\\',
  mid: '( {f} )',
  bot: '  =w=  ',
};

const SNAIL: CreatureDef = {
  top: '   __  ',
  mid: '~( {f})',
  bot: " '----'",
};

const CAPYBARA: CreatureDef = {
  top: 'n_____n',
  mid: '( {f} )',
  bot: '(_____)' ,
};

const PENGUIN: CreatureDef = {
  top: ' (___) ',
  mid: '( {f} )',
  bot: ' /. .\\ ',
};

const BEAR: CreatureDef = {
  top: '(\\(·)/)',
  mid: ' ({f}) ',
  bot: ' (___) ',
};

const DRAGON: CreatureDef = {
  top: '/\\~/\\/',
  mid: ' ({f}) ',
  bot: '\\/,~,\\/',
};

const FOX: CreatureDef = {
  top: '/\\ /\\/',
  mid: '( {f})',
  bot: ' ~~~~ ',
};

const BLOB: CreatureDef = {
  top: '  .--. ',
  mid: ' ({f}) ',
  bot: '  `--` ',
};

const MUSHROOM: CreatureDef = {
  top: '(~~~~~)',
  mid: ' ({f}) ',
  bot: '  | |  ',
};

const AXOLOTL: CreatureDef = {
  top: '*\\  /*',
  mid: ' ({f})',
  bot: '~~()~~',
};

const DEFAULT_CREATURE: CreatureDef = BLOB;

// ── mapping: all 50 buddy IDs → archetype ──────────────────────────────────

export const CREATURE_BY_ID: Record<string, CreatureDef> = {
  // Common (15)
  glitchlet: GHOST,
  loopup:    SNAIL,
  nullpup:   CAT,
  byteling:  DUCK,
  stackit:   ROBOT,
  pingling:  BLOB,
  tabbit:    RABBIT,
  scopin:    OWL,
  craslet:   BLOB,
  boolup:    MUSHROOM,
  varlet:    CAT,
  loglet:    DUCK,
  patchkin:  SNAIL,
  driftin:   RABBIT,
  forklet:   FOX,

  // Uncommon (12)
  hexcub:    BEAR,
  compilot:  ROBOT,
  mergekit:  FOX,
  cachekin:  CAPYBARA,
  threadlet: SNAIL,
  parsekin:  OWL,
  buildur:   ROBOT,
  hooklet:   OWL,
  queuepup:  PENGUIN,
  refactix:  FOX,
  lintlet:   MUSHROOM,
  depseed:   MUSHROOM,

  // Rare (10)
  asyncwing: DRAGON,
  kernfox:   FOX,
  proxlet:   GHOST,
  cryptkin:  GHOST,
  dockerpup: PENGUIN,
  pipeling:  SNAIL,
  shellcub:  BEAR,
  regexwing: DRAGON,
  daemonlet: GHOST,
  heapkin:   CAPYBARA,

  // Epic (8)
  voidpup:   GHOST,
  signalfox: FOX,
  kernelith: DRAGON,
  entropix:  BLOB,
  spectrex:  AXOLOTL,
  recursix:  BLOB,
  latenclaw: DRAGON,
  drifthorn: CAPYBARA,

  // Legendary (5)
  nullgod:   DRAGON,
  compileris: ROBOT,
  voidmere:  GHOST,
  hexathorn: DRAGON,
  driftmare: CAPYBARA,
};

export { DEFAULT_CREATURE };
