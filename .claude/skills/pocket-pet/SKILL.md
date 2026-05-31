---
name: pocket-pet
description: Manage the user's Pocket Pet statusline companion — choose a starter buddy, check status, feed it, appraise its stats, buy food, or pull new buddies from the gacha. Use whenever the user types /pocket-pet, or asks to choose/feed/check/appraise their pocket pet, buddy, or creature.
---

# Pocket Pet

You drive the Pocket Pet CLI on the user's behalf. Pocket Pet is a deterministic,
zero-token creature that lives in the Claude Code status line.

When this skill is invoked, take whatever arguments the user passed (everything
after `/pocket-pet`) and run the CLI with them. If no arguments were given, run
`status` — unless the user has no buddy yet, in which case run `choose` to show
the three starters.

Run exactly this (substitute <ARGS>):

```bash
node "$CLAUDE_PROJECT_DIR/bin/pocket-pet.mjs" <ARGS>
```

Print the CLI's output to the user verbatim, inside a code block. Do not editorialize
or add commentary unless the user asks a follow-up question.

## Commands

- `choose` — list the three starter buddies (Nullpup / Byteling / Pingling)
- `choose 1` (or 2, or 3) — pick that starter and activate it
- `status` — the active buddy's status line
- `collection` — roster, shards, pity counters
- `appraise [buddyId]` — full stats: bond, personality, axes, history
- `feed [foodId]` — feed the active buddy
- `store` / `buy <foodId> [qty]` — food shop
- `pull <common|rare|legendary>` — gacha pull with earned shards
- `swap <buddyId>` / `release <buddyId>` / `name <nickname>` / `talk <message>`

## First run

If the user has never chosen a buddy, the status line and CLI will say so. Guide
them to `/pocket-pet choose`, then `/pocket-pet choose 1` (or 2, or 3).
