---
name: feedback_notion_mcp_update_a_block_fails_validation_use_rest_patch
description: "Notion MCP API-update-a-block returns 'body.paragraph should be defined' for any paragraph edit; patch the block over REST with the ship-aggregator-tools script instead. Also: never return raw fetch bodies from a Chrome javascript_tool call."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7c6d8f94-f9c3-47a3-af85-dc71bdbecb22
  modified: 2026-10-03T19:37:40.891Z
---

`mcp__notionApi__API-update-a-block` rejects every attempt to change a paragraph's text (tried
`type: {"paragraph": {"rich_text": [...]}}`): 400 "body.paragraph should be defined, instead was `undefined`". The
tool wraps the object under `type`, but the REST endpoint wants `paragraph` at the top of the body.

**Why:** found 2026-10-03 while updating the REL-65 release note and top verdict paragraph on an in-place re-check.
**How to apply:** use `ship-aggregator-tools/update_paragraph.cjs <blockId> <textFile>` (REST PATCH, token read from
env, never printed). `API-patch-page` for properties and `API-patch-block-children` for appending still work fine
through the MCP tool, including `heading_3` blocks.

Same session, a related trap: a `javascript_tool` helper that returned the parsed body of an authenticated JSON
fetch dumped 50KB of ranking rows and hid the headers I wanted. In-page, summarize to a small object (status, the
headers you need, a count, an error code) and never return the payload.
