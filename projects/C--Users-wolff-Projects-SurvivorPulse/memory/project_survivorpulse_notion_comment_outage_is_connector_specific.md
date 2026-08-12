---
name: project_survivorpulse_notion_comment_outage_is_connector_specific
description: "The recurring \"Notion comment API is down\" is one connector failing, not Notion — a second connector's create-comment works. Try it before falling back."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2993dd74-1b19-4302-9b8a-6bd5b31d6e47
  modified: 2026-08-12T16:37:59.221Z
---

Multiple sessions (SST-1293, SST-1331, SST-1332, SST-1317-1322) recorded the
Notion comment endpoint as "down all session" and fell back to writing the
audit trail into the ticket's **Notes** property, or to driving Chrome by hand.
SST-1333 (2026-08-12) established that this is **not a Notion-wide outage**.

Two Notion MCP connectors are configured. They fail independently:

- `mcp__notionApi__*` — `API-create-a-comment` returns
  **`400 missing_version`** ("Notion-Version header should be defined"), and
  later in the same session every call began returning **`401 unauthorized`**.
  Page-property writes (`API-patch-page`) worked right up until the 401.
- `mcp__d77c6777-…__notion-*` — `notion-create-comment` **succeeded** in the
  same session, minutes after the first connector had started 401ing, and
  `notion-fetch` read the page fine. It takes `page_id` + `markdown`.

**Why:** the `missing_version` error is a client-side header defect in one
connector, not a Notion API state, so it will never "come back" on its own and
waiting for it is wasted time. The 401 is separate again (a token problem on
that connector only).

**How to apply:** when the comment endpoint fails, do NOT immediately fall back
to the Notes property or to Chrome. Load the other connector via ToolSearch
(`select:mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-create-comment,…`)
and retry there — the sp-autonomous process wants real comments, since Done is
defined by those comments existing and the Notes field is a lossy substitute a
reviewer will not think to read. Note the two connectors also expose different
property-write shapes (`API-patch-page` takes Notion property objects;
`notion-update-page` takes a flat SQLite-style map), so port the payload rather
than reusing it verbatim. Related:
[[project_survivorpulse_notion_via_chrome_field_overwrite]],
[[project_survivorpulse_notion_create_comment_write_path_defect]].
