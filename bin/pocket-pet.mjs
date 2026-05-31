#!/usr/bin/env node
// Pocket Pet CLI — the interactive surface: collection, gacha, talk, swap, release.
// Usage: /pocket-pet <command> [args]
import { loadState, saveState, statePath } from '../dist/src/persistence.js';
import { createInitialState } from '../dist/src/state.js';
import { applyEvent } from '../dist/src/engine/events.js';
import { render, renderCollection } from '../dist/src/render.js';
import { appraiseBuddy } from '../dist/src/engine/appraise.js';
import { rollPersonalityForId, archetypeName, archetypeDescriptor } from '../dist/src/engine/personality.js';
import { BUDDIES_BY_ID } from '../dist/data/buddies.js';
import { FOODS, FOODS_BY_ID } from '../dist/data/food.js';

const now = () => new Date().toISOString();

// Three diverse starters: sarcastic, gruff, curious — cover different personalities.
const STARTERS = [
  { id: 'nullpup',  label: 'Nullpup',  blurb: '"everything is fine. it\'s not."' },
  { id: 'byteling', label: 'Byteling', blurb: '"doesn\'t explain itself. doesn\'t need to."' },
  { id: 'pingling', label: 'Pingling', blurb: '"what does THAT do? and THAT? what about THIS?"' },
];

function starterMenu() {
  const lines = ['Choose your starter — these three found you first.\n'];
  STARTERS.forEach((s, i) => {
    const { personality } = rollPersonalityForId(s.id);
    const def = BUDDIES_BY_ID[s.id];
    const trait = def?.traitPrimary ?? '?';
    lines.push(`  ${i + 1}.  ${s.label.padEnd(12)} · ${trait.padEnd(14)} · ${archetypeName(personality)} — ${archetypeDescriptor(personality)}`);
    lines.push(`       ${s.blurb}`);
  });
  lines.push('\nRun:  /pocket-pet choose 1   (or 2, or 3)');
  return lines.join('\n');
}

function requireBuddy(state) {
  if (!state.activeBuddy || state.roster.length === 0) {
    console.log('No buddy yet.\n');
    console.log(starterMenu());
    process.exit(0);
  }
}

function help() {
  console.log(`Pocket Pet 🐾  (state: ${statePath()})

Usage: /pocket-pet <command> [args]

  choose [1|2|3]         Pick your starter buddy (first-time setup)

  status                 Show the active buddy's status line
  collection             Show your roster, shards, pity counters
  pull <common|rare|legendary>
                         Spend shards on a gacha pull
  swap <buddyId>         Make a roster buddy active
  release <buddyId> [--force]
                         Release a buddy for shards (legendary needs --force)
  talk <message...>      Say something to your buddy

  Emotional attachment:
  appraise [buddyId]     Show your buddy's full stats, personality and bond history
  store                  Browse the food store and your pantry
  buy <foodId> [qty]     Buy food with shards
  feed [foodId]          Feed your active buddy (picks a favorite/cheapest if omitted)
  name <nickname>        Nickname your active buddy ("Steve")
  name <buddyId> <nick>  Nickname a specific roster buddy
  help                   Show this help
`);
}

function main() {
  const [cmd, ...args] = process.argv.slice(2);
  let state = loadState();

  switch (cmd) {
    case 'choose': {
      if (state.activeBuddy && state.roster.length > 0) {
        console.log(`You already have a buddy: ${state.roster[0].currentForm}. Use /pocket-pet swap to change active buddy.`);
        process.exit(0);
      }
      const pick = args[0];
      if (!pick || !['1', '2', '3'].includes(pick)) {
        console.log(starterMenu());
        process.exit(0);
      }
      const starter = STARTERS[Number(pick) - 1];
      state = createInitialState(starter.id, now());
      saveState(state);
      const buddy = state.roster[0];
      const { personality } = rollPersonalityForId(starter.id);
      console.log(`\n🐾 ${buddy.currentForm} chose you.\n`);
      console.log(`   ${archetypeName(personality)} — ${archetypeDescriptor(personality)}`);
      console.log(`   Trait: ${buddy.traitPrimary}`);
      console.log(`\n${render(state)}`);
      console.log('\nStart working and watch the status line. Run /pocket-pet help for commands.');
      break;
    }

    case 'status':
      requireBuddy(state);
      console.log(render(state));
      break;

    case 'collection':
    case 'dex':
      requireBuddy(state);
      console.log(renderCollection(state));
      break;

    case 'pull': {
      requireBuddy(state);
      const kind = args[0];
      if (!['common', 'rare', 'legendary'].includes(kind)) {
        console.error('Usage: /pocket-pet pull <common|rare|legendary>');
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
      requireBuddy(state);
      const id = args[0];
      if (!id) { console.error('Usage: /pocket-pet swap <buddyId>'); process.exit(1); }
      const result = applyEvent(state, { type: 'swap_buddy', at: now(), toBuddyId: id });
      state = result.state;
      saveState(state);
      console.log(render(state));
      break;
    }

    case 'release': {
      requireBuddy(state);
      const id = args[0];
      const force = args.includes('--force');
      if (!id) { console.error('Usage: /pocket-pet release <buddyId> [--force]'); process.exit(1); }
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
      requireBuddy(state);
      const text = args.join(' ');
      const result = applyEvent(state, { type: 'talk', at: now(), text });
      console.log(`🐾 "${result.reply}"`);
      break;
    }

    case 'appraise': {
      requireBuddy(state);
      console.log(appraiseBuddy(state, args[0]));
      break;
    }

    case 'store': {
      requireBuddy(state);
      console.log(`Store 🛒  (balance: ${state.player.shardBalance}💎)\n`);
      for (const f of FOODS) {
        const owned = state.player.food?.[f.id] ?? 0;
        console.log(`  ${f.emoji} ${f.id.padEnd(16)} ${String(f.cost).padStart(3)}💎  -${f.nourish} hunger  +${f.attachment}♥${f.favoredAxis ? ` (loved by ${f.favoredAxis})` : ''}  ${owned ? `[have ${owned}]` : ''}`);
        console.log(`     ${f.blurb}`);
      }
      console.log(`\nBuy with:  /pocket-pet buy <foodId> [qty]`);
      break;
    }

    case 'buy': {
      requireBuddy(state);
      const foodId = args[0];
      const qty = Number(args[1] ?? '1');
      if (!foodId || !FOODS_BY_ID[foodId]) {
        console.error('Usage: /pocket-pet buy <foodId> [qty]   (see "/pocket-pet store")');
        process.exit(1);
      }
      try {
        const result = applyEvent(state, { type: 'buy_food', at: now(), foodId, qty });
        state = result.state;
        saveState(state);
        const f = FOODS_BY_ID[foodId];
        console.log(`Bought ${qty}× ${f.emoji} ${f.name}. Balance: ${state.player.shardBalance}💎`);
      } catch (e) {
        console.error(String(e.message ?? e));
        process.exit(1);
      }
      break;
    }

    case 'feed': {
      requireBuddy(state);
      try {
        const result = applyEvent(state, { type: 'feed', at: now(), foodId: args[0] });
        state = result.state;
        saveState(state);
        console.log(`🐾 "${result.reply}"`);
        console.log(render(state));
      } catch (e) {
        console.error(String(e.message ?? e));
        process.exit(1);
      }
      break;
    }

    case 'name': {
      requireBuddy(state);
      if (args.length === 0) { console.error('Usage: /pocket-pet name <nickname>  |  /pocket-pet name <buddyId> <nickname>'); process.exit(1); }
      const isId = state.roster.some((b) => b.buddyId === args[0]);
      const buddyId = isId ? args[0] : undefined;
      const nickname = (isId ? args.slice(1) : args).join(' ');
      if (!nickname) { console.error('Give a nickname.'); process.exit(1); }
      const result = applyEvent(state, { type: 'rename', at: now(), buddyId, nickname });
      state = result.state;
      saveState(state);
      console.log(render(state));
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
