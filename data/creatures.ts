// Kaomoji-style ASCII art for each buddy species.
// {f} in `mid` is replaced at render time with a 3-char mood face.
// Line widths within a creature don't have to match — render.ts pads to max.

export interface CreatureDef {
  top: string;
  mid: string; // contains exactly one {f} placeholder
  bot: string;
}

// ── mood faces ───────────────────────────────────────────────────────────────
//
//  3 chars: left-eye + nose/mouth + right-eye (or mouth in centre).
//  Eyes tell the story: o = round/alert, ^ = happy-squint, - = flat/sleepy,
//  = = half-lidded, > = angry-squint, T = tear-drip.
//
//  bored     curious   engaged   excited   over      tired     sulking   betrayed
//  -_-       o.o       ^‿^       ♥v♥       OAO       =_=       >_<       T_T

export const MOOD_FACE: Record<string, string> = {
  bored:          '-_-',   // flat deadpan eyes
  curious:        'o.o',   // wide open eyes, dot nose
  engaged:        '^‿^',   // happy-squint + curved smile  (U+203F undertie)
  excited:        '♥v♥',   // heart eyes + V-mouth
  overstimulated: 'OAO',   // huge shocked eyes
  tired:          '=_=',   // half-lidded sleepy eyes
  sulking:        '>_<',   // angry squint
  betrayed:       'T_T',   // tear-drip eyes
};

// ── archetypes ──────────────────────────────────────────────────────────────
//
//  Bodies are kept intentionally simple so the face (mood) stays the focal
//  point. Only the top silhouette & bottom hint at the species.
//
//  CAT        RABBIT     GHOST      DUCK       ROBOT
//   /\_/\      /\ /\     .-----.     ___       .[||].
//  ( -_- )    ( -_- )   | -_-  |  <( -_- )    |[-_-]|
//   ~ ~         v         '~~~'      ~~~        |___|
//
//  OWL        SNAIL      CAPYBARA   PENGUIN    BEAR
//  /^   ^\     ,___.     n~~~~n      (   )     (\   /)
//  ( -_- )    \(-_-)    ( -_- )    (-_-·>)    ( -_- )
//   (,^,)      ~\/~     (__o__)    /(___)\     (___)
//
//  DRAGON     FOX        BLOB       MUSHROOM   AXOLOTL
//  /^\  /^\   /\   /\    .-----.   .-o-OO-o.  }~(---)~{
//  <(-_-)>   ( -_- )    ( -_-  )  ( -_-   )  }~(-_-)~{
//  -vVVV-     ~~~~~      `~~~~~'     |   |     (_/ \_)

const CAT: CreatureDef = {
  top: ' /\\_/\\ ',
  mid: '( {f} )',
  bot: '  ~ ~  ',
};

const RABBIT: CreatureDef = {
  top: ' /\\ /\\ ',
  mid: '( {f} )',
  bot: '   v   ',
};

const GHOST: CreatureDef = {
  top: ' .-----.',
  mid: '| {f}  |',
  bot: " '~~~~~'",
};

const DUCK: CreatureDef = {
  top: '   ___  ',
  mid: '<( {f} )',
  bot: '   ~~~  ',
};

const ROBOT: CreatureDef = {
  top: ' .[||]. ',
  mid: '|[{f}]| ',
  bot: ' |___| ',
};

const OWL: CreatureDef = {
  top: '/^   ^\\',
  mid: '( {f} )',
  bot: ' (,^,) ',
};

const SNAIL: CreatureDef = {
  top: ' ,___. ',
  mid: '\\( {f})',
  bot: ' ~\\/~ ',
};

const CAPYBARA: CreatureDef = {
  top: 'n~~~~n ',
  mid: '( {f} )',
  bot: '(__o__)',
};

const PENGUIN: CreatureDef = {
  top: '  (   )  ',
  mid: '( {f}·>) ',
  bot: ' /(___)\\ ',
};

const BEAR: CreatureDef = {
  top: '(\\   /)',
  mid: '( {f} )',
  bot: ' (___)  ',
};

const DRAGON: CreatureDef = {
  top: '/^\\  /^\\',
  mid: '<( {f} )>',
  bot: ' -vVVV- ',
};

const FOX: CreatureDef = {
  top: '/\\   /\\',
  mid: '( {f} )',
  bot: ' ~~~~~ ',
};

const BLOB: CreatureDef = {
  top: ' .-----.',
  mid: '( {f}  )',
  bot: " `~~~~~'",
};

const MUSHROOM: CreatureDef = {
  top: '.-o-OO-o.',
  mid: '( {f}   )',
  bot: '  |   |  ',
};

const AXOLOTL: CreatureDef = {
  top: '}~(---)~{',
  mid: '}~({f})~{',
  bot: '(_/  \\_)',
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
