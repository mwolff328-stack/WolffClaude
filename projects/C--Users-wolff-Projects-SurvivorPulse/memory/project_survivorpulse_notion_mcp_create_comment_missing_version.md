---
name: project-survivorpulse-notion-mcp-create-comment-missing-version
description: "mcp__notionApi__API-create-a-comment fails with `missing_version` on every payload shape, while reads, API-post-page and API-patch-page on the SAME server work. Comment posting is broken; page and property writes are not — don't declare a Notion outage."
metadata: 
  node_type: memory
  type: project
  originSessionId: 21592230-06ea-476f-b7cd-e40061b85574
  modified: 2026-08-21T13:27:20.765Z
---

Observed 2026-08-21, whole session, on `mcp__notionApi__API-create-a-comment`:

```
{"status":400,"code":"missing_version",
 "message":"Notion-Version header failed validation: Notion-Version header should be defined,
            instead was `undefined`."}
```

Tried and all identical: `parent` as `{page_id}` object vs. bare string; `rich_text` as
`[{text:{content}}]`, as `[{type:"text",text:{content}}]`, and as a bare `["string"]`. Re-checked
after an hour and after a push. Always the same.

**The server is NOT down, and this is not an auth problem.** On the same connector, in the same
session, all of these worked:

- `API-retrieve-a-page`, `API-retrieve-a-data-source` — fine
- `API-post-page` — **created SST-1428 with full Description / AC / Test Cases**
- `API-patch-page` — moved SST-1424 to `In Review` without disturbing its grooming fields
- `API-patch-block-children` — appended headings/callouts/paragraphs to a ticket's page body

So the defect is scoped to the **comment-creation endpoint's missing `Notion-Version` header**,
which is a server-side wrapper bug nothing on this side can set.

## Working around it

1. Don't defer the work. Ticket creation, property edits and status transitions all still work
   through the API.
2. For sign-offs and build logs, `API-patch-block-children` into the **page body** is a viable
   fallback — label it explicitly as a deviation so nobody reads a body block as a comment.
   Page body is for supplemental material under the Operating Model, which a build/review log is;
   grooming content still belongs in the property fields.
3. The Chrome composer remains the route that produces real *comments* — but it needs a browser
   selection, and the in-app browser lands on a login wall (wrong browser, not an outage).
4. **Watch the 2,000-character limit per `rich_text` element** on every write path. Exceeding it
   is a clean `validation_error` that names the length, and the write is rejected atomically —
   nothing partial lands. Split long text across multiple `rich_text` objects in the same array.

Consequence for process: a story whose Done definition depends on sign-off **comments** existing
cannot legitimately be self-certified Done while this is broken. Leave it `In Review` and say so.

Related but different: [[project-survivorpulse-notion-create-comment-write-path-defect]] (a
different connector; writes succeeded, *reads* of replies were blind) and
[[project-survivorpulse-notion-page-read-truncates-rich-text]].
