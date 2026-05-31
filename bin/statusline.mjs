#!/usr/bin/env node
// Pocket Pet statusline — renders the creature and drives the wall-clock heartbeat.
// Claude Code runs this on every refresh (see statusLine.refreshInterval in settings).
// stdin: Claude Code session JSON. stdout: the creature's status line(s).

const COMMENT_DISPLAY_WINDOW_SEC = 90;

function secsBetween(a, b) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 1000;
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main() {
  const { loadState, saveState } = await import('../dist/src/persistence.js');
  const { applyEvent } = await import('../dist/src/engine/events.js');
  const { render } = await import('../dist/src/render.js');

  await readStdin(); // consume but ignore stdin

  const now = new Date().toISOString();
  let state = loadState();

  if (!state.activeBuddy || state.roster.length === 0) {
    process.stdout.write('🐾 No buddy — run: npm run pocket-pet -- choose');
    return;
  }

  const lastTick = state.session.lastTickAt ?? state.session.sessionStart ?? now;
  const elapsedSec = Math.max(0, Math.min(secsBetween(lastTick, now), 3600));

  if (elapsedSec > 0) {
    const result = applyEvent(state, { type: 'tick', at: now, elapsedSec });
    state = result.state;
    saveState(state);
  }

  let line = render(state);

  const c = state.session.lastComment;
  const cAt = state.session.lastCommentAt;
  if (c && cAt && secsBetween(cAt, now) <= COMMENT_DISPLAY_WINDOW_SEC) {
    line += `\n\x1b[2m"${c}"\x1b[0m`;
  }

  process.stdout.write(line);
}

main().catch(() => {
  // Never break the statusline — fail silent.
  process.stdout.write('');
});
