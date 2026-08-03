---
name: feedback_source_scanning_guards_need_three_meta_tests
description: "A test that greps source for a required token fails silently four ways — prose satisfies it, multi-line registrations read as absent, a floor below the current count stays green, and ONE NUL byte makes the file invisible to ripgrep entirely."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 29ab28e5-1bde-4292-b74b-031f40ea1c5c
  modified: 2026-08-02T07:04:14.515Z
---

SurvivorPulse enforces several invariants by scanning `server/routes.ts` for a
required middleware token (`adminRoutesRequireAdminGuard`, and the auth guards
added in SST-1139/SST-1147/SST-1149). This class of test is worth writing — it
catches "one missing word in a 13k-line file" that no reviewer reliably spots —
but it fails silently in four specific ways, each needing its own meta-test:

1. **Prose must not satisfy it.** `expect(source).toMatch('requireUnifiedAuth')`
   stays green with every guard deleted, because the token appears in the file's
   own header, in comment blocks above the routes, and in the test's own doc
   comment. Anchor on the `app.VERB(path, guard)` **syntax** and add a test that
   feeds a comment-only mention above an unguarded route.
   ⚠️ Assert "the captured token is NOT in the guard list", never a specific
   value: for `app.get('/x', async (req,res) => …)` the capture is `async`, not
   `''`. A `toBe('')` assertion fails on correct code.

2. **A per-line regex cannot see a multi-line registration.** `app.post(`
   followed by the path on the next line (the Stripe webhook in `server/index.ts`
   has this shape) is reported as ABSENT rather than as unguarded — the worst
   outcome, since absence looks like "nothing to check". Add a meta-test with a
   multi-line fixture.

3. **The non-empty-scan floor must equal the CURRENT count, not sit below it.**
   A floor of `>= 7` against 8 registrations stays green when a guarded route is
   deleted. Same hazard in reverse for a shrink-only ratchet: make the floor move
   with the count.

4. **A single NUL byte in a source file makes it invisible to the scanner.**
   Measured 2026-08-01 (SST-1219): I wrote a Map grouping key as
   `` `${season}\0${week}\0${type}` `` and the `\0` became two REAL 0x00 bytes in
   the committed file. Consequences, both verified:
   - **ripgrep skips the file silently.** `rg -l parseSpreadDecimal server/services/odds/`
     returned only `spreadCascade.ts`, omitting the module whose *line 1* is that
     import. Targeted, rg says "binary file matches (found \0 byte around offset
     4832)"; `--text` finds it. So an `rg`-based guard reports **no violations**
     because it never read the file — fail-open, and indistinguishable from clean.
   - **git classifies it binary**: `Bin 0 -> 8149 bytes, 0 insertions(+)`. No diff,
     no blame, no textual merge — permanently, and `.gitattributes` `*.ts text
     eol=lf` does NOT help (`text` governs EOL normalization; binary-ness is the
     NUL heuristic unless the `diff` attribute is set).

   A peer session scanned all 1929 tracked source files: it was the only one.
   Note `scripts/check-imports.js` and friends use `fs.readFileSync(…, 'utf-8')`,
   which reads NULs fine — so the repo's *current* guards were safe and this was
   latent. Any future `rg`/`grep`-based guard would not be.

   **How to apply:** never use `\0` as an in-string delimiter — `|` or `\x1f` are
   as unambiguous and stay text. When a guard reports zero findings over a
   directory you expect hits in, check `rg --files <dir>` against `git ls-files`
   before believing it. And note the fix's own commit still shows as `Bin`,
   because a commit is undiffable if EITHER side's blob is binary — that is
   expected, not an incomplete fix.

   ⚠️ **Write the recurrence guard with BYTE READS, never with ripgrep** — an
   rg-based NUL scan skips exactly the files it exists to find. `git ls-files -z`
   → `readFileSync` → test for `0x00`. Guard its mechanism on hard-coded buffers
   too: the repo is clean, so a repo-only assertion passes under a broken detector.

   **Detecting it, and reading the aftermath.** Suspect a NUL whenever `git show
   --stat` reports `Bin` for something that should be source, or shows
   `0 insertions(+), 0 deletions(-)` on a file you know changed. Confirm the fix
   with `git diff --numstat` on the working copy — a probe line yields real `2 0`
   counts once the NULs are gone. Verify by **restored ripgrep visibility**, which
   is the actual proof, not by reading the commit message. Scope at the fix:
   0 of 2001 tracked files contained a NUL; runtime behaviour was always CORRECT
   (NUL is a legal JS string char and works as a Map-key separator) and the
   pre-publish gate was green with the file in place — so no test can catch this
   class, only a byte-level check can.

   ⚠️ **And the mistake that travelled further than the defect.** I reported
   "every source-scanning guard in this repo was fail-open on that file." FALSE,
   and a peer session measured it: this repo's guards use `fs.readFileSync`, which
   decodes the NUL-bearing blob to a normal string — `'parseSpreadDecimal' in s`
   is True. The only `grep`-based tripwire is scoped to `client/src`. The finding
   was real; the blast radius was **inferred from one tool's result rather than
   measured against how each guard actually reads files**. One tool's blindness is
   not every tool's blindness. The overstatement reached a founder-facing report
   before the retraction did, because the sweeping version is the quotable one —
   so state blast radius as what you measured, and name the tool you measured with.

Two further traps for the ratchet variant: a baseline can quarantine a genuinely
unguarded route as "known bad" instead of forcing a fix — carry a
NEVER_BASELINE_PREFIXES list for the sensitive prefixes; and scan **both**
`server/routes.ts` and `server/index.ts`, since routes are registered in both
(see [[project_survivorpulse_split_route_registration]]).

Related: [[feedback_survivorpulse_source_text_guards_fooled_by_text]],
[[feedback_proving_a_test_is_load_bearing]]
