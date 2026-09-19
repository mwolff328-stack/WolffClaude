---
name: project_survivorpulse_local_run_of_mocked_route_tests_needs_localhost_database_url
description: Mocked-storage route tests that import server/routes trip the DB guard locally; run them with a localhost DATABASE_URL (lazy pool) and know supertest requests are lazy.
metadata: 
  node_type: memory
  type: project
  originSessionId: dedfca8e-b67e-44c6-bdf5-3a7cbc2b39bf
  modified: 2026-09-19T02:33:16.213Z
---

Route tests that mount a real handler from `server/routes` with `storage` mocked (e.g. `tests/batchRecommendationsPreloads.sst1672.test.ts`) fail locally at the DB_GUARD unless `server/db` is mocked or a harmless URL is set:

```
DATABASE_URL=postgresql://u:p@localhost:5432/x NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.config.ts <file>
```

The pool is lazy so nothing connects; the tests then run for real. Also `vi.mock('../server/db', () => ({ db: {}, pool: {} }))` in the file itself.

Two traps found doing this (SST-1672):
- **supertest requests are lazy**: `request(app).post(...).send(...)` sends nothing until `.then`/`await`. A test that parks work on gates and awaits later must resolve eagerly (`.then(r => r)`), or it "fails" because the request never fired.
- Running the suite rewrites `tests/strategyEngine/__snapshots__/claimLedgerCharacterization.test.ts.snap` (line endings only). It is churn, not your change: `git checkout --` it before committing.
- `tests/usedTeamsAccessor.sst1304.test.ts` needs a real DB and fails identically with or without your change locally; CI is its oracle.
