---
name: project_survivorpulse_notion_comments_via_chrome_composer
description: "The Chrome comment composer click is UNRELIABLE and can silently corrupt the last existing comment on the page. Always try the OAuth connector's notion-create-comment FIRST — it works cleanly. Only fall back to Chrome if the connector is genuinely unavailable, and then use the probe-string safety protocol below before typing the real comment."
metadata: 
  node_type: memory
  type: project
  originSessionId: d82d8712-5081-4ef9-b4b9-148894d49e43
  modified: 2026-08-22T23:17:00.741Z
---

## ⚠️ 2026-08-22: the composer click is unreliable and can corrupt an existing comment — try the OAuth connector FIRST

During SST-1438 grooming, the standing assumption below ("browser route worked
on the first try") did not hold. Clicking the `Add a comment...` composer —
both via its accessibility `ref` from `read_page` and via nearby coordinates in
the same visual row — did **not** reliably focus a fresh composer. Twice, the
typed text landed **mid-sentence inside the body of the last existing comment
on the page** (Deb's already-posted comment), silently editing/corrupting it
instead of creating a new one. Each time this was caught immediately by
re-reading the page (`get_page_text` / `API-retrieve-page-markdown`) right
after typing, and reverted with ctrl+z — one over-aggressive multi-press
ctrl+z actually deleted Deb's entire comment body and required ctrl+shift+z
(redo) to restore it. Coordinate clicks far outside the last comment's
paragraph (near the attach/mention/send icons) avoided the corruption but also
failed to focus anything — keystrokes were silently lost.

**Revised order of operations, effective now: try
`mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-create-comment` (OAuth
connector — `page_id` + `markdown`) FIRST, before touching Chrome at all.**
This SST-1438 task ultimately succeeded that way — posted cleanly on the first
call, zero corruption risk. Do not reach for the browser as the default path
just because a past session documented it working; the connector is faster
and cannot corrupt anything.

**If the Chrome fallback is ever necessary anyway** (e.g. the OAuth connector
is also down), do not trust a click on that element blind. Use this safety
protocol:
1. Click the composer, then type a short, unique probe string (not the real
   comment).
2. Immediately re-check via `get_page_text` / `API-retrieve-page-markdown` —
   confirm the probe landed as a new composer draft, and confirm no existing
   comment (especially the last one on the page) changed.
3. Only proceed with the full comment text once that's confirmed. If the
   probe landed inside another comment, undo (see the ctrl+z/ctrl+shift+z
   note above) and try a different click target before retrying.

This does not overturn the "browser route works" finding below entirely — it
worked cleanly in the 2026-08-20 session — but it is evidently not reliable
across sessions, and the failure mode is silent corruption of someone else's
comment rather than a clean error. Treat every composer click as unverified
until step 2 above confirms it.

## 2026-08-20 session (original finding, still useful as fallback detail)

`mcp__notionApi__API-create-a-comment` still returns
`400 missing_version` (the known client-side header defect — see
[[project_survivorpulse_notion_comment_outage_is_connector_specific]]).

## ⚠️ READ THIS FIRST: the OAuth connector came back mid-session

Early in the session the fallback connector `mcp__d77c6777-…__notion-create-comment`
was **not loadable at all** — `ToolSearch` with an exact `select:` returned
"No matching deferred tools found". Both documented MCP routes were dead, so the
whole browser procedure below was built and used.

**Hours later, in the SAME session, the OAuth connector appeared in the deferred
tool list and worked on the first call** — `notion-get-comments` read cleanly and
`notion-create-comment` posted successfully, including a threaded reply via
`discussion_id`.

This is exactly the pattern `sp-autonomous`'s SKILL.md warns about: *"Re-check
with ToolSearch before you write the final report. First-check absence is not
proof of permanent absence."* It cost real time here — several long, fragile
browser typing sessions that the connector would have done in one call.

**So: re-run the `select:` ToolSearch for the OAuth connector periodically, not
just once at the start.** The browser procedure below is the genuine fallback and
it does work, but it is far slower and far more failure-prone than the connector.

When it IS available, prefer it outright: it takes `page_id` + `markdown`, posts
reliably regardless of length, supports real markdown formatting (which the
browser route cannot produce), and `discussion_id` lets you thread a reply
directly onto an existing discussion.

## The browser fallback, for when the connector is genuinely absent

The **browser route worked on the first try** and is worth reaching for
immediately rather than falling back to the Notes property.

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
