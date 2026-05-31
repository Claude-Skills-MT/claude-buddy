#!/usr/bin/env node
// Pocket Pet CLI — the interactive surface: collection, gacha, talk, swap, release.
// Usage: buddy <command> [args]
import { loadState, saveState, statePath } from '../dist/src/persistence.js';
import { applyEvent } from '../dist/src/engine/events.js';
import { render, renderCollection } from '../dist/src/render.js';

const now = () => new Date().toISOString();

function help() {
  console.log(`Pocket Pet 🐾  (state: ${statePath()})

Usage: buddy <command> [args]

  status                 Show the active buddy's status line
  collection             Show your roster, shards, pity counters
  pull <common|rare|legendary>
                         Spend shards on a gacha pull
  swap <buddyId>         Make a roster buddy active
  release <buddyId> [--force]
                         Release a buddy for shards (legendary needs --force)
  talk <message...>      Say something to your buddy
  help                   Show this help
`);
}

function main() {
  const [cmd, ...args] = process.argv.slice(2);
  let state = loadState();

  switch (cmd) {
    case 'status':
      console.log(render(state));
      break;

    case 'collection':
    case 'dex':
      console.log(renderCollection(state));
      break;

    case 'pull': {
      const kind = args[0];
      if (!['common', 'rare', 'legendary'].includes(kind)) {
        console.error('Usage: buddy pull <common|rare|legendary>');
        process.exit(1);
      }
      try {
        const before = new Set(state.roster.map((b) => b.buddyId));
        const result = applyEvent(state, { type: 'pull', at: now(), kind });
        state = result.state;
        saveState(state);
        const added = state.roster.find((b) => !before.has(b.buddyId));
        if (added) {
          console.log(`✨ NEW: ${added.currentForm} (${added.rarity})!`);
        } else {
          console.log(`Duplicate — converted to shards/resonance. Balance: ${state.player.shardBalance}💎 / ${state.player.resonanceShards} resonance`);
        }
      } catch (e) {
        console.error(String(e.message ?? e));
        process.exit(1);
      }
      break;
    }

    case 'swap': {
      const id = args[0];
      if (!id) { console.error('Usage: buddy swap <buddyId>'); process.exit(1); }
      const result = applyEvent(state, { type: 'swap_buddy', at: now(), toBuddyId: id });
      state = result.state;
      saveState(state);
      console.log(render(state));
      break;
    }

    case 'release': {
      const id = args[0];
      const force = args.includes('--force');
      if (!id) { console.error('Usage: buddy release <buddyId> [--force]'); process.exit(1); }
      try {
        const result = applyEvent(state, { type: 'release', at: now(), buddyId: id, confirm: force });
        state = result.state;
        saveState(state);
        console.log(`Released ${id}. Balance: ${state.player.shardBalance}💎`);
      } catch (e) {
        console.error(String(e.message ?? e));
        process.exit(1);
      }
      break;
    }

    case 'talk': {
      const text = args.join(' ');
      const result = applyEvent(state, { type: 'talk', at: now(), text });
      console.log(`🐾 “${result.reply}”`);
      break;
    }

    case 'help':
    case undefined:
      help();
      break;

    default:
      console.error(`Unknown command: ${cmd}`);
      help();
      process.exit(1);
  }
}

main();
