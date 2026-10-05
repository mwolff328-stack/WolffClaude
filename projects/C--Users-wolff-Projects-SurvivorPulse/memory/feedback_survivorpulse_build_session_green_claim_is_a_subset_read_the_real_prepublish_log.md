---
name: survivorpulse-build-session-green-claim-is-a-subset-read-the-real-prepublish-log
description: "A build session's \"N related test files green, npm run check clean\" is a subset claim; the CI pre-publish job (real vitest) is the truth, and its failures show only in the pre-publish check, not the numbered unit shards"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 1fbcec2e-344d-446b-a996-70f273a13d2c
  modified: 2026-10-02T12:07:22.988Z
---

When a build session's Done or In Review comment says "164 related test files green, tsc + npm run check clean", do not carry that into a SHIP verdict. `npm run check` is typecheck plus import/query-key guards only (zero vitest), and "related" test files are whatever the author chose to run.

**Why:** 2026-10-01, SST-1784 (Proposed view reads Proposed picks only) claimed exactly that. CI's `pre-publish` job went from success at aa439d9d to failure at 838e6d8a with 4 failures in 3 Apply-path integration suites (`gameplanApplyEliminationBoundary.sst1259`, `gameplanApplyCompletedWeekBackstop.sst1379`, `gameplanApplyManualLock.sst1394`). The numbered `Unit tests (shard n/8)` jobs were all green and `Gate verdict` was green (false green); only the `pre-publish` check showed it. The author had even noted the Apply reconcile change was covered "by a source-shape guard only (real-DB integration suites run in CI)" and then did not wait for that CI result before requesting review.

**How to apply:** Every cycle, read the `pre-publish` job log directly (`gh api repos/.../actions/jobs/<id>/logs`, grep ` FAIL `, `Test Files`, `Tests`) and confirm the specific suites near the change are green. Compare totals to the last READY tip. Treat any ticket whose own comment defers real-DB coverage to CI as unverified until you have read that CI result. Related: [[autonomous-push-cadence-outruns-ci-signal]], [[queued-gate-is-not-a-verified-commit]].
