import type { Mood } from '../types.js';

const VELOCITY_LADDER: Mood[] = [
  'bored', 'curious', 'engaged', 'excited', 'overstimulated', 'tired',
];

export function nextMoodFromVelocity(
  current: Mood,
  xpPerMinute: number,
): Mood {
  // Not a velocity-ladder mood — return as-is (will be cleared by other logic)
  if (current === 'sulking' || current === 'betrayed') return current;

  let targetIndex: number;
  if (xpPerMinute <= 0) targetIndex = 0;
  else if (xpPerMinute < 1) targetIndex = 1;
  else if (xpPerMinute < 3) targetIndex = 2;
  else if (xpPerMinute < 6) targetIndex = 3;
  else if (xpPerMinute < 10) targetIndex = 4;
  else targetIndex = 5;

  const target = VELOCITY_LADDER[targetIndex];
  return target ?? 'bored';
}

export function commentFrequencyMultiplier(mood: Mood): number {
  switch (mood) {
    case 'bored': return 0.5;
    case 'curious': return 0.8;
    case 'engaged': return 1.0;
    case 'excited': return 1.5;
    case 'overstimulated': return 2.0;
    case 'tired': return 0.4;
    case 'sulking': return 0.3;
    case 'betrayed': return 0.2;
  }
}

export function moodLabel(mood: Mood): string {
  return mood;
}

export function updateMood(
  buddy: { mood: Mood; moodSince: string },
  newMood: Mood,
  nowIso: string,
): { mood: Mood; moodSince: string } {
  if (buddy.mood === newMood) return buddy;
  return { mood: newMood, moodSince: nowIso };
}
