---
name: project_survivorpulse_elimination_predicate_rulings
description: "Founder rulings of 2026-08-01 governing the ONE shared elimination predicate — tie=loss, strikeCount is a real feature, buyback assumed at read time only."
metadata: 
  node_type: memory
  type: project
  originSessionId: bb24e775-f112-4c5f-9a43-4e0efcce862d
  modified: 2026-08-01T22:01:17.353Z
---

Founder ruled these on 2026-08-01. They govern the single shared elimination
predicate SST-1212 creates. Recorded here because Notion MCP was unavailable that
session, so until the rulings are posted they live only in a temp scratchpad.

**The predicate takes THREE inputs, not one** — build it that way from the start:

1. **Tie = loss** (SST-1212). Decided once, enforced through one shared
   predicate. Previously three implementations disagreed:
   `applyResultsToPoolEntries` and `recomputeEntryStatus` treated a tie as a
   loss; `computeEntryStatusFromPicks` (the read-time override on four
   endpoints) did not.
2. **`pools.strikeCount` is a real product direction**, NOT dead code to delete —
   founder ruled keep and build. It is currently unread and defaults to 1, so a
   first-loss backfill is safe for EXISTING data only.
3. **Buyback assumption** (SST-1204), past-season pools only: assume exactly ONE
   buyback for uncapped pools, honour `entryRevivalDeadline`.

**Two things the buyback ruling must NOT do:**

- Never increment `entries.revivals` for an assumption — it is a record of fact.
  The assumed `revivalFee` goes into the ROI computation only, labelled.
- Never persist the derived standing. `isAlive` is overwritten **at read time**
  with `eliminationBasis: 'recorded' | 'assumed_buyback'` alongside it.

**Why that is not a reversal of ruling 3** (the `entryPills.ts` AC-15 must-NOT):
the derivation reads the STORED elimination record, not pick history. Ruling 3
exists because SST-961 lets a user clear a past LOSING pick, so a pick-history
derivation would find no loss and flip an eliminated entry back to "Alive".
Deriving off the stored record has no such failure mode. Anyone reading this as
license to derive from `pickedWeeks` has misread it. See
[[project_survivorpulse_per_call_site_rules_recur]].
