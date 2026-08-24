---
name: feedback_jsdom_normalises_inline_styles_two_traps
description: "jsdom rewrites inline styles before a test can read them - it DROPS a `border` shorthand whose colour is a var(), and normalises hex to rgb(), which silently makes both the guard and its must-NOT twin unassertable or vacuous."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 44cf1269-ac61-4fe9-a466-5952719b4f33
  modified: 2026-08-24T16:42:44.922Z
---

Two traps, discovered together in SST-1451 (moving My Pools card view onto `--sp-elevated`). Both are invisible in review — the test reads correct and names its requirement correctly.

**1. jsdom DROPS a `border` shorthand whose colour is a `var()`.** Measured:
`<div style={{ border: "1px solid var(--sp-border-standard)" }}>` yields `el.style.border === ""` and no `border:` in `getAttribute("style")` **at all**. Not a wrong value — the declaration vanishes. Any test guarding it asserts against an empty string. Real browsers handle it fine, so this is purely a test-visibility problem and it is easy to mistake for "the style didn't apply."

`borderTop`, `borderLeft`, and the `borderWidth`/`borderStyle`/`borderColor` longhands all SURVIVE with a `var()`. So the workaround is a shape change in the production code:
```
borderWidth: "1px", borderStyle: "solid", borderColor: "var(--sp-border-standard)",
borderLeft: `3px solid ${accent}`,   // last, so the accent still wins the left edge
```
Computed output is identical — provable, because `borderWidth` serialises to `"1px 1px 1px 3px"` under BOTH spellings. Pin that with a control test so the equivalence is a measurement, not a claim.

**2. jsdom normalises an inline hex to `rgb()`, which makes `.not.toMatch(/#[0-9a-f]{3,8}/)` VACUOUS.** `background: "#1e293b"` reads back as `"rgb(30, 41, 59)"`, so a hex regex never matches and the assertion passes under the broken implementation exactly as happily as under the fixed one. It was caught only because the RED run was actually performed — it passed when all its siblings failed. State the requirement positively instead: `expect(style.background).toMatch(/^var\(--[a-z0-9-]+\)$/)` — "is a design-token reference" fails on a literal colour.

**Why:** both traps produce a green test that has never been able to fail, which per [[feedback_proving_a_test_is_load_bearing]] proves nothing. Trap 2 is the same family as the hex/rgb confusion in any computed-style assertion; trap 1 is worse because it makes the correct-looking code shape unguardable rather than merely unguarded.

**How to apply:** before asserting on ANY inline style in a jsdom test, run a throwaway probe that renders the exact style object and dumps `getAttribute("style")` plus the individual `el.style.*` getters. Two minutes, and it tells you which properties survive and in what serialised form. Then derive the expected value from the collaborator rather than restating it — SST-1451's parity tests parse the token out of the shared `<Card>` primitive's own className at runtime, so the test goes red if EITHER side drifts. See [[feedback_guard_the_wire_not_just_the_helper]] for the same instinct applied to call sites, and [[project_survivorpulse_hover_shade_over_inline_backgrounds]] for the related fact that inline backgrounds beat `:hover` CSS in this codebase.
