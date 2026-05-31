import type { GameState } from './types.js';
import { hearts, hungerTier } from './engine/attachment.js';

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

export function render(state: GameState): string {
  const buddy = state.roster.find((b) => b.buddyId === state.activeBuddy);
  if (!buddy) return '[ no buddy ]';

  const rarityIcon = RARITY_EMOJI[buddy.rarity] ?? '?';
  const moodIcon = MOOD_EMOJI[buddy.mood] ?? '?';
  // The user's nickname wins; the species form trails in parentheses.
  const name = buddy.nickname ? `${buddy.nickname} (${buddy.currentForm})` : buddy.currentForm;
  const level = buddy.rarity === 'legendary' ? `Lv${buddy.level}` : `S${buddy.evolutionStage}`;
  const xp = buddy.xp;
  const shards = state.player.shardBalance;
  const streak = state.player.streakDays > 0 ? `🔥${state.player.streakDays}d` : '';
  const h = hearts(buddy.attachment);
  const bond = `${'♥'.repeat(h)}${'·'.repeat(5 - h)}`;

  const parts = [`${rarityIcon} ${name} ${level}`, moodIcon, bond, `${xp}✨`, `${shards}💎`];
  if (hungerTier(buddy.hunger) === 'Starving' || hungerTier(buddy.hunger) === 'Hungry') parts.push('🍖');
  if (streak) parts.push(streak);

  return parts.join(' · ');
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
