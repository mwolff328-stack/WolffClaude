---
name: feedback_a_green_test_certifies_its_stale_comments
description: A test that hand-builds the shape it claims a call site uses cannot notice the call site changed — and its green run lends false authority to the stale comment.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8788757e-2bea-49b0-9e4d-4e45ebb5f3f3
  modified: 2026-08-01T20:54:35.562Z
---

`entryRecommendationsCacheDiscriminator.test.ts` (SST-1007) said in the present tense that PickGrid's Ranked view fetches `availableOnly: true`, and called line 97 "the ACTUAL 5-arg call shape PickGrid.tsx uses post-fix". That died at commit `2dddde5e` (SST-1158, labelled SST-1159 in code), **74 commits** before anyone noticed. The suite stayed 5/5 green the entire time — before the correction and after it.

It stayed green because the test **constructs both query keys itself** from `queryKeys.entries.optimizerRecommendations(...)`. It never reads a call site. So it pins the key FACTORY (a real, still-live invariant: distinct discriminator values must yield distinct cache entries) while its prose claims to mirror a caller that had moved. Nothing typechecks a comment, and nothing tied the fixture to the thing it named.

**Why:** the cost was a real review cycle. These comments were cited as evidence in SST-1179's AC-9 review and sent the reviewer chasing a "differing availableOnly fetch filter" mechanism that was already dead code. A passing suite next to a confident comment reads as corroboration — green is the strongest possible endorsement of a false narrative, and it is entirely unearned when the test never touches what the comment describes.

**How to apply:**
- Before citing a test's comment as evidence about live code, **enumerate the call sites** (`grep` every caller of the key factory / helper, including default-argument callers that pass fewer args). Here that meant 9 `optimizerRecommendations(` and 2 `fetchEntryRecommendations(` sites — 7 of the 9 resolved the discriminator by *default*, invisible to a grep for the literal value.
- A comment saying "the ACTUAL shape X uses" is a **claim about a file it does not import**. Treat it as unverified. If a test hand-builds a fixture it calls a mirror of a call site, that mirror has no mechanism to break when the original moves.
- When a scenario in a test goes dead, the fix is usually **not** deletion: separate the MECHANISM (still live, keep guarding) from the PAIRING (historical, relabel). Say plainly that no live call site produces the value, so the next reader does not re-derive it.
- Check for the *second* staleness while you are in there: the same comments also named `SeasonGridSection.tsx` as a live reader, which SST-1120 had moved to a different key entirely. One rotted comment usually has company.
- Same disease as [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] and [[feedback_guard_the_wire_not_just_the_helper]]; the green-run twist is what makes it worse than a stale doc. Related: [[feedback_guard_the_wire_not_just_the_helper]], [[feedback_proving_a_test_is_load_bearing]].
