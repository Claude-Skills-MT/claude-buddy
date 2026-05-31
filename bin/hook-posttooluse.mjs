#!/usr/bin/env node
// Pocket Pet PostToolUse hook — feeds terminal/edit activity into the engine.
// stdin: Claude Code PostToolUse JSON (tool_name, tool_input, tool_output, exit_code).
// The pet feeds on your builds, tests and pain. Zero tokens.

const TEST_RE = /\b(npm (run )?test|yarn test|pnpm test|vitest|jest|mocha|pytest|go test|cargo test|rspec|phpunit|gradle test|mvn test)\b/i;
const BUILD_RE = /\b(npm run build|yarn build|pnpm build|make\b|tsc\b|cargo build|go build|gradle build|mvn (package|install)|webpack|vite build|next build|cmake)\b/i;

const LANG_BY_EXT = {
  ts: 'TypeScript', tsx: 'TypeScript', js: 'JavaScript', jsx: 'JavaScript',
  py: 'Python', rs: 'Rust', go: 'Go', rb: 'Ruby', java: 'Java', kt: 'Kotlin',
  c: 'C', h: 'C', cpp: 'C++', cc: 'C++', cs: 'C#', php: 'PHP', swift: 'Swift',
  sh: 'shell', sql: 'SQL', html: 'HTML', css: 'CSS', json: 'JSON', md: 'Markdown',
};

function langForPath(p) {
  if (!p) return undefined;
  const ext = p.split('.').pop()?.toLowerCase();
  return ext ? LANG_BY_EXT[ext] : undefined;
}

function eventsFor(input, now) {
  const events = [];
  const tool = input.tool_name;
  const ti = input.tool_input ?? {};
  const exit = input.exit_code;
  const failed = input.tool_result === 'error' || (typeof exit === 'number' && exit !== 0);

  if (tool === 'Bash') {
    const cmd = String(ti.command ?? '');
    const isTest = TEST_RE.test(cmd);
    const isBuild = BUILD_RE.test(cmd);

    if (isTest) {
      events.push({ type: failed ? 'test_fail' : 'test_pass', at: now });
    }
    if (isBuild && !failed) {
      events.push({ type: 'build_success', at: now });
    }
    if (failed) {
      events.push({ type: 'error_detected', at: now });
    } else {
      events.push({ type: 'error_resolved', at: now });
    }
  } else if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit') {
    const lang = langForPath(ti.file_path);
    if (lang) events.push({ type: 'language_tag', at: now, lang });
  }

  return events;
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main() {
  const { loadState, saveState } = await import('../dist/src/persistence.js');
  const { applyEvent } = await import('../dist/src/engine/events.js');

  let input = {};
  try { input = JSON.parse((await readStdin()) || '{}'); } catch { input = {}; }

  const now = new Date().toISOString();
  let state = loadState();
  let lastComment;

  for (const event of eventsFor(input, now)) {
    const result = applyEvent(state, event);
    state = result.state;
    if (result.comment) lastComment = result.comment;
  }
  saveState(state);

  if (lastComment) {
    process.stdout.write(JSON.stringify({ systemMessage: `🐾 "${lastComment}"`, suppressOutput: true }));
  } else {
    process.stdout.write('{}');
  }
}

main().catch(() => process.stdout.write('{}'));
