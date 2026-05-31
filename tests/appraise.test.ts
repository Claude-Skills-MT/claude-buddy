import { describe, it, expect } from 'vitest';
import { appraiseBuddy } from '../src/engine/appraise.js';
import { createInitialState } from '../src/state.js';

describe('appraiseBuddy', () => {
  const s = createInitialState('glitchlet', '2024-01-01T10:00:00Z');

  it('produces a multi-line report for the active buddy', () => {
    const out = appraiseBuddy(s);
    expect(out).toContain('Appraisal');
    expect(out).toContain('emotional makeup');
    expect(out).toContain('victories');
  });

  it('reflects the nickname when set', () => {
    const named = { ...s, roster: s.roster.map((b) => ({ ...b, nickname: 'Steve' })) };
    const out = appraiseBuddy(named);
    expect(out).toContain('Steve');
    expect(out).toContain('(Glitchlet)');
  });

  it('mentions shared failures bonding when failures dominate', () => {
    const tough = { ...s, roster: s.roster.map((b) => ({ ...b, sharedFailures: 10, sharedSuccesses: 2 })) };
    const out = appraiseBuddy(tough);
    expect(out.toLowerCase()).toContain('hard times');
  });

  it('handles unknown buddyId gracefully', () => {
    expect(appraiseBuddy(s, 'does-not-exist')).toContain('No buddy');
  });

  it('shows higher attachment tier when bonded', () => {
    const bonded = { ...s, roster: s.roster.map((b) => ({ ...b, attachment: 95 })) };
    const out = appraiseBuddy(bonded);
    expect(out).toContain('Inseparable');
  });
});
