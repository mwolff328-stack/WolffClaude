---
name: feedback-notion-oauth-preference
description: "Use the Notion OAuth connector, not the Notion API-key MCP server, for all Notion work"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b700f54b-8584-4257-ba41-26330ab76a89
  modified: 2026-08-17T17:41:12.535Z
---

Use the Notion OAuth-based connector (MCP server prefixed `mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-*`, e.g. `notion-search`, `notion-fetch`, `notion-create-pages`, `notion-create-comment`) for all Notion work, not the API-key-based `notionApi` server (`mcp__notionApi__*`).

**Why:** User explicitly asked (2026-08-13) to standardize on Notion OAuth going forward, across sessions, not just the current one. Confirmed again 2026-08-17 after a concrete failure: the OAuth connector's tools weren't in this session's initial deferred-tool list (only `notionApi` was reachable), so a fallback to `notionApi__API-create-a-comment` was attempted — every call to that one endpoint failed with `400 missing_version` ("Notion-Version header should be defined, instead was undefined"), even though other `notionApi` endpoints on the same page (`API-get-block-children`, `API-delete-a-block`, `API-get-self`) worked fine. This looks like a bug specific to that connector's comment-creation endpoint, not a payload issue — retried with both object-form and string-form `parent`, both `type:"text"` and bare `text` rich_text shapes, same error every time. Worked around it at the time by appending plain paragraph blocks to the page body instead of a real comment — later had to delete those duplicate paragraphs once the OAuth connector's `notion-create-comment` became available and posted the real threaded comment.

**How to apply:** At the start of any session involving Notion (search, fetch, create/update pages, comments, etc.), reach for the `mcp__d77c6777-...__notion-*` tools via ToolSearch (`select:mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-search` etc.) instead of `mcp__notionApi__*`, even if only `notionApi` shows up in the initial deferred-tool list — search ToolSearch for it explicitly (e.g. `query: "notion"` or `select:mcp__d77c6777-...__notion-create-comment"`) before falling back to `notionApi`. If `notionApi__API-create-a-comment` ever needs to be used as a last resort, expect it to fail with `missing_version` regardless of payload shape — don't burn retries on it; go straight to appending a page-body paragraph (and clean it up later) or wait for the OAuth connector instead. Verified working via a live `notion-search` call on 2026-08-13 and a live `notion-create-comment` call on 2026-08-17. Relevant to [[reference_survivorpulse_operating_model]] and any other project using Notion (grooming docs, briefs, etc.).
