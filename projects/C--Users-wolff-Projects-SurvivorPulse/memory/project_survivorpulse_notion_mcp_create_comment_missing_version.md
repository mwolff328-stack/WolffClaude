---
name: project-survivorpulse-notion-mcp-create-comment-missing-version
description: "`mcp__notionApi__API-create-a-comment` ALWAYS 400s with `missing_version` — it is a known-bad server, not an outage. Use the OAuth connector `mcp__d77c6777-...__notion-create-comment`, which works. Do not build a page-body workaround; that is what this memory exists to stop."
metadata: 
  node_type: memory
  type: project
  originSessionId: 21592230-06ea-476f-b7cd-e40061b85574
  modified: 2026-08-21T13:37:30.511Z
---

## The answer first

**Post Notion comments with `mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-create-comment`.**
It works. `mcp__notionApi__API-create-a-comment` does not, and never will in this setup:

```
{"status":400,"code":"missing_version",
 "message":"Notion-Version header failed validation: Notion-Version header should be defined,
            instead was `undefined`."}
```

That is the `notionApi` wrapper failing to send a required header. **No payload shape fixes it.**
Tried and identical: `parent` as `{page_id}` object vs. bare string; `rich_text` as
`[{text:{content}}]`, `[{type:"text",text:{content}}]`, and `["string"]`. Retried an hour later
and after a push. Always the same.

This is already the standing preference — see [[feedback-prefer-notion-oauth-connector]]
("MCP server is fallback-only") — and it names this exact failure.

## The expensive part, which is the actual lesson

The `missing_version` error is *convincing*. It reads like a transient server-side outage, and
`mcp__notionApi__*` reads like "the Notion MCP server". On 2026-08-21 that led to: four retries, a
`SearchSkills`/browser-fallback detour, a founder question about which Chrome to drive, and finally
a **page-body workaround** — sign-offs appended as blocks instead of posted as comments, with a
callout explaining the deviation. All of it unnecessary. A peer session had posted ~10 comments to
the same page that same day through the OAuth connector without a single failure.

The tell that was missed: **reads, `API-post-page`, `API-patch-page` and `API-patch-block-children`
on that same server all worked.** A real outage does not fail exactly one endpoint. That should
have prompted "wrong server", not "broken endpoint".

Cross-reference [[feedback-search-memory-before-accepting-a-tool-failure-as-fatal]] — the memory
index already carried the answer, and it was not consulted before designing a workaround. **A tool
error that looks infrastructural is precisely when to search memory, not to start engineering
around it.**

## Practical notes for the OAuth connector

- It takes `markdown`, which renders **inline** formatting (bold, italic, code, links). Headings,
  lists and tables are stored as plain text — fine for sign-offs, don't fight it.
- `notion-get-comments` **cannot see replies** nested under a top-level discussion, so a
  successfully-posted comment often will not appear when you read back. The create call returning
  `{"status":"success","id":...}` IS the confirmation. See
  [[project-survivorpulse-notion-create-comment-write-path-defect]] — chased across two sessions
  before being understood.
- The 2,000-character limit is per `rich_text` element on the REST paths; oversize is a clean
  `validation_error` naming the length and the write is rejected atomically, nothing partial lands.

## What `mcp__notionApi__*` is still fine for

Page creation, property updates, block append/delete. All verified working the same session. So
"the notionApi server is broken" is too strong — it is comment creation specifically.

Related: [[project-survivorpulse-notion-page-read-truncates-rich-text]].
