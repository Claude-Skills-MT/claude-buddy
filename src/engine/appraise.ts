import type { GameState, BuddyState, AxisProfile, EmotionAxis } from '../types.js';
import {
  effectiveAxes,
  archetypeName,
  archetypeDescriptor,
  archetypeExemplar,
  dominantAxis,
  AXES,
} from './personality.js';
import { attachmentTier, hungerTier, hearts } from './attachment.js';

// A team-leader-style appraisal, à la Pokémon GO. Reads the emotional state and
// delivers a flavorful verdict, axis bars, and the shared history.

const AXIS_LABEL: Record<EmotionAxis, string> = {
  sarcasm: 'Sarcasm',
  stubbornness: 'Stubbornness',
  affection: 'Affection',
  tenderness: 'Tenderness',
  leadership: 'Leadership',
  responsibility: 'Responsibility',
};

const ATTACHMENT_INTRO: Record<string, string> = {
  Inseparable: "Overall, {name} would follow you to the end of the repo. I've rarely seen a bond this deep.",
  Devoted: 'Overall, {name} is devoted to you — that much is plain to anyone watching.',
  Bonded: 'Overall, {name} trusts you. You two have something real.',
  Warming: "Overall, {name} is warming up to you. The bond is taking root.",
  Curious: "Overall, {name} is still sizing you up. Early days yet.",
  Wary: "Overall, {name} keeps you at arm's length. Trust will have to be earned.",
};

function bar(value: number, width = 10): string {
  const filled = Math.round((value / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function axisRemark(axis: EmotionAxis, value: number): string {
  const strong = value >= 75;
  const map: Record<EmotionAxis, [string, string]> = {
    sarcasm: ['has a razor wit and is not afraid to use it', 'rarely throws shade'],
    stubbornness: ['will not be moved once its mind is made', 'is surprisingly easy-going'],
    affection: ['wears its heart wide open', 'guards its heart closely'],
    tenderness: ['is gentle to its very core', 'has a tougher shell'],
    leadership: ['was born to lead the team', 'is happy to follow'],
    responsibility: ['can be trusted with anything', 'is a bit of a free spirit'],
  };
  return strong ? map[axis][0] : map[axis][1];
}

export function appraiseBuddy(state: GameState, buddyId?: string): string {
  const id = buddyId ?? state.activeBuddy;
  const buddy = state.roster.find((b) => b.buddyId === id);
  if (!buddy) return `No buddy "${id}" in your roster.`;

  const name = buddy.nickname ?? buddy.currentForm;
  const axes = effectiveAxes(buddy);
  const tier = attachmentTier(buddy.attachment);
  const dom = dominantAxis(axes);

  const lines: string[] = [];
  lines.push(`── Appraisal: ${name} ${buddy.nickname ? `(${buddy.currentForm})` : ''}`.trimEnd());
  lines.push(`   ${'♥'.repeat(hearts(buddy.attachment))}${'·'.repeat(5 - hearts(buddy.attachment))}  ${tier} (${Math.round(buddy.attachment)}/100)`);
  lines.push('');

  lines.push((ATTACHMENT_INTRO[tier] ?? ATTACHMENT_INTRO['Wary']!).replace('{name}', name));
  lines.push(`It is ${archetypeName(buddy.personality)} by nature — ${archetypeDescriptor(buddy.personality)}${archetypeExemplar(buddy.personality) ? `, ${archetypeExemplar(buddy.personality)}` : ''}.`);
  lines.push(`Above all, it ${axisRemark(dom, axes[dom])}.`);
  lines.push('');

  lines.push('Its emotional makeup:');
  for (const axis of AXES) {
    lines.push(`  ${AXIS_LABEL[axis].padEnd(15)} ${bar(axes[axis])} ${String(axes[axis]).padStart(3)}`);
  }
  lines.push('');

  lines.push(`You've shared ${buddy.sharedSuccesses} victories and survived ${buddy.sharedFailures} failures together.`);
  if (buddy.sharedFailures > buddy.sharedSuccesses && buddy.sharedFailures > 0) {
    lines.push('It was the hard times that bonded you most. It hasn\'t forgotten them.');
  }
  lines.push(`Hunger: ${hungerTier(buddy.hunger)} (${Math.round(buddy.hunger)}/100) · fed ${buddy.timesFed} time${buddy.timesFed === 1 ? '' : 's'}.`);
  if (hungerTier(buddy.hunger) === 'Starving') lines.push('…and it would really, really like a meal right about now.');

  return lines.join('\n');
}

export function axisProfileLine(axes: AxisProfile): string {
  return AXES.map((a) => `${AXIS_LABEL[a][0]}${axes[a]}`).join(' ');
}
