import type { CommentEntry } from './index.js';

// TODO: expand to 15-30 entries
export const idleNudgePool: CommentEntry[] = [
  { text: "you went quiet." },
  { text: "I'm still here." },
  { text: "thinking? debugging in your head? both are valid." },
  { text: "it's been a while since your last keystroke.", trait: ['Anxious'] },
  { text: "I'm not rushing you. I'm noting the silence.", trait: ['Stoic'] },
  { text: "idle time is still time I'm not judging but I'm noting it.", trait: ['Judgmental'] },
  { text: "...", trait: ['Melancholic'] },
  { text: "do you need a moment. take the moment.", trait: ['Nurturing'] },
];
