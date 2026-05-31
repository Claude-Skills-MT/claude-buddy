import type { CommentEntry } from './index.js';

// {rosterName} and {rosterTrait} placeholders are substituted at runtime.
// TODO: expand to 15-30 entries
export const rosterRoastPool: CommentEntry[] = [
  { text: "{rosterName} just sitting there. waiting. silently judging. classic." },
  { text: "your other buddy {rosterName} hasn't said anything in days. healthy." },
  { text: "just checking — {rosterName} is locked away right? we're good?" },
  { text: "{rosterName} with that {rosterTrait} thing. must be exhausting for you." },
  { text: "your other ones are soft.", trait: ['Gruff'] },
  { text: "I've seen your roster. I'm not impressed.", trait: ['Gruff'] },
  { text: "those little ones in your roster... they mean well.", rarity: ['legendary'] },
  { text: "I don't roast commons. it's beneath me.", rarity: ['legendary'] },
  { text: "{rosterName} is very {rosterTrait}. must be a vibe." },
  { text: "I'm the active buddy. {rosterName} is not. I want that acknowledged." },
];
