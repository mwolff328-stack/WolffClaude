---
name: survivorpulse-local-test-substitute-when-ci-is-down
description: "How to get real local vitest evidence on Windows/Git Bash in a fresh worktree when the CI gate cannot run; npm run test:unit is broken on Windows, full suite is too slow, use vitest related"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ab27021-5588-4f49-83f8-6949d85566fc
  modified: 2026-09-19T16:45:40.680Z
---

When the Pre-Publish Gate cannot run (see [[survivorpulse-github-actions-budget-exhaustion-signature]]), the closest local substitute is NOT `npm run test:unit`.

- **`npm run test:unit` fails immediately on Windows**: its script starts with the POSIX env prefix `NODE_ENV=test ...`, which npm's cmd.exe shell rejects ("'NODE_ENV' is not recognized"). The wrapper subshell still exits 0, so a `; echo EXIT:$?` pattern reports success. Always read the log, never the wrapper's exit code.
- **Run vitest directly from Git Bash with the env vars set**: `NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 SKIP_DB_GUARD=1 DATABASE_URL=postgres://u:p@localhost:5432/localonly npx vitest run --config vitest.config.ts` (the fake localhost DATABASE_URL just lets `server/db` import; see the mocked-route-tests memory). `npx vitest` is pre-approved in CLAUDE.md and is NOT blocked.
- **The full unit suite is ~1,300 test files** (CI splits it across shards, ~40-45 min wall). Locally it ran 15+ minutes without finishing and starves other work. Do not wait for it.
- **Use `vitest related`** on the production files changed since the last CI-cleared commit, plus the changed test files (`git diff --name-only <cleared>..HEAD`). Add `--reporter=default --reporter=json --outputFile.json=/tmp/x.json` to get exact per-file results. ~7 files/min on a laptop; ~120+ files for a UserContext-touching change.
- **`testTimeout` is 30s** in vitest.config.ts. A heavy combinatorics test (`tests/portfolioRecommendation.test.ts`, "should generate correct number of combinations") took 30.9s and "failed" under local load (parallel subagents, tsc). That is load, not a regression; re-run it alone before believing it.
- **A fresh worktree has no node_modules**: `npm ci --no-audit --no-fund` takes ~40s.
- **TaskStop on a background run may leave the node workers alive on Windows.** Find them by worktree path in the command line (`Get-CimInstance Win32_Process -Filter "Name='node.exe'"` filtered on the worktree name) and stop only those; never blanket-kill node.exe (other sessions run vitest too).
- `npm run check` (typecheck + import/query-key/vacuous-test guards + e2e tsc) works fine locally and took ~2-3 min; it also typechecks `*.test.tsx` files (tsconfig excludes only `*.test.ts`).

**Why:** this session lost ~25 minutes to the broken npm script and an unfinishable full run. **How to apply:** in a CI-down audit, run `npm run check` first, then `vitest related` scoped to the uncleared commits, and label the result as substitute evidence, not a gate.
