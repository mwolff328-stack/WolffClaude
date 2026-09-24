---
name: full-suite-run-needs-test-disable-network-env
description: Running vitest directly over client/src (or the whole repo) without TEST_DISABLE_NETWORK=1/NODE_ENV=test hangs for 30+ minutes against unreachable local Postgres
metadata:
  type: feedback
---

Calling `npx vitest run client/src` (or any broad path) directly — without the env vars `npm run test:unit` and CI's `pre-publish.yml` job set (`NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1`) — silently hangs for 30+ minutes with zero output once it reaches integration-style tests in `tests/` that try to hit a real Postgres at `localhost:5432`. [[project_survivorpulse_sandbox_has_no_local_postgres]] already establishes there's no local Postgres in this sandbox; this is the corollary for scoping a test run wide enough to include those files. `npm run test:unit` bakes the env vars into the npm script itself; a raw `npx vitest` call bypasses that.

**Why:** discovered while chasing a real CI regression (SST-1667 round 3, 2026-09-24): the pre-publish gate on `2026-v1` was red for a reason NOT covered by my usual `client/src/components/cockpit/__tests__/` + `client/src/pages/__tests__/` sweep — a test in `client/src/components/pool-shared/__tests__/` also referenced a UI element I'd removed. Running the full suite to catch cross-directory fallout is the right instinct (per [[feedback_sweep_for_the_class_not_the_change]]), but the first attempt (`npx vitest run client/src` with no env vars, backgrounded) hung with zero output for over 20 minutes before I diagnosed it — it wasn't stuck, it was retrying DB connections against files outside `client/src` proper that the bare path glob still picked up under the default `vitest.config.ts`.

**How to apply:** when a local full/broad test run is needed to catch cross-directory fallout from a UI/behavior change, always prefix with `NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1` (or just run `npm run test:unit`), matching `pre-publish.yml`'s Stage 1 job-level env exactly. Also: a background `| tail -N` pipe produces ZERO output until the whole command exits (tail buffers until EOF) — absence of output is not evidence of a hang; check `tasklist` (or equivalent) for live worker processes instead of assuming a stall.
