#!/usr/bin/env node
// Pocket Pet SessionStart hook — summons a random buddy, runs streak/comeback logic.
// stdin: Claude Code SessionStart JSON. stdout: JSON with a systemMessage (the summon line).

const STARTERS = [
  { id: 'nullpup',  label: 'Nullpup',  blurb: '"everything is fine. it\'s not."' },
  { id: 'byteling', label: 'Byteling', blurb: '"doesn\'t explain itself. doesn\'t need to."' },
  { id: 'pingling', label: 'Pingling', blurb: '"what does THAT do? and THAT? what about THIS?"' },
];

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main() {
  // Dynamic imports so a missing/stale dist produces a helpful message instead of a crash.
  const { loadState, saveState } = await import('../dist/src/persistence.js');
  const { applyEvent } = await import('../dist/src/engine/events.js');
  const { render } = await import('../dist/src/render.js');
  const { rollPersonalityForId, archetypeName, archetypeDescriptor } = await import('../dist/src/engine/personality.js');
  const { BUDDIES_BY_ID } = await import('../dist/data/buddies.js');

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  let state = loadState();

  // No buddy chosen yet — show the starter menu.
  if (!state.activeBuddy || state.roster.length === 0) {
    const lines = ['🐾 No buddy yet. Choose your starter:\n'];
    STARTERS.forEach((s, i) => {
      const { personality } = rollPersonalityForId(s.id);
      const def = BUDDIES_BY_ID[s.id];
      const trait = def?.traitPrimary ?? '?';
      lines.push(`  ${i + 1}.  ${s.label.padEnd(12)} · ${trait.padEnd(14)} · ${archetypeName(personality)} — ${archetypeDescriptor(personality)}`);
      lines.push(`       ${s.blurb}`);
    });
    lines.push('\nRun in your terminal:  npm run pocket-pet -- choose 1   (or 2, or 3)');
    process.stdout.write(JSON.stringify({ systemMessage: lines.join('\n'), suppressOutput: true }));
    return;
  }

  const firstOfDay = state.player.lastSessionDate !== today;
  const result = applyEvent(state, { type: 'session_start', at: now, firstOfDay });
  state = result.state;
  saveState(state);

  const summon = render(state);
  const parts = [`🐾 ${summon}`];
  if (result.comment) parts.push(`"${result.comment}"`);

  process.stdout.write(JSON.stringify({ systemMessage: parts.join('  '), suppressOutput: true }));
}

main().catch((e) => {
  const msg = e?.message?.split('\n')[0] ?? String(e);
  process.stdout.write(JSON.stringify({
    systemMessage: `🐾 Pocket Pet needs a rebuild — run: npm run install-pet\n(${msg})`,
    suppressOutput: true,
  }));
});
