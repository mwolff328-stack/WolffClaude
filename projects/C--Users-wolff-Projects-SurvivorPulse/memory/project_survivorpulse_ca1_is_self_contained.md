---
name: project_survivorpulse_ca1_is_self_contained
description: CA1 does NOT import the scoring or pool-dynamics stack — a scoring change needs no golden-snapshot regeneration; and phase0-8/ in CLAUDE.md no longer exist
metadata: 
  node_type: memory
  type: project
  originSessionId: baf43b4f-7640-44ba-b0ec-419991174241
  modified: 2026-08-03T02:09:31.955Z
---

**`ca1/` is self-contained. A change to the scoring or pool-dynamics stack does NOT require
regenerating the CA1 golden snapshots.** Verified 2026-08-02 during SST-1188, and independently
by Stan across ~120 `ca1/` files.

- `ca1/`'s only cross-boundary imports are **`server/db.js`** and **`shared/schema.js`**
  (`games`, `teams`, `pickPopularity` — the last is *global* market data, a different table from
  `poolTeamPicks` / `poolWeeklyStats`).
- It runs its **own** `ca1/engine/deterministic-engine.js`.
- `grep -i 'optimizerService|poolDynamics|qPick|compositeScore'` across `ca1/` returns **zero
  hits**.

**`phase0/` … `phase8/` DO NOT EXIST.** `CLAUDE.md`'s directory layout still documents them as
the CA1 pipeline, and its Commands section still lists `phase0:test` / `phase6:test:phase6`.
The pipeline is consolidated in `ca1/`. Snapshots live at `ca1/tests/phase{0,1,3}/__snapshots__/`.
Do not conclude "CA1 is affected" from CLAUDE.md's description — read `ca1/` itself.

**Why this matters beyond trivia:** SST-1188 was **deferred for size on this basis alone**. Its
founder ruling named "a CA1 golden-snapshot regeneration reviewed as a deliberate diff" plus a
Stan analytical review of the shifted numbers as the known cost, and that cost was the stated
reason the ticket was held back. The cost did not exist. The whole reason evaporated on a
five-minute grep.

**How to apply:**
- Before accepting "this needs CA1 snapshots regenerated" as scope, grep `ca1/` for the symbols
  you are actually changing. Treat it as independent until shown otherwise.
- The ruling's wording was *"check the CA1 golden snapshots specifically"* — **check**, not
  *regenerate regardless*. Checking and reporting "unaffected" discharges it. (Ann's ruling on
  this, SST-1188 In Review.)
- Confirm empirically with `git diff --numstat`, **never the diff body**: a full suite run marks
  the golden `.snap` files modified with **zero** content change (CRLF churn) — see
  [[project_survivorpulse_ca1_snapshot_crlf_churn]].

Related: [[feedback_survivorpulse_verify_a_deferral_reason]],
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]],
[[project_survivorpulse_ca1_snapshot_crlf_churn]].
