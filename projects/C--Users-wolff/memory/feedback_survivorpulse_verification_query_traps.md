---
name: feedback_survivorpulse_verification_query_traps
description: "Two SurvivorPulse verification traps that each fake a failure or fake a pass — the schedule_type enum value, and tests/ being excluded from every tsconfig"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1822a37a-6806-42d1-a467-6dd43d564c56
  modified: 2026-08-12T05:52:00.213Z
---

Two traps burned hours in one session. Both produce a *confident wrong answer*, not an
error.

**1. `schedule_type` is `regular_season`, not `regular`.** The storage layer takes
`'regular'` as its `ScheduleType` argument and maps it through `requireDbScheduleType`
before it hits the DB. A verification query written as
`WHERE schedule_type = 'regular'` returns **0 rows against a fully-populated table**.

**Why:** I wrote that query, got 0 rows, and concluded Proposed picks were never
persisting. Hours went into instrumenting the transaction, corrupting `storage.ts` with
sed, and chasing a phantom silent-rollback. The writes had been landing the entire time.
The Apply endpoint's `success: true` was correct and I disbelieved it.

**How to apply:** before declaring "the data isn't there", run the query with **no
filters** first (`SELECT count(*), season, schedule_type, period_type FROM t GROUP BY …`).
A grouped count cannot lie about an enum value the way an equality filter can. Treat a
0-row result on a filtered query as "my filter may be wrong" until a grouped count
agrees. Related: [[project_survivorpulse_gameplan_scope_divergence]].

**Also:** editing `C:\Users\wolff\Projects\SurvivorPulse` does NOT change what the Replit
dev app runs — that's `/home/runner/workspace`, a different filesystem. Local Edit-tool
changes will never appear in the dev console. Instrument via the Replit shell, or push
and let Replit Sync land it.

**2. `tests/*.test.ts` is excluded from every tsconfig, so type-level guards there are inert.**
`tsconfig.json` has `"exclude": ["node_modules","build","dist","**/*.test.ts"]` and
`include` covers only `client/src`, `shared`, `server`; no npm script type-checks the
`tests/` dir (`check` runs `tsc` + `check:e2e`).

**Exact scope, because the difference bites both ways:** the exclude glob is `.test.ts`
only. A `.test.tsx` under `client/src/**` **IS** type-checked — a co-resident session's
half-finished `SeasonGridSection.test.tsx` produced a real `npx tsc --noEmit` error in
the same session this was learned. So `tsc` in the main worktree also compiles other
sessions' WIP: an error in a file you never touched is theirs, not yours.

A `@ts-expect-error` tripwire in a test file is therefore **never evaluated** — a guard
that cannot fail. I wrote one, ran `npx tsc --noEmit`, and got exit 0 / 0 errors; that
looked like a pass and was actually the file not being compiled at all.

**How to apply:** guards in `tests/` must execute under **vitest**, not rely on the type
checker. Runtime shapes that work: `fn.length` for arity (goes genuinely RED when a
parameter is added or removed), and parsing the real source file to assert the CORRECT
call form is present. Never assert a broken form is *absent* — that fails open on any
rename.
