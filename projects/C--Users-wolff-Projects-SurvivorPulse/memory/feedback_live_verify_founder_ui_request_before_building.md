---
name: feedback_live_verify_founder_ui_request_before_building
description: "Before building a founder-described UI revision, check the live production page directly -- a founder's phrasing of a symptom (\"move X to the right of Y\") can misdiagnose the actual root cause (a shared CSS stacking bug, not a data-order change), and one item in a multi-item request can already be correct, unrelated to what the screenshot was illustrating."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 9993d1e9-832b-4c4b-8899-555d49920869
  modified: 2026-09-30T04:31:40.057Z
---

SST-1757's founder revision request had 5 items, phrased as direct fixes ("move X right of Y", "change link labels to X and Y"). Checking the live production page for each item BEFORE dispatching any build work changed the actual work in two ways:

**1. One item was already correct.** "Change [series-hub] link labels to 'Duplicating vs. Not Duplicating Picks: Survival Curves' and '...Strategy Comparison'" -- the live page already showed exactly those two strings, verbatim. The founder's screenshot was illustrating the CORRECT target state (likely as a reference for what "done" looks like across the whole request), not flagging a defect. Building a "fix" here would have been a wasted commit, and worse, an unnecessary review cycle.

**2. Two items were misdiagnosed as reorders when the real defect was a shared CSS bug.** "Move 'Realistic' button to the right of 'Fresh start'" reads as a data/array reorder. The actual code already had the array in the right order (`[fresh, realistic]`), so a literal reading would conclude nothing was wrong. Checking the LIVE RENDER showed the two options stacked VERTICALLY, not side-by-side -- the founder's "move X right of Y" was the founder's own description of what they wanted to SEE, not a diagnosis of the underlying cause. The real bug: a shared `PickerRow.tsx` component's "stacked on mobile, side-by-side on desktop" CSS variant had an unconditional `w-full` class with no `sm:` breakpoint reset, so it stayed stacked at every viewport width regardless of the container correctly switching to `flex-row`. This was a ONE-LINE CSS fix in a SHARED component that also fixed the fifth request item (an identical symptom on a second page, via the same component) for free -- discovering this by reading the array order alone, without checking the live render, would have led to either a no-op "fix" (reordering an already-correct array) or, worse, actually reordering underlying data/state in a way that could have had other consequences.

**How to apply:** for ANY founder-described UI revision request, before writing or dispatching build work, open the live/deployed page(s) named in the request and directly observe each described symptom. Don't take a "move X right of Y"-style description as necessarily describing the fix mechanism (a reorder) -- it describes the desired OUTCOME, and the actual root cause needs its own investigation (read the relevant component's current state/order first; if that's already correct, the defect is elsewhere — check rendering/CSS/layout next). This investigation is fast (a few browser navigations and screenshots) relative to the cost of building, reviewing, and shipping a fix for the wrong root cause, or building a fix for something that was never broken.

See [[feedback_reproduce_on_current_commit_before_triaging_a_reported_failure]] for the closely related principle applied to bug reports specifically (a reported failure can self-resolve via later commits); this note is the UI-revision-request variant, where the risk isn't staleness but a literal-reading misdiagnosis of the root cause.
