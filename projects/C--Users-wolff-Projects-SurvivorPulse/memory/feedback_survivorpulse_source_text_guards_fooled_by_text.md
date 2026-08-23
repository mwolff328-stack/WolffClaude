---
name: feedback_survivorpulse_source_text_guards_fooled_by_text
description: "Guardrails that assert about CODE by grepping FILE TEXT get fooled by text that isn't code — comments, docstrings quoting the old pattern, and compiled build output. Assert on syntax, exclude build output, be wary of regex comment-strippers. Also: a PER-FILE guard makes extracting to a shared helper a breaking change — inject the guarded call instead of moving it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 515ac9ce-220f-4755-b974-8f44a68dacc8
  modified: 2026-08-23T16:31:11.639Z
---

SurvivorPulse has many `readFileSync` + `expect(source).toMatch(...)` guardrails. They are cheap and catch real architectural regressions, but they share one failure mode: **an assertion about code, evaluated against text, fooled by text that is not code.** Five confirmed instances on 2026-07-28 alone, across two branches and two sessions:

1. **A comment cross-referencing a file.** `tests/e2e/mobile-responsive.e2e.test.ts` banned the bare string `MobileAccountDrawer` in `TopBar.tsx`. A comment naming the mobile half of the account menu failed a guard whose own name says "does NOT **mount**". Cost a full gate cycle.
2. **A docstring quoting the pattern it replaced.** An inventory grep for files still using the old `TEST_DISABLE_NETWORK` gate matched the *new* guard file, because its docstring quotes the old pattern to explain what it supersedes.
3. **Compiled build output counted as source.** `tests/entryDeleteLastEntryMessage.tripwire.test.ts` scans `server/**` for a duplicated string literal; the built bundle in `server/public/` counted as a second *source* declaration. Its exclusion list covered `node_modules|dist|build|__tests__` but not build output. (Gitignored ⇒ never in CI ⇒ looks like a real regression **locally only**.)
4. **My own new guardrail vs. my own docblock.** `not.toMatch(/import\.meta\.env/)` on a visibility module failed because the module's docblock *describes* the retired env gate in prose.
5. **The regex comment-stripper itself — the nastiest.** Stripping `/\/\*[\s\S]*?\*\//g` to fix (4) then swallowed real code, because a comment containing `/admin/*` has `/*` in it, which opens a bogus match that runs to the next `*/`. This *removes* code rather than adding a false hit, so the assertion silently finds nothing and **passes**.

**Sibling failure mode, opposite direction:** a per-line scan can be blind to code that spans multiple lines (matches too *little* rather than too much) — see [[feedback_source_scanning_guards_need_three_meta_tests]] for the multi-line-registration instance of this same "assert on syntax, not identifiers, and add an adversarial fixture" discipline. That file also documents its own independent "prose satisfies a route-guard scan" instance — same mechanism as case 1 below, different concrete guard.

**How to apply — in preference order:**
1. **Assert on syntax, not identifiers.** `not.toMatch(/import\s[^;]*Foo/)` and `not.toMatch(/<Foo\b/)` beat `not.toMatch(/Foo/)`. A comment may reference a symbol; code may not import or render it. This is strictly *more* precise, not weaker, and needs no stripping.
2. **Exclude build output explicitly** in any walk of `server/**` or `client/**` — `server/public/` and `dist/` are gitignored, so this class of failure reproduces locally and never in CI.
3. **Reach for comment-stripping last**, and never with a naive `/\*...\*/` regex. If unavoidable, verify the stripped text still contains the code you expect before asserting on it.
4. **Word nearby comments defensively.** When a doc comment must name the banned token, expect the guard to see it.

**Why (1) outranks (2) and (3), stated as a principle:** excluding paths and stripping comments are both *subtractive* — they make the guard match **less**, so a mistake in either **fails open** and the guard silently stops guarding (instance 5 is exactly this). Tightening to syntax makes it match **more precisely**, so a mistake **fails closed** and shouts. When choosing between fixes, prefer the one whose failure mode is loud.

**Same family, beyond guardrails:** the pre-publish gate's skip-accounting block parses vitest's *rendered* output and printed its header with no numbers because it stripped ANSI codes after matching rather than before (fixed `5cbd2053`) — an assertion about a run, evaluated against its text rendering.

**Diagnostic tell:** a content guard fails against code that is obviously correct on inspection. Before debugging the code, check whether a comment, docstring, or build artifact contains the token. See [[feedback_survivorpulse_gate_page_not_viewer]] for the companion lesson on proving which guard tests are load-bearing.

## A PER-FILE source guard makes "extract to a shared helper" a breaking change

The failures above are all a guard matching **wrongly**. This one is a guard working **correctly** and constraining a legitimate refactor — and it is easy to miss because the obvious design is the one that breaks it.

`tests/e2eSpecPoolTagging.tripwire.test.ts` requires, for every `e2e/*.spec.ts` that creates a pool, **both** an import from `helpers/specPoolTag` **and** a call to it — *in that same file* — and it enumerates with `readdirSync(E2E_DIR)`, i.e. **non-recursively**. Both properties are deliberate and good: the import-plus-call pairing is what stops it going fail-open on a rename, and the flat scan keeps it from coupling to files it doesn't own.

The consequence is not obvious until you try it: **a helper cannot satisfy that requirement on a spec's behalf.** Deduplicating four copies of a wizard `fillStep1` by moving the `fillPoolDescriptionWithRunTag` call into `e2e/helpers/poolWizardStep1.ts` would have stripped the import *and* the call from all three submitting specs, and turned the tripwire red — correctly, because it could no longer see that they tag at all. The helper is never scanned; it isn't a `.spec.ts` and isn't in the enumerated directory.

**The fix is to keep the guarded call in the guarded file, not to weaken the guard.** Inject it: the shared helper takes the description fill as a **callback** (`fillDescription: (page) => fillPoolDescriptionWithRunTag(page, note)`), so each spec keeps its own import and call site while the helper owns the *order* and the *count*. Coverage then splits cleanly along what each instrument can actually see — the tripwire keeps guarding "a spec forgot to tag", and a unit test on the helper guards "the description is written exactly once", which the tripwire is structurally blind to.

**How to apply, generally:** before extracting anything out of a file that a source-shape guard scans, check the guard's *enumeration* (recursive or flat? which glob?) and whether it demands import **and** call in the same file. If it does, the extraction must leave the guarded token behind — pass the guarded operation in rather than moving it out. And per [[feedback_guard_the_wire_not_just_the_helper]], prove the guard still has teeth *after* the move: sever one call site, confirm it goes red **naming that file**, restore, confirm green. A tripwire that was load-bearing before a refactor is not automatically load-bearing after it.
