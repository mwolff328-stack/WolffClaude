---
name: project_survivorpulse_notion_comments_via_chrome_composer
description: "When both Notion MCP connectors are unavailable, the page-bottom comment composer in the founder's Chrome works — long typing exceeds the 30s CDP limit but the text still lands, so verify by screenshot before assuming failure."
metadata: 
  node_type: memory
  type: project
  originSessionId: d82d8712-5081-4ef9-b4b9-148894d49e43
  modified: 2026-08-20T15:46:09.298Z
---

**2026-08-20.** `mcp__notionApi__API-create-a-comment` still returns
`400 missing_version` (the known client-side header defect — see
[[project_survivorpulse_notion_comment_outage_is_connector_specific]]), and the
documented fallback connector
`mcp__d77c6777-…__notion-create-comment` was **not loadable in this session** —
`ToolSearch` with an exact `select:` returned "No matching deferred tools found",
because the OAuth-backed Notion connector needs authorization and the session
could not run the flow.

So both documented MCP routes were dead. The **browser route worked on the first
try** and is worth reaching for immediately rather than falling back to the Notes
property.

## What works

- `mcp__notionApi__API-patch-page` **still works** for property fields
  (Description / Acceptance Criteria / Test Cases / Status / relations). Only
  *comments* are broken. Grooming content therefore does not need the browser.
  ⚠️ Each rich_text element is capped at **2000 characters** — split long field
  content into multiple `rich_text` array entries or the patch 400s.
- Comments: use the founder's real Chrome (`mcp__claude-in-chrome__*`, already
  logged in). Scroll to the **bottom of the page** — below every property — to
  the `Add a comment...` composer. Click it, type, then click the blue submit
  arrow at the composer's right edge. This posts a new TOP-LEVEL comment, which
  is better than the sidebar `Reply...` box (a reply nests under an existing
  discussion where `notion-get-comments` cannot see it).

## The two traps that actually bit

1. **A long comment exceeds the tool's 30-second CDP limit and returns
   `Failed to type: Input.dispatchKeyEvent timed out`. THE TEXT USUALLY LANDED
   ANYWAY.** Do not retype — that produces a doubled comment. Wait ~10s,
   screenshot, and read what is actually in the composer before doing anything
   else. Both long comments in this session reported that error and both had
   typed completely.
2. **The typed text sits as an UNSENT DRAFT.** The error makes it look like the
   action failed entirely; it did not, but it also did not submit. You must
   still click the submit arrow. Screenshot after clicking: a posted comment
   leaves the composer showing an empty `Add a comment...` placeholder.

Corollary: because typing is slow and the draft persists, you can APPEND a
correction to a draft before sending it — e.g. post-rebase SHAs, when the
comment body was written pre-rebase.

## Chrome goes unresponsive under local CPU load

While a full `vitest` run (or several background agents) is going, script
injection times out and every screenshot fails with
`Script injection timed out after 5000ms`. That is **contention, not a dead
tab** — the page recovers once the load drops. Sequence browser work *between*
heavy local runs rather than alongside them, and never conclude a comment failed
just because you cannot screenshot it.

Related: [[project_survivorpulse_notion_via_chrome_field_overwrite]] (the
stale-coordinate trap that once appended a grooming verdict into an Acceptance
Criteria field — the page-bottom composer is well away from property fields,
which is a second reason to prefer it),
[[feedback_prefer_notion_oauth_connector]],
[[feedback_search_memory_before_accepting_a_tool_failure_as_fatal]].
