---
name: project_survivorpulse_unit_config_disables_db_host_guard
description: "vitest.config.ts sets SKIP_DB_GUARD=1 for the whole unit project on a false \"connects to nothing\" claim; 3 test files write to any real DB on every npm test."
metadata: 
  node_type: memory
  type: project
  originSessionId: 06406c48-9309-43e0-a921-c1b757698c20
  modified: 2026-09-08T02:36:05.123Z
---

`vitest.config.ts:58` sets `env: { SKIP_DB_GUARD: '1' }` for the entire unit project. Its comment justifies this by saying the `exclude` list drops every `*.integration.test.ts(x)` so "nothing it runs connects to a database". **That clause is false**, and the exemption is therefore much wider than it reads.

The exclude list covers `*.integration.test.ts(x)`, `*.e2e.test.ts`, `*.smoketest.ts`, and the DIRECTORIES `tests/e2e/**` and `tests/regression/**` — note `tests/regression/**` is a directory, so a file named `tests/foo.regression.test.ts` is NOT excluded.

Three files open a real connection and `db.insert()` with **no env gate at all** — they run on every `npm test` with the host guard disabled, writing to whatever `DATABASE_URL` names (seasons 91301/91302/91304 into `entries`/`picks`/`proposedPicks`):
- `tests/getTeamUsageByEntry.startingWeekFloor.sst1302.test.ts`
- `tests/getTeamUsageByEntry.track.sst1301.test.ts`
- `tests/usedTeamsAccessor.sst1304.test.ts`

Five more are one env var away (`RUN_DB_REGRESSION_TESTS=1` etc.), including `tests/futureGameCorruption.regression.test.ts` and `tests/recommendations.eligibility.blackbox.test.ts` (which mints seasons 2050-2059).

**Why it matters:** SST-1006 (`bbbbefcd`, 2026-07-23) hardened `scripts/lib/disposableDbHost.ts` to reject `ep-flat-rice`, `ep-blue-tree` and `helium` "under any flag" — but the unit config disables the guard before it can run, so SST-1006 is not closed in practice. Filed as SST-1586; the historic residue it produced is SST-1585.

**How to apply:** Never run the full test suite to investigate a DB-pollution question — running it is the defect. Diagnose statically or against a genuinely local Postgres. When checking whether a suite can write to a real DB, do NOT trust a filename-pattern exemption: grep the file for `server/db` / `server/storage` imports and `db.insert(` directly. Relates to [[project_survivorpulse_env_gated_suites_are_invisible_locally]] and [[feedback_guard_the_wire_not_just_the_helper]] — a test asserting `isDisposableDbHost('helium') === false` passes today and proves nothing about this hole.
