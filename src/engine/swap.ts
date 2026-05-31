import type { SessionState } from '../types.js';

const SULK_THRESHOLD = 3;

export interface SwapResult {
  session: SessionState;
  sulk: boolean;
}

export function recordSwap(session: SessionState, today: string, _fromId: string, _toId: string): SwapResult {
  const prev = session.swapDates[today] ?? 0;
  const newCount = prev + 1;
  const sulk = newCount >= SULK_THRESHOLD;
  return {
    session: {
      ...session,
      sessionSwapCount: session.sessionSwapCount + 1,
      swapDates: { ...session.swapDates, [today]: newCount },
    },
    sulk,
  };
}

export function swapsOnDay(session: SessionState, day: string): number {
  return session.swapDates[day] ?? 0;
}
