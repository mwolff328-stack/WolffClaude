---
name: project_survivorpulse_publish_prerequisites
description: "What actually blocks a SurvivorPulse production publish — as of the 2026-09-02 publish the baseline is eff67c7a and NO real migration is pending; the only recurring step is deleting the ALLOW_UNSAFE_DEV_FEATURES deployment secret. Also carries the post-publish smoke recipe, the baseline-identification method (walk 'Published your App' markers from the CURRENT tip backward to find the real last one, don't trust an old note's recorded baseline), and the two bundle-grep false negatives (backtick quoting, template literals)."
metadata: 
  node_type: memory
  type: project
  originSessionId: d80d5a6e-b36c-4612-9383-f66be9200837
  modified: 2026-09-02T05:40:49.580Z
---

A green pre-publish gate is NOT SHIP on its own. Verified 2026-07-28 from Notion pages/comments + repo docs (no DB queried — see the wrong-host rule).

**⚠️ This note went stale for 5+ publishes and nobody caught it until asked for a "comprehensive" verdict (2026-09-02).** It said baseline `c98d9242` (2026-08-24) while five more publishes had actually happened: `5885f9a6` (08-25 00:40), `67cb7dc1` (08-25 15:45), `2c8b46e1` (08-25 22:47), `9854cac5` (08-27 23:40), `84a36f3d` (08-30 04:42), `9b035dbf` (08-30 19:50), `82ad817f` (08-31 05:46), `92ee848a` (08-31 22:30) — eight markers, not zero. **Never trust this note's recorded baseline as current.** Before computing "commits since last publish," always re-derive it: `git log origin/2026-v1 --grep="Published your App" --format='%H %ci %s' | head -1` against the CURRENT tip, not against whatever SHA a memory file last recorded. Update this note every time you learn of a publish, not just when you happen to be the one aggregating a SHIP report.

**Resolved — do NOT re-raise these** (older notes and `~/.claude/skills/pre-deploy/SKILL.md` still list them):
- SST-941 (`picks.period` backfill): Done. Prod audit 2026-07-24 found 152 rows, 0 mismatched — nothing to apply.
- SST-997 (`maxEntriesPerUser` 1→100): Done. **Applied to prod 2026-07-24, 31 rows.** Dev was a no-op and did not predict prod.

**ALSO RESOLVED 2026-07-28 (founder published to prod, applying both):**
- **SST-1037** `pools.pool_classification` ALTER — APPLIED to prod.
- **SST-1079** `user_preferences` TABLE — APPLIED to prod.
- The `ALLOW_UNSAFE_DEV_FEATURES` deployment-secret deletion was done: prod boots and serves, which it cannot do with the flag set (`server/envValidation.ts` fatal-exits first). **This is a free post-publish check — if the site is up, the secret was deleted.**

**PUBLISHED 2026-08-24 — new baseline is `c98d9242`** (was `8308b085`). Compute the next
unpublished batch from `c98d9242..origin/2026-v1` (5 commits remaining as of 2026-08-24:
SST-1461 ROI drawer work + the SST-1330 CLAIMED-tooltip word-doubling fix), not from any
older SHA. Shipped 24 commits: SST-1448 (Proposed-track pick-grid click gating), SST-1449,
SST-1330 (CLAIMED badge reads `claimedByOtherEntry`), SST-1450 (Spec Mismatches admin module
removed — see migration note below), SST-1451 (My Pools card elevation), SST-1446 (P&L routes
extraction + support-session write guard), SST-1457 (Portfolio Overview elevation).
**NO real migration** — the only `shared/schema.ts` diff in the whole range is a 22-line
**comment block** (SST-1450, explaining why `spec_mismatch_snapshots` stays defined on purpose
after its feature was removed, to keep the deprecation zero-migration and avoid a future
`db:push` silently dropping the table) — zero actual column/table changes, verified via
`git diff 8308b085..c98d9242 -- shared/schema.ts`.

**⚠️ Baseline-identification method — general going forward, not one-off.** Two "Published your
App" Replit auto-commits landed in this range: `dad9b400` (2026-08-23 16:51:50 UTC) and
`439b6c15` (2026-08-24 22:20:23 UTC). Both are pure Replit-platform markers that land **~2
minutes AFTER** the real deploy finishes (confirmed: `dad9b400` sits 2 min after the
already-recorded 2026-08-23 bundle `Last-Modified` of 16:49:45 GMT; `439b6c15` sits 2 min after
this publish's bundle `Last-Modified` of 22:18:15 GMT) — they carry no real app-code changes of
their own. **The baseline is always the last REAL commit immediately BEFORE the marker, never
the marker itself.** Expect the bundle's `Last-Modified` to sit a couple of minutes before its
own marker commit's timestamp; use that gap to identify which marker (if more than one exists
in a range) corresponds to which publish.

Post-publish smoke, all green: prod bundle `Last-Modified` 22:18:15 GMT (`assets/index-lHZ3k5Wu.js`)
vs tip commit (`c98d9242`) 21:44:10 UTC (deploy is NEWER, so it carries the code);
`/api/seasons/current` 200 JSON; `/api/pools` and `/api/me` 401; site boots at all, which
self-proves `ALLOW_UNSAFE_DEV_FEATURES` was deleted again for this publish.

<details><summary>Prior publish record (2026-08-23), kept for history</summary>

**PUBLISHED 2026-08-23 — new baseline is `8308b085`** (was `4d0b9b5d`). Shipped SST-1439
(Admin Support Mode) + SST-1438 (Season Grid Proposed-track clear), 11 commits.
**NO migration was pending or applied** — zero schema/migration/`.sql` files in the whole range.
Post-publish smoke, all green: prod bundle `Last-Modified` 16:49:45 GMT vs tip commit 08:01:15 UTC
(deploy is NEWER, so it carries the code); `/api/seasons/current` 200 JSON; `/api/pools` and
`/api/me` 401; site boots at all, which self-proves `ALLOW_UNSAFE_DEV_FEATURES` was deleted.

</details>

**Still open (not schema):**
1. **Every future publish** must re-do the `ALLOW_UNSAFE_DEV_FEATURES` deletion — full
   how/where and the self-proving verification method live in
   [[project_survivorpulse_prepublish_gate_mechanism]] and
   [[project_survivorpulse_unsafe_dev_flag_is_self_proving]], not duplicated here.
2. Founder review of `landing.tsx` public copy (~6 residual edge/overclaim phrases flagged, first raised 2026-07-28). Subscription-flow pre-prod verification story is tagged `[POST-BETA]` — confirm scope rather than treating it as a hard block. ⚠️ Un-re-verified dated notes rot — this item has now sat "open" across multiple publishes (2026-07-28 through at least 2026-08-23) with no confirmation anyone re-checked it in between. Re-check current status via the SST ticket, not this note, before citing it as still open on any future publish; don't just re-copy this line forward again.

**A publish carries the code that existed WHEN YOU CLICKED IT — always compare timestamps.** On 2026-07-28 the founder published at ~20:13 UTC (applying the SST-1037 + SST-1079 migrations), then later reported "I have published" in a session whose commits landed at 21:43–23:01 UTC. The migrations were live; the CODE was not. The prod bundle's `Last-Modified` (20:13:57 GMT) predated the first commit by 90 minutes, and the deployed `Footer.tsx` was still the pre-change version. A DB migration being Done says nothing about whether the code deploy carries your commit — they are separate halves of the same button press, and only the migration half is visible in Notion. Check `curl -sI <prod>/assets/index-*.js | grep Last-Modified` against `git log --date=iso-strict-local` before declaring anything shipped.

**⚠️ The prod bundle quotes string values with BACKTICKS, not double quotes.** Grepping it for `"data-testid":"footer"` returns 0 even when the attribute is present — the real serialization is ``"data-testid":`footer` ``. This produced a false negative that read exactly like "the deploy didn't carry the change," on a deploy that had. Before concluding a marker is absent, print its actual form: `grep -oE '.{25}data-testid.{25}' bundle.js | head`. Always pair any absence check with a **positive control** (a marker you know ships, e.g. `link-footer-terms`) — if the control is also 0, the pattern is wrong, not the deploy. Same family as [[feedback_survivorpulse_source_text_guards_fooled_by_text]]: an assertion about code, evaluated against its text rendering.

**⚠️ Second, sharper false negative — a TEMPLATE LITERAL never appears in the bundle as its rendered text (2026-08-23).** Verifying the SST-1438 publish, `grep "Clear this Proposed pick"` returned **0** on a bundle that carried the change — because the source is `` `Clear this ${trackLabel} pick?` ``, so the literal only ever exists interpolated at runtime. It compiles to the split form ``children:[`Clear this `,f,` pick?`]`` and ``"aria-label":f?`Clear ${f} pick for week ${t}`:`Clear pick for week ${…}` ``, with `trackLabel` minified to `f`. Read as "the deploy didn't carry SST-1438" for a moment; it had. **Before grepping a bundle for any user-facing copy, open the source and check whether the string is a literal or a template.** If it interpolates, grep the invariant FRAGMENTS around the hole (`Clear this `, ` pick for week `), never the assembled sentence. Best discriminator is a shape only the new code has — here the `f ? … : …` ternary whose false branch is the OLD copy, which simultaneously proves the new branch shipped and the old call sites were preserved. Build it by diffing baseline vs tip source for genuinely new literals rather than guessing a phrase.

**Cheap post-publish smoke that needs no auth** (used 2026-07-28): from a browser tab on the prod origin, `fetch('/')` → pull the `assets/*.css` + `assets/*.js` names out of the HTML → fetch them → grep for a string unique to the shipped change. Proves the deploy actually carries the commit rather than trusting the Replit UI. Also probe `/api/seasons/current` (200 JSON = DB healthy) and `/api/pools` (401 = auth intact). Note `/api/health` and `/api/version` DO NOT EXIST — they 200 with the SPA index.html, the known wrong-path trap.

**SST-945 + SST-1088 — RESOLVED 2026-07-28. A green gate may now be reported as an UNQUALIFIED ship on coverage grounds.** SST-945 closed the FAST-mode half (`TEST_INTEGRATION_FAST: 0`). SST-1088 closed the second, independent gate: 24 suites self-skipped on `TEST_DISABLE_NETWORK`, using it as a proxy for "no database here" — true on a laptop, false in CI, which disables outbound internet AND provisions a Postgres. They now gate on real DB availability (`tests/guards/dbIntegrationGate.ts`). **Stage 2a went 633 passed / 241 skipped → 864 passed / 10 skipped / 0 failed**, confirmed on two independent runs against different code (`30416680520`, `30422100361`).

Still state the residual skip count — a green gate is not "everything ran" — but quote the gate's own summary block, which now enumerates each residual skip with a true reason. The 10: 5 `strategies` (needs a live server → Stage 2c), 3 `strategyApply.ss6` + 1 `strategyRecommendation.ss4` (pre-existing manual/unreachable), 1 `gameplanApplyFutureUsedTeamCollision` (quarantined — real apply-ordering defect, SST-1094). None are outbound-call suites; that was part of the same false premise.

Adjacent, does NOT qualify a ship but do not read "864 passed" as 864 verified behaviours: **SST-1095** — tests that pass via an early `return` before any `expect()` report as PASSED, so no skip count can show them. The 8 fail-open `*.tripwire` guards are fixed; 8 remain. Re-measure any run with `gh run view <id> --log | grep -E "Stage 2a.*(Test Files|Tests )" | tail -2`.

**CI DB is never a blocker — corrected 2026-07-28.** The gate provisions an ephemeral Postgres (`localhost:5432/ci_test`) and pushes the schema fresh every run, so any column/table in `shared/schema.ts` exists there automatically. Proven: `tests/poolClassification.integration.test.ts` passed 8/8 in run `30385908570` despite SST-1037 being listed as "CI pending". Only PROD is ever pending. Don't chase phantom CI-DB migrations.

**Why:** stale checklist entries cost real time and, worse, hid a genuinely pending prod ALTER.

**How to apply:** run the gate per [[project_survivorpulse_prepublish_gate_mechanism]], then walk the "Still open" list above. ⚠️ That list has shrunk over time (was 4 items, now 2) — this line used to say "Items 1-4"; count the actual list rather than trusting a number here, since this exact staleness bug is what it's warning about. Both current items are founder-run manual steps; Claude can only remind. When a backfill IS applied, delete its warning here rather than leaving a dangling index line.
