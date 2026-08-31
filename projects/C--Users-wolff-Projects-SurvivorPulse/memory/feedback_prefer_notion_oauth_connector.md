---
name: feedback-prefer-notion-oauth-connector
description: "User wants the Notion OAuth connector used by default for Notion writes, not the notionApi MCP fallback."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ef8f1c7f-3b77-46b0-a01b-49ab80ba5547
  modified: 2026-08-31T13:23:15.376Z
---

Use the Notion OAuth connector tools (currently surfaced as `mcp__<connector-id>__notion-*`, e.g. `notion-create-comment`, `notion-fetch`, `notion-query-data-sources`) as the **default** path for Notion reads/writes — not `notionApi` (the plugin MCP server), which has a known-persistent `missing_version` outage on `create-a-comment` (see [[project_survivorpulse_notion_mcp_create_comment_missing_version]]).

**Why:** Confirmed 2026-08-31 during a SHIP-aggregator run — `notionApi`'s create-a-comment failed with `missing_version` yet again (same failure mode logged days earlier), and the OAuth connector posted the same comment successfully on the first try. The user then said explicitly: "We should be using the Notion OAuth connector by default."

**How to apply:** At the start of any Notion-touching task, check ToolSearch for a connector server exposing `notion-fetch`/`notion-create-comment`/`notion-query-data-sources` etc. (a UUID-prefixed server name, distinct from `notionApi`) and prefer it over `notionApi` for every operation it supports. Only fall back to `notionApi` (or the browser-via-Chrome route per [[project_survivorpulse_notion_comment_outage_is_connector_specific]]) if the OAuth connector itself is unavailable/erroring — don't reach for `notionApi` first "just in case." This also resolves the recurring `missing_version` outage note that the sp-autonomous skill's aggregator procedure has been carrying forward unresolved across multiple runs — stop citing that outage as blocking once the OAuth connector is confirmed available in-session.
