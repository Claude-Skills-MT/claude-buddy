#!/usr/bin/env node
// Pocket Pet statusline — renders the creature and drives the wall-clock heartbeat.
// Claude Code runs this on every refresh (see statusLine.refreshInterval in settings).
// stdin: Claude Code session JSON. stdout: the creature's status line(s).
import { loadState, saveState } from '../dist/src/persistence.js';
import { applyEvent } from '../dist/src/engine/events.js';
import { render } from '../dist/src/render.js';

const COMMENT_DISPLAY_WINDOW_SEC = 90;

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

function secsBetween(a, b) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 1000;
}

async function main() {
  let input = {};
  try {
    input = JSON.parse((await readStdin()) || '{}');
  } catch {
    input = {};
  }

  const now = new Date().toISOString();
  let state = loadState();

  // Heartbeat tick: elapsed wall-clock time since last render drives passive XP,
  // shards, tame-hours, mood and (occasionally) a passive comment.
  const lastTick = state.session.lastTickAt ?? state.session.sessionStart ?? now;
  const elapsedSec = Math.max(0, Math.min(secsBetween(lastTick, now), 3600));

  if (elapsedSec > 0) {
    const result = applyEvent(state, { type: 'tick', at: now, elapsedSec });
    state = result.state;
    saveState(state);
  }

  // Base status line.
  let line = render(state);

  // Append the creature's current comment if it's still within its display window.
  const c = state.session.lastComment;
  const cAt = state.session.lastCommentAt;
  if (c && cAt && secsBetween(cAt, now) <= COMMENT_DISPLAY_WINDOW_SEC) {
    line += `\n\x1b[2m“${c}”\x1b[0m`;
  }

  process.stdout.write(line);
}

main().catch(() => {
  // Never break the statusline — fail silent.
  process.stdout.write('');
});
