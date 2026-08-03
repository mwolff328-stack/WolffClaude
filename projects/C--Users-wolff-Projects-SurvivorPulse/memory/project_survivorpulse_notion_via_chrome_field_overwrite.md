---
name: project_survivorpulse_notion_via_chrome_field_overwrite
description: "Driving Notion through Chrome: a text property's editor closes between tool round-trips and the next keystroke REPLACES the field; and an unsent comment draft reads identically to a posted comment — verify by timestamp, not text"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4233dbd4-4c4f-4211-baa1-08c236605893
  modified: 2026-08-03T02:08:50.846Z
---

**⚠️ "Notion needs auth" in the startup banner does NOT mean there is no Notion MCP.** Measured
2026-08-02, and it cost a whole wedged-browser detour. The session banner listed
`plugin:customer-support:notion` under *"require authentication before their tools can be
used"*, which read as "no Notion MCP available" — so the session went to Chrome, typed into
SST-1206's title with `Ctrl+P`, and later wedged the renderer on a long `type`. A **different,
already-authorised** Notion server was present the whole time under an opaque id
(`mcp__d77c6777-…__notion-*`). Its tools were in the deferred list, not the auth-required list.
The two lists mean opposite things and are printed adjacently.

**So: before concluding Notion is Chrome-only, run `ToolSearch` for `notion` and read what comes
back.** A named plugin server being unauthenticated says nothing about whether an unnamed one is
connected. Same reasoning applies to any capability the banner appears to deny — the deferred
list is searchable, the auth-required list is not, and only the second is a real "no".

**Try the MCP server FIRST — Chrome is the fallback, not the default.** Measured 2026-08-02:
`notion-update-page` with `command:"update_properties"` wrote a multi-thousand-character
**Acceptance Criteria** and **Test Cases** in ONE call, newlines and all, and a re-fetch confirmed
both landed intact. Every trap below then simply does not apply. The MCP server being "unavailable"
had become an assumption carried between sessions rather than a fact — check it, because the cost
of not checking is an hour of `browser_batch` plus a silently destroyed field. Chrome is still
needed for anything with no MCP equivalent (reading a rendered page, clicking a UI affordance).

When the Notion MCP server genuinely is unavailable, board reads and writes go through the
founder's Chrome. Two traps, both measured on 2026-08-01 while grooming SST-1219.

**1. A text property field silently OVERWRITES across tool round-trips.**
Notion's property editor closes on its own during the gap between two `browser_batch` calls.
The next `type` action re-opens it with the existing value **selected**, so the first keystroke
replaces the whole field. Typing AC-1..AC-5 in one batch and AC-6..AC-9 in the next left the
field holding a stray `A` plus AC-6..AC-9 — AC-1..AC-5 were gone. The next field's text then
landed nowhere at all, and Test Cases read `Empty`.

The failure is silent and looks like the text "didn't go in", which sends you hunting for a
click-coordinate problem. It is not: the click was fine, the content was destroyed on re-entry.

**How to apply:**
- **Fill each property field inside ONE `browser_batch`**: click → type → `shift+Return` → type
  → … → `Escape`. Never split one field across calls.
- Keep each `type` under ~250 chars. A ~560-char single `type` exceeds the 30s CDP
  `Input.dispatchKeyEvent` timeout and reports failure — **but the text usually lands anyway**,
  so re-sending it duplicates the sentence. Screenshot before retrying, never retry blind.
- `shift+Return` for newlines; a bare `Return` closes the editor (and in a comment box, sends).
- Insert `wait 1` between lines on long fields. Without them Notion throws
  *"There was an issue persisting your edits"* and then blocks navigation with a
  **"Leave site?"** dialog. Do not force past it — wait ~15s and the edits usually flush.
- **Re-read every field after writing it**, by reloading the page, not by trusting the
  post-write screenshot. The collapsed property view truncates, so a partially-destroyed field
  can look complete.

**2. `Ctrl+P` is NOT Notion search here — it types into the page.**
Intending to search, `Ctrl+P` did nothing and the query went straight into the open page's
TITLE, renaming SST-1206 mid-session. `Ctrl+Z` restored it exactly. Use the sidebar search
button, and screenshot to confirm a search modal is actually open **before** typing.

**3. An unsent comment DRAFT is indistinguishable from a posted comment in `get_page_text`.**
Measured 2026-08-02 posting a founder ruling on SST-1236. A ~2500-char `type` blew the CDP
timeout; the full text landed in the composer but was **never sent**. `get_page_text` rendered
that draft inline with the real comments, so the page read exactly as if the comment had
posted. The only tell is the **author line**: posted comments carry `Mike Wolff · <time>`,
a draft carries the avatar and the raw text with no name and no timestamp.

So "did my comment post?" needs a stronger check than reading the text back:
- **Click the send button explicitly** (the blue arrow at the composer's right edge) — do not
  assume a completed `type` posted anything, and never use bare `Return` to send a long
  comment you also want newlines in.
- **Verify by the timestamp, not the text.** Re-read and confirm `Just now` (or a time) plus
  the author name appears above it, and that the composer has reverted to its
  `Add a comment…` placeholder.

Two adjacent findings from the same attempt:
- **After the CDP timeout the renderer stays unresponsive for ~30-60s** — `screenshot` itself
  fails with *"Script injection timed out … the page is busy"*. That is the tab still chewing
  the keystrokes, not a crash. Wait it out; do not retry the type, or you duplicate the text.
- **A click on a `find`-returned comment-box ref may not focus it**, and the subsequent
  keystrokes are then swallowed *entirely* — zero text, zero damage. So "my text isn't there"
  now has two distinct causes: **swallowed** (harmless, retry) versus **landed-but-unsent**
  (retyping duplicates it). Screenshot to tell them apart before retrying.

**3b. The draft can be INVISIBLE, survive reloads, and later SPLICE two attempts into one
corrupted comment.** Measured 2026-08-02 on SST-1212, and it defeats the check in §3 above.
A ~4500-char `type` blew the CDP timeout and wedged the renderer for minutes. Reloading the page
showed **no draft and no comment** — so "verified by reload that nothing posted" looked
conclusive, and was reported to the founder twice. It was wrong. The keystrokes were buffered
below the UI: the draft persisted across two full navigations while rendering as nothing at all.
A later short retry typed into the same composer landed **at the cursor position inside the
buffered text**, and a single send then posted both as ONE comment spliced mid-word:

    …The TEST was corrected to assert the requirement; th[Claude — BUILD SUMMARY - landed
    78b9c9ed..d83c0f1c …]e code was then fixed to satisfy it.

So the §3 tell (author line / `Just now`) is necessary but **not sufficient**: it distinguishes
draft from posted, and cannot see a draft that renders as neither. Three consequences:

- **Absence of evidence is not evidence of absence here.** "I reloaded and nothing was there"
  does not mean nothing was typed. After any CDP timeout on a comment, assume text is buffered
  until a later successful send proves otherwise — and say so with that hedge, rather than
  reporting it as verified-clean.
- **Never type a second attempt into the same composer.** Clear it first (click in, `Ctrl+A`,
  `Delete`) or the retry is spliced into the invisible buffer instead of replacing it.
- **Keep comments short enough not to time out** (≲1500 chars). A long build summary belongs in
  a repo file with a short comment pointing at it — the failure mode above is unrecoverable
  without edit/delete rights, and it lands on a ticket that may already be `Done`.

Also: comment drafts survive across batches (unlike property fields) — which is precisely why
an unsent draft can masquerade as a posted comment. The page body is NOT the property field —
grooming content in the body fails the gate — and `Escape` inside a side-peek closes the whole
peek rather than the editor, so work full-page for property edits.

Related: [[feedback_survivorpulse_fetch_and_search_before_work]],
[[feedback_survivorpulse_shared_worktree_staging_discipline]].
