import type { GameState } from './types.js';

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
  const name = buddy.currentForm;
  const level = buddy.rarity === 'legendary' ? `Lv${buddy.level}` : `S${buddy.evolutionStage}`;
  const xp = buddy.xp;
  const shards = state.player.shardBalance;
  const streak = state.player.streakDays > 0 ? `🔥${state.player.streakDays}d` : '';

  const parts = [`${rarityIcon} ${name} ${level}`, moodIcon, `${xp}✨`, `${shards}💎`];
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
    lines.push(`  ${rarityIcon} ${b.currentForm} (${b.rarity}) ${moodIcon} ${b.xp}✨${active}`);
  }
  return lines.join('\n');
}
