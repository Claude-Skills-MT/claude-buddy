export interface TalkEntry {
  text: string;
  trait?: string[];
  rarity?: string[];
  minStage?: number;
}

// Deflection pool — used when user asks a coding question
export const DEFLECTION_POOL: TalkEntry[] = [
  { text: "that's not really my thing. have you tried crying?" },
  { text: "I don't do that. I do other things." },
  { text: "asking the wrong creature." },
  { text: "I'm a companion. not a consultant." },
  { text: "no." },
  { text: "lol no.", trait: ['Chaotic'] },
  { text: "I appreciate the faith. it is misplaced.", trait: ['Sarcastic'] },
  { text: "that falls outside my domain.", trait: ['Stoic'] },
  { text: "I could answer that. I won't.", trait: ['Blunt'] },
  { text: "you have a whole IDE for that. use it.", trait: ['Judgmental'] },
  { text: "try rubber duck debugging. I'm not the duck.", trait: ['Gruff'] },
  { text: "I believe in you to figure that out without me.", trait: ['Nurturing'] },
  { text: "ERROR: not within scope.", rarity: ['epic', 'legendary'] },
  { text: "that question has been asked. the answer lives elsewhere.", rarity: ['legendary'] },
];

// General talk responses
export const TALK_POOL: TalkEntry[] = [
  { text: "still here." },
  { text: "what do you want." },
  { text: "I'm watching." },
  { text: "that's a question I wasn't expecting." },
  { text: "working on it.", trait: ['Stoic'] },
  { text: "I have thoughts. I'll keep them.", trait: ['Melancholic'] },
  { text: "ask me something I can answer.", trait: ['Blunt'] },
  { text: "I appreciate the attention.", trait: ['Clingy'] },
  { text: "you clicked on me. noted.", trait: ['Sarcastic'] },
  { text: "I'm fine. are you fine. don't answer that.", trait: ['Nurturing'] },
  { text: "!!!", trait: ['Chaotic'] },
  { text: "...", trait: ['Melancholic'] },
  { text: "I've been thinking about your last session.", rarity: ['epic', 'legendary'] },
  { text: "we've been together a while now. I have opinions.", rarity: ['legendary'] },
];
