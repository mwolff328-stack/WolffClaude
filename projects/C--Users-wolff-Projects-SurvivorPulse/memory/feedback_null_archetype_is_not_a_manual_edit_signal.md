---
name: feedback_null_archetype_is_not_a_manual_edit_signal
description: "proposed_picks.archetype IS NULL means \"unknown writer\" (manual edit OR unattributable cross-device Apply), not \"manually edited\" specifically -- don't use it alone to suppress the stale dot for manual picks."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: aafd697d-5743-4cee-aba8-7aa0acb7fc86
  modified: 2026-09-10T04:26:24.466Z
---

`proposed_picks.archetype` is nullable and, by the schema's own comment, NULL means "unknown writer" — collapsing two distinct cases: a genuinely hand-edited pick (proposedPickWriteService.ts never sets archetype) AND a legitimately Apply-written pick this device just can't attribute (cross-device Apply, cleared localStorage, an older run, or a pre-SST-1338 row). There is no third column distinguishing them.

**Why:** Attempted to fix SST-1619 (founder-reported: the amber "out of date" dot fires on a proposed pick the user manually typed) by suppressing `resolveProposedDivergence`'s stale verdict whenever `rowArchetype` is null/undefined and no local run record attributes the cell. This broke ~20 tests across 6 files in `client/src/components/cockpit/__tests__/` — tests that had survived multiple prior code-review rounds specifically to *protect* the conservative "unattributable = still show stale" behavior for the cross-device case (see `proposedWriterAttribution.ts`'s own doc comment: "the residual SST-1333 could not close"). The fix's blast radius silently hid genuine staleness for the much more common cross-device scenario, not just the narrow manual-edit case it targeted.

**How to apply:** Before touching `isProposedBadgeStale` / `resolveProposedDivergence` / `attributeProposedWriter` for anything related to "was this manually edited," check whether the change would also suppress the cross-device-unattributed case — run the full `client/src/components/cockpit` test suite (not just the file you're editing) before concluding a predicate change is safe. Distinguishing "manual edit" from "unattributable Apply write" for real needs a new, unambiguous signal on the row (e.g., an explicit `written_by: 'manual' | <archetype>` column) — a schema change and its own design/migration, not a client-side predicate tweak. See [[project_survivorpulse_sst1338_archetype_column_founder_gated]] for the migration-gating context on that same column, and file the "suppress dot for true manual edits" ask as its own follow-on story rather than folding it into an unrelated bug fix.
