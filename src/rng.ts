export interface Rng {
  next(): number;
  int(maxExclusive: number): number;
  pick<T>(arr: readonly T[]): T;
  weighted<T>(items: { item: T; weight: number }[]): T;
}

export function createRng(seed: number): Rng {
  let s = seed >>> 0;

  function next(): number {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  }

  function int(maxExclusive: number): number {
    return Math.floor(next() * maxExclusive);
  }

  function pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('Cannot pick from empty array');
    const result = arr[int(arr.length)];
    if (result === undefined) throw new Error('Pick out of bounds');
    return result;
  }

  function weighted<T>(items: { item: T; weight: number }[]): T {
    if (items.length === 0) throw new Error('Cannot pick from empty weighted list');
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let r = next() * total;
    for (const { item, weight } of items) {
      r -= weight;
      if (r <= 0) return item;
    }
    const last = items[items.length - 1];
    if (!last) throw new Error('Weighted pick failed');
    return last.item;
  }

  return { next, int, pick, weighted };
}

export function deriveSeed(...parts: (string | number)[]): number {
  let hash = 2166136261;
  for (const part of parts) {
    const str = String(part);
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 0x9e3779b9;
  }
  return hash >>> 0;
}
