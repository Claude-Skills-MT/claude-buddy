#!/usr/bin/env node
// Pocket Pet SessionStart hook — summons a random buddy, runs streak/comeback logic.
// stdin: Claude Code SessionStart JSON. stdout: JSON with a systemMessage (the summon line).
import { loadState, saveState } from '../dist/src/persistence.js';
import { applyEvent } from '../dist/src/engine/events.js';
import { render } from '../dist/src/render.js';
import { rollPersonalityForId, archetypeName, archetypeDescriptor } from '../dist/src/engine/personality.js';
import { BUDDIES_BY_ID } from '../dist/data/buddies.js';

const STARTERS = [
  { id: 'nullpup',  label: 'Nullpup',  blurb: '”everything is fine. it\'s not.”' },
  { id: 'byteling', label: 'Byteling', blurb: '”doesn\'t explain itself. doesn\'t need to.”' },
  { id: 'pingling', label: 'Pingling', blurb: '”what does THAT do? and THAT? what about THIS?”' },
];

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

function isFirstSessionOfDay(state, today) {
  return state.player.lastSessionDate !== today;
}

function starterMenu() {
  const lines = ['🐾 No buddy yet. Choose your starter:\n'];
  STARTERS.forEach((s, i) => {
    const { personality } = rollPersonalityForId(s.id);
    const def = BUDDIES_BY_ID[s.id];
    const trait = def?.traitPrimary ?? '?';
    lines.push(`  ${i + 1}.  ${s.label.padEnd(12)} · ${trait.padEnd(14)} · ${archetypeName(personality)} — ${archetypeDescriptor(personality)}`);
    lines.push(`       ${s.blurb}`);
  });
  lines.push('\nRun in your terminal:  npm run pocket-pet -- choose 1   (or 2, or 3)');
  return lines.join('\n');
}

async function main() {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  let state = loadState();

  // No buddy chosen yet — show the starter menu instead of the normal summon.
  if (!state.activeBuddy || state.roster.length === 0) {
    process.stdout.write(JSON.stringify({
      systemMessage: starterMenu(),
      suppressOutput: true,
    }));
    return;
  }

  const firstOfDay = isFirstSessionOfDay(state, today);
  const result = applyEvent(state, { type: 'session_start', at: now, firstOfDay });
  state = result.state;
  saveState(state);

  const summon = render(state);
  const parts = [`🐾 ${summon}`];
  if (result.comment) parts.push(`”${result.comment}”`);

  process.stdout.write(JSON.stringify({
    systemMessage: parts.join('  '),
    suppressOutput: true,
  }));
}

main().catch(() => {
  process.stdout.write('{}');
});
