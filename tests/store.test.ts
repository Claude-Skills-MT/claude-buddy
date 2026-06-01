import { describe, it, expect } from 'vitest';
import { buyFood, feed, isFavoriteFood, chooseFoodForBuddy, StoreError } from '../src/engine/store.js';
import { createInitialState } from '../src/state.js';
import { FOODS_BY_ID } from '../data/food.js';
import type { GameState } from '../src/types.js';

function stateWithShards(shards: number): GameState {
  const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');
  return { ...s, player: { ...s.player, shardBalance: shards } };
}

describe('buyFood', () => {
  it('deducts shards and adds to pantry', () => {
    let s = stateWithShards(100);
    s = buyFood(s, 'byte-biscuit', 2);
    expect(s.player.food['byte-biscuit']).toBe(2);
    expect(s.player.shardBalance).toBe(100 - FOODS_BY_ID['byte-biscuit']!.cost * 2);
  });

  it('throws when too few shards', () => {
    const s = stateWithShards(5);
    expect(() => buyFood(s, 'cache-cake', 1)).toThrow(StoreError);
  });

  it('throws for unknown food', () => {
    const s = stateWithShards(100);
    expect(() => buyFood(s, 'nope', 1)).toThrow();
  });

  it('throws on non-positive qty', () => {
    const s = stateWithShards(100);
    expect(() => buyFood(s, 'glitchberry', 0)).toThrow();
  });
});

describe('feed', () => {
  it('lowers hunger, raises attachment, consumes one food', () => {
    let s = stateWithShards(500);
    s = buyFood(s, 'byte-biscuit', 1);
    s = { ...s, roster: s.roster.map((b) => ({ ...b, hunger: 80 })) };
    const { state } = feed(s, 'byte-biscuit', '2024-01-01T11:00:00Z');
    const b = state.roster[0]!;
    expect(b.hunger).toBeLessThan(80);
    expect(b.attachment).toBeGreaterThan(0);
    expect(b.timesFed).toBe(1);
    expect(state.player.food['byte-biscuit']).toBe(0);
  });

  it('throws when feeding food you do not own', () => {
    const s = stateWithShards(100);
    expect(() => feed(s, 'cache-cake', '2024-01-01T11:00:00Z')).toThrow(StoreError);
  });

  it('favorite food grants more attachment than a plain one', () => {
    // Force the active buddy to be high-affection so heart-honey is a favorite.
    let s = stateWithShards(500);
    s = buyFood(s, 'heart-honey', 1);
    s = buyFood(s, 'glitchberry', 1);
    s = {
      ...s,
      roster: s.roster.map((b) => ({
        ...b,
        baseAxes: { ...b.baseAxes, affection: 100 },
      })),
    };
    const favorite = feed(s, 'heart-honey', '2024-01-01T11:00:00Z');
    const plain = feed(s, 'glitchberry', '2024-01-01T11:00:00Z');
    expect(favorite.isFavorite).toBe(true);
    expect(favorite.state.roster[0]!.attachment).toBeGreaterThan(plain.state.roster[0]!.attachment);
  });

  it('hunger never goes below 0', () => {
    let s = stateWithShards(500);
    s = buyFood(s, 'legendary-feast', 1);
    s = { ...s, roster: s.roster.map((b) => ({ ...b, hunger: 10 })) };
    const { state } = feed(s, 'legendary-feast', '2024-01-01T11:00:00Z');
    expect(state.roster[0]!.hunger).toBe(0);
  });
});

describe('isFavoriteFood / chooseFoodForBuddy', () => {
  it('isFavoriteFood true when axis is high', () => {
    const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');
    const buddy = { ...s.roster[0]!, baseAxes: { ...s.roster[0]!.baseAxes, leadership: 100 } };
    expect(isFavoriteFood(buddy, FOODS_BY_ID['captains-crust']!)).toBe(true);
  });

  it('chooseFoodForBuddy returns null with empty pantry', () => {
    const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');
    expect(chooseFoodForBuddy(s, s.roster[0]!)).toBeNull();
  });

  it('chooseFoodForBuddy prefers a favorite', () => {
    let s = stateWithShards(500);
    s = buyFood(s, 'glitchberry', 1);
    s = buyFood(s, 'captains-crust', 1);
    const buddy = { ...s.roster[0]!, baseAxes: { ...s.roster[0]!.baseAxes, leadership: 100 } };
    expect(chooseFoodForBuddy(s, buddy)).toBe('captains-crust');
  });
});
