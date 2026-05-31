'use strict';
// Pocket Pet SessionStart hook — zero external dependencies for the common path.
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const STARTERS = [
  { id: 'nullpup',  label: 'Nullpup',  trait: 'Sarcastic', personality: 'Aloof',       desc: 'cool, distant, and devastatingly sarcastic', blurb: '"everything is fine. it\'s not."' },
  { id: 'byteling', label: 'Byteling', trait: 'Gruff',     personality: 'Stubborn',    desc: 'as stubborn as they come',                   blurb: '"doesn\'t explain itself. doesn\'t need to."' },
  { id: 'pingling', label: 'Pingling', trait: 'Curious',   personality: 'Mischievous', desc: 'a playful little gremlin',                   blurb: '"what does THAT do? and THAT? what about THIS?"' },
];

function statePath() {
  return process.env.CLAUDE_BUDDY_STATE || path.join(os.homedir(), '.claude-buddy', 'state.json');
}

function loadRaw() {
  try { return JSON.parse(fs.readFileSync(statePath(), 'utf8')); }
  catch { return null; }
}

function starterMenu() {
  const lines = ['🐾 No buddy yet. Choose your starter:\n'];
  STARTERS.forEach((s, i) => {
    lines.push(`  ${i + 1}.  ${s.label.padEnd(12)} · ${s.trait.padEnd(14)} · ${s.personality} — ${s.desc}`);
    lines.push(`       ${s.blurb}`);
  });
  lines.push('\nRun in your terminal:  npm run pocket-pet -- choose 1   (or 2, or 3)');
  return lines.join('\n');
}

function out(obj) { process.stdout.write(JSON.stringify(obj)); }

async function main() {
  const raw = loadRaw();

  // No state file, or no buddy chosen yet — show starter menu. No dist needed.
  if (!raw || !raw.activeBuddy || !Array.isArray(raw.roster) || raw.roster.length === 0) {
    out({ systemMessage: starterMenu(), suppressOutput: true });
    return;
  }

  // Has a buddy — delegate to the engine (needs dist/).
  try {
    const { loadState, saveState } = await import('../dist/src/persistence.js');
    const { applyEvent }           = await import('../dist/src/engine/events.js');
    const { render }               = await import('../dist/src/render.js');

    const now     = new Date().toISOString();
    const today   = now.slice(0, 10);
    let   state   = loadState();
    const firstOfDay = state.player.lastSessionDate !== today;
    const result  = applyEvent(state, { type: 'session_start', at: now, firstOfDay });
    saveState(result.state);

    const parts = [`🐾 ${render(result.state)}`];
    if (result.comment) parts.push(`"${result.comment}"`);
    out({ systemMessage: parts.join('  '), suppressOutput: true });
  } catch {
    // dist/ missing or stale — show buddy name without engine processing.
    const buddy = raw.roster.find(b => b.buddyId === raw.activeBuddy);
    const name  = buddy?.nickname || buddy?.currentForm || raw.activeBuddy;
    out({ systemMessage: `🐾 ${name} is here. (run: npm run install-pet to rebuild)`, suppressOutput: true });
  }
}

main().catch(() => out({}));
