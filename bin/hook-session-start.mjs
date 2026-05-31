#!/usr/bin/env node
// Pocket Pet SessionStart hook — summons a random buddy, runs streak/comeback logic.
// stdin: Claude Code SessionStart JSON. stdout: JSON with a systemMessage (the summon line).
import { loadState, saveState } from '../dist/src/persistence.js';
import { applyEvent } from '../dist/src/engine/events.js';
import { render } from '../dist/src/render.js';

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

function isFirstSessionOfDay(state, today) {
  return state.player.lastSessionDate !== today;
}

async function main() {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  let state = loadState();
  const firstOfDay = isFirstSessionOfDay(state, today);

  const result = applyEvent(state, { type: 'session_start', at: now, firstOfDay });
  state = result.state;
  saveState(state);

  const summon = render(state);
  const parts = [`🐾 ${summon}`];
  if (result.comment) parts.push(`“${result.comment}”`);

  process.stdout.write(JSON.stringify({
    systemMessage: parts.join('  '),
    suppressOutput: true,
  }));
}

main().catch(() => {
  process.stdout.write('{}');
});
