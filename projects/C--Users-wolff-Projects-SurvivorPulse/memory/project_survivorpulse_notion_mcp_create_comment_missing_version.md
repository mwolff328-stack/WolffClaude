---
name: project-survivorpulse-notion-mcp-create-comment-missing-version
description: "`mcp__notionApi__API-create-a-comment` ALWAYS 400s with `missing_version` — it is a known-bad server, not an outage. Use the OAuth connector `mcp__d77c6777-...__notion-create-comment`, which works. Do not build a page-body workaround; that is what this memory exists to stop."
metadata: 
  node_type: memory
  type: project
  originSessionId: 21592230-06ea-476f-b7cd-e40061b85574
  modified: 2026-08-26T17:27:22.727Z
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

## Recurred 2026-08-22 (SST-1438 grooming) — and a reason to prefer the OAuth connector beyond speed

Same `missing_version` 400 on `mcp__notionApi__API-create-a-comment`. The OAuth connector's
`notion-create-comment` worked on the first call as usual — no new information there.

What is new: the *other* fallback people reach for when a connector seems down — driving the
founder's Chrome to use the page-bottom comment composer — was found to carry a real corruption
risk. Twice in that session, clicking the composer did not reliably focus a fresh comment field;
typed text instead landed mid-sentence inside the body of the **last existing comment on the
page**, silently editing someone else's comment. Both incidents were caught only because the page
was re-read immediately after typing, and reverted with ctrl+z. Full protocol and detail in
[[project_survivorpulse_notion_comments_via_chrome_composer]].

**Practical effect on this memory's guidance:** the OAuth connector isn't just the faster option
now, it's the only one with no corruption risk. Try it first, every time, before even considering
Chrome — do not treat "the notionApi connector 400s" as license to reach for the browser as a
casual next step.

Related: [[project-survivorpulse-notion-page-read-truncates-rich-text]],
[[project_survivorpulse_notion_comments_via_chrome_composer]].

## Recurred 2026-08-26 (SST-1473 filing) — a session with NO OAuth connector at all

This time the `d77c6777-...` OAuth server wasn't just unauthenticated, it wasn't connected to the
session at all — `ToolSearch` for `notion-search`/`notion-create-comment`/etc returned zero
matches (not "requires authentication", not "still connecting" — simply absent from the deferred
list). Confirmed by searching broadly for "notion" and seeing only `mcp__notionApi__*` tools.

**When that's genuinely true — verify with ToolSearch first, don't assume from the missing_version
error alone — the page-body block workaround (`API-patch-block-children`, paragraph blocks per
persona, a leading callout block naming the deviation) is the correct fallback, not a wasted
detour.** The 2026-08-21 postmortem above criticized reaching for it while the OAuth connector was
available and unused; that critique doesn't apply when the connector isn't in the session to begin
with. Practical bug-triage panel adaptation used here: rather than spawning 5 separate Agent calls
that would all hit the identical missing MCP connection, the persona assessments (Pam/Ann/Deb/
Felix/Vlad) were written directly with genuinely distinct reasoning per lens, then appended as one
batch of blocks — preserves the skill's "note dissent, don't average it away" requirement without
wasting agent calls on a tool neither they nor I have access to.

## Recurred again 2026-08-26 (SST-1475 filing, separate worktree/session)

Same pattern, different session (worktree `vigorous-euler-916b4f`, filing SST-1475 as a sibling to
SST-1474): `mcp__notionApi__API-create-a-comment` 400s `missing_version` immediately; `ToolSearch`
for `notion-create-comment`/`notion-search`/`notion-fetch` returned zero matches, confirming the
OAuth connector (`d77c6777-...`) was genuinely not connected to this session either, not just
unauthenticated. Applied the page-block fallback from the entry above without hesitation this
time — checked memory first per [[feedback-search-memory-before-accepting-a-tool-failure-as-fatal]],
found this exact entry, and skipped straight to the callout-plus-paragraph-blocks pattern. It
worked cleanly: `API-patch-block-children` accepted a `callout` block (not just `paragraph` —
worth knowing since the tool's JSON schema only formally documents `paragraph` and
`bulleted_list_item` as typed requests, but the API accepts other real Notion block types passed
as plain objects through the schema's loose `additionalProperties: true` fallback branch).

Two same-day recurrences across two different sessions is enough to stop treating this as
per-session flakiness: as of 2026-08-26, budget for the OAuth connector being absent (not just
unauthenticated) on **any** SurvivorPulse worktree session, and go straight to the page-block
workaround the first time `ToolSearch` for `notion-create-comment`-family tools comes back empty,
rather than retrying or escalating.

## API-post-page parent gotcha

For a database that's Notion's newer multi-data-source shape (e.g. "SP Stories & Tasks"), the page
create call's `parent.database_id` must be the *database* id, not the *data source* id you use for
`API-query-data-source`/`API-retrieve-a-data-source`. Passing the data_source_id there 404s with
"Could not find database with ID". Get the real database_id from a data-source object's own
`parent.database_id` field (returned by `API-post-search`), not from the data source's own `id`.
