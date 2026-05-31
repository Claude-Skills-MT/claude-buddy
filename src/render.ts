import type { GameState } from './types.js';
import { hearts, hungerTier } from './engine/attachment.js';
import { CREATURE_BY_ID, DEFAULT_CREATURE, MOOD_FACE } from '../data/creatures.js';

const MOOD_EMOJI: Record<string, string> = {
  bored: '😑',
  curious: '🤔',
  engaged: '🧐',
  excited: '⚡',
  overstimulated: '🤯',
  tired: '😪',
  sulking: '😒',
  betrayed: '😤',
};

const RARITY_EMOJI: Record<string, string> = {
  common: '◆',
  uncommon: '◈',
  rare: '✦',
  epic: '❋',
  legendary: '★',
};

export function render(state: GameState, comment?: string): string {
  const buddy = state.roster.find((b) => b.buddyId === state.activeBuddy);
  if (!buddy) return '[ no buddy ]';

  const def = CREATURE_BY_ID[buddy.buddyId] ?? DEFAULT_CREATURE;
  const face = MOOD_FACE[buddy.mood] ?? '·_·';
  const art0 = def.top;
  const art1 = def.mid.replace('{f}', face);
  const art2 = def.bot;

  const rarityIcon = RARITY_EMOJI[buddy.rarity] ?? '?';
  const name = buddy.nickname ? `${buddy.nickname} (${buddy.currentForm})` : buddy.currentForm;
  const level = buddy.rarity === 'legendary' ? `Lv${buddy.level}` : `S${buddy.evolutionStage}`;
  const h = hearts(buddy.attachment);
  const bond = `${'♥'.repeat(h)}${'·'.repeat(5 - h)}`;
  const xp = buddy.xp;
  const shards = state.player.shardBalance;
  const streak = state.player.streakDays > 0 ? ` · 🔥${state.player.streakDays}d` : '';
  const moodIcon = MOOD_EMOJI[buddy.mood] ?? '';
  const hungry =
    hungerTier(buddy.hunger) === 'Starving' || hungerTier(buddy.hunger) === 'Hungry'
      ? ' · 🍖'
      : '';

  const line1 = `${art0}  ${rarityIcon} ${name} ${level} · ${moodIcon} · ${bond}`;
  const line2 = `${art1}  ${xp}✨ · ${shards}💎${hungry}${streak}`;
  const line3 = comment ? `${art2}  "${comment}"` : art2;

  return [line1, line2, line3].join('\n');
}

export function renderCollection(state: GameState): string {
  const lines = [
    `Roster (${state.roster.length}) · Shards: ${state.player.shardBalance}💎 · Resonance: ${state.player.resonanceShards}`,
    `Pity: Epic ${state.player.pityEpicCounter}/10 · Legendary ${state.player.pityLegendaryCounter}/50`,
    '',
  ];
  for (const b of state.roster) {
    const active = b.buddyId === state.activeBuddy ? ' ◄' : '';
    const rarityIcon = RARITY_EMOJI[b.rarity] ?? '?';
    const moodIcon = MOOD_EMOJI[b.mood] ?? '?';
    const h = hearts(b.attachment);
    const bond = `${'♥'.repeat(h)}${'·'.repeat(5 - h)}`;
    const label = b.nickname ? `${b.nickname} (${b.currentForm})` : b.currentForm;
    lines.push(`  ${rarityIcon} ${label} ${moodIcon} ${bond} ${b.xp}✨${active}`);
  }
  return lines.join('\n');
}
