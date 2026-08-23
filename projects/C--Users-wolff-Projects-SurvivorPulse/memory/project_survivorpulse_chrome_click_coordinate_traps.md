---
name: project_survivorpulse_chrome_click_coordinate_traps
description: "Driving the founder's Chrome: clicks take screenshot-space coordinates, a resizing dialog re-centres so stale coords dismiss it, and a long `type` aimed at a Notion comment box can land in the page TITLE instead."
metadata: 
  node_type: memory
  type: project
  originSessionId: 29ab28e5-1bde-4292-b74b-031f40ea1c5c
  modified: 2026-08-23T06:57:53.388Z
---

Authenticated prod smoke goes through **claude-in-chrome** (the founder's real
Chrome, already logged in). `/api/me` returned 200 + `role: ADMIN` with no
credential handling at all — never type a password to get there.

Two coordinate traps cost several round trips on 2026-07-31, both of which fail
*silently* (the click lands somewhere harmless and nothing reports an error):

1. **`computer` takes SCREENSHOT-space coordinates; `getBoundingClientRect`
   returns viewport-space.** The window measured 1920 CSS px but screenshots came
   back 1568 wide — scale 0.8167. Clicking the rect's raw x/y overshot every
   target by ~22%. Convert: `x * (screenshotWidth / window.innerWidth)`. The tell
   is a click that "succeeds" and changes nothing.

2. **A dialog that resizes re-centres, so coordinates measured a step earlier are
   stale — and a stale click usually lands OUTSIDE the dialog and dismisses it.**
   Clicking "Clear" in the Apply pool-picker dropped the warning line, the dialog
   shrank, and every row moved; the next click (correct when measured) closed the
   modal instead. Re-measure after every state change, never batch a measure with
   a later click.

3. **Writing to Notion through Chrome can edit the page instead of commenting.**
   When the Notion MCP is unavailable (it has been absent for several sessions),
   Chrome is the only board-write route — and it is genuinely dangerous. Clicking
   the `Add a comment…` textbox by `ref` reported success, but a ~4,000-character
   `type` landed in the **page title**: SST-1131's title gained a run of em dashes
   and a `§` from the body of the message, and the comment was never created.
   Nothing errored; the only tell was "Edited just now" in the header. `ctrl+z`
   ×12 restored the title exactly and the rest of the page (description, ACs,
   existing comments) was untouched — verified with `get_page_text`, not by eye.
   **Never bulk-type a long comment.** Click the box, screenshot to confirm the
   caret is actually in it, type a short probe, confirm it appeared *in the
   comment box*, and only then continue — or hand the text to the founder to
   paste. Avoid `—`, `§`, `---` and `///` in anything typed into Notion at all:
   they trigger markdown/divider autoformatting.

When a real click won't land and you only need to know whether the handler
works, `dispatchEvent` a pointerdown/mousedown/pointerup/mouseup/click sequence —
React's delegated listener picks it up, and it proved the modal opened fine and
the problem was purely my coordinates. Use that for *diagnosis*; go back to a
real click for anything you intend to claim a user can do.

**Guard destructive UI before committing to it.** The Apply dialog defaults to
**every** pool selected ("replaces this concluded season's recorded picks in 7
pools") — it would have overwritten real 2025 pools. Read the confirmation
sentence and assert the selected set programmatically (`checkedCount === 1` and
the label matches the intended pool) *before* clicking the commit button, rather
than trusting that the click sequence did what it looked like.

Related: [[project_survivorpulse_production_smoke_access]],
[[project_survivorpulse_radix_outside_click_arming_race]],
[[project_survivorpulse_stale_spa_bundle_after_publish]],
[[project_survivorpulse_notion_via_chrome_field_overwrite]] (same probe-before-typing discipline,
applied to the comment composer specifically — a stale composer click there lands text inside the
LAST EXISTING COMMENT rather than the page title, recurring 2026-08-05 and again 2026-08-22),
[[project_survivorpulse_notion_comments_via_chrome_composer]] (current standing order: try the
OAuth connector's `notion-create-comment` before Chrome at all, given this corruption risk)
