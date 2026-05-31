'use strict';
// Pocket Pet statusline — zero external dependencies for the "no buddy" path.
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const COMMENT_DISPLAY_WINDOW_SEC = 90;

function statePath() {
  return process.env.CLAUDE_BUDDY_STATE || path.join(os.homedir(), '.claude-buddy', 'state.json');
}

function loadRaw() {
  try { return JSON.parse(fs.readFileSync(statePath(), 'utf8')); }
  catch { return null; }
}

function secsBetween(a, b) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 1000;
}

async function main() {
  // Drain stdin (Claude Code sends session JSON we don't need).
  if (!process.stdin.isTTY) {
    for await (const _ of process.stdin) { /* drain */ }
  }

  const raw = loadRaw();

  if (!raw || !raw.activeBuddy || !Array.isArray(raw.roster) || raw.roster.length === 0) {
    process.stdout.write('🐾 No buddy — run: npm run pocket-pet -- choose');
    return;
  }

  try {
    const { loadState, saveState } = await import('../dist/src/persistence.js');
    const { applyEvent }           = await import('../dist/src/engine/events.js');
    const { render }               = await import('../dist/src/render.js');

    const now      = new Date().toISOString();
    let   state    = loadState();
    const lastTick = state.session.lastTickAt ?? state.session.sessionStart ?? now;
    const elapsed  = Math.max(0, Math.min(secsBetween(lastTick, now), 3600));

    if (elapsed > 0) {
      const r = applyEvent(state, { type: 'tick', at: now, elapsedSec: elapsed });
      state = r.state;
      saveState(state);
    }

    let line = render(state);
    const c   = state.session.lastComment;
    const cAt = state.session.lastCommentAt;
    if (c && cAt && secsBetween(cAt, now) <= COMMENT_DISPLAY_WINDOW_SEC) {
      line += `\n\x1b[2m"${c}"\x1b[0m`;
    }
    process.stdout.write(line);
  } catch {
    // dist/ missing — show a minimal line so the statusline isn't blank.
    const buddy = raw.roster.find(b => b.buddyId === raw.activeBuddy);
    const name  = buddy?.nickname || buddy?.currentForm || raw.activeBuddy;
    process.stdout.write(`🐾 ${name} · (run npm run install-pet)`);
  }
}

main().catch(() => process.stdout.write(''));
