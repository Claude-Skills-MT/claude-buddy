import type { EmotionAxis } from '../src/types.js';

// Food lives in the Store and is bought with Shards (the work currency). Names are
// monster-world flavored — not real apples, but recognizable cousins. Each food
// nourishes (lowers hunger) and grants a little attachment when eaten. Some foods
// resonate with a personality axis: feed a leader a "Captain's Crust" and the bond
// lands harder.

export interface FoodDef {
  id: string;
  name: string;
  emoji: string;
  cost: number;          // shards
  nourish: number;       // hunger points removed (0-100 scale)
  attachment: number;    // base attachment granted on eating
  favoredAxis?: EmotionAxis; // buddies high on this axis adore it (bonus attachment)
  blurb: string;
}

export const FOODS: readonly FoodDef[] = [
  {
    id: 'glitchberry',
    name: 'Glitchberry',
    emoji: '🫐',
    cost: 8, nourish: 20, attachment: 2,
    blurb: 'A flickering blue berry. Tastes slightly different every bite.',
  },
  {
    id: 'byte-biscuit',
    name: 'Byte Biscuit',
    emoji: '🍪',
    cost: 12, nourish: 30, attachment: 3,
    blurb: 'Crunchy, eight-sided, gone in one gulp. The everyday staple.',
  },
  {
    id: 'null-nectar',
    name: 'Null Nectar',
    emoji: '🧃',
    cost: 15, nourish: 25, attachment: 3, favoredAxis: 'sarcasm',
    blurb: 'Tastes like nothing. Aloof types pretend to hate it. They love it.',
  },
  {
    id: 'pixel-plum',
    name: 'Pixel Plum',
    emoji: '🍑',
    cost: 10, nourish: 22, attachment: 2, favoredAxis: 'tenderness',
    blurb: 'Soft, warm, sweet. The comfort food of the monster world.',
  },
  {
    id: 'captains-crust',
    name: "Captain's Crust",
    emoji: '🥖',
    cost: 18, nourish: 28, attachment: 4, favoredAxis: 'leadership',
    blurb: 'A hearty loaf. Born leaders break it and share it with the team.',
  },
  {
    id: 'ember-pepper',
    name: 'Ember Pepper',
    emoji: '🌶️',
    cost: 14, nourish: 24, attachment: 3, favoredAxis: 'stubbornness',
    blurb: 'Fiery. Only the headstrong and the hotheaded ask for seconds.',
  },
  {
    id: 'heart-honey',
    name: 'Heart Honey',
    emoji: '🍯',
    cost: 20, nourish: 26, attachment: 5, favoredAxis: 'affection',
    blurb: 'Golden and glowing. Devoted buddies positively melt for it.',
  },
  {
    id: 'duty-dumpling',
    name: 'Duty Dumpling',
    emoji: '🥟',
    cost: 16, nourish: 32, attachment: 3, favoredAxis: 'responsibility',
    blurb: 'Balanced, wholesome, dependable. Eaten without fuss.',
  },
  {
    id: 'cache-cake',
    name: 'Cache Cake',
    emoji: '🍰',
    cost: 30, nourish: 50, attachment: 6,
    blurb: 'A rich layered treat that keeps. A proper celebration meal.',
  },
  {
    id: 'legendary-feast',
    name: 'Legendary Feast',
    emoji: '🍱',
    cost: 80, nourish: 100, attachment: 12,
    blurb: 'A full spread fit for an Awakened one. Fills the belly and the heart.',
  },
] as const;

export const FOODS_BY_ID: Readonly<Record<string, FoodDef>> = Object.fromEntries(
  FOODS.map((f) => [f.id, f]),
);
