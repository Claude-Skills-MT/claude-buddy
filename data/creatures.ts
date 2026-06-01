// Kaomoji-style ASCII art for each buddy species.
// {f} in `mid` is replaced at render time with a 3-char mood face.
// Line widths within a creature don't have to match — render.ts pads to max.
// Every buddy has its OWN unique CreatureDef — no sharing.

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

// ── Common (15) ──────────────────────────────────────────────────────────────

// nullpup — ghost puppy/dog  (floppy ears, ghost tail)
export const NULLPUP: CreatureDef = {
  top: ' /\\_/\\ ',
  mid: '( {f} )',
  bot: '  u u  ',
};

// glitchlet — glitchy ghost  (jagged top, glitch artifacts)
export const GLITCHLET: CreatureDef = {
  top: '.=|=|=.',
  mid: '| {f}  |',
  bot: " '~|~|~'",
};

// loopup — loop snail  (round shell, curled antenna)
export const LOOPUP: CreatureDef = {
  top: ' ,@@@. ',
  mid: '\\( {f})',
  bot: ' ~\\o~ ',
};

// byteling — binary duck  (01 on forehead, bill)
export const BYTELING: CreatureDef = {
  top: ' _01_  ',
  mid: '<( {f} )',
  bot: '  ~~~  ',
};

// stackit — stack robot  (stacked plates on top, boxy)
export const STACKIT: CreatureDef = {
  top: '=[=|=]=',
  mid: '|[{f}]|',
  bot: ' |___| ',
};

// pingling — ping blob  (round, signal ripple on top)
export const PINGLING: CreatureDef = {
  top: ' .~~~. ',
  mid: '( {f}  )',
  bot: " `·····'",
};

// tabbit — tab rabbit  (tab-key ears >>)
export const TABBIT: CreatureDef = {
  top: ' >> >> ',
  mid: '( {f} )',
  bot: '   v   ',
};

// scopin — scope owl  (curvy tufts, brow arches)
export const SCOPIN: CreatureDef = {
  top: '/^   ^\\',
  mid: '( {f} )',
  bot: ' (,v,) ',
};

// craslet — crash blob  (cracked top, X mark)
export const CRASLET: CreatureDef = {
  top: ' .x-x. ',
  mid: '( {f}  )',
  bot: " `/////'",
};

// boolup — bool mushroom  (T/F split cap)
export const BOOLUP: CreatureDef = {
  top: '.T---F.',
  mid: '( {f}  )',
  bot: '  | |  ',
};

// varlet — variable cat  ($ sign ear tufts)
export const VARLET: CreatureDef = {
  top: ' $\\_/$ ',
  mid: '( {f} )',
  bot: '  ~ ~  ',
};

// loglet — log duck  (logfile lines on forehead, bill)
export const LOGLET: CreatureDef = {
  top: ' _≡≡_  ',
  mid: '<( {f} )',
  bot: '  ~~~  ',
};

// patchkin — patch snail  (# patch on shell)
export const PATCHKIN: CreatureDef = {
  top: ' ,###. ',
  mid: '\\( {f})',
  bot: ' ~\\/~ ',
};

// driftin — drift rabbit  (drifting tilted ears)
export const DRIFTIN: CreatureDef = {
  top: '/\\  /\\ ',
  mid: '( {f} )',
  bot: '  ~v~  ',
};

// forklet — fork fox  (Y-shaped forked ears)
export const FORKLET: CreatureDef = {
  top: 'Y\\   /Y',
  mid: '( {f} )',
  bot: ' ~~~~~ ',
};

// ── Uncommon (12) ────────────────────────────────────────────────────────────

// hexcub — hex bear  (0x on forehead, round ears)
export const HEXCUB: CreatureDef = {
  top: '(0x   0x)',
  mid: '( {f}  )',
  bot: ' (___) ',
};

// compilot — compiler robot  (|>| arrow panels)
export const COMPILOT: CreatureDef = {
  top: '.|>|>|.',
  mid: '|[{f}]|',
  bot: ' |=|=| ',
};

// mergekit — merge fox  (← → merge arrows as ears)
export const MERGEKIT: CreatureDef = {
  top: '←\\   /→',
  mid: '( {f} )',
  bot: ' ~~≈~~ ',
};

// cachekin — cache capybara  ([] slot brackets on head)
export const CACHEKIN: CreatureDef = {
  top: 'n[~~]n ',
  mid: '( {f} )',
  bot: '(__□__)',
};

// threadlet — thread snail  (=== thread lines on shell)
export const THREADLET: CreatureDef = {
  top: ' ,===. ',
  mid: '\\( {f})',
  bot: ' ~===~ ',
};

// parsekin — parse owl  (<> tag tufts)
export const PARSEKIN: CreatureDef = {
  top: '/<>  <>\\',
  mid: '( {f} )',
  bot: ' (,^,) ',
};

// buildur — build robot  (# hash crown, heavy frame)
export const BUILDUR: CreatureDef = {
  top: ' #[##]# ',
  mid: '|[{f}]|',
  bot: ' |###| ',
};

// hooklet — hook owl  (J-shaped hook ear tufts)
export const HOOKLET: CreatureDef = {
  top: 'J^   ^J',
  mid: '( {f} )',
  bot: ' (,J,) ',
};

// queuepup — queue penguin  ([ ] bracket sides)
export const QUEUEPUP: CreatureDef = {
  top: ' [ ( ) ]',
  mid: '([{f}·>)',
  bot: '/([___]\\',
};

// refactix — refactor fox  (↺ cycle symbol ears)
export const REFACTIX: CreatureDef = {
  top: '↺\\   /↺',
  mid: '( {f} )',
  bot: ' ~↺~~↺ ',
};

// lintlet — lint mushroom  (! warning spores on cap)
export const LINTLET: CreatureDef = {
  top: '.!-!!-!.',
  mid: '( {f}  )',
  bot: '  | !  ',
};

// depseed — dep seed mushroom  (* node dots on cap)
export const DEPSEED: CreatureDef = {
  top: '.*·**·*.',
  mid: '( {f}  )',
  bot: '  |·|  ',
};

// ── Rare (10) ────────────────────────────────────────────────────────────────

// asyncwing — async dragon  (~ wave wings)
export const ASYNCWING: CreatureDef = {
  top: '~^\\  /^~',
  mid: '<( {f} )>',
  bot: ' ~vVVv~ ',
};

// kernfox — kernel fox  ([] bracket ears)
export const KERNFOX: CreatureDef = {
  top: '[\\   /]',
  mid: '( {f} )',
  bot: ' ~[~]~ ',
};

// proxlet — proxy ghost  (-> arrows flowing through)
export const PROXLET: CreatureDef = {
  top: '.->--<-.',
  mid: '| {f}  |',
  bot: " '->->->'",
};

// cryptkin — crypto ghost  (# cipher marks on body)
export const CRYPTKIN: CreatureDef = {
  top: '.#--##-.',
  mid: '| {f}# |',
  bot: " '#####'",
};

// dockerpup — docker penguin  ([] container frame)
export const DOCKERPUP: CreatureDef = {
  top: ' [( )] ',
  mid: '([{f}·>)',
  bot: '/[___]\\',
};

// pipeling — pipe snail  (| pipe tubes on shell)
export const PIPELING: CreatureDef = {
  top: ' ,|||. ',
  mid: '\\( {f})',
  bot: ' ~|·|~ ',
};

// shellcub — shell bear  ($ prompt on forehead, heavy brow)
export const SHELLCUB: CreatureDef = {
  top: '($   $)',
  mid: '( {f} )',
  bot: ' ($$$) ',
};

// regexwing — regex dragon  (.+ pattern on wings)
export const REGEXWING: CreatureDef = {
  top: '.+\\  /+.',
  mid: '<( {f} )>',
  bot: ' .+VVV+. ',
};

// daemonlet — daemon ghost  (∿ infinity loop bottom)
export const DAEMONLET: CreatureDef = {
  top: ' .∿∿∿. ',
  mid: '| {f}  |',
  bot: " '∿∿∿∿∿'",
};

// heapkin — heap capybara  (^ pyramid stacks on head)
export const HEAPKIN: CreatureDef = {
  top: 'n^~~^n ',
  mid: '( {f} )',
  bot: '(^_^__)',
};

// ── Epic (8) ─────────────────────────────────────────────────────────────────

// voidpup — void ghost pup  (0 null marks, hollow eyes implied)
export const VOIDPUP: CreatureDef = {
  top: '.0---0.',
  mid: '| {f}0 |',
  bot: " '0~0~0'",
};

// signalfox — signal fox  (~ wave ears and tail)
export const SIGNALFOX: CreatureDef = {
  top: '~\\   /~',
  mid: '( {f} )',
  bot: ' ≋≋≋≋≋ ',
};

// kernelith — kernel dragon  (monolith flat-top, imposing)
export const KERNELITH: CreatureDef = {
  top: '|=====|',
  mid: '<[{f}]>',
  bot: '|=vVv=|',
};

// entropix — entropy blob  (~ chaotic squiggles)
export const ENTROPIX: CreatureDef = {
  top: '~.~~~.~',
  mid: '({f}~~)',
  bot: '`~~∿~~∿`',
};

// spectrex — spectre axolotl  (spectral frills, glowing)
export const SPECTREX: CreatureDef = {
  top: '}°(---)°{',
  mid: '}°({f})°{',
  bot: '(_/ \\_ )',
};

// recursix — recursive blob  (nested parentheses)
export const RECURSIX: CreatureDef = {
  top: '((.--.))',
  mid: '(({f} ))',
  bot: "((`..'  ))",
};

// latenclaw — latency dragon  (!! delay marks, heavy claws)
export const LATENCLAW: CreatureDef = {
  top: '!!\\  /!!',
  mid: '<( {f} )>',
  bot: ' !vVVv! ',
};

// drifthorn — drift capybara  (horn /\ on head)
export const DRIFTHORN: CreatureDef = {
  top: 'n/\\~~n ',
  mid: '( {f} )',
  bot: '(/\\o/\\)',
};

// ── Legendary (5) ────────────────────────────────────────────────────────────

// nullgod — void dragon supreme  (* stars around)
export const NULLGOD: CreatureDef = {
  top: '*^\\**/**^*',
  mid: '<*( {f} )*>',
  bot: '**-vVVv-**',
};

// compileris — prime compiler robot  (** double stars, grand frame)
export const COMPILERIS: CreatureDef = {
  top: '**[||]**',
  mid: '*[{f}]*',
  bot: '**|=|**',
};

// voidmere — eternal void ghost  (** ornate star border)
export const VOIDMERE: CreatureDef = {
  top: '*.=====.*',
  mid: '*| {f} |*',
  bot: "*'~*~*~'*",
};

// hexathorn — ancient hex dragon  (thorn spikes §)
export const HEXATHORN: CreatureDef = {
  top: '§^\\  /^§',
  mid: '<§{f}§>',
  bot: '§-vVVv-§',
};

// driftmare — risen drift capybara  (crown *** on head)
export const DRIFTMARE: CreatureDef = {
  top: '*n~~~n*',
  mid: '*( {f} )*',
  bot: '*(★_★)*',
};

// ── default & registry ───────────────────────────────────────────────────────

const DEFAULT_CREATURE: CreatureDef = PINGLING;

export const CREATURE_BY_ID: Record<string, CreatureDef> = {
  // Common (15)
  nullpup:   NULLPUP,
  glitchlet: GLITCHLET,
  loopup:    LOOPUP,
  byteling:  BYTELING,
  stackit:   STACKIT,
  pingling:  PINGLING,
  tabbit:    TABBIT,
  scopin:    SCOPIN,
  craslet:   CRASLET,
  boolup:    BOOLUP,
  varlet:    VARLET,
  loglet:    LOGLET,
  patchkin:  PATCHKIN,
  driftin:   DRIFTIN,
  forklet:   FORKLET,

  // Uncommon (12)
  hexcub:    HEXCUB,
  compilot:  COMPILOT,
  mergekit:  MERGEKIT,
  cachekin:  CACHEKIN,
  threadlet: THREADLET,
  parsekin:  PARSEKIN,
  buildur:   BUILDUR,
  hooklet:   HOOKLET,
  queuepup:  QUEUEPUP,
  refactix:  REFACTIX,
  lintlet:   LINTLET,
  depseed:   DEPSEED,

  // Rare (10)
  asyncwing: ASYNCWING,
  kernfox:   KERNFOX,
  proxlet:   PROXLET,
  cryptkin:  CRYPTKIN,
  dockerpup: DOCKERPUP,
  pipeling:  PIPELING,
  shellcub:  SHELLCUB,
  regexwing: REGEXWING,
  daemonlet: DAEMONLET,
  heapkin:   HEAPKIN,

  // Epic (8)
  voidpup:   VOIDPUP,
  signalfox: SIGNALFOX,
  kernelith: KERNELITH,
  entropix:  ENTROPIX,
  spectrex:  SPECTREX,
  recursix:  RECURSIX,
  latenclaw: LATENCLAW,
  drifthorn: DRIFTHORN,

  // Legendary (5)
  nullgod:    NULLGOD,
  compileris: COMPILERIS,
  voidmere:   VOIDMERE,
  hexathorn:  HEXATHORN,
  driftmare:  DRIFTMARE,
};

export { DEFAULT_CREATURE };
