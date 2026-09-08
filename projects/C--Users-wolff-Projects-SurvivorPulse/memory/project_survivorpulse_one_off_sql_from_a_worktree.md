---
name: project_survivorpulse_one_off_sql_from_a_worktree
description: How to run one-off SQL against the local Neon dev DB from a worktree session when the Neon MCP tools are down — without writing a scratch file into the shared main checkout
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
