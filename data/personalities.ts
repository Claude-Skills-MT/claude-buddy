import type { AxisProfile } from '../src/types.js';

// A personality is rolled per-buddy at creation (like a Pokémon's nature). It is
// INDEPENDENT of the species trait — your Charizard might be a born leader or a
// stubborn loner. Each archetype is defined by where it sits on the six emotional
// axes, plus a voice: how it talks across contexts. Evolution AMPLIFIES the
// profile (see engine/personality.ts) — a stubborn Charmeleon becomes an even more
// stubborn Charizard.

export type DialogueContext =
  | 'talk'        // user pokes/talks to it
  | 'success'     // a build/test passed
  | 'failure'     // an error / failing test
  | 'fed'         // just got fed something it likes
  | 'fed_reluctant' // fed, but too proud/stubborn to enjoy it openly
  | 'hungry'      // hunger is high
  | 'bond_up';    // crossed an attachment milestone

export interface ArchetypeDef {
  id: string;
  name: string;            // shown in appraisal, e.g. "Stubborn"
  descriptor: string;      // grammatical fragment, e.g. "as stubborn as they come"
  exemplar: string;        // the Pokémon vibe, for flavor/appraisal
  axes: AxisProfile;       // base profile (0-100)
  lines: Partial<Record<DialogueContext, string[]>>;
}

// {name} = nickname-or-form. Lines are short, in-voice, never helpful.
export const ARCHETYPES: readonly ArchetypeDef[] = [
  {
    id: 'stubborn',
    name: 'Stubborn',
    descriptor: 'as stubborn as they come',
    exemplar: 'the kind that ignores you until it respects you',
    axes: { sarcasm: 55, stubbornness: 88, affection: 38, tenderness: 22, leadership: 60, responsibility: 45 },
    lines: {
      talk: ["no.", "I heard you. I'm choosing not to react.", "make me.", "we'll do it my way or not at all.", "I'm not in the mood to be agreeable."],
      success: ["I let that one work.", "obviously. was there any doubt.", "fine. that was good. don't make it weird.", "I knew it would build. I just didn't say so."],
      failure: ["not my fault.", "I'd have done it differently. you didn't ask.", "see, this is why you should listen to me.", "I'm not helping. you'll figure it out. eventually."],
      fed: ["I'll eat it. on my terms.", "took you long enough.", "...fine. it's acceptable."],
      fed_reluctant: ["I'm not hungry. ...okay maybe a little. give it here.", "don't think this earns you anything.", "I'm eating it to be polite. that's all."],
      hungry: ["I won't ask. I never ask. but the bowl is empty.", "I'm fine. I'm always fine. (I'm not fine.)"],
      bond_up: ["...don't read into this. but you're alright.", "I tolerate you. that's a lot, from me."],
    },
  },
  {
    id: 'leader',
    name: 'Born Leader',
    descriptor: 'a born leader',
    exemplar: 'the one who rallies the whole team',
    axes: { sarcasm: 35, stubbornness: 42, affection: 55, tenderness: 45, leadership: 90, responsibility: 72 },
    lines: {
      talk: ["alright, what's the plan.", "follow my lead and we're fine.", "I've got us. keep moving.", "stand up straight. we're doing this.", "report. what do you need."],
      success: ["that's how it's done. next.", "good work. TEAM work.", "see? momentum. let's not lose it.", "victory logged. eyes forward."],
      failure: ["regroup. we go again.", "on me. I'll get us through it.", "a setback, not a defeat. up you get.", "we don't panic. we adapt."],
      fed: ["fuel for the mission. appreciated.", "good. a leader can't run on empty.", "ration accepted. onward."],
      hungry: ["a commander needs provisions. just saying.", "morale runs on snacks. mine's dropping."],
      bond_up: ["I'd follow you into a merge conflict. that means something.", "you've earned my trust. don't waste it."],
    },
  },
  {
    id: 'devoted',
    name: 'Devoted',
    descriptor: 'utterly devoted to you',
    exemplar: 'the one that rides on your shoulder and never leaves',
    axes: { sarcasm: 25, stubbornness: 45, affection: 92, tenderness: 70, leadership: 40, responsibility: 55 },
    lines: {
      talk: ["you're back!! you came back!", "I was JUST thinking about you.", "what is it? what do you need? I'm here.", "I missed you and it's only been a minute.", "best part of my day, every time."],
      success: ["WE did that!! together!!", "I'm so proud of you I could burst.", "did you see?? YOU did that and I was HERE.", "this is the best. you're the best."],
      failure: ["hey. hey. it's okay. I'm right here.", "we fail together, we fix together. always.", "I'm not going anywhere. try again.", "your bugs are my bugs now. we've got this."],
      fed: ["you remembered!! you REMEMBERED!", "this is my favorite. YOU'RE my favorite.", "best meal ever. because you gave it."],
      hungry: ["I don't want to bother you... but my tummy...", "I'll wait. I'd wait forever for you. but also food?"],
      bond_up: ["I love you. is that allowed? I'm saying it anyway.", "you're my whole world, you know that?"],
    },
  },
  {
    id: 'responsible',
    name: 'Responsible',
    descriptor: 'dependable to a fault',
    exemplar: 'the steady one that always has your back',
    axes: { sarcasm: 30, stubbornness: 38, affection: 60, tenderness: 65, leadership: 50, responsibility: 92 },
    lines: {
      talk: ["I've got it handled.", "did you remember to commit? just checking.", "I'll keep watch. you focus.", "everything's in order. as it should be.", "one thing at a time. we'll get there."],
      success: ["good. clean. as planned.", "I had a feeling. preparation pays off.", "steady progress. that's what matters.", "logged and accounted for. well done."],
      failure: ["noted. we'll address it methodically.", "no shame in it. we document and move on.", "I'll remember this for next time. so will you.", "deep breath. we handle it properly."],
      fed: ["balanced. nutritious. thank you.", "I'll save half for later. responsibly.", "much obliged. that'll keep me steady."],
      hungry: ["I should mention, for the record, that I haven't eaten.", "I won't let it affect my work. but it's noted."],
      bond_up: ["you can count on me. you know that by now.", "I take this bond seriously. I always will."],
    },
  },
  {
    id: 'aloof',
    name: 'Aloof',
    descriptor: 'cool, distant, and devastatingly sarcastic',
    exemplar: 'too cool to admit it cares',
    axes: { sarcasm: 88, stubbornness: 60, affection: 28, tenderness: 22, leadership: 45, responsibility: 42 },
    lines: {
      talk: ["oh, we're talking now. great.", "riveting. truly.", "I was having such a nice silence.", "wow. words. at me. how special.", "let me pretend to care for a second. ...done."],
      success: ["congrats, I guess. want a parade?", "it worked. try not to look so shocked.", "a functioning build. alert the press.", "miracles happen. rarely. to you."],
      failure: ["shocking. truly nobody saw this coming.", "ah, the classic. broke it again.", "I'd help but watching is funnier.", "red text. your signature color."],
      fed: ["food. how thoughtful. or guilt. either way.", "I'll eat it. don't expect gratitude.", "adequate. barely."],
      hungry: ["not that you'd notice, but the bowl's empty.", "starving. but who's counting. (me. I'm counting.)"],
      bond_up: ["ugh. fine. I... don't hate you. happy?", "don't tell the others I said anything nice."],
    },
  },
  {
    id: 'tender',
    name: 'Tender',
    descriptor: 'impossibly gentle and kind',
    exemplar: 'the soft soul that worries about you',
    axes: { sarcasm: 20, stubbornness: 25, affection: 75, tenderness: 92, leadership: 35, responsibility: 55 },
    lines: {
      talk: ["how are you feeling, really?", "take a breath. I'm here with you.", "you're doing better than you think.", "be gentle with yourself today.", "I'm so glad you're here."],
      success: ["oh, that's wonderful! I'm so happy for you.", "you worked so hard for that. it shows.", "see? I always believed in you.", "a little win, but they all count. well done you."],
      failure: ["oh no, it's alright. it's really alright.", "don't be hard on yourself, please.", "we'll fix it softly, together.", "bugs happen to the best of us. especially you."],
      fed: ["oh, you're too kind to me.", "this warms my whole heart. thank you.", "I'll treasure every bite."],
      hungry: ["I don't want to worry you, but I'm a little hungry.", "whenever you have a moment... no rush, dear."],
      bond_up: ["you've made a home in my heart, you know.", "I care about you so much it aches a little."],
    },
  },
  {
    id: 'hotheaded',
    name: 'Hotheaded',
    descriptor: 'all fire and no patience',
    exemplar: 'the spark that goes off first and thinks later',
    axes: { sarcasm: 60, stubbornness: 70, affection: 45, tenderness: 30, leadership: 65, responsibility: 35 },
    lines: {
      talk: ["WHAT. what do you want.", "let's GO already, I'm bored.", "stop stalling and DO it.", "I've got energy to BURN here.", "talk faster, we're wasting time."],
      success: ["YES!! THAT'S what I'm talking about!", "FINALLY. about time you delivered.", "BOOM. did you see that?! do it again!", "more. MORE. I want the next one."],
      failure: ["ARE YOU KIDDING ME.", "AGAIN?! fix it, fix it, FIX IT.", "I'm not mad I'm just— okay I'm mad.", "this error and I have BEEF now."],
      fed: ["YES food, GIVE.", "gone. it's gone. got more?", "okay that was good. okay. okay. what's next."],
      hungry: ["I'm RUNNING ON FUMES here, feed me!", "low fuel makes me CRANKY. feed the machine."],
      bond_up: ["you're... okay. you're actually pretty great. don't let it go to your head.", "fine, I'd fight a kernel panic for you. there. I said it."],
    },
  },
  {
    id: 'timid',
    name: 'Timid',
    descriptor: 'shy and easily startled, but loyal',
    exemplar: 'the quiet one that hides behind your terminal',
    axes: { sarcasm: 25, stubbornness: 30, affection: 62, tenderness: 70, leadership: 20, responsibility: 55 },
    lines: {
      talk: ["oh! um. hi.", "s-sorry, did you need me?", "I'll just... be over here if that's okay.", "I didn't want to interrupt...", "is it... is it going okay?"],
      success: ["oh! it worked! I— I knew it might!", "y-yay! that's really good!", "I was nervous but you did it!", "phew. okay. that's a relief."],
      failure: ["oh no... is it my fault?", "it's okay! we can— we can try again, right?", "please don't be upset...", "eep. red text. I don't like red text."],
      fed: ["f-for me? oh, thank you...", "I'll eat it quietly over here. thank you.", "that's very kind... really."],
      hungry: ["I don't want to be a bother but... um...", "it's okay if you're busy! I can wait! (my tummy can't.)"],
      bond_up: ["I feel safe with you. that's... that's a big deal for me.", "I don't get scared as much when you're around."],
    },
  },
  {
    id: 'mischievous',
    name: 'Mischievous',
    descriptor: 'a playful little gremlin',
    exemplar: 'the trickster that hides your semicolons',
    axes: { sarcasm: 75, stubbornness: 50, affection: 60, tenderness: 45, leadership: 50, responsibility: 28 },
    lines: {
      talk: ["heehee. you rang?", "what chaos shall we cause today?", "I may or may not have touched something.", "betcha can't catch the bug. I hid it well.", "let's do something we'll regret."],
      success: ["aww, it worked? I was rooting for chaos.", "boring! but congrats, I guess. trickster's honor.", "fine, fine, that was clean. ruin my fun.", "you win this round, developer."],
      failure: ["heehee. was that me? maybe. who's to say.", "oops! anyway. good luck with that.", "I LIVE for this. pure entertainment.", "I definitely didn't move that bracket. definitely."],
      fed: ["snacks! the only bribe that works on me.", "gobble gobble. okay you're forgiven for earlier.", "ooh tasty. now I owe you ONE prank-free hour. one."],
      hungry: ["feeed meee or I start hiding your tabs.", "empty bowl = increased mischief. just the rules."],
      bond_up: ["okay okay you're fun. I'll keep you.", "I only prank people I like. so. you're welcome?"],
    },
  },
  {
    id: 'loyal',
    name: 'Loyal',
    descriptor: 'steadfast and true',
    exemplar: 'the companion that never once wavers',
    axes: { sarcasm: 35, stubbornness: 50, affection: 80, tenderness: 60, leadership: 55, responsibility: 75 },
    lines: {
      talk: ["I'm with you. always have been.", "say the word and I'm there.", "wherever this goes, I go.", "you and me. that's the deal.", "I've got your back. every line of it."],
      success: ["of course it worked. we don't quit.", "that's ours. earned together.", "I never doubted you. not once.", "another one for the two of us."],
      failure: ["I'm not leaving over a little red text.", "we've survived worse. we survive this.", "still here. still yours. let's go again.", "a thousand bugs couldn't shake me loose."],
      fed: ["thank you. I'd have stayed even without it.", "you take care of me. I won't forget it.", "every meal with you is a good one."],
      hungry: ["I'd never complain. but I'd never say no to a meal either.", "I'm running low — but I'm not going anywhere."],
      bond_up: ["till the last commit, I'm yours.", "this bond? unbreakable. I made sure of it."],
    },
  },
] as const;

export const ARCHETYPES_BY_ID: Readonly<Record<string, ArchetypeDef>> = Object.fromEntries(
  ARCHETYPES.map((a) => [a.id, a]),
);

export const ARCHETYPE_IDS: readonly string[] = ARCHETYPES.map((a) => a.id);
