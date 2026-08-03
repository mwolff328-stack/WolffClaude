---
name: project_survivorpulse_max_entries_default_dual_mirror
description: "maxEntriesPerUser has FOUR defaults across layers; the Create Pool wizard uses its own factory and bypasses the DB default. Changing \"the default\" means changing all mirrors."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2f4e7b49-3945-4eb6-ad82-fce2992b2de8
  modified: 2026-08-01T22:54:04.545Z
---

`maxEntriesPerUser` has multiple independent "default" sources that must move together — changing one is almost never enough:

1. **DB column default** — `shared/schema.ts:515` `integer("max_entries_per_user").default(100)`. Only applies when an INSERT omits the field.
2. **Legacy `/pools/create` single-form** — `client/src/pages/pool-form.tsx:215` (create default) and `:374` (edit prefill `|| 100`).
3. **Create Pool WIZARD modal** (current surface, SST-424 `PoolCreationWizard`) — a SEPARATE factory `buildDefaultFormData()` in `client/src/components/pool-form-shared/types.ts:178`.
4. **Edit Settings tab** — `poolFormAdapter.ts:132` `pool.maxEntriesPerUser ?? 1` (renders stored value).

**The trap:** the wizard POSTs the field EXPLICITLY (`PoolCreationWizard.tsx:331`), so the DB `.default(100)` is ALWAYS overridden by whatever the form factory seeds. Raising only the DB default does nothing for wizard-created pools.

History: founder raised default 1→100 on 2026-07-22 (commit `e929be26`) but updated only #1 and #2, MISSING the wizard (#3). Result: wizard pools still capped at 1 (the SST-958 "+ Add Entry refused" symptom). Fix ticket filed 2026-07-23 (SE-65 Add & Edit Pool epic, page `3a629ce5-833d-8194-b64e-c9a1ddc12efe`). **RESOLVED** (verified 2026-08-01: `buildDefaultFormData()` at `pool-form-shared/types.ts:178` now seeds `maxEntriesPerUser: 100`). The 4-mirror structural trap itself is durable — re-check all four sources on any future default change.

Also note the Step 5 input has a `max={20}` HTML cap (`Step5Entries.tsx:174`) that must accommodate any default ≥ its value.
