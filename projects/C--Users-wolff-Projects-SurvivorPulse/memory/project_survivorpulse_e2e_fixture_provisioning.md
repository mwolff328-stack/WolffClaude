---
name: project_survivorpulse_e2e_fixture_provisioning
description: "How the E2E fixture pool is really provisioned, why the API POST is a forbidden fallback, and which DBs seed-e2e refuses"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4c4dca3a-8902-4439-96af-1142489b8245
  modified: 2026-08-02T07:43:10.968Z
---

⚠️ **REVERSED 2026-08-01 by SST-1213** (`c934083d`, then `3b2c3503`). The paragraph below was
true until that day and is now the opposite of the truth — kept because the *reasoning* still
explains the fixture design, but do not act on it.

> ~~The E2E fixture pool is created **by `scripts/seed-e2e.ts` at the DB level**, not by the API.
> `e2e/fixtures.setup.ts`'s `POST /api/pools` is a *fallback* that normally never fires — and it
> is provisioning a state the product deliberately forbids: `server/routes.ts` 403s a non-admin
> creating a **regular-season pool in a season that has already ended**.~~

**Now:** the past-season pool-type gate is **deleted outright** at both the create and update
routes. A non-admin may create a past-season regular pool; season bounds are enforced only by
`validateNFLPoolSeason` (`HIST_YEARS_BACK = 5`, no future seasons). So `POST /api/pools` is the
**primary** provisioning path, it succeeds, and the DB-level fallback in `fixtures.setup.ts` is
largely unreachable. That matters far beyond the fixture: **the suite now writes fixture pools
into whatever database it is aimed at**, where before it simply failed. Provisioning failure was
the only thing keeping helium clean. SST-1214 added run-id tagging + teardown in response — see
[[project_survivorpulse_playwright_teardown_coverage]] for what that does and does NOT cover.

The fixture pool must be a **completed (past) season** — ~8 specs assert past-season semantics
(SST-469 always-editable bypass, SE-68 snap-to-`startingWeek`, historical read-only mode).

**Corollary, measured 2026-08-02: deleting the fixture pool is SAFE, and the intuition that it
isn't comes from the pre-SST-1213 text above.** A session warned that a tag-scoped sweep would
delete the pool later runs reuse, forcing a *creation* the API refuses for a past season and
falling to `provisionPoolViaDatabase`, which returns null without `DATABASE_URL`. That chain
breaks at its first link — the API refusal no longer exists. Proof from the data rather than the
docs: the live fixture pool carried `[e2e-run:local-e443ece2]`, `buildFixtureDescription` applies
the tag at **creation**, and that run had `DATABASE_URL` unset — so a season-2025 fixture pool
demonstrably *was* created through `POST /api/pools` with no database reachable. Flagging it as a
hypothesis to confirm before deleting was still right; asserting it would have been wrong.

⚠️ **LATENT HAZARD, independent of any one night: the fixture pool carries the CREATING run's run
id.** So that run's teardown is entitled to delete a resource every later run reuses. Observed
state: pool `5a07c5e4-fabf-42d4-a616-b93932a43c6a` (`E2E Fixture Pool - picks`) tagged with one
specific run's id, while a concurrent run's manifest recorded it under `reusedPoolIds` with
`createdPoolIds: []`. It survived only because the creating run was killed before teardown fired.
A concurrent run reusing it while the creating run's teardown completes loses it mid-flight.

**And teardown only ever deletes what a run CREATED** — so on a reused fixture pool the
create → tag → delete path is never exercised at all. A green run whose manifest shows
`createdPoolIds: []` proves nothing about teardown, however many tests passed. Check the manifest
before citing teardown as verified. See [[project_survivorpulse_playwright_teardown_coverage]].
So "just use the current season" satisfies the create gate and breaks the suite.

**`scripts/seed-e2e.ts` refuses most databases by host.** It accepts local Postgres
(`localhost`/`127.0.0.1`/`::1`/`*.localhost`), the E2E CI host `ep-blue-tree*`, and — added by
SST-1186 on 2026-08-01 — the dedicated **throwaway** Neon branch `e2e-throwaway`
(`ep-mute-bar-a65jnspl…`, exact-match only, four DNS variants). It still **explicitly rejects
`ep-flat-rice` (the shared dev DB) and helium**, by founder ruling: seeding the dev DB would
reproduce SST-1187 in a database the founder uses daily. So you still cannot seed E2E fixtures
into the dev DB — use the throwaway branch instead. Its connection string is a founder-managed
secret (`E2E_THROWAWAY_DATABASE_URL`), never in the repo.

`isDisposableDbHost` and `isDevSeedableHost` were deliberately left byte-identical — only
`isE2eSeedableHost` grew. Widening `isDisposableDbHost` would mark the shared dev DB destroyable
without sign-off, re-opening what SST-1006 built it to prevent.

Blast radius: the `chromium`, `admin` and `mobile` projects all declare
`dependencies: [..., 'fixtures']`, so one setup failure zeroes **every** browser spec file, not
just the ~24 that read `e2e/.auth/fixtures.json` directly.

Playwright specifics worth knowing (measured, 1.62):
- A CLI `--reporter=...` flag **replaces** the config's reporters — it silently bypasses any
  guard registered in `playwright.config.ts`.
- `--list` still invokes a reporter's `onEnd`, so a coverage guard must exempt it.
- Specs are **collected before setup projects run**, so a module-scope `readFixtures()` throws
  during collection and takes the whole file out. Resolve it in `beforeAll`.
- Exit codes: a failed setup with dependents unrun exits **1**; a run where every test *skips*
  exits **0**. The all-skip shape is the real silent-green mode.

RESOLVED 2026-07-30 (SST-1117): the fixture season is now DERIVED (`currentSeason - 1` from
`shared/seasonConfig.ts`) in `e2e/helpers/fixtureSeason.ts`, imported by BOTH `fixtures.setup.ts`
and `scripts/seed-e2e.ts`. A reporter (`e2e/reporters/executedCountGuard.ts`) fails any run whose
executed count falls below 10% of collected and prints
`[e2e-coverage] executed=N skipped=N did-not-run=N collected=N floor=N` on every run — read that
line, never the exit code. Healthy shards run ~29-52 executed of ~55 collected.

See [[project_survivorpulse_e2e_ci_drift_traps]], [[feedback_confirm_the_check_covers_what_you_changed]]
and [[feedback_survivorpulse_source_text_guards_fooled_by_text]].
