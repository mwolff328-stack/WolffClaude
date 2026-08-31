---
name: feedback_survivorpulse_chrome_browser_selection
description: How to pick the right Chrome browser for claude-in-chrome live verification when multiple browsers are connected -- user does not know the deviceId offhand.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b87a74e6-3db8-4e1f-b4e6-f8eff766ba9b
  modified: 2026-08-31T13:34:32.986Z
---

When `list_connected_browsers` shows more than one connected browser, the user
wants "the SurvivorPulse Chrome browser" used -- but the extension only reports
generic names ("Browser 1", "Browser 2"), not a saved mapping, and the user does
not know which deviceId that corresponds to on sight.

**Why:** asked once (2026-08-31); the user didn't have the deviceId memorized
and asked how to find it rather than just picking a label.

**How to apply:** don't try to guess or ask the user to look up a deviceId.
Go straight to `switch_browser` (no args) -- it broadcasts a connect prompt to
every connected extension and the user clicks Connect in the actual browser
they mean, which also lets them name it (confirmed named "SurvivorPulse Chrome"
in that session). This is faster and more reliable than presenting a
deviceId-labeled list for this user. If `switch_browser` ever isn't available,
fall back to the `AskUserQuestion` listing every connected browser plus the
"open a confirmation screen in every connected Chrome extension" option -- but
prefer `switch_browser` directly first for this user.
