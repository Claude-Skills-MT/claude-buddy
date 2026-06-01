import { describe, it, expect } from 'vitest';
import { recordSwap, swapsOnDay } from '../src/engine/swap.js';
import type { SessionState } from '../src/types.js';

function makeSession(overrides: Partial<SessionState> = {}): SessionState {
  return {
    sessionStart: '2024-01-01T10:00:00Z',
    sessionSwapCount: 0,
    swapDates: {},
    errorStreakActive: false,
    eventIndex: 0,
    ...overrides,
  };
}

describe('recordSwap', () => {
  it('first swap does not trigger sulk', () => {
    const s = makeSession();
    const { sulk } = recordSwap(s, '2024-01-01', 'a', 'b');
    expect(sulk).toBe(false);
  });

  it('second swap does not trigger sulk', () => {
    const s = makeSession({ swapDates: { '2024-01-01': 1 } });
    const { sulk } = recordSwap(s, '2024-01-01', 'a', 'b');
    expect(sulk).toBe(false);
  });

  it('third swap triggers sulk', () => {
    const s = makeSession({ swapDates: { '2024-01-01': 2 } });
    const { sulk } = recordSwap(s, '2024-01-01', 'a', 'b');
    expect(sulk).toBe(true);
  });

  it('fourth swap also triggers sulk', () => {
    const s = makeSession({ swapDates: { '2024-01-01': 3 } });
    const { sulk } = recordSwap(s, '2024-01-01', 'a', 'b');
    expect(sulk).toBe(true);
  });

  it('new day resets count — no sulk after 2 on previous day + 1 today', () => {
    const s = makeSession({ swapDates: { '2024-01-01': 2 } });
    const { sulk } = recordSwap(s, '2024-01-02', 'a', 'b');
    expect(sulk).toBe(false);
  });

  it('increments session swap count', () => {
    const s = makeSession({ sessionSwapCount: 5 });
    const { session } = recordSwap(s, '2024-01-01', 'a', 'b');
    expect(session.sessionSwapCount).toBe(6);
  });

  it('updates swapDates', () => {
    const s = makeSession();
    const { session } = recordSwap(s, '2024-01-01', 'a', 'b');
    expect(swapsOnDay(session, '2024-01-01')).toBe(1);
  });
});
