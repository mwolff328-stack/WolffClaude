---
name: survivorpulse-sst1564-beta-testers-backfill-gap
description: "SST-1564 (Done 2026-09-07) backfilled Beta Testers rows for real signups that SST-1527's automation silently missed before its Notion token went live — explains the 2026-09-07 batch of 13 new rows and 6 touched Prospect Tracker Signup Date fields."
metadata: 
  node_type: memory
  type: project
  originSessionId: db2f7b7e-95ee-44a5-8002-26ca0157c599
  modified: 2026-09-08T14:19:57.143Z
---

SST-1527's automated Beta Testers writer (`server/services/betaOnboarding/syncNewBetaUser.ts`) is credential-gated and fire-and-forget with no persistence/retry: if `NOTION_INTEGRATION_TOKEN` wasn't yet set in the Replit production deployment at the moment a user signed up, the write silently no-op'd (`console.warn` only) and that signup was permanently missing from Beta Testers with no audit trail. This was a known, accepted risk flagged in SST-1527's own code review ("worth an explicit backfill plan").

SST-1564 (Bug, Done 2026-09-07) is the backfill. The founder found the gap by comparing Admin Hub User Management against the live Beta Testers database — a contiguous block of real signups (~Aug 30–Sep 1: topflightpilot, cubsaints, joeybowers35, mikolajkonopka60, named examples) had no Beta Testers row, bookended by present rows before (through ~Aug 27, entered manually pre-automation) and after (Sep 2 onward, automation working correctly). Fix was a one-time idempotent backfill script — `storage.getUsers({statusFilter:'ACTIVE', roleFilter:'USER'})` filtered through `isEligibleForBetaOnboarding`, reusing `syncBetaTesterRow`/`crossReferenceProspect` — run once by the founder in the Replit shell against production on 2026-09-07.

**Effect on that day's data (important for daily-brief interpretation):**
- 13 new Beta Testers rows appeared in a single ~60-second window (21:51–21:52 UTC), not just the 4 named examples — the backfill swept every qualifying account missing a row, a broader set than the founder's spot-check screenshots.
- Their `Date Redeemed` was stamped with the backfill's run time, not each user's true original signup date. **Do not read a backfill day's "Signups Today" as that day's organic acquisition pace** — it's a one-time catch-up. The all-time "Progress to 50" total is unaffected and correct (these are real, previously-uncounted users).
- The backfill's `crossReferenceProspect` step also touched `Signup Date` on 6 pre-existing Prospect Tracker rows it matched by email (bigroddy12, bcavers@comcast.net, laram.gamaleldin, will17, felipedamiao, GRch25) — this is a side effect of the fix, not data corruption.

**Why this matters:** [[feedback_verify_a_reviewers_evidence_not_their_judgement]] and [[feedback_static_dupe_theory_beaten_by_live_db_proof]] are the closest existing lessons — this is the same shape one level up: a *reporting job's own* alarm needs to be checked against recent Done bug tickets in SP Stories & Tasks before being reported as a data-integrity blocker. See [[feedback_check_recent_done_bugs_before_flagging_batch_anomaly]] for the generalized rule.
