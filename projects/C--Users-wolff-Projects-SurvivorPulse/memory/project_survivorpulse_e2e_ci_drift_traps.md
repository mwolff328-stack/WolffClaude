---
name: survivorpulse-e2e-ci-drift-traps
description: playwright-ci trap set — persistent E2E DB masked months of drift; wrong /api paths 200 with index.html; six shards share one DB+user so any spec can 503 the cockpit run-wide
metadata: 
  node_type: memory
  type: project
  originSessionId: bcb95cd0-9b51-4fda-a138-72a9a86493dd
  modified: 2026-08-02T02:21:26.583Z
---

PR #94 (2026-07-27) was the first full playwright-ci run since mid-July because SST-1040–1046 shipped to 2026-v1 by direct push. Recovering it surfaced five layered traps:

1. **Persistent E2E DB = drift sponge.** New schema tables made `drizzle-kit push` open its TTY-only create-vs-rename prompt, which crashes in CI **and exits 0** — the job limps on and dies later with a missing column. Fixed permanently: `scripts/ci-reset-e2e-db.mjs` clean-slates the schema every run (guarded by CONFIRM_E2E_DB_RESET=yes).
2. Fresh DB then unmasked latent fixture bugs the old rows had been satisfying: kickoff lock 409s picks on the completed fixture game (fixtures now DB-insert that one row on PICK_LOCKED); the fixture pool's `allowBuybacks=false` premise never held (schema default true).
3. **Wrong `/api/*` path ⇒ 200 + index.html.** `PATCH /api/pools/:id` is NOT a route (real update = `PUT /api/pools/:poolId/settings`); the SPA static catch-all "succeeds" and masks the no-op. Check response content-type when an API call mysteriously doesn't stick. Follow-up filed: 404 unmatched /api paths.
   - **Second instance, 2026-08-02, worse than the first: a VALID route with an EMPTY parameter.** `DELETE /api/pools/` (id resolved to empty) also returns **200 + the SPA shell**. It is subtler than a wrong path shape — the route exists and the method is right — and it lands on a **destructive** endpoint, where "200 ⇒ it worked" is the most dangerous possible misreading: you conclude the row is gone and stop looking. Found by session `local_5c6408a8` when a shell variable silently came back empty during a manual cleanup in helium. **Assert the id is non-empty before issuing the request, and read the BODY, not the status** — the real delete answers `{"message":"Pool deleted successfully"}`. Same family as [[feedback_a_200_is_not_proof_the_server_lived]].
4. **Six shards, one DB, ONE test user, fullyParallel.** Any spec that creates a current-season pool without complete forward spreads flips `/api/me/strategy/cockpit` to 503 for the whole user mid-run — and post-Season-View, Game Plan pool sections need cockpit success. UC-4.10 now explicit-skips under detected cockpit data-error. Real cure (backlogged): per-shard DB/user.
5. **Direct-pushed UI redesigns strand E2E specs.** SST-1043 retired the standalone PickGrid on /pools/:id (`pick-grid`/`pick-cell-*` testids); SST-522 hid the TopBar hamburger outside 768–1023px and made it a sidebar toggle. Fix specs to the requirement against the shipped design (union locators for grid-or-fallback; band-scoped hamburger test); pick-grid-multi-pick + pick-grid-status-and-results are block-skipped with coverage pointers until season-grid E2E parity is authored.

6. **RESOLVED 2026-07-30 (SST-1117)** — was: the fixture's pinned season went stale on a calendar boundary and silently blocked the entire suite (observed 1 failed / 1 skipped / 305 did not run). Now the fixture season is DERIVED (`currentSeason - 1`) in `e2e/helpers/fixtureSeason.ts`, shared by both the setup fixture and `seed-e2e.ts`, with an executed-count-floor reporter as a backstop. Full mechanics in [[project_survivorpulse_e2e_fixture_provisioning]].

Two harness facts that cost real time here:
- **`npx playwright test` exits 0 while running almost nothing.** Both the auth-form-missing failure and the fixture 403 produced exit code 0 with 305 tests unrun. A bare exit code is never evidence a suite ran — assert a non-zero executed count.
- **`.env` and `.env.test` are gitignored, so they do NOT exist in a git worktree.** Playwright silently reports `injected env (0) from .env.test` and then fails on missing creds; a server started with `--env-file=.env` dies with `.env: not found`. Point at the main checkout's copy by absolute path rather than duplicating a credentials file.

Related: the sp-live-verify skill, [[project_survivorpulse_prepublish_gate_mechanism]], [[project_survivorpulse_replit_deployment_is_autoscale]]
