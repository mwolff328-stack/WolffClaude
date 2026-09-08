---
name: feedback_a_groomed_ac_can_assert_a_false_codebase_fact
description: "ACs cite grep/schema results as settled fact; those citations age and can be wrong, and they steer real decisions."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 386dc302-d37e-4bed-820b-27161b9c1bda
  modified: 2026-09-08T00:37:50.132Z
---

SST-1512's AC-1 stated: "a grep of server/routes.ts confirms NO aggregate/admin endpoint serves a cross-user distribution externally (only /api/admin/users/:userId/pools, per-user, and /api/pools, scoped to the requester)." That is false. `GET /api/pools?scope=all` (`server/routes.ts:5802-5832`) calls `storage.getAllPoolsWithEntryCountsAndUsername()` and returns **every pool system-wide with full rows** for any ADMIN. The false claim had passed a grooming gate and was steering the ticket toward the higher-friction founder-run-SQL mechanism by asserting the cheaper one didn't exist.

**Why:** a grep result written into an AC reads as verified fact forever, but it was a point-in-time observation by one person, and it is never re-run. Reviewers trust it precisely because it looks like evidence rather than opinion — the same dynamic that let a wrong `CLAUDE.md` line about `computeEffectiveSpread` being deleted help SST-1196 survive review. Worse, a *negative* claim ("no endpoint exists") is the kind most likely to be wrong, because the original grep only had to miss one branch of one handler.

**How to apply:** treat any embedded grep/schema/"verified twice" claim in a ticket as a **hypothesis to re-run**, not a finding — especially negative existence claims, and especially when it is the premise for choosing between two mechanisms. Re-running is usually one command. When it turns out wrong, strike it explicitly on the ticket rather than quietly routing around it, so it stops steering the next decision. Related: [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]], [[feedback_verify_a_reviewers_evidence_not_their_judgement]], [[feedback_staged_ticket_headers_rot_into_harmful_instructions]].
