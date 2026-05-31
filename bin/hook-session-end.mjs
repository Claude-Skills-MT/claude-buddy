#!/usr/bin/env node
// Pocket Pet SessionEnd hook — banks tame-hours from the session, triggers evolution.
import { loadState, saveState } from '../dist/src/persistence.js';
import { applyEvent } from '../dist/src/engine/events.js';

async function main() {
  const now = new Date().toISOString();
  let state = loadState();
  const result = applyEvent(state, { type: 'session_end', at: now });
  saveState(result.state);
  process.stdout.write('{}');
}

main().catch(() => {
  process.stdout.write('{}');
});
