---
name: project_survivorpulse_deployed_dev_url
description: "How to find the deployed dev app URL for live verification -- canonical source is .replit's DEV_BASE_URL (repo-tracked), this memory is only a fallback cache."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3e2be073-728c-4e6a-ba0c-09d57451f6a7
  modified: 2026-08-07T15:27:41.164Z
---

**Canonical source, as of 2026-08-07: `.replit`'s `[userenv.development]` block, key `DEV_BASE_URL`.**
Read that file directly (it's committed to the repo, no network call needed) before asking the founder or falling back to the cached value below. This was the founder's own idea (SST-1292 reopening follow-up) -- `DEV_BASE_URL` already existed as an unused workspace env var (grep confirmed zero code references), so it cost nothing to repurpose it as the durable, git-diffable home for this URL instead of agent-only memory.

**Cached value as of 2026-08-07 (verify against `.replit` first -- it may have moved):**
`https://3faa879a-b955-4ac0-b132-e4ebbd482101-00-3f5q699y4opzy.worf.replit.dev/`

This is the Replit *workspace* dev preview the founder tests against day to day (distinct from the `survivorpulse-beta.replit.app` production autoscale deployment in [[project_survivorpulse_production_smoke_access]]). Auto-login is active there (`ALLOW_UNSAFE_DEV_FEATURES`), so navigating in via `mcp__claude-in-chrome__*` lands authenticated as the founder immediately -- no login flow needed.

**Why this had to be asked for once, 2026-08-07 (SST-1292 reopening):** the URL is a per-Repl UUID host. Before this fix it was stored nowhere in the repo, so a prior session (SST-1292's first pass) shipped a fix, verified only with jsdom component tests, marked it Done -- the founder's live retest on this exact URL found it still broken -- and the reopening session had no way to reach the real deployed surface at all until the founder supplied the URL mid-task. Codifying it in `.replit` closes that gap for good; this memory file is now a fallback for whenever reading the repo file isn't convenient, not the primary path.

**How to use it going forward:**
- **Read `.replit`'s `DEV_BASE_URL` first.** Only fall back to the cached value above if the repo checkout isn't available for some reason.
- **Verify it's still live before trusting it** -- a per-workspace UUID host WILL change if the founder ever recreates the workspace. A quick `GET /api/me` (200 bare = auto-login active, connection failure/wrong app = stale) confirms it in one request before doing a longer live-verify pass.
- If it 404s or refuses to connect: don't guess a new one. Ask the founder for the current URL, then update it in BOTH places -- `.replit`'s `DEV_BASE_URL` (commit + push to `2026-v1`, per the file's own comment on why this must live in the repo) AND this memory file's cached value (edit in place, don't create a duplicate file).
- ⚠️ **Known fragility:** `.replit`'s `[userenv.development]` block has been silently stripped once before by a Replit-platform "Published your App" auto-commit (the `ALLOW_UNSAFE_DEV_FEATURES` incident, 2026-07-24 -- see `.replit`'s own comment block for the full story). If `DEV_BASE_URL` is ever missing or reverted to the `http://localhost:3000` placeholder after a publish, that's the cause -- re-add it to the repo file, not only via the Replit Configurations UI.
- This is specifically the workspace *dev* preview. Do not confuse it with production ([[project_survivorpulse_production_smoke_access]]) -- dev has real historical odds for past seasons but not necessarily current-season forward odds; see the `sp-live-verify` skill §0 for what each surface can and can't show you.

**Confirmed working live-verify pattern (SST-1292 reopening):** navigate to `/game-plan`, use the season selector to switch to 2025, select the "Goldflam Suicide 2025" pool (Season View), toggle a row's Actual/Proposed pill, then either read the DOM directly (`document.querySelectorAll('[data-cell-kind]')`) or zoom-screenshot the cell to confirm real rendered content -- not just that the toggle click didn't error.

---

**Exact working sequence, 2026-08-19 — a peer session declared live verification unavailable in this same environment while it was working for me.** Recording the mechanics, because "I couldn't get a live surface" is almost always a wrong tool sequence, not a missing capability:

0. **Use `mcp__claude-in-chrome__*`, NOT the in-app Browser pane (`mcp__Claude_Browser__*`).** These are two different surfaces and only the first carries the founder's session. Confirmed independently 2026-08-19: a peer session tried ONLY the in-app pane, hit a display limitation there, and concluded live verification was unavailable in this environment for the whole run -- while the Chrome path was working fine in a parallel session at the same moment. A failure in the in-app pane is evidence about that pane, never about whether a live surface exists.
1. `mcp__claude-in-chrome__list_connected_browsers`. If more than one is connected the tool **requires** an `AskUserQuestion` listing every browser (name + deviceId) plus the literal "open a confirmation screen in every connected Chrome extension" option. Never pick one yourself.
2. `mcp__claude-in-chrome__select_browser` with the chosen deviceId.
3. **`tabs_context_mcp {createIfEmpty: true}` FIRST** — `tabs_create_mcp` errors with "No tab group exists for this session yet" before the group exists. This one trap can read as "the browser tools are broken."
4. Navigate to `.replit`'s `DEV_BASE_URL`; auto-login returns the founder's real ADMIN identity from `GET /api/me` with no login flow and no credential handling.
5. `javascript_tool` + `fetch(..., {credentials:'include'})` returns JSON directly. **Aggregate inside the page** and return a small object — the tool result caps out fast on raw rows.

⚠️ **A plain `curl` from Bash returns `{"errorCode":"UNAUTHORIZED"}`.** That is the wrong surface (no session cookie), NOT the app being unreachable — do not take a 401 there as evidence that live verification is impossible. See [[feedback_search_memory_before_accepting_a_tool_failure_as_fatal]] and [[feedback_survivorpulse_verify_a_deferral_reason]].

⚠️ **The deployed dev app runs whatever last synced to `2026-v1`.** Before concluding your change is or isn't live, confirm the `Replit Sync` run for YOUR exact commit. Reading a stale bundle and calling it a code result is its own trap ([[project_survivorpulse_stale_spa_bundle_after_publish]]).

This surface supports **writes**, not just reads — `PUT /api/entries/:id/regular/:season/proposed-picks/:week` (note: bare week number, `week:5` is rejected) and `POST /api/me/gameplan/apply` both work, which is how a full plant-then-re-Apply behavioural proof was run against the founder's real pools. Dev only; never do this against production.
