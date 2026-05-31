#!/usr/bin/env node
// Pocket Pet installer — wires the statusline + hooks into ~/.claude/settings.json.
// Usage: node bin/install.mjs           (install)
//        node bin/install.mjs --uninstall
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(HERE);
const BIN = join(REPO, 'bin');

const SETTINGS_DIR = join(homedir(), '.claude');
const SETTINGS = join(SETTINGS_DIR, 'settings.json');

const MARK = '__pocketPet'; // tag we add so we can find/remove our own entries

const statusline = join(BIN, 'statusline.mjs');
const sessionStart = join(BIN, 'hook-session-start.mjs');
const postToolUse = join(BIN, 'hook-posttooluse.mjs');
const sessionEnd = join(BIN, 'hook-session-end.mjs');

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

function stripOurs(arr) {
  return (arr ?? []).filter((e) => !e[MARK]);
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
  console.log(`\n🐾 Pocket Pet installed into ${SETTINGS}`);
  console.log('Restart Claude Code (or start a new session) to see your buddy in the status line.');
  console.log(`\nManage it with:  node ${join(BIN, 'buddy.mjs')} <command>`);
}

function uninstall() {
  backup();
  const s = load();
  if (s.statusLine?.[MARK]) delete s.statusLine;
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
  console.log('🐾 Pocket Pet removed from settings.json (your other settings are untouched).');
}

if (process.argv.includes('--uninstall')) uninstall();
else install();
