---
name: project-survivorpulse-notion-create-comment-write-path-defect
description: "There is no notion-create-comment write defect — that was chased across two sessions and six live attempts and was wrong. The REAL defect: notion-get-comments cannot see replies nested under a top-level comment, in ANY mode (include_all_blocks, include_resolved, discussion_id-scoped all fail identically). Verify comment presence by looking at the actual Notion page, not this tool."
metadata: 
  node_type: memory
  type: project
  originSessionId: c700945e-e36b-49ee-9783-d7015cd92910
  modified: 2026-08-03T04:23:34.435Z
---

**FINAL, 2026-08-03 — read this whole entry before touching Notion comment verification again.
Two prior versions of this memory (both written in the same investigation, hours apart) reached
confident wrong conclusions. This version was only reached because the founder opened the actual
page and looked.**

## What's actually true

**There is no `notion-create-comment` write-path defect. Every attempted write succeeded,
including all five original SST-1206 attempts and a sixth diagnostic one.** They landed as
**replies** nested under the page's one pre-existing discussion thread (Notion appends a new
comment to an existing discussion rather than starting a fresh one — normal behavior). Confirmed
directly: the founder clicked "Show 18 replies" on the live page and found Ann's business
acceptance, Vlad's QA sign-off, and Felix's round-5 build summary genuinely there, plus the live
diagnostic comment from this session.

**The real defect: `notion-get-comments` cannot see replies, in any configuration tried.** All of
the following returned the exact same wrong answer — `comment-count="12"`, 12 `<comment>`
elements, ending at the same 2026-08-02T08:53:20 comment, no replies included:
- Default call
- `include_all_blocks: true` (this flag governs block-anchored vs. page-anchored *discussions* —
  a different axis from replies-within-one-discussion; it does not touch this bug)
- `include_resolved: true`
- Scoped directly via `discussion_id` to the exact discussion the replies belong to

`notion-search` was also tried as an independent check and was inconclusive — it's a semantic
search over page content, not a comment-content grep, so it doesn't reliably confirm or deny a
specific comment's presence either way.

## How the misdiagnosis happened, so it isn't repeated

1. **Round 1 (prior session, 2026-08-02):** `notion-create-comment` succeeds, returns an ID.
   `notion-get-comments` shows no change (because it can't see replies — unknown at the time).
   `notion-fetch` on the returned comment ID 404s (because comments aren't fetchable that way at
   all — also unknown at the time). Both signals looked like confirmation of a failed write. They
   weren't. Repeated 4 more times with the same false result, reasonably read as overwhelming
   evidence.
2. **Round 2 (this session, earlier):** Correctly identified that `notion-fetch` on a comment ID is
   invalid (proved with a controlled test on a fresh page — comment genuinely there per
   `get-comments`, yet `notion-fetch` on its ID still 404'd). This was real progress. But the
   *replacement* verification — `notion-get-comments` — was trusted without the same scrutiny,
   because on a **brand-new page with no prior discussion**, a freshly-created comment starts its
   *own* discussion and is trivially visible; there was no existing thread for it to become an
   invisible reply *within*. The control test's design accidentally avoided the exact condition
   (an existing discussion to reply into) that triggers the real bug. Six live attempts, a caching
   hypothesis raised and correctly ruled out, a page-specific-defect theory built and reported with
   real confidence — all wrong, because the one tool used to verify every single test was itself
   blind to the thing being tested.
3. **What broke the loop:** the founder opened the real page in a browser and looked. No API call
   in either session ever would have surfaced this — every verification path available
   (`notion-get-comments` in all modes, `notion-fetch`, `notion-search`) has a blind spot that
   covers this exact scenario.

## How to apply

1. **Do not trust `notion-get-comments`'s count or content as complete when a page already has an
   existing discussion thread.** It appears to report only top-level/opening comments per
   discussion and silently omits replies, with no error, no truncation flag, and no working
   pagination parameter in the exposed tool schema.
2. **There is currently no known reliable MCP-only way to verify a comment landed on a page that
   already has a discussion thread.** If a `notion-create-comment` call returns success and the
   page already had prior comments, treat its landing as unconfirmed by any tool call and unlikely
   to be provably wrong either — the honest state is "probably fine, unverifiable via MCP." Ask a
   human to check the actual page before concluding a write failed.
3. **Never diagnose "notion-create-comment doesn't work" from a `notion-get-comments` /
   `notion-fetch` mismatch alone.** Both have known, separate blind spots (this entry; and comment
   IDs are never fetchable via `notion-fetch`, ever). Escalate to a human looking at the real page
   before writing up a "confirmed defect."
4. If you're testing this kind of thing yourself: **a control test on a brand-new page does not
   exercise the reply-visibility bug**, because a new page has nothing to reply into. Test on a
   page that already has an existing comment thread, or the control proves nothing about the real
   scenario.
5. This is a **fourth**, distinct Notion failure mode in this project's history — do not conflate
   with the other three:
   - **No connector at all**: `plugin:customer-support:notion` needs OAuth in a non-interactive
     session. Stage in `pending-notion-tickets/` and move on.
   - **Header rot** — see [[feedback_staged_ticket_headers_rot_into_harmful_instructions]]. The
     write succeeded; a staging file's header wasn't updated. SST-1211, SST-1232.
   - **The `notion-fetch`-on-a-comment-ID false signal**: always 404s, proves nothing either way,
     comments simply aren't fetchable entities.
   - **This one**: `notion-get-comments` is blind to replies. The write is fine.

## What this means for SST-1206 specifically

Ann's, Vlad's, and Felix's round-5 review content genuinely is on the ticket, has been since
2026-08-02, and nothing needs to be reposted. The four "confirmed write-path defect" commits
(`c289c654`, `57c78f93`, `87e0fdd6`, `3da449e4`) and `pending-notion-tickets/2026-08-02-sst-1206-round-5.md`'s
original header are wrong; the file has been corrected in place (not deleted, per this project's
own convention for staging-file rot) with a prominent notice at the top.

Vlad's stated condition for Done — his and Ann's comments "confirmed via `notion-get-comments`" —
cannot be satisfied by that tool, period; it's blind to exactly this content. The *substance* is
satisfied (both are genuinely present, confirmed by direct page inspection). Whether that's enough
to move Status is the founder's call, not made here.

## Independently corroborated (2026-08-03, separate session)

A second, independent session hit the identical false-positive pattern on the same ticket
(five of its own `notion-create-comment` "success" responses, `notion-get-comments` stuck at
`comment-count="12"` across every documented mode including `include_all_blocks` +
`include_resolved` together) and, on being told the real mechanism, verified it by a THIRD
method this file didn't yet have: opened the live page in a real browser tab, clicked
"Show 18 replies" under the first comment, and read the reply thread's actual rendered text.
Found its own exact comment content there verbatim (matching its 5th attempt word-for-word,
including commit hashes), plus Vlad's and Ann's real round-5 sign-offs, also verbatim and
uncorrupted — closing the loop on content INTEGRITY, not just presence, which no prior check
in this file had established. `notion-get-comments` with every flag documented in this file
still returned the stale `comment-count="12"` at the same moment the browser showed 18
replies — so the blind spot is confirmed stable across sessions, not a one-time glitch.

The corrected posting convention (anchor new comments via `selection_with_ellipsis` rather
than bare `page_id` once a page already has a prior comment, so a reply doesn't nest
invisibly) is now the canonical process fix, documented in the Operating Model §4.4 — not
restated here to avoid two documents describing the same standard and drifting apart. This
memory stays the incident/mechanism record; the Operating Model is the authority on the
going-forward procedure.

## External research context (2026-08-02, kept for reference)

While chasing the false "write defect," found a real, currently-open, unrelated bug in
`makenotion/notion-mcp-server` on the same operation —
[issue #328](https://github.com/makenotion/notion-mcp-server/issues/328) /
[PR #329](https://github.com/makenotion/notion-mcp-server/pull/329): `create-a-comment` is missing
its `Notion-Version` header parameter, causing an explicit `400 missing_version`. That symptom
never matched what was observed here (always a clean success), so it was never the explanation —
noted here only in case it's independently useful, not as a lead worth chasing on this issue.

Related: [[feedback_staged_ticket_headers_rot_into_harmful_instructions]],
[[project_survivorpulse_notion_via_chrome_field_overwrite]],
[[project_survivorpulse_notion_sst_id_is_auto_increment]]
