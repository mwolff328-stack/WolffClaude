---
name: check-recent-done-bugs-before-flagging-batch-anomaly
description: "Before reporting a clustered/batch data change (many rows touched in the same short window) as suspicious test-data or corruption, check SP Stories & Tasks for a recent Done bug/backfill that explains it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: db2f7b7e-95ee-44a5-8002-26ca0157c599
  modified: 2026-09-08T14:20:11.551Z
---

On 2026-09-07 the sp-daily-acquisition-brief job found 13 new Beta Testers rows created within one ~60-second window, with no matching Prospect Tracker rows, plus 6 unrelated historical Prospect Tracker rows whose Signup Date had been rewritten to that same timestamp. This pattern (sudden batch, tight time clustering, minimal-field new rows, side-touches on unrelated records) was reported as a "DATA INTEGRITY — investigate before trusting today's numbers" blocker, framed as a likely test/seed script or corruption event.

It was actually [[project_survivorpulse_sst1564_beta_testers_backfill_gap]] — a founder-run, one-time idempotent backfill fixing a real, previously-known automation gap (SST-1527's Beta Testers writer silently no-op'ing before its Notion token went live). The batch shape that looked like an anomaly was exactly what a correct backfill script looks like: many rows written in one run, touching cross-referenced records as a designed side effect.

**Why:** a batch of near-simultaneous writes is *consistent with* either a bug/test-data event or a deliberate one-time backfill — the shape alone doesn't distinguish them. Founder had to correct the record after the fact, which means the report understated confidence in a real fix and could have caused unnecessary distrust of legitimate signup numbers if the founder hadn't caught it.

**How to apply:** before characterizing a batch/clustered data change as an anomaly requiring investigation, check the SP Stories & Tasks database for a Bug or Story with Status=Done and a Date Completed matching the same day, especially anything with "backfill" in its Proposed Resolution or a Category like Auth & Accounts. If one exists and plausibly explains the batch, report it as an explained backfill (with the caveat that batch-stamped dates may not reflect true historical dates) rather than as an unexplained integrity concern. If no explaining ticket is found, THEN flag it as needing investigation — the caution itself was right, just the confidence level and the missing lookup step were wrong. This is the same discipline as [[feedback_verify_a_reviewers_evidence_not_their_judgement]] and [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] one level up: verify against the system of record (here, the ticket tracker) before asserting a negative conclusion about data quality.
