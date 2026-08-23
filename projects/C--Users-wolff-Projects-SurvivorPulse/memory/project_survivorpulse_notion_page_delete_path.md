---
name: project_survivorpulse_notion_page_delete_path
description: "The OAuth Notion connector cannot delete/trash a page; notionApi's API-delete-a-block is the only path and it works, despite being documented as retired."
metadata: 
  node_type: memory
  type: project
  originSessionId: 57653058-040e-4969-b809-27c30e6a84fc
  modified: 2026-08-23T04:05:15.986Z
---

The OAuth Notion connector (`mcp__d77c6777-...__notion-*`) has **no page trash/delete/archive tool**. `notion-update-page` has no `in_trash` option — only `notion-update-data-source` does, and that trashes a whole data source, not a row.

`mcp__notionApi__API-delete-a-block` **does work** for trashing a database row — verified 2026-08-23 removing a probe row from the Follow-Ups data source, returning `in_trash: true, archived: true`. Pass the page's UUID as `block_id` (a Notion page is a block).

This contradicts `sp-social-listening/SKILL.md`, which documents `mcp__notionApi` as retired because "every call fails with `401 unauthorized` regardless of how valid the token" due to an unsubstituted `${NOTION_TOKEN}` placeholder. That claim is **not universally true** — at minimum the delete path authenticates fine. Related: [[project_survivorpulse_notion_mcp_create_comment_missing_version]] documents a *different* notionApi failure (`missing_version` on create-comment), which is a per-endpoint defect, not a server-wide auth failure. Treat "notionApi is dead" as per-endpoint, not blanket.

**Why:** without this, a session needing to remove a wrongly-created Notion row concludes deletion is impossible and leaves garbage rows behind, or wastes turns on a browser workaround.

**How to apply:** to delete a Notion page/row, use `mcp__notionApi__API-delete-a-block` with the page UUID. Do not assume the retirement note in `sp-social-listening/SKILL.md` rules it out. Still prefer the OAuth connector for every read/create/update — this is the one gap it doesn't cover.
