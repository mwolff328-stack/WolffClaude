---
name: survivorpulse-make-picks-vision
description: "Founder's product vision for the Make Picks step redesign (SE-85), captured 2026-07-02"
metadata: 
  node_type: memory
  type: project
  originSessionId: 44b0b154-1de0-401c-9b8c-1df6cf97b4bf
---

Founder's vision for the "Make Picks" step (step 2 of My Picks, epic [[project_survivorpulse_make_picks_epic]] SE-85), stated 2026-07-02, still being fleshed out ("Let's start with this...").

**Core principle:** zero-effort default, opt-in depth. Mirrors the design philosophy already applied to Set Strategy — minimize forced data processing/work for users who just want to submit picks, while making deeper analysis available for users who want it.

Key elements so far:
- On page load, picks should be **auto-allocated across all pools/entries** based on the strategy chosen in Set Strategy (step 1) — user should not have to manually build picks from scratch.
- User can accept the auto-generated picks as-is and submit, or opt into changes/deeper analysis (Portfolio Risk Lens, ROI Analysis, etc.) — those tools are optional detours, not gates.
- The active strategy driving the allocation must be **clearly and prominently displayed** on the page — user should always know "why" these picks were chosen.
- Founder wants to **reuse the existing Pick Grid component from the My Pools experience** as the visual/interaction focal point of the new Make Picks page (entries as rows, weeks as columns, editable cells). Screenshot reference: My Pools > [Pool] page, grid + ROI/Historical Pool Data tabs below it.

Follow-up decisions (2026-07-02, same conversation):
- **Allocation logic:** Make Picks needs its OWN allocation logic (not just a thin render of the strategy engine's raw output) — must handle edge cases the engine output alone doesn't cover.
- **No-pools edge case:** if the user came from Set Strategy having chosen "Last Season Pools (2025)" or "Setup Pools to Model" (i.e. no real pools/entries exist yet to allocate picks to), Make Picks must help them create real pools **as fast and easy as possible** so they can then receive allocated picks. This is a first-class flow, not an error state.
- **Manual overrides = strategy drift:** when a user manually edits/overrides an auto-allocated pick in the grid, that IS the drift signal — feeds directly into the previously-stubbed OQ-2 drift detection (Phase 3 Lite Strategy Review). No more "always off" stub; overrides should be the primary drift trigger.
- **Grid reuse = extend, not fork:** the ask is to extend the SAME Pick Grid component used in My Pools (currently read-only) to support an editable mode, not build a visually-identical sibling component. One component, two modes.

Further follow-up (2026-07-02, same conversation, after Pam's brief/candidate story breakdown was reviewed and confirmed as matching intent):
- **Tie-break edge case:** the auto-allocation logic must handle the case where multiple teams are tied as the top recommendation for a given pool/entry — needs an explicit tie-break rule (not silently pick one).
- **Ranked list visibility:** users should be able to see a ranked list of teams per entry, not just the single top pick — this is a required visible feature, not just internal allocation logic. (Note: the legacy SST-563 flow already has a "Phase 4a Ranked Targets / TargetsZone" component — check whether it can be reused/extended rather than rebuilt.)

**Why:** Consistent with founder's stated priority (see [[feedback_survivorpulse_dev_workflow]] and the Set Strategy redesign SS-10) of low-friction UX as a core product differentiator — matches Steve Jobs BoA persona's "make complexity effortless" mandate.

Further follow-up (2026-07-02, after Deb's wireframe pass, answering her open questions):

- **Cross-entry team collision (clarifies "tied entries"):** the real scenario isn't just within-entry tied ranks — it's that two DIFFERENT entries can independently land on the same team as their top recommendation. If the pool's `allowDuplicatePicks` is off, that collides. Resolution: the allocation algorithm must be a **portfolio-level constrained optimizer**, not independent per-entry allocation — it needs to decide which entry keeps the top-ranked team and which entry(s) get bumped to their next-highest-ranked team, choosing the assignment that maximizes **overall portfolio survival probability and/or ROI** (not just satisfying the constraint arbitrarily). This is materially more complex than a simple per-entry greedy pick and has real sizing implications for the Auto-Allocation Engine story — likely closer to an assignment-problem-style optimization (think Hungarian algorithm shape) than a simple rule. Flag for Felix/Stan to size accordingly during grooming.
- **"Try a modeled pool instead" — CONFIRMED IN SCOPE** for the No-Pools Fast Setup Flow story. Flow: user's modeled pool data (already used to compute their strategy) becomes the starting point/pre-fill for real pool setup — the system auto-fills as much of the pool config as it can from the model, then prompts the user only for the remaining required info to finalize real pool creation. Once created, the already-computed picks get assigned to the new real pool/entries immediately (no re-allocation from scratch). Goal: user should not have to invest a bunch of upfront manual pool-setup time to get through Make Picks.

**How to apply:** When Ann/Deb groom SE-85 stories, scope the default experience around auto-allocation + prominent strategy display first, then layer progressive-disclosure entry points to Portfolio Lens/ROI Analyzer as secondary flows. Extend (not fork) the My Pools Pick Grid component to add an editable mode — check for a shared-component extraction opportunity similar to the Pool Setup component pattern used in SS-10. Scope a dedicated "no pools yet → fast pool creation" sub-flow as part of the initial slice, not a follow-up. Wire manual grid edits to the OQ-2 drift signal instead of leaving it stubbed.
