import type { Rng } from '../rng.js';
import { DEFLECTION_POOL, TALK_POOL } from '../../data/talk/index.js';
import type { TalkEntry } from '../../data/talk/index.js';

const CODING_KEYWORDS = [
  /how (do|to|can)/i,
  /what is/i,
  /why (does|is|won)/i,
  /\berror\b.*\bfix\b/i,
  /\bfunction\b/i,
  /\bimplement\b/i,
  /\bdebug\b/i,
  /\bcode\b.*\bwork\b/i,
  /\?$/,
];

export function looksLikeCodingQuestion(text: string): boolean {
  return CODING_KEYWORDS.some((re) => re.test(text));
}

function filterEntries(entries: TalkEntry[], rarity: string, trait: string, stage: number): TalkEntry[] {
  return entries.filter((e) => {
    if (e.rarity && !e.rarity.includes(rarity)) return false;
    if (e.trait && !e.trait.includes(trait)) return false;
    if (e.minStage !== undefined && stage < e.minStage) return false;
    return true;
  });
}

export function talkReply(
  rarity: string,
  traitPrimary: string,
  evolutionStage: number,
  userText: string,
  rng: Rng,
): string {
  if (looksLikeCodingQuestion(userText)) {
    const entries = filterEntries(DEFLECTION_POOL, rarity, traitPrimary, evolutionStage);
    const pool = entries.length > 0 ? entries : DEFLECTION_POOL;
    return rng.pick(pool).text;
  }

  const entries = filterEntries(TALK_POOL, rarity, traitPrimary, evolutionStage);
  const pool = entries.length > 0 ? entries : TALK_POOL;
  return rng.pick(pool).text;
}
