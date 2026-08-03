---
name: project_survivorpulse_fixed_position_inside_dialog
description: "A position:fixed bar inside a Radix dialog detaches from the modal and eats taps on its bottom edge — and the failure reads as a flaky E2E timeout, not a layout bug"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1bb7137f-c3a9-4fee-814a-9b69a6af9944
  modified: 2026-07-29T19:44:57.037Z
---

`position: fixed` is **viewport**-relative, never dialog-relative. A component that pins a bar to `bottom-0` is correct while it owns the page scroll, and wrong the moment it is embedded in a Radix `DialogContent` (centred, `max-h-[90vh] overflow-y-auto`) — the bar leaves the modal and paints across the bottom of the SCREEN, over the dialog's bottom edge *and* the page behind it. A sibling spacer div (`h-14`) does NOT compensate: it sits at the end of the dialog's inner scroll, not at the end of the viewport.

Concrete case (SST-1083, WizardNav in AddPoolWizard, fixed 2026-07-29): at 375x812 the dialog spanned y 40.6–771.4 and the bar 756–812, so the bottom ~15px of every modal step was untappable. `scrollIntoViewIfNeeded` parks a target flush at the scrollport's bottom padding edge — exactly into that band — so the 16px Pick Mode radio centred at y 759.6 and `elementFromPoint` returned the bar's Back button.

**The tell.** In CI this presents as `locator.check: Test timeout of 60000ms exceeded` — a timeout, which reads as flake or slowness. The real diagnosis is one line deeper in the Playwright call log: `... subtree intercepts pointer events`, naming the intercepting element and its parent's className. Always pull the full call log (`gh run view --job <id> --log`) before theorising; it identified the culprit here in a single grep, and the parent className was enough to find the file. The desktop twin of the same test passing is the second tell — same helper, same data, different viewport means layout, not state.

Fix shape: give the component a `modalMode` prop; when set, render the nav inline at every breakpoint and skip the fixed bar + spacer entirely. Guard it in **both** directions in jsdom (modal renders no `.fixed.bottom-0`; page mode still does) — a test that only asserts the bar's absence also passes if someone deletes it outright. See [[feedback_survivorpulse_gate_page_not_viewer]].

Related: [[project_survivorpulse_flex_percentage_height_and_radix_traps]] (other Radix/flex layout traps), the sp-live-verify skill (how to reproduce this locally).
