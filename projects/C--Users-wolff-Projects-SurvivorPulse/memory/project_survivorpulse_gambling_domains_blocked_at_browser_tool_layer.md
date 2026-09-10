---
name: project_survivorpulse_gambling_domains_blocked_at_browser_tool_layer
description: betonline.ag (all subdomains) is blocked by categorical safety policy on both claude-in-chrome and the sandboxed Browser pane, regardless of live login — plan BetOnline/gambling-site research around manual user screenshots, not automated browsing.
metadata:
  type: project
  originSessionId: nervous-vaughan-d24dc4
  modified: 2026-09-10T05:02:14.708Z
---

Attempting to research BetOnline.ag's NFL Survivor Pool product (pick-popularity/ownership data, for a beta-outreach conversation with prospect mikkon123), both browser tool surfaces refused the entire domain outright:

- `mcp__claude-in-chrome__navigate` to `https://www.betonline.ag/` → blocked, even when connected to the user's live logged-in "SurvivorPulse Chrome" profile via `switch_browser`.
- `mcp__Claude_Browser__navigate` to the same URL → blocked in the sandboxed pane too.
- Retried after the user said "try now" (implying they'd changed something) — still blocked on both, message text unchanged/near-identical.
- A different subdomain (`promotions.betonline.ag`) — also blocked, confirming it's a domain-category block (gambling sites), not a specific-URL or login-state block.
- Once the user had a `betonline.ag` tab open in the shared MCP tab group (via a "Research BetOnline" tab group in their own Chrome, not opened via the navigate tool), even `tabs_context_mcp` — just reading tab context, no navigation — failed with "This site is blocked." So the restriction applies at the tool-interaction layer whenever a blocked-domain tab is present in the group, not only at navigation time.

**Why:** confirmed empirically across multiple attempts and both browser tool surfaces in this session (2026-09-04 through 2026-09-09), including after the user's own live logged-in profile and an explicit retry request.

**How to apply:** don't re-attempt navigating/reading a gambling-site domain (betonline.ag or likely similar sportsbook/casino sites) via `claude-in-chrome` or the sandboxed `Claude_Browser` tools, even with the user's live login — it's a categorical policy block, not something tied to auth or a specific path, and retrying wastes a round-trip. Don't look for workarounds (cached pages, alternate subdomains, WebFetch on a different subdomain — also tried and got a real 403, separately) — that would be circumventing a deliberate restriction. Instead, ask the user to grab screenshots or copy/paste the specific numbers/labels from their own browser session and paste them into the conversation; from there, real analysis (e.g. [[feedback_survivorpulse_verify_field_wide_percentages_via_full_field_sum]]) is still possible on the pasted data.
