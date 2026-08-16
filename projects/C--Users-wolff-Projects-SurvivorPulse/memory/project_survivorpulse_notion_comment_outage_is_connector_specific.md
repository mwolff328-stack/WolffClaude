---
name: project_survivorpulse_notion_comment_outage_is_connector_specific
description: "The recurring \"Notion comment API is down\" is one connector failing, not Notion — a second connector's create-comment works. Try it before falling back."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2993dd74-1b19-4302-9b8a-6bd5b31d6e47
  modified: 2026-08-16T03:37:29.666Z
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

**Recurred 2026-08-15 (SST-1361):** a full triage panel (5 personas) each hit
`missing_version` on `mcp__notionApi__API-create-a-comment`, and every one of
them — plus the orchestrator — accepted it as fatal and wrote to Notes instead
of trying the second connector, despite this memory existing since 2026-08-12.
The founder had to ask "did you try Notion OAuth instead of API?" before the
second connector got tried — and it worked on the first call. Root cause of
the repeat: nobody searched memory for "Notion comment" before treating the
tool error as a dead end; the failure was pattern-matched as "known API quirk,
proceed with workaround" rather than "check if this is already solved." Backfilled
the missing comments after the fact once the OAuth connector was confirmed
working. **Lesson: a tool failure that looks like infrastructure flakiness is
exactly the kind of thing worth a memory search before working around it — the
workaround itself (Notes-only) degrades the audit trail for everyone
downstream, not just this session.**
