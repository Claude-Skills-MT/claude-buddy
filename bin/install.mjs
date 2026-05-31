#!/usr/bin/env node
// Pocket Pet installer — wires the statusline + hooks into ~/.claude/settings.json
// and installs the /pocket-pet skill into ~/.claude/skills.
// Usage: node bin/install.mjs           (install)
//        node bin/install.mjs --uninstall
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(HERE);
const BIN = join(REPO, 'bin');

// Forward slashes work on Windows, macOS and Linux. Backslashes in a command
// string break when Claude Code runs hooks through bash (e.g. Git Bash on Windows).
function fwd(p) { return p.replace(/\\/g, '/'); }

const SETTINGS_DIR = join(homedir(), '.claude');
const SETTINGS = join(SETTINGS_DIR, 'settings.json');
const SKILLS_DIR = join(SETTINGS_DIR, 'skills', 'pocket-pet');

const MARK = '__pocketPet'; // tag we add so we can find/remove our own entries

const statusline   = fwd(join(BIN, 'statusline.cjs'));
const sessionStart = fwd(join(BIN, 'hook-session-start.cjs'));
const postToolUse  = fwd(join(BIN, 'hook-posttooluse.cjs'));
const sessionEnd   = fwd(join(BIN, 'hook-session-end.cjs'));
const cli          = fwd(join(BIN, 'pocket-pet.mjs'));

function load() {
  if (!existsSync(SETTINGS)) return {};
  try { return JSON.parse(readFileSync(SETTINGS, 'utf8')); }
  catch { return {}; }
}

function backup() {
  if (existsSync(SETTINGS)) {
    const dest = `${SETTINGS}.bak.${Date.now()}`;
    copyFileSync(SETTINGS, dest);
    console.log(`Backed up existing settings → ${dest}`);
  }
}

function save(obj) {
  mkdirSync(SETTINGS_DIR, { recursive: true });
  writeFileSync(SETTINGS, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function hookEntry(command) {
  return { [MARK]: true, hooks: [{ type: 'command', command: `node ${command}` }] };
}

// An entry is "ours" if it carries our mark OR its command references one of our
// scripts. The path check catches stale entries from older installs (e.g. the
// previous .mjs hooks) that would otherwise linger and crash on startup.
function isOurs(e) {
  if (!e) return false;
  if (e[MARK]) return true;
  const cmds = (e.hooks ?? []).map((h) => h?.command ?? '').join(' ');
  return /(hook-session-start|hook-posttooluse|hook-session-end|statusline|pocket-pet|bin[\/\\]buddy)/.test(cmds);
}

function stripOurs(arr) {
  return (arr ?? []).filter((e) => !isOurs(e));
}

// The /pocket-pet skill — lets the user run the CLI from inside Claude Code.
function skillBody() {
  return `---
name: pocket-pet
description: Manage the user's Pocket Pet statusline companion — choose a starter buddy, check status, feed it, appraise its stats, buy food, or pull new buddies from the gacha. Use whenever the user types /pocket-pet, or asks to choose/feed/check/appraise their pocket pet, buddy, or creature.
---

# Pocket Pet

You drive the Pocket Pet CLI on the user's behalf. Pocket Pet is a deterministic,
zero-token creature that lives in the Claude Code status line.

When this skill is invoked, take whatever arguments the user passed (everything
after \`/pocket-pet\`) and run the CLI with them. If no arguments were given, run
\`status\` — unless the user has no buddy yet, in which case run \`choose\` to show
the three starters.

Run exactly this (substitute <ARGS>):

\`\`\`bash
node "${cli}" <ARGS>
\`\`\`

Print the CLI's output to the user verbatim, inside a code block. Do not editorialize
or add commentary unless the user asks a follow-up question.

## Commands

- \`choose\` — list the three starter buddies (Nullpup / Byteling / Pingling)
- \`choose 1\` (or 2, or 3) — pick that starter and activate it
- \`status\` — the active buddy's status line
- \`collection\` — roster, shards, pity counters
- \`appraise [buddyId]\` — full stats: bond, personality, axes, history
- \`feed [foodId]\` — feed the active buddy
- \`store\` / \`buy <foodId> [qty]\` — food shop
- \`pull <common|rare|legendary>\` — gacha pull with earned shards
- \`swap <buddyId>\` / \`release <buddyId>\` / \`name <nickname>\` / \`talk <message>\`

## First run

If the user has never chosen a buddy, the status line and CLI will say so. Guide
them to \`/pocket-pet choose\`, then \`/pocket-pet choose 1\` (or 2, or 3).
`;
}

function installSkill() {
  mkdirSync(SKILLS_DIR, { recursive: true });
  writeFileSync(join(SKILLS_DIR, 'SKILL.md'), skillBody(), 'utf8');
  console.log(`Installed /pocket-pet skill → ${join(SKILLS_DIR, 'SKILL.md')}`);
}

function install() {
  backup();
  const s = load();

  if (s.statusLine && !s.statusLine[MARK]) {
    console.log('⚠️  An existing statusLine was found; it has been backed up and replaced.');
  }
  s.statusLine = {
    [MARK]: true,
    type: 'command',
    command: `node ${statusline}`,
    refreshInterval: 10,
    padding: 1,
  };

  s.hooks = s.hooks ?? {};
  s.hooks.SessionStart = [...stripOurs(s.hooks.SessionStart), { ...hookEntry(sessionStart), matcher: 'startup|resume|clear' }];
  s.hooks.PostToolUse = [...stripOurs(s.hooks.PostToolUse), { ...hookEntry(postToolUse), matcher: 'Bash|Edit|Write|MultiEdit' }];
  s.hooks.SessionEnd = [...stripOurs(s.hooks.SessionEnd), hookEntry(sessionEnd)];

  save(s);
  installSkill();

  console.log(`\n🐾 Pocket Pet installed into ${SETTINGS}`);
  console.log('Start a new Claude Code session, then run:  /pocket-pet choose');
}

function uninstall() {
  backup();
  const s = load();
  if (s.statusLine && isOurs({ hooks: [{ command: s.statusLine.command }], [MARK]: s.statusLine[MARK] })) {
    delete s.statusLine;
  }
  if (s.hooks) {
    for (const ev of ['SessionStart', 'PostToolUse', 'SessionEnd']) {
      if (s.hooks[ev]) {
        s.hooks[ev] = stripOurs(s.hooks[ev]);
        if (s.hooks[ev].length === 0) delete s.hooks[ev];
      }
    }
    if (Object.keys(s.hooks).length === 0) delete s.hooks;
  }
  save(s);
  try { rmSync(SKILLS_DIR, { recursive: true, force: true }); } catch {}
  console.log('🐾 Pocket Pet removed from settings.json and skills (your other settings are untouched).');
}

if (process.argv.includes('--uninstall')) uninstall();
else install();
