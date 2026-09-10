---
name: project_survivorpulse_notion_comments_api_missing_version_defect
description: "Notion MCP's API-create-a-comment tool returned a connector-level \"missing_version\" error on every call this session (2026-09-09), regardless of payload/parent shape -- page reads/writes (API-post-page, API-patch-page, API-query-data-source) worked fine throughout."
metadata: 
  node_type: memory
  type: project
  originSessionId: aafd697d-5743-4cee-aba8-7aa0acb7fc86
  modified: 2026-09-10T04:26:36.502Z
---

`mcp__notionApi__API-create-a-comment` failed with `{"code":"missing_version","message":"Notion-Version header should be defined, instead was undefined"}` on every attempt (2026-09-09), across multiple payload shapes (parent as `{page_id}`, `{type:"page_id", page_id}`, with/without explicit `type:"text"` on rich_text items). This is a connector bug, not a caller mistake — the Notion-Version header is presumably supposed to be injected by the connector itself and wasn't for this one endpoint.

**Why:** This blocked the bug-triage/sp-autonomous skill's mandated "comment on every touch" audit trail (persona triage comments, per-slice progress comments) for SST-1619. Other Notion API calls in the same session (page create, property patch, data-source query) worked normally the whole time, so this is narrowly scoped to the comments endpoint, not a general outage.

**How to apply:** If `API-create-a-comment` fails with `missing_version` again, don't retry with different payloads — it's not a payload problem. Fall back to recording the audit trail in the ticket's own **Notes** property via `API-patch-page` (durable, visible on the page, just not a native threaded comment) and flag it plainly in that Notes text so the substitution is transparent. Re-check `API-create-a-comment` at the start of a later session before assuming it's still broken — no fix was applied here, just worked around.
