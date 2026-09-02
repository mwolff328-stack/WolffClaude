---
name: project_survivorpulse_workflow_step_names_are_parser_markers
description: A pre-publish.yml step NAME is hardcoded as a parser marker inside a tripwire test, so renaming a stage fails Stage 1 — nowhere near the file you edited.
metadata:
  type: project
---

`tests/rateLimitedIdentityReuse.tripwire.test.ts` reads `.github/workflows/pre-publish.yml`
at runtime. Line ~102 hardcodes the Stage 2c step's name verbatim:

```ts
const STAGE_2C_STEP_MARKER = "Stage 2c: HTTP integration tests (auth endpoints)'";
```

`getStage2cFiles()` finds that string, slices forward to the next `\n      - name:` (capped at
`STAGE_2C_BLOCK_MAX_CHARS = 4000`), and regexes the test filenames out of the block. It **throws**
`out of sync` rather than returning empty if the marker is missing — good design, and it means a
stage rename is a hard failure. A synthetic copy of the step name is also embedded in a meta-test
fixture (~:1002), so a rename must be made in at least three places.

**Why:** the failure surfaces in **Stage 1 (unit)**, not in the stage you renamed, so the stack
trace points at a rate-limiting tripwire while the actual cause is a YAML label. During SST-1509 the
Stage 2c step name became inaccurate (the stage gained a non-auth suite) and renaming it was the
obvious tidy-up; it was left deliberately wrong instead, because the coupling costs more than the
inaccuracy. Same shape as [[feedback_a_shape_change_needs_a_shape_grep_not_a_name_grep]] — the
coupling is a string literal in a test, invisible to any search for the *workflow*.

**How to apply:** before touching any `- name:` in `pre-publish.yml`, grep the repo for that exact
step name. Adding or removing a FILE in a stage's list is safe — that meta-test asserts with
`expect.arrayContaining([...])` and `toBeGreaterThanOrEqual(8)`, carrying the comment *"a legitimate
9th Stage-2c file must not break this meta-test"*. Renaming the STEP is not. Also watch the
4000-char slice cap when adding comment blocks near the step.

Related: [[project_survivorpulse_survivorpulse_source_text_guards_fooled_by_text]] and
[[feedback_source_scanning_guards_need_three_meta_tests]] — this guard is a rare good example, with
its own meta-tests and a loud-throw on marker loss.
