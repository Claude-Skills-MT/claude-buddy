#!/usr/bin/env node
// Pocket Pet SessionEnd hook — banks tame-hours from the session, triggers evolution.

async function main() {
  const { loadState, saveState } = await import('../dist/src/persistence.js');
  const { applyEvent } = await import('../dist/src/engine/events.js');

  const now = new Date().toISOString();
  let state = loadState();
  if (state.activeBuddy && state.roster.length > 0) {
    const result = applyEvent(state, { type: 'session_end', at: now });
    saveState(result.state);
  }
  process.stdout.write('{}');
}

main().catch(() => process.stdout.write('{}'));
