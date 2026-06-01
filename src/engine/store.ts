import type { GameState, BuddyState } from '../types.js';
import { FOODS_BY_ID } from '../../data/food.js';
import type { FoodDef } from '../../data/food.js';
import { gainAttachment } from './attachment.js';
import { effectiveAxes } from './personality.js';
import { HUNGER_MAX, FOOD_FAVORITE_AXIS_THRESHOLD, FOOD_FAVORITE_BONUS } from '../constants.js';

export class StoreError extends Error {}

export function buyFood(state: GameState, foodId: string, qty: number): GameState {
  const food = FOODS_BY_ID[foodId];
  if (!food) throw new StoreError(`No such food: ${foodId}`);
  if (qty <= 0) throw new StoreError('Quantity must be positive');
  const total = food.cost * qty;
  if (state.player.shardBalance < total) {
    throw new StoreError(`Need ${total}💎 for ${qty}× ${food.name}, have ${state.player.shardBalance}💎`);
  }
  const owned = state.player.food[foodId] ?? 0;
  return {
    ...state,
    player: {
      ...state.player,
      shardBalance: state.player.shardBalance - total,
      food: { ...state.player.food, [foodId]: owned + qty },
    },
  };
}

export interface FeedResult {
  state: GameState;
  food: FoodDef;
  isFavorite: boolean;
}

// Whether this food resonates with the buddy's (amplified) personality.
export function isFavoriteFood(buddy: BuddyState, food: FoodDef): boolean {
  if (!food.favoredAxis) return false;
  return effectiveAxes(buddy)[food.favoredAxis] >= FOOD_FAVORITE_AXIS_THRESHOLD;
}

// Pick a sensible default food to feed: prefer one the active buddy favours, else
// the cheapest thing in the pantry.
export function chooseFoodForBuddy(state: GameState, buddy: BuddyState): string | null {
  const owned = Object.entries(state.player.food).filter(([, n]) => n > 0).map(([id]) => id);
  if (owned.length === 0) return null;
  const favorite = owned.find((id) => {
    const f = FOODS_BY_ID[id];
    return f && isFavoriteFood(buddy, f);
  });
  if (favorite) return favorite;
  return owned.sort((a, b) => (FOODS_BY_ID[a]?.cost ?? 0) - (FOODS_BY_ID[b]?.cost ?? 0))[0] ?? null;
}

export function feed(state: GameState, foodId: string, atIso: string): FeedResult {
  const food = FOODS_BY_ID[foodId];
  if (!food) throw new StoreError(`No such food: ${foodId}`);
  const owned = state.player.food[foodId] ?? 0;
  if (owned <= 0) throw new StoreError(`You don't have any ${food.name}. Buy some first.`);

  const buddy = state.roster.find((b) => b.buddyId === state.activeBuddy);
  if (!buddy) throw new StoreError('No active buddy to feed');

  const isFavorite = isFavoriteFood(buddy, food);
  let fed: BuddyState = {
    ...buddy,
    hunger: Math.max(0, Math.min(HUNGER_MAX, buddy.hunger - food.nourish)),
    timesFed: buddy.timesFed + 1,
    lastFedAt: atIso,
  };
  fed = gainAttachment(fed, food.attachment + (isFavorite ? FOOD_FAVORITE_BONUS : 0));

  const newFood = { ...state.player.food, [foodId]: owned - 1 };

  return {
    state: {
      ...state,
      roster: state.roster.map((b) => (b.buddyId === buddy.buddyId ? fed : b)),
      player: { ...state.player, food: newFood },
    },
    food,
    isFavorite,
  };
}
