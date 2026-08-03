---
name: project_survivorpulse_sandbox_has_no_local_postgres
description: "This Claude Code build sandbox has no reachable Postgres server at all — real-DB integration tests can't run locally here; use a targeted CI gate dispatch instead."
metadata: 
  node_type: memory
  type: project
  originSessionId: 5071f04d-3b14-43bb-a992-1bf3ed30afe7
  modified: 2026-08-03T06:38:21.180Z
---

This agent sandbox (the worktree environment sessions run in, e.g. `.claude/worktrees/*`) has no Docker, no local Postgres binary, and typically no `.env` file (fresh worktrees don't inherit it — it's gitignored). `tests/testEnvSetup.ts` falls back to `postgres://test:test@localhost:5432/test_db` when `DATABASE_URL` is unset, which passes the `dbHostGuard` allowlist check (localhost is disposable) but then fails with `ECONNREFUSED` — nothing is actually listening. `SKIP_DB_INTEGRATION` therefore evaluates `false` (a DB URL IS configured) even though no DB is reachable, so integration suites don't cleanly skip — they try and fail with a connection error.

**Why:** confirmed 2026-08-03 (SST-1249) — checked for `docker`, `pg_ctl`, `psql`, none present; `.env` absent (only `.env.example`); raw `echo $DATABASE_URL` empty in the shell.

**How to apply:** don't try to stand up a local Postgres here (no Docker available) and don't burn time debugging why an integration test "should" skip but doesn't — it's the `ECONNREFUSED`-not-clean-skip trap above, not a real DB issue. For genuine RED/GREEN proof on DB-integration-only logic:
1. Extract the core logic into a pure, DB-free helper wherever feasible (e.g. `shared/strategyEngine/`) and get real local RED→GREEN proof on that — this is usually where the actual bug risk lives anyway.
2. For the DB-integration test itself (unexecutable locally), write it carefully (deterministic fixtures, DB read-back, the fixture-must-violate-the-requirement rule), then get real proof via `gh workflow run pre-publish.yml --ref 2026-v1` dispatched against your exact pushed commit (confirm the SHA with `gh run view <id> --json headSha`), then `gh run watch <id> --exit-status` in the background, then `gh run view <id> --log | grep <your-test-file-or-name>` to confirm the SPECIFIC new tests executed and passed — not just that the stage was green. This is faster and more targeted than waiting for the ambient "Sp ship readiness watch" loop (a recurring session that dispatches its own gate runs roughly every 30 min) to happen to cover your SHA.

Do not confuse this with the separate, already-documented [DB topology trap](project_survivorpulse_prepublish_gate_mechanism.md) (helium vs. Neon dev branches vs. prod) — this is a different failure mode: it's not about hitting the WRONG database, it's about this sandbox having NO database reachable at all, by design (no Docker/Postgres installed here).
