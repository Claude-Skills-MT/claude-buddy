#!/usr/bin/env node
// Pocket Pet installer — wires the statusline + hooks into ~/.claude/settings.json.
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
const SKILLS_DIR = join(SETTINGS_DIR, 'skills', 'pocket-pet'); // kept for clean removal of older installs

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
  s.hooks.PostToolUse  = [...stripOurs(s.hooks.PostToolUse),  { ...hookEntry(postToolUse),  matcher: 'Bash|Edit|Write|MultiEdit' }];
  s.hooks.SessionEnd   = [...stripOurs(s.hooks.SessionEnd),   hookEntry(sessionEnd)];

  save(s);

  // A slash-command skill routes through the LLM and costs tokens — the exact
  // opposite of this project's zero-token promise. Older installs shipped one;
  // delete it so /pocket-pet can never silently burn tokens again.
  try {
    if (existsSync(SKILLS_DIR)) {
      rmSync(SKILLS_DIR, { recursive: true, force: true });
      console.log('Removed a stale /pocket-pet skill (skills cost tokens — this pet is zero-token).');
    }
  } catch { /* nothing to clean */ }

  console.log(`\n🐾 Pocket Pet installed into ${SETTINGS}`);
  console.log('\nPick your starter (run once in a terminal — zero tokens):');
  console.log(`\n  node ${cli} choose`);
  console.log(`  node ${cli} choose 1`);
  console.log('\nThen start Claude Code. The pet lives in the status line — no tokens ever.');
  console.log(`\nAll commands:  node ${cli} help`);
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
  try { rmSync(SKILLS_DIR, { recursive: true, force: true }); } catch { /* already gone */ }
  console.log('🐾 Pocket Pet removed from settings.json (your other settings are untouched).');
}

if (process.argv.includes('--uninstall')) uninstall();
else install();
