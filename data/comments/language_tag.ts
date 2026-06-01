import type { CommentEntry } from './index.js';

// TODO: expand to 15-30 entries. {lang} placeholder is substituted at runtime.
export const languageTagPool: CommentEntry[] = [
  { text: "{lang}. okay." },
  { text: "writing {lang} today. noted." },
  { text: "{lang} files. let's see how this goes." },
  { text: "oh {lang}. bold choice.", trait: ['Sarcastic'] },
  { text: "{lang} detected. adjusting expectations.", trait: ['Stoic'] },
  { text: "I have opinions about {lang}. I'll keep them.", rarity: ['epic', 'legendary'] },
];
