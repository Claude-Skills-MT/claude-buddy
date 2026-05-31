import type { GameState, AxisProfile, EmotionAxis } from '../types.js';
import { effectiveAxes, archetypeName, archetypeDescriptor, AXES } from './personality.js';
import { attachmentTier, hungerTier, hearts } from './attachment.js';

const AXIS_LABEL: Record<EmotionAxis, string> = {
  sarcasm:        'Sarcasm',
  stubbornness:   'Stubbornness',
  affection:      'Affection',
  tenderness:     'Tenderness',
  leadership:     'Leadership',
  responsibility: 'Responsibility',
};

function bar(value: number, width = 10): string {
  const filled = Math.round((value / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

export function appraiseBuddy(state: GameState, buddyId?: string): string {
  const id = buddyId ?? state.activeBuddy;
  const buddy = state.roster.find((b) => b.buddyId === id);
  if (!buddy) return `No buddy "${id}" in your roster.`;

  const displayName = buddy.nickname ? `${buddy.nickname} (${buddy.currentForm})` : buddy.currentForm;
  const axes = effectiveAxes(buddy);
  const tier = attachmentTier(buddy.attachment);
  const h = hearts(buddy.attachment);

  const lines: string[] = [];
  lines.push(`── Appraisal: ${displayName}`);
  lines.push('');

  lines.push(`Attachment    ${'♥'.repeat(h)}${'·'.repeat(5 - h)}  ${tier} (${Math.round(buddy.attachment)}/100)`);
  lines.push(`Hunger        ${hungerTier(buddy.hunger)} (${Math.round(buddy.hunger)}/100)`);
  lines.push(`Mood          ${buddy.mood}`);
  lines.push(`Evolution     Stage ${buddy.evolutionStage} · ${buddy.tameHours.toFixed(1)}h · Lv ${buddy.level}`);
  lines.push(`Rarity        ${buddy.rarity}`);
  lines.push('');

  lines.push(`Personality   ${archetypeName(buddy.personality)}  —  ${archetypeDescriptor(buddy.personality)}`);
  lines.push(`Trait         ${buddy.traitPrimary}${buddy.traitSecondary ? ` / ${buddy.traitSecondary}` : ''}${buddy.traitTertiary ? ` / ${buddy.traitTertiary}` : ''}`);
  lines.push('');

  lines.push('Axes:');
  for (const axis of AXES) {
    lines.push(`  ${AXIS_LABEL[axis].padEnd(15)} ${bar(axes[axis])}  ${String(axes[axis]).padStart(3)}`);
  }
  lines.push('');

  lines.push('History:');
  lines.push(`  Shared victories:   ${buddy.sharedSuccesses}`);
  lines.push(`  Shared failures:    ${buddy.sharedFailures}`);
  if (buddy.sharedFailures > buddy.sharedSuccesses && buddy.sharedFailures > 0) {
    lines.push('  The hard times bonded you most.');
  }
  lines.push(`  Fed:                ${buddy.timesFed} time${buddy.timesFed === 1 ? '' : 's'}${buddy.lastFedAt ? ` · last ${new Date(buddy.lastFedAt).toLocaleDateString()}` : ''}`);
  lines.push('');

  lines.push(`Accessories   ${buddy.accessoriesUnlocked.length ? buddy.accessoriesUnlocked.join(', ') : '(none unlocked)'}`);

  return lines.join('\n');
}

export function axisProfileLine(axes: AxisProfile): string {
  return AXES.map((a) => `${AXIS_LABEL[a][0]}${axes[a]}`).join(' ');
}
