---
name: feedback_notion_comment_anchor_must_match_exactly_one_span_use_full_block_text
description: "notion-create-comment selection_with_ellipsis 'start...end' fails 'Multiple matches' when several spans fit; the error dumps the whole page; use the exact full block text instead. A failed anchored call posts nothing."
metadata:
  node_type: feedback
  type: feedback
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-02T23:20:52.879Z
---

Per Operating Model 4.4, every comment after the first on a story must be ANCHORED to specific page content
(`selection_with_ellipsis`), each creating its own discussion. On SST-1797 two anchors failed with a 400
`Multiple matches found: 2 occurrences of <pattern>` because `"Pam: scope...(round 1 done)"` and
`"Felix: architecture review...in progress)"` could each end at more than one place in the page. The error
echoes the ENTIRE page body (tens of thousands of characters) into context. Nothing is posted on failure,
so a retry cannot duplicate.

**How to apply:** prefer the EXACT FULL text of one short block with no ellipsis (e.g. `Pam: scope, Size, Priority
(round 1 done)`), or a start...end where the end text is unique. Anchors that worked: a distinctive bullet line
("Ann: Description and Acceptance Criteria"), a heading ("Approvals Required Before Dev"). Page bodies for
stories that only have property fields (empty body) have nothing to anchor to: put a short scope/owners
section in the body first (see SST-590's layout) so later comments can anchor. Related:
[[feedback_notion_comment_markdown_rejects_colon_word_colon_as_custom_emoji]].
