---
name: project_survivorpulse_one_off_sql_from_a_worktree
description: How to check what is actually in a SurvivorPulse database — one-off SQL against the local Neon dev DB from a worktree when Neon MCP is down, and how to prove a column exists on helium, which no local check can reach
metadata: 
  node_type: memory
  type: project
  originSessionId: 131df278-6a7d-4838-bea7-c0f1aa864cb7
  modified: 2026-09-08T14:34:51.443Z
---

A worktree session CAN reach the real Neon dev DB (`ep-flat-rice`, survivorpulse-dev),
even with the Neon MCP tools dead (`CONNECT_TIMEOUT` / `CONNECTION_CLOSED`, which
happens often). The worktree itself has neither `.env` nor `node_modules` — both live
only in the main checkout at `C:\Users\wolff\Projects\SurvivorPulse`. So run Node with
**cwd at the main checkout**, where bare ESM imports resolve:

```
cd "C:/Users/wolff/Projects/SurvivorPulse" && node --input-type=module -e "
import fs from 'node:fs';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;
const url = fs.readFileSync('.env','utf8').split(/\r?\n/)
  .find(l => /^\s*DATABASE_URL\s*=/.test(l))
  .replace(/^\s*DATABASE_URL\s*=\s*/,'').trim();
if (!new URL(url).host.startsWith('ep-flat-rice')) { console.error('REFUSING'); process.exit(1); }
const pool = new Pool({ connectionString: url });
try { /* … */ } finally { await pool.end(); }
"
```

**Why this shape:** `--input-type=module -e` resolves bare specifiers from cwd, so no
file is created. `sp-live-verify` §8 suggests "a repo-root `.mjs`" — that works, but it
drops a scratch file into the **shared** main checkout where another concurrent
session's `git status` sees it, which is exactly the class of disturbance the 2026-08-07
postmortem is about. A `-e` one-liner leaves nothing behind. A script under the
scratchpad or `/tmp` fails ESM `node_modules` resolution, which is why the skill warned
against it.

**Guard rails that matter:** parse `DATABASE_URL` inside the script and never echo it —
`.env` line 1 is a **commented-out** `ep-cool-brook` URL and the active line 2 is
`ep-flat-rice` (see [[project_survivorpulse_env_database_url_two_lines]]); print the
hostname only. Assert the host prefix before any write. `ep-blue-tree` is CI and
`ep-mute-bar` is the e2e-throwaway branch — only the host distinguishes them.

This does **not** contradict [[project_survivorpulse_sandbox_has_no_local_postgres]].
That memory is about there being no local Postgres binary or Docker for integration
tests; a real hosted Neon dev DB is reachable this way and always was.

**How to apply:** use it for schema-drift repair. When `server/schemaDriftCheck.ts`
kills the dev server at boot, apply the story's own idempotent migration file this way —
never `npm run db:push`, which drops anything the report lists as an extra table
(`pick_confirmations` is a standing example, and the boot log names it explicitly). Then
prove it with the **boot check**, not the migration file's STATE note: from the main
checkout, `NODE_ENV=development CI_STATIC=1 PORT=5000 npx tsx --env-file=.env
server/index.ts` should log `[SCHEMA_DRIFT_CHECK] No missing schema.` and reach
`✅ Server successfully started on port 5000`. `CI_STATIC=1` is required — plain
`npm run dev` hangs in `setupVite` and never reaches `listen`, so a clean drift check
alone would leave you with no port to confirm. Verified 2026-09-08 applying SST-1544's
Opening-popularity migration.

## Proving a column exists on helium, which you cannot connect to

helium (the deployed dev app's DB) is reachable only from inside the Replit container,
so no local SQL check says anything about it. You do not need the founder to run a
console query — **a route backed by a bare Drizzle `.select()` is a column-existence
probe.** `.select()` with no argument names EVERY column in `shared/schema.ts`, and a
SELECT naming a column the database lacks fails at **plan time** with Postgres 42703,
regardless of how many rows match. So a 200 proves the column is there, and an empty
result set cannot mask a missing one.

Two conditions make the 200 load-bearing, and both must be checked in the source before
citing it — otherwise this is just "no error happened", which is not evidence:
1. The storage method really uses a bare `.select()` (not an explicit column list, which
   would omit the new column and prove nothing).
2. The call is not wrapped in an inner `catch` that swallows the rejection and still
   returns 200. A bare `Promise.all` feeding an outer catch is fine — the rejection
   surfaces as an error status.

Worked example, 2026-09-08, settling whether helium had SST-1544's two
`opening_popularity_percentage` columns: `GET /api/pick-popularity` returned rows whose
key set included `openingPopularityPercentage`, and
`GET /api/pools/:poolId/pick-popularity/effective` — the route reading BOTH
`pick_popularity` and `user_pool_pick_popularity_overrides` — returned 200 across three
pools. Both columns confirmed present, contradicting the migration's own authoring
commit, which had said "Not yet applied to any database".

**What this technique CANNOT see:** nullability, CHECK constraints, defaults, indexes.
`schemaDriftCheck` compares column NAMES only, so the boot check is blind to them too. A
migration whose `ADD COLUMN`s ran but whose `DROP NOT NULL` did not will pass every probe
here and still fail at runtime on the first write that relies on the relaxed column. Say
so explicitly rather than reporting the whole migration as verified.

Reach it with the founder's real session via `mcp__claude-in-chrome__*` and
`javascript_tool` + `fetch(..., {credentials:'include'})` — a plain `curl` from Bash
returns `UNAUTHORIZED` because it carries no session cookie, which is the wrong surface,
not the app being down (see [[project_survivorpulse_deployed_dev_url]]).
