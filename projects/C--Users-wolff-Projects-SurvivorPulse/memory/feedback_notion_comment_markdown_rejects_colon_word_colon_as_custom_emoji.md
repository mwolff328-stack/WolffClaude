---
name: feedback-notion-comment-markdown-rejects-colon-word-colon-as-custom-emoji
description: "A Notion comment whose markdown contains `:word:` (e.g. `isAdmin:false: shown`) fails with 400 'Unsupported mention type in markdown: custom_emoji'; nothing is posted."
metadata:
  node_type: feedback
  type: feedback
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-02T12:38:13.204Z
---

`notion-create-comment` (OAuth connector, `markdown` parameter) parses any `:word:` span as
custom-emoji syntax. A comment that contained `... isAdmin:false: shown ...` was rejected with
`validation_error: Unsupported mention type in markdown: custom_emoji. Supported mention types
are: user, page, database, date.` (2026-10-02, relaying a QA persona's report on SST-1789).
The call is atomic: nothing was posted, so re-sending after the fix cannot duplicate.

**Why:** code-style identifiers in ticket comments (`isActive:true`, `role:"USER"`, TS object
shorthand) are exactly the shape the emoji parser grabs when a value is followed by another
colon. The error message names "custom_emoji", which reads like an emoji problem rather than a
text-formatting one, so it is easy to misdiagnose as a connector outage.

**How to apply:** when writing a comment that quotes code or test fixtures, use `=` or a
space instead of `:` between identifier and value (`isActive=false`), and never end a value
with a colon right before more text. Check the text for any `:xxx:` pairs before sending. If a
400 mentions custom_emoji, fix the text and re-send; do not fall back to `notionApi`. Related:
[[feedback_prefer_notion_oauth_connector]].
