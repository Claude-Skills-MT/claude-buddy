# claude-buddy 🐾 — Pocket Pet

A small pixel-creature that lives in your Claude Code status line. It is **not** an
AI assistant and it will not answer your coding questions. It reacts to your
session, evolves, roasts you, remembers when you were gone, and has opinions about
your hours.

Every passive behavior is **deterministic and zero-token** — it runs as plain
Node scripts wired into Claude Code's status line and hooks. No model calls.

```
◆ Glitchlet S0 · 🤔 · 925✨ · 7💎 · 🔥3d
“look who remembered they have a license.”
```

## How it attaches to Claude Code

Claude Code has no graphical sidebar, so Pocket Pet lives in two real extension
points:

| Surface | What it does |
| --- | --- |
| **Status line** (`statusLine` in settings) | Renders the creature every ~10s. This heartbeat also accrues passive XP, shards and tame-hours, shifts mood, and occasionally surfaces a passive comment. |
| **`SessionStart` hook** | Summons a random buddy from your roster ("you didn't choose them, they chose you"), runs streak / comeback-roast logic, grants the first-session bonus. |
| **`PostToolUse` hook** (`Bash`, `Edit`, `Write`) | Watches your terminal: build success, test pass/fail and errors feed the pet (it feeds on your pain). File edits tag the active language. |
| **`SessionEnd` hook** | Banks the session's tame-hours and triggers evolution. |

> **Honest limitation:** Claude Code has no wall-clock *hook* timer, so passive
> comments can't be injected into the chat on a fixed schedule. Instead they appear
> in the **status line** (the creature's own speech), driven by the status line's
> `refreshInterval`. That's the correct home for them anyway — next to your work,
> not in your conversation.

## Install

Requires Node 18+. Installs into `~/.claude/settings.json` (your existing settings
are backed up and preserved):

```bash
npm install
npm run install-pet      # builds, then wires up status line + hooks
```

Start a new Claude Code session and your buddy appears in the status line.

To remove it (restores cleanly, leaves your other settings alone):

```bash
npm run uninstall-pet
```

## Interacting with your pet

Gacha, collection and chat happen through the CLI (there's no GUI):

```bash
npm run buddy status                 # current buddy's status line
npm run buddy collection             # roster, shards, pity counters
npm run buddy pull rare              # spend shards on a pull (common|rare|legendary)
npm run buddy swap <buddyId>         # make a roster buddy active
npm run buddy release <buddyId>      # release for shards (legendary needs --force)
npm run buddy talk "hey"             # say something (it deflects coding questions)
```

State lives at `~/.claude-buddy/state.json` (override with `CLAUDE_BUDDY_STATE`).

## The system

- **50 buddies** across Common / Uncommon / Rare / Epic / Legendary, with evolution
  chains, traits, accessories and Awakened legendary forms.
- **XP**: passive trickle + bursts (error / build / test), flow-state multiplier,
  past-midnight bonus, streak multiplier (1–7×). Active buddy earns full XP; roster
  buddies earn 10%.
- **Shards & gacha** with persistent pity (Epic @10, Legendary @50) and duplicate
  conversion (refunds → resonance shards → bonus levels).
- **Evolution**: 3-stage (10h/35h), 2-stage (20h), legendary level 1–100 with trait
  unlocks and an Awakened form at Lv 81+.
- **Moods, streaks & comeback roasts** (six severity tiers from "oh. you're back."
  to full devastation), swap-sulk rules, seasonal events.
- **Talk mode** that never answers coding questions — it deflects in character.

## Architecture

Pure, deterministic engine with a single seam so the integration layer stays thin:

```
data/         50 buddies + comment / talk pools (no logic)
src/engine/   pure modules: xp, shards, gacha, evolution, mood, streak, swap, …
src/engine/events.ts   applyEvent(state, event) — the one reducer hooks call
src/render.ts          render(state) — the status-line string
src/persistence.ts     load / save JSON (the only module that touches the disk)
bin/          the Claude Code glue: statusline + hook scripts + CLI + installer
```

Everything in `src/engine` and `data` is time- and randomness-injected, so it's
fully reproducible. Run the suite:

```bash
npm test          # 138 tests
npm run typecheck
```
