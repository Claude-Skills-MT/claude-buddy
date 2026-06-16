// Kaomoji-style ASCII art for each buddy species, one CreatureDef per evolution form.
// {f} in `mid` is replaced at render time with a 3-char mood face.
// Line widths within a creature don't have to match — render.ts pads to max.
// Every buddy has its OWN unique array of forms, indexed by evolutionStage.

export interface CreatureDef {
  top: string;
  mid: string; // contains exactly one {f} placeholder
  bot: string;
}

// ── mood faces ───────────────────────────────────────────────────────────────
//
//  3 chars: left-eye + nose/mouth + right-eye (or mouth in centre).
//
//  bored     curious   engaged   excited   over      tired     sulking   betrayed
//  -_-       o.o       ^‿^       ♥v♥       OAO       =_=       >_<       T_T

export const MOOD_FACE: Record<string, string> = {
  bored:          '-_-',
  curious:        'o.o',
  engaged:        '^‿^',
  excited:        '♥v♥',
  overstimulated: 'OAO',
  tired:          '=_=',
  sulking:        '>_<',
  betrayed:       'T_T',
};

// ── Common (15) — 3 stages each ──────────────────────────────────────────────

const GLITCHLET_FORMS: CreatureDef[] = [
  // 0 Glitchlet — glitchy ghost
  { top: '.=|=|=.', mid: '| {f}  |', bot: " '~|~|~'" },
  // 1 Glitchin — taller, more artifacts, jagged crown
  { top: '|=|=|=|=|', mid: '|≋ {f} ≋|', bot: " '~|~|~|~'" },
  // 2 Glitchara — towering glitch-storm, shards everywhere
  { top: '≋|=|=|=|≋', mid: '≋[ {f} ]≋', bot: "  ~|≋|≋|~  " },
];

const LOOPUP_FORMS: CreatureDef[] = [
  // 0 Loopup — loop snail
  { top: ' ,@@@. ', mid: '\\( {f})', bot: ' ~\\o~ ' },
  // 1 Loopex — bigger shell, twin antennae
  { top: ' ,@@@@@. ', mid: '\\\\( {f} )', bot: ' ~\\oo~ ' },
  // 2 Looprime — massive spiral shell, looping aura
  { top: '↺,@@@@@,↺', mid: '↺\\( {f} )↺', bot: ' ~\\oOo~ ' },
];

const NULLPUP_FORMS: CreatureDef[] = [
  // 0 Nullpup — ghost puppy
  { top: ' /\\_/\\ ', mid: '( {f} )', bot: '  u u  ' },
  // 1 Nullfang — bigger, bared fangs
  { top: ' /\\_/\\ ', mid: '( {f} )', bot: ' \\WvW/ ' },
  // 2 Nullvex — hulking void-hound, fanged maw + aura
  { top: '/\\__/\\__', mid: '§( {f} )§', bot: ' \\WVWvW/ ' },
];

const BYTELING_FORMS: CreatureDef[] = [
  // 0 Byteling — binary duck
  { top: ' _01_  ', mid: '<( {f} )', bot: '  ~~~  ' },
  // 1 Bytewulf — bytes spread, sharper bill, wolfish
  { top: '_0110_  ', mid: '<<( {f} )', bot: ' /~~~\\ ' },
  // 2 Bytestorm — data-storm beast, crackling
  { top: '01·≋·10', mid: '<<§( {f} )§', bot: ' /≋~~≋\\ ' },
];

const STACKIT_FORMS: CreatureDef[] = [
  // 0 Stackit — stack robot
  { top: '=[=|=]=', mid: '|[{f}]|', bot: ' |___| ' },
  // 1 Stackor — taller stack, double plating
  { top: '=[=|=|=]=', mid: '|[ {f} ]|', bot: '|[=|=]| ' },
  // 2 Stackrux — towering stack-mech, antenna
  { top: '★=[=|=|=]=★', mid: '|[[ {f} ]]|', bot: '|[=|=|=]|' },
];

const PINGLING_FORMS: CreatureDef[] = [
  // 0 Pingling — ping blob
  { top: ' .~~~. ', mid: '( {f}  )', bot: " `·····'" },
  // 1 Pingsor — wider ripple aura
  { top: '.~≈~≈~. ', mid: '(( {f} ))', bot: " `··•··'" },
  // 2 Pingmoth — moth wings of signal ripples
  { top: '≈.~≈~≈~.≈', mid: '≈(( {f} ))≈', bot: " `·•·•·•·'" },
];

const TABBIT_FORMS: CreatureDef[] = [
  // 0 Tabbit — tab rabbit
  { top: ' >> >> ', mid: '( {f} )', bot: '   v   ' },
  // 1 Tabbex — taller ears, leaner
  { top: '>>> >>> ', mid: '(( {f} ))', bot: '  \\v/  ' },
  // 2 Tabberon — towering rabbit-buck, long ears
  { top: '>>>> >>>>', mid: '((§ {f} §))', bot: '  \\vWv/  ' },
];

const SCOPIN_FORMS: CreatureDef[] = [
  // 0 Scopin — scope owl
  { top: '/^   ^\\', mid: '( {f} )', bot: ' (,v,) ' },
  // 1 Scopara — bigger brow tufts, spread wings
  { top: '/^^ ^^\\', mid: '(( {f} ))', bot: ' (,vWv,)' },
  // 2 Scopinth — grand owl, full wings + crest
  { top: '╱/^^ ^^\\╲', mid: '((§ {f} §))', bot: '(,vWvWv,)' },
];

const CRASLET_FORMS: CreatureDef[] = [
  // 0 Craslet — crash blob
  { top: ' .x-x. ', mid: '( {f}  )', bot: " `/////'" },
  // 1 Crashor — cracked wide, jagged shards
  { top: '.x-x-x. ', mid: '(( {f} ))', bot: " `//\\//'" },
  // 2 Crashveil — shattered ethereal mass
  { top: 'x.≋x-x≋.x', mid: '((§ {f} §))', bot: " `/≋\\/≋/'" },
];

const BOOLUP_FORMS: CreatureDef[] = [
  // 0 Boolup — bool mushroom
  { top: '.T---F.', mid: '( {f}  )', bot: '  | |  ' },
  // 1 Boolara — wider cap, twin stem
  { top: '.T--^--F.', mid: '(( {f} ))', bot: '  |·|·|  ' },
  // 2 Boolstrike — battle-mushroom, spore strikes
  { top: '★.T-^-F.★', mid: '((§ {f} §))', bot: '  \\|VV|/  ' },
];

const VARLET_FORMS: CreatureDef[] = [
  // 0 Varlet — variable cat
  { top: ' $\\_/$ ', mid: '( {f} )', bot: '  ~ ~  ' },
  // 1 Varkon — bigger cat, fanged
  { top: '$\\_ _/$', mid: '(( {f} ))', bot: ' ~W~W~ ' },
  // 2 Varkonis — regal var-lion, mane
  { top: '$§\\_ _/§$', mid: '((§ {f} §))', bot: ' ~WvWvW~ ' },
];

const LOGLET_FORMS: CreatureDef[] = [
  // 0 Loglet — log duck
  { top: ' _≡≡_  ', mid: '<( {f} )', bot: '  ~~~  ' },
  // 1 Loghorn — log lines + horn
  { top: '/≡≡≡_  ', mid: '<( {f} )', bot: ' \\~~~/ ' },
  // 2 Logvast — vast horned log-beast
  { top: '§/≡≡≡≡\\§', mid: '<<§( {f} )§', bot: ' \\~≋~≋/ ' },
];

const PATCHKIN_FORMS: CreatureDef[] = [
  // 0 Patchkin — patch snail
  { top: ' ,###. ', mid: '\\( {f})', bot: ' ~\\/~ ' },
  // 1 Patchor — bigger patched shell
  { top: ' ,#####. ', mid: '\\\\( {f} )', bot: ' ~\\##/~ ' },
  // 2 Patchrend — torn jagged shell
  { top: '#,##≋##,#', mid: '\\\\§( {f} )§', bot: ' ~\\#≋#/~ ' },
];

const DRIFTIN_FORMS: CreatureDef[] = [
  // 0 Driftin — drift rabbit
  { top: '/\\  /\\ ', mid: '( {f} )', bot: '  ~v~  ' },
  // 1 Driftex — leaner, drifting trails
  { top: '/\\∿ ∿/\\', mid: '(( {f} ))', bot: ' ~∿v∿~ ' },
  // 2 Driftveil — ethereal drift-beast, veil trails
  { top: '∿/\\∿ ∿/\\∿', mid: '((§ {f} §))', bot: ' ~∿vWv∿~ ' },
];

const FORKLET_FORMS: CreatureDef[] = [
  // 0 Forklet — fork fox
  { top: 'Y\\   /Y', mid: '( {f} )', bot: ' ~~~~~ ' },
  // 1 Forksin — sharper forked ears, fangs
  { top: 'Y\\Y Y/Y', mid: '(( {f} ))', bot: ' ~WvW~ ' },
  // 2 Forkrune — mystical fork-fox, rune marks
  { top: '§Y\\Y Y/Y§', mid: '((§ {f} §))', bot: ' ~WvWvW~ ' },
];

// ── Uncommon (12) — 3 stages each ────────────────────────────────────────────

const HEXCUB_FORMS: CreatureDef[] = [
  // 0 Hexcub — hex bear
  { top: '(0x   0x)', mid: '( {f}  )', bot: ' (___) ' },
  // 1 Hexbear — bigger bear, broader frame
  { top: '(0x  ~  0x)', mid: '(( {f}  ))', bot: ' (__□__) ' },
  // 2 Hexlord — regal hex-bear, crown
  { top: '★(0x ~ 0x)★', mid: '((§ {f} §))', bot: '(_□_□_)' },
];

const COMPILOT_FORMS: CreatureDef[] = [
  // 0 Compilot — compiler robot
  { top: '.|>|>|.', mid: '|[{f}]|', bot: ' |=|=| ' },
  // 1 Compilex — taller frame, more arrows
  { top: '.|>|>|>|.', mid: '|[ {f} ]|', bot: '|=|==|=|' },
  // 2 Compilon — towering compile-mech, antenna
  { top: '★|>|>|>|★', mid: '|[[ {f} ]]|', bot: '|=|=||=|=|' },
];

const MERGEKIT_FORMS: CreatureDef[] = [
  // 0 Mergekit — merge fox
  { top: '←\\   /→', mid: '( {f} )', bot: ' ~~≈~~ ' },
  // 1 Mergehorn — merge fox + horns
  { top: '←\\§ §/→', mid: '(( {f} ))', bot: ' ~≈W≈~ ' },
  // 2 Mergevast — vast merge-beast, broad aura
  { top: '≋←\\§ §/→≋', mid: '((§ {f} §))', bot: ' ~≈WvW≈~ ' },
];

const CACHEKIN_FORMS: CreatureDef[] = [
  // 0 Cachekin — cache capybara
  { top: 'n[~~]n ', mid: '( {f} )', bot: '(__□__)' },
  // 1 Cachorn — capybara + horn slots
  { top: 'n[~§~]n ', mid: '(( {f} ))', bot: '(_□_□_)' },
  // 2 Cacheveil — vast cache-beast, layered slots
  { top: '≋n[~§~]n≋', mid: '((§ {f} §))', bot: '(_□□□□_)' },
];

const THREADLET_FORMS: CreatureDef[] = [
  // 0 Threadlet — thread snail
  { top: ' ,===. ', mid: '\\( {f})', bot: ' ~===~ ' },
  // 1 Threadex — woven shell, twin antennae
  { top: ' ,=====. ', mid: '\\\\( {f} )', bot: ' ~==·==~ ' },
  // 2 Threadrend — torn thread-mass, jagged
  { top: '=,==≋==,=', mid: '\\\\§( {f} )§', bot: ' ~=≋=≋=~ ' },
];

const PARSEKIN_FORMS: CreatureDef[] = [
  // 0 Parsekin — parse owl
  { top: '/<>  <>\\', mid: '( {f} )', bot: ' (,^,) ' },
  // 1 Parseron — bigger owl, spread wings
  { top: '/<><> <><>\\', mid: '(( {f} ))', bot: ' (,^W^,) ' },
  // 2 Parserune — mystical owl, rune crest
  { top: '§/<><> <><>\\§', mid: '((§ {f} §))', bot: '(,^WvW^,)' },
];

const BUILDUR_FORMS: CreatureDef[] = [
  // 0 Buildur — build robot
  { top: ' #[##]# ', mid: '|[{f}]|', bot: ' |###| ' },
  // 1 Buildrak — heavier crane frame
  { top: '#[####]# ', mid: '|[ {f} ]|', bot: '|#|##|#|' },
  // 2 Buildrex — colossal build-mech, T-crane
  { top: '★#[####]#★', mid: '|[[ {f} ]]|', bot: '|#|####|#|' },
];

const HOOKLET_FORMS: CreatureDef[] = [
  // 0 Hooklet — hook owl
  { top: 'J^   ^J', mid: '( {f} )', bot: ' (,J,) ' },
  // 1 Hookvex — sharper hook tufts, fangs
  { top: 'J^J J^J', mid: '(( {f} ))', bot: ' (,JWJ,) ' },
  // 2 Hookvast — vast hook-beast, wide wings
  { top: '≋J^J J^J≋', mid: '((§ {f} §))', bot: '(,JWvWJ,)' },
];

const QUEUEPUP_FORMS: CreatureDef[] = [
  // 0 Queuepup — queue penguin
  { top: ' [ ( ) ]', mid: '([{f}·>)', bot: '/([___]\\' },
  // 1 Queuefang — bigger queue, fangs
  { top: '[ [( )] ]', mid: '([ {f}·>)', bot: '/([_W_]\\' },
  // 2 Queuestrike — battle-penguin, striking
  { top: '★[ [( )] ]★', mid: '([§ {f}·>)§', bot: '/([_VWV_]\\' },
];

const REFACTIX_FORMS: CreatureDef[] = [
  // 0 Refactix — refactor fox
  { top: '↺\\   /↺', mid: '( {f} )', bot: ' ~↺~~↺ ' },
  // 1 Refaktor — bigger fox, cycle aura
  { top: '↺\\↺ ↺/↺', mid: '(( {f} ))', bot: ' ~↺W↺~ ' },
  // 2 Refakthorn — horned refactor-beast
  { top: '§↺\\↺ ↺/↺§', mid: '((§ {f} §))', bot: ' ~↺WvW↺~ ' },
];

const LINTLET_FORMS: CreatureDef[] = [
  // 0 Lintlet — lint mushroom
  { top: '.!-!!-!.', mid: '( {f}  )', bot: '  | !  ' },
  // 1 Linthorn — warning cap + horn
  { top: '.!-!§!-!.', mid: '(( {f} ))', bot: '  \\!|!/  ' },
  // 2 Lintveil — vast warning-spore beast
  { top: '≋.!-!§!-!.≋', mid: '((§ {f} §))', bot: ' \\!|VV|!/ ' },
];

const DEPSEED_FORMS: CreatureDef[] = [
  // 0 Depseed — dep seed mushroom
  { top: '.*·**·*.', mid: '( {f}  )', bot: '  |·|  ' },
  // 1 Depvine — sprouting vines
  { top: '.*·**·*·*.', mid: '(( {f} ))', bot: ' \\|·|·|/ ' },
  // 2 Depforest — towering dep-tree, canopy
  { top: '★*·**·**·*★', mid: '((§ {f} §))', bot: ' \\|·|·|·|/ ' },
];

// ── Rare (10) — 2 stages each ────────────────────────────────────────────────

const ASYNCWING_FORMS: CreatureDef[] = [
  // 0 Asyncwing — async dragon
  { top: '~^\\  /^~', mid: '<( {f} )>', bot: ' ~vVVv~ ' },
  // 1 Asyncrend — jagged torn wings, fierce
  { top: '≋~^\\≋ ≋/^~≋', mid: '<<§( {f} )§>>', bot: ' ~vVWVv~ ' },
];

const KERNFOX_FORMS: CreatureDef[] = [
  // 0 Kernfox — kernel fox
  { top: '[\\   /]', mid: '( {f} )', bot: ' ~[~]~ ' },
  // 1 Kernveil — ethereal kernel-fox, veil tails
  { top: '≋[\\§ §/]≋', mid: '((§ {f} §))', bot: ' ~[≋W≋]~ ' },
];

const PROXLET_FORMS: CreatureDef[] = [
  // 0 Proxlet — proxy ghost
  { top: '.->--<-.', mid: '| {f}  |', bot: " '->->->'" },
  // 1 Proxhorn — horned proxy-wraith
  { top: '§.->--<-.§', mid: '|§ {f} §|', bot: " '->-W->-'" },
];

const CRYPTKIN_FORMS: CreatureDef[] = [
  // 0 Cryptkin — crypto ghost
  { top: '.#--##-.', mid: '| {f}# |', bot: " '#####'" },
  // 1 Cryptvast — vast cipher-wraith
  { top: '≋.#--##-.≋', mid: '|§ {f}# §|', bot: " '#≋##≋#'" },
];

const DOCKERPUP_FORMS: CreatureDef[] = [
  // 0 Dockerpup — docker penguin
  { top: ' [( )] ', mid: '([{f}·>)', bot: '/[___]\\' },
  // 1 Dockerstrike — armored container-beast
  { top: '★[( )( )]★', mid: '([§{f}·>)§', bot: '/[_VWV_]\\' },
];

const PIPELING_FORMS: CreatureDef[] = [
  // 0 Pipeling — pipe snail
  { top: ' ,|||. ', mid: '\\( {f})', bot: ' ~|·|~ ' },
  // 1 Pipehorn — horned pipe-beast
  { top: '§,|||||.§', mid: '\\\\§( {f} )§', bot: ' ~|·|·|~ ' },
];

const SHELLCUB_FORMS: CreatureDef[] = [
  // 0 Shellcub — shell bear
  { top: '($   $)', mid: '( {f} )', bot: ' ($$$) ' },
  // 1 Shellrend — jagged shell-beast
  { top: '($≋ ≋$)', mid: '((§ {f} §))', bot: ' ($V$V$) ' },
];

const REGEXWING_FORMS: CreatureDef[] = [
  // 0 Regexwing — regex dragon
  { top: '.+\\  /+.', mid: '<( {f} )>', bot: ' .+VVV+. ' },
  // 1 Regexveil — vast pattern-dragon
  { top: '≋.+\\§ §/+.≋', mid: '<<§( {f} )§>>', bot: ' .+VWVWV+. ' },
];

const DAEMONLET_FORMS: CreatureDef[] = [
  // 0 Daemonlet — daemon ghost
  { top: ' .∿∿∿. ', mid: '| {f}  |', bot: " '∿∿∿∿∿'" },
  // 1 Daemonvast — vast daemon-wraith
  { top: '≋.∿∿∿∿∿.≋', mid: '|§ {f} §|', bot: " '∿∿W∿∿'" },
];

const HEAPKIN_FORMS: CreatureDef[] = [
  // 0 Heapkin — heap capybara
  { top: 'n^~~^n ', mid: '( {f} )', bot: '(^_^__)' },
  // 1 Heaphorn — horned heap-beast, taller stacks
  { top: 'n^^§^^n ', mid: '((§ {f} §))', bot: '(^_^_^_)' },
];

// ── Epic (8) — 2 stages each ─────────────────────────────────────────────────

const VOIDPUP_FORMS: CreatureDef[] = [
  // 0 Voidpup — void ghost pup
  { top: '.0---0.', mid: '| {f}0 |', bot: " '0~0~0'" },
  // 1 Voidstrike — striking void-hound, fangs + aura
  { top: '★0---0★', mid: '|§ {f}0 §|', bot: " '0VWV0'" },
];

const SIGNALFOX_FORMS: CreatureDef[] = [
  // 0 Signalfox — signal fox
  { top: '~\\   /~', mid: '( {f} )', bot: ' ≋≋≋≋≋ ' },
  // 1 Signalveil — ethereal signal-beast, wave veil
  { top: '≋~\\§ §/~≋', mid: '((§ {f} §))', bot: ' ≋≋W≋W≋ ' },
];

const KERNELITH_FORMS: CreatureDef[] = [
  // 0 Kernelith — kernel dragon
  { top: '|=====|', mid: '<[{f}]>', bot: '|=vVv=|' },
  // 1 Kernelord — regal monolith-dragon
  { top: '★|=====|★', mid: '<<[ {f} ]>>', bot: '|=vVWVv=|' },
];

const ENTROPIX_FORMS: CreatureDef[] = [
  // 0 Entropix — entropy blob
  { top: '~.~~~.~', mid: '({f}~~)', bot: '`~~∿~~∿`' },
  // 1 Entrophorn — horned chaos-beast
  { top: '§~.~∿~.~§', mid: '(§{f}~~§)', bot: '`~∿~W~∿~`' },
];

const SPECTREX_FORMS: CreatureDef[] = [
  // 0 Spectrex — spectre axolotl
  { top: '}°(---)°{', mid: '}°({f})°{', bot: '(_/ \\_ )' },
  // 1 Spectrhorn — horned spectral axolotl
  { top: '}°§(---)§°{', mid: '}°(§{f}§)°{', bot: '(_/V\\V_ )' },
];

const RECURSIX_FORMS: CreatureDef[] = [
  // 0 Recursix — recursive blob
  { top: '((.--.))', mid: '(({f} ))', bot: "((`..'  ))" },
  // 1 Recurshorn — horned recursion-beast
  { top: '§((.--.))§', mid: '((§{f} §))', bot: "((`.W.'  ))" },
];

const LATENCLAW_FORMS: CreatureDef[] = [
  // 0 Latenclaw — latency dragon
  { top: '!!\\  /!!', mid: '<( {f} )>', bot: ' !vVVv! ' },
  // 1 Latenvast — vast latency-dragon
  { top: '≋!!\\§ §/!!≋', mid: '<<§( {f} )§>>', bot: ' !vVWVv! ' },
];

const DRIFTHORN_FORMS: CreatureDef[] = [
  // 0 Drifthorn — drift capybara w/ horn
  { top: 'n/\\~~n ', mid: '( {f} )', bot: '(/\\o/\\)' },
  // 1 Driftvast — vast drift-beast, twin horns + veil
  { top: '∿n/\\~/\\n∿', mid: '((§ {f} §))', bot: '(/\\oWo/\\)' },
];

// ── Legendary (5) — 4 forms each (0-2 growth, 3 Awakened) ────────────────────

const NULLGOD_FORMS: CreatureDef[] = [
  // 0 Nullgod
  { top: '*^\\**/**^*', mid: '<*( {f} )*>', bot: '**-vVVv-**' },
  // 1 Nullgod — grander
  { top: '★*^\\**/**^*★', mid: '<*§( {f} )§*>', bot: '**-vVWVv-**' },
  // 2 Nullgod — towering
  { top: '★*^\\*✦*/*^*★', mid: '<<*§( {f} )§*>>', bot: '**=vVWVv=**' },
  // 3 Nullgod Unbound — showpiece, full star aura
  { top: '✦★*^\\*✦*/*^*★✦', mid: '✧<<*§( {f} )§*>>✧', bot: '★**=vWVWVw=**★' },
];

const COMPILERIS_FORMS: CreatureDef[] = [
  // 0 Compileris
  { top: '**[||]**', mid: '*[{f}]*', bot: '**|=|**' },
  // 1 Compileris — grander
  { top: '★**[||]**★', mid: '*[ {f} ]*', bot: '**|=|=|**' },
  // 2 Compileris — towering
  { top: '★**[|✦|]**★', mid: '*[[ {f} ]]*', bot: '**|=|=|=|**' },
  // 3 Compileris Prime — showpiece, radiant frame
  { top: '✦★**[|✦|]**★✦', mid: '✧*[[ {f} ]]*✧', bot: '★**|=|◆|=|**★' },
];

const VOIDMERE_FORMS: CreatureDef[] = [
  // 0 Voidmere
  { top: '*.=====.*', mid: '*| {f} |*', bot: "*'~*~*~'*" },
  // 1 Voidmere — grander
  { top: '★*.=====.*★', mid: '*|§ {f} §|*', bot: "*'~*W*~'*" },
  // 2 Voidmere — towering
  { top: '★*.==✦==.*★', mid: '*|§§ {f} §§|*', bot: "*'~*WVW*~'*" },
  // 3 Voidmere Eternal — showpiece, eternal star halo
  { top: '✦★*.==✦==.*★✦', mid: '✧*|§§ {f} §§|*✧', bot: "★*'~*WVW*~'*★" },
];

const HEXATHORN_FORMS: CreatureDef[] = [
  // 0 Hexathorn
  { top: '§^\\  /^§', mid: '<§{f}§>', bot: '§-vVVv-§' },
  // 1 Hexathorn — grander
  { top: '★§^\\§ §/^§★', mid: '<<§ {f} §>>', bot: '§-vVWVv-§' },
  // 2 Hexathorn — towering
  { top: '★§^\\✦/^§★', mid: '<<§§ {f} §§>>', bot: '§=vVWVv=§' },
  // 3 Hexathorn Ancient — showpiece, ancient thorn crown
  { top: '✦★§^\\✦/^§★✦', mid: '✧<<§§ {f} §§>>✧', bot: '★§=vWVWVw=§★' },
];

const DRIFTMARE_FORMS: CreatureDef[] = [
  // 0 Driftmare
  { top: '*n~~~n*', mid: '*( {f} )*', bot: '*(★_★)*' },
  // 1 Driftmare — grander
  { top: '★*n~∿~n*★', mid: '*(§ {f} §)*', bot: '*(★W★)*' },
  // 2 Driftmare — towering
  { top: '★*n~✦~n*★', mid: '*((§ {f} §))*', bot: '*(★VWV★)*' },
  // 3 Driftmare Risen — showpiece, risen star mane
  { top: '✦★*n~✦~n*★✦', mid: '✧*((§ {f} §))*✧', bot: '★*(★VWV★)*★' },
];

// ── default, registry & accessor ─────────────────────────────────────────────

const DEFAULT_CREATURE: CreatureDef = { top: ' .---. ', mid: '( {f}  )', bot: " `---'" };

// For each buddy, an array of forms indexed by evolutionStage.
export const CREATURE_FORMS_BY_ID: Record<string, CreatureDef[]> = {
  // Common (15)
  glitchlet: GLITCHLET_FORMS,
  loopup:    LOOPUP_FORMS,
  nullpup:   NULLPUP_FORMS,
  byteling:  BYTELING_FORMS,
  stackit:   STACKIT_FORMS,
  pingling:  PINGLING_FORMS,
  tabbit:    TABBIT_FORMS,
  scopin:    SCOPIN_FORMS,
  craslet:   CRASLET_FORMS,
  boolup:    BOOLUP_FORMS,
  varlet:    VARLET_FORMS,
  loglet:    LOGLET_FORMS,
  patchkin:  PATCHKIN_FORMS,
  driftin:   DRIFTIN_FORMS,
  forklet:   FORKLET_FORMS,

  // Uncommon (12)
  hexcub:    HEXCUB_FORMS,
  compilot:  COMPILOT_FORMS,
  mergekit:  MERGEKIT_FORMS,
  cachekin:  CACHEKIN_FORMS,
  threadlet: THREADLET_FORMS,
  parsekin:  PARSEKIN_FORMS,
  buildur:   BUILDUR_FORMS,
  hooklet:   HOOKLET_FORMS,
  queuepup:  QUEUEPUP_FORMS,
  refactix:  REFACTIX_FORMS,
  lintlet:   LINTLET_FORMS,
  depseed:   DEPSEED_FORMS,

  // Rare (10)
  asyncwing: ASYNCWING_FORMS,
  kernfox:   KERNFOX_FORMS,
  proxlet:   PROXLET_FORMS,
  cryptkin:  CRYPTKIN_FORMS,
  dockerpup: DOCKERPUP_FORMS,
  pipeling:  PIPELING_FORMS,
  shellcub:  SHELLCUB_FORMS,
  regexwing: REGEXWING_FORMS,
  daemonlet: DAEMONLET_FORMS,
  heapkin:   HEAPKIN_FORMS,

  // Epic (8)
  voidpup:   VOIDPUP_FORMS,
  signalfox: SIGNALFOX_FORMS,
  kernelith: KERNELITH_FORMS,
  entropix:  ENTROPIX_FORMS,
  spectrex:  SPECTREX_FORMS,
  recursix:  RECURSIX_FORMS,
  latenclaw: LATENCLAW_FORMS,
  drifthorn: DRIFTHORN_FORMS,

  // Legendary (5)
  nullgod:    NULLGOD_FORMS,
  compileris: COMPILERIS_FORMS,
  voidmere:   VOIDMERE_FORMS,
  hexathorn:  HEXATHORN_FORMS,
  driftmare:  DRIFTMARE_FORMS,
};

// Safe accessor: clamps stage to available forms, falls back to a blob.
export function creatureFor(buddyId: string, stage: number): CreatureDef {
  const forms = CREATURE_FORMS_BY_ID[buddyId];
  if (!forms || forms.length === 0) return DEFAULT_CREATURE;
  const i = Math.max(0, Math.min(stage, forms.length - 1));
  return forms[i]!;
}

export { DEFAULT_CREATURE };
