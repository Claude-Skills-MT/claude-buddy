import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import type { GameState } from './types.js';
import { createInitialState } from './state.js';
import { STATE_VERSION } from './constants.js';

const DEFAULT_BUDDY = 'glitchlet';

export function statePath(): string {
  return process.env['CLAUDE_BUDDY_STATE'] ?? join(homedir(), '.claude-buddy', 'state.json');
}

export function migrate(raw: unknown): GameState {
  if (typeof raw !== 'object' || raw === null) {
    return createInitialState(DEFAULT_BUDDY, new Date().toISOString());
  }
  const r = raw as Record<string, unknown>;
  if ((r['version'] as number) === STATE_VERSION) {
    return raw as GameState;
  }
  // Future migrations go here; for now, reset on unknown version
  return createInitialState(DEFAULT_BUDDY, new Date().toISOString());
}

export function loadState(path?: string): GameState {
  const p = path ?? statePath();
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    return migrate(raw);
  } catch {
    return createInitialState(DEFAULT_BUDDY, new Date().toISOString());
  }
}

export function saveState(state: GameState, path?: string): void {
  const p = path ?? statePath();
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 2), 'utf8');
}
