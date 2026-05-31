'use strict';
// Pocket Pet SessionEnd hook — banks tame-hours from the session, triggers evolution.
const path = require('path');
const url  = require('url');

const DIST = path.join(__dirname, '..', 'dist');

async function main() {
  const { loadState, saveState } = await import(url.pathToFileURL(path.join(DIST, 'src/persistence.js')).href);
  const { applyEvent }           = await import(url.pathToFileURL(path.join(DIST, 'src/engine/events.js')).href);

  const now   = new Date().toISOString();
  const state = loadState();
  if (state.activeBuddy && state.roster.length > 0) {
    saveState(applyEvent(state, { type: 'session_end', at: now }).state);
  }
  process.stdout.write('{}');
}

main().catch(() => process.stdout.write('{}'));
