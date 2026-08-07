---
name: project_survivorpulse_deployed_dev_url
description: "The current deployed dev app URL (Replit workspace preview), founder-confirmed 2026-08-07 -- use for live verification of UI fixes instead of asking or skipping the check."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3e2be073-728c-4e6a-ba0c-09d57451f6a7
  modified: 2026-08-07T15:09:24.628Z
---

**Current deployed dev app URL (confirmed by founder 2026-08-07):**
`https://3faa879a-b955-4ac0-b132-e4ebbd482101-00-3f5q699y4opzy.worf.replit.dev/`

This is the Replit *workspace* dev preview the founder tests against day to day (distinct from the `survivorpulse-beta.replit.app` production autoscale deployment in [[project_survivorpulse_production_smoke_access]]). Auto-login is active there (`ALLOW_UNSAFE_DEV_FEATURES`), so navigating in via `mcp__claude-in-chrome__*` lands authenticated as the founder immediately -- no login flow needed.

**Why this had to be asked for once, 2026-08-07 (SST-1292 reopening):** the URL is a per-Repl UUID host, not stored anywhere in the repo, and each Repl workspace gets its own. A prior session (SST-1292's first pass) shipped a fix, verified only with jsdom component tests, and marked it Done -- the founder's live retest on this exact URL found it still broken. This session initially had no way to reach the real deployed surface at all and had to ask the founder for the URL mid-task.

**How to use it going forward:**
- Try this URL first for any "does this actually render right" check on SurvivorPulse UI work, via `mcp__claude-in-chrome__navigate`.
- **Verify it's still live before trusting it** -- Replit workspace URLs *can* rotate if the founder restarts/recreates the workspace, though they are typically stable across a long-running dev session. A quick `GET /api/me` (200 bare = auto-login active, connection failure/wrong app = stale) confirms it in one request before doing a longer live-verify pass.
- If it 404s or refuses to connect, don't guess a new one -- ask the founder for the current URL and update this memory file with the new value (edit in place, don't create a duplicate file).
- This is specifically the workspace *dev* preview. Do not confuse it with production ([[project_survivorpulse_production_smoke_access]]) -- dev has real historical odds for past seasons but not necessarily current-season forward odds; see the `sp-live-verify` skill §0 for what each surface can and can't show you.

**Confirmed working live-verify pattern (SST-1292 reopening):** navigate to `/game-plan`, use the season selector to switch to 2025, select the "Goldflam Suicide 2025" pool (Season View), toggle a row's Actual/Proposed pill, then either read the DOM directly (`document.querySelectorAll('[data-cell-kind]')`) or zoom-screenshot the cell to confirm real rendered content -- not just that the toggle click didn't error.
