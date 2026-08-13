---
name: feedback-notion-oauth-preference
description: "Use the Notion OAuth connector, not the Notion API-key MCP server, for all Notion work"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b700f54b-8584-4257-ba41-26330ab76a89
  modified: 2026-08-13T13:15:33.245Z
---

Use the Notion OAuth-based connector (MCP server prefixed `mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-*`, e.g. `notion-search`, `notion-fetch`, `notion-create-pages`) for all Notion work, not the API-key-based `notionApi` server (`mcp__notionApi__*`).

**Why:** User explicitly asked (2026-08-13) to standardize on Notion OAuth going forward, across sessions, not just the current one.

**How to apply:** At the start of any session involving Notion (search, fetch, create/update pages, comments, etc.), reach for the `mcp__d77c6777-...__notion-*` tools via ToolSearch (`select:mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-search` etc.) instead of `mcp__notionApi__*`. Verified working via a live `notion-search` call on 2026-08-13. Relevant to [[reference_survivorpulse_operating_model]] and any other project using Notion (grooming docs, briefs, etc.).
