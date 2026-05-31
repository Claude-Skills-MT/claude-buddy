import { describe, it, expect } from 'vitest';
import { applyEvent, createInitialState } from '../src/engine/events.js';
import { render } from '../src/render.js';
import type { PetEvent } from '../src/engine/events.js';
import type { GameState } from '../src/types.js';

const SESSION_START = '2024-06-01T09:00:00Z';

function freshState(): GameState {
  return createInitialState('glitchlet', SESSION_START);
}

describe('event replay integration', () => {
  it('session_start + tick + build_success produces valid state', () => {
    const events: PetEvent[] = [
      { type: 'session_start', at: SESSION_START, firstOfDay: true },
      { type: 'tick', at: '2024-06-01T09:30:00Z', elapsedSec: 1800 },
      { type: 'build_success', at: '2024-06-01T09:30:01Z' },
    ];

    let state = freshState();
    for (const event of events) {
      const result = applyEvent(state, event);
      state = result.state;
    }

    const buddy = state.roster.find((b) => b.buddyId === 'glitchlet')!;
    expect(buddy.xp).toBeGreaterThan(0);
    expect(state.player.shardBalance).toBeGreaterThan(0);
  });

  it('build_success emits a comment', () => {
    let state = freshState();
    const result = applyEvent(state, { type: 'build_success', at: SESSION_START });
    expect(result.comment).toBeTruthy();
    expect(typeof result.comment).toBe('string');
  });

  it('talk event returns a reply', () => {
    const state = freshState();
    const result = applyEvent(state, { type: 'talk', at: SESSION_START, text: 'hey' });
    expect(result.reply).toBeTruthy();
  });

  it('coding question deflected in talk mode', () => {
    const state = freshState();
    const result = applyEvent(state, { type: 'talk', at: SESSION_START, text: 'how do I fix this error?' });
    expect(result.reply).toBeTruthy();
    // Should not answer the question — reply is a deflection
    expect(result.reply).not.toContain('error on line');
  });

  it('error_detected increases XP', () => {
    const state = freshState();
    const before = state.roster[0]!.xp;
    const { state: after } = applyEvent(state, { type: 'error_detected', at: SESSION_START });
    expect(after.roster[0]!.xp).toBeGreaterThan(before);
  });

  it('error_resolved awards shards when error was active', () => {
    let state = freshState();
    state = applyEvent(state, { type: 'error_detected', at: SESSION_START }).state;
    const shardsBefore = state.player.shardBalance;
    state = applyEvent(state, { type: 'error_resolved', at: SESSION_START }).state;
    expect(state.player.shardBalance).toBeGreaterThan(shardsBefore);
  });

  it('swap_buddy changes active buddy', async () => {
    // First add another buddy to roster
    const { BUDDIES_BY_ID } = await import('../data/buddies.js');
    const { createInitialBuddyState } = await import('../src/state.js');
    let state = freshState();
    const compilotDef = BUDDIES_BY_ID['compilot']!;
    state = { ...state, roster: [...state.roster, createInitialBuddyState(compilotDef)] };

    const { state: after } = applyEvent(state, {
      type: 'swap_buddy', at: SESSION_START, toBuddyId: 'compilot',
    });
    expect(after.activeBuddy).toBe('compilot');
  });

  it('3 swaps same day triggers sulk on swapped buddy', async () => {
    const { BUDDIES_BY_ID } = (await import('../data/buddies.js'));
    const { createInitialBuddyState } = (await import('../src/state.js'));
    let state = freshState();
    const compilotDef = BUDDIES_BY_ID['compilot']!;
    const nullpupDef = BUDDIES_BY_ID['nullpup']!;
    state = {
      ...state,
      roster: [...state.roster, createInitialBuddyState(compilotDef), createInitialBuddyState(nullpupDef)],
    };

    const day = '2024-06-01';
    // Swap 1: glitchlet -> compilot
    state = applyEvent(state, { type: 'swap_buddy', at: `${day}T10:00:00Z`, toBuddyId: 'compilot' }).state;
    // Swap 2: compilot -> nullpup
    state = applyEvent(state, { type: 'swap_buddy', at: `${day}T11:00:00Z`, toBuddyId: 'nullpup' }).state;
    // Swap 3: nullpup -> glitchlet (triggers sulk on nullpup)
    state = applyEvent(state, { type: 'swap_buddy', at: `${day}T12:00:00Z`, toBuddyId: 'glitchlet' }).state;

    const nullpup = state.roster.find((b) => b.buddyId === 'nullpup');
    expect(nullpup?.mood).toBe('sulking');
  });

  it('render returns a non-empty statusline string', () => {
    const state = freshState();
    const line = render(state);
    expect(line.length).toBeGreaterThan(0);
    expect(line).toContain('Glitchlet');
  });

  it('replay is deterministic — same events same final state', () => {
    const events: PetEvent[] = [
      { type: 'session_start', at: SESSION_START, firstOfDay: true },
      { type: 'error_detected', at: '2024-06-01T09:05:00Z' },
      { type: 'build_success', at: '2024-06-01T09:10:00Z' },
      { type: 'tick', at: '2024-06-01T09:30:00Z', elapsedSec: 1200 },
    ];

    function replay() {
      let s = freshState();
      for (const e of events) s = applyEvent(s, e).state;
      return s;
    }

    const a = replay();
    const b = replay();
    expect(a.roster[0]!.xp).toBe(b.roster[0]!.xp);
    expect(a.player.shardBalance).toBe(b.player.shardBalance);
  });
});
