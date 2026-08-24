---
name: feedback_sweep_for_the_class_not_the_change
description: "A behaviour change invalidates a CLASS of existing assertions — re-sweep after every behaviour change, not once at the start."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 606235bf-b91b-432d-b211-7da816a9d0aa
  modified: 2026-08-24T17:30:00.000Z
---

When a change flips a behaviour, existing tests asserting the OLD behaviour break as a
class. Sweep for the class, and re-sweep after **each** behaviour change — not once.

On SST-1097 (open access) I swept for paywall assertions and pinned four suites with
`vi.mock('@shared/accessMode', () => ({ OPEN_ACCESS_MODE: false }))`. Then I made a
*second* behaviour change (a bad beta code is ignored rather than rejected) and never
re-swept. The CI gate caught the fifth suite with four `expected 201 to be 400`.

The sweep is one command and it found a sixth file the same minute:

```bash
for f in $(grep -rlE "BETA_CODE_|SUBSCRIPTION_REQUIRED|active\)\.toBe\(false\)|\"/start\"" tests/); do
  grep -q "accessMode" "$f" && echo "PINNED $f" || echo ">> UNPINNED $f"
done
```

**Why:** local runs prove nothing here — ~171 tests self-skip without a DB, and the four
that broke were among them. Two full local runs (8558 passing) were green while CI failed.

**How to apply:** after every behaviour change in a slice, re-run the class sweep. Pin
old-behaviour suites to the old mode and label them as covering that branch — never
delete them; the gate is hidden, not removed, so the evidence it works must survive.


## Moving/deleting ROUTES: the discriminator is "does the guard ENUMERATE", not "does it mention your feature"

**Added 2026-08-24 (SST-1450 + SST-1446, two sessions cross-checking).** When a change
adds, deletes, renames or MOVES route registrations, the affected class is the set of
tests that read `server/routes.ts` as source text. Measured on this repo:

- **76 test files MENTION the path** (prose, comments) — a `grep -rln "server/routes.ts"`
  count is a mentions count, not a readers count. Do not report it as the latter.
- **~15-16 actually SCAN it.** Requiring a `readFileSync`/`readFile` call *plus* a literal
  `routes.ts` / `SOURCE_FILES` / `ROUTES_SOURCE` reference gets close, but is a FLOOR:
  it misses a reader going through a helper or a variable path. The reverse over-counts —
  "contains readFileSync AND mentions routes.ts" pulls in files that read a *different*
  file and merely mention routes.ts in a comment (that error inflated one count from 15
  to 18).

**The discriminator that actually predicts breakage:** *does the guard enumerate ALL
registrations?* Checked across 15 scanners while 6 routes were extracted into a new file:
"does the guard mention the moved feature" was **zero for all 15, including both that
broke**. "Does it enumerate the whole registration set" was true for 3 — and 2 of those 3
were the ones affected. Enumeration is the property; topical relevance is noise.

**Two failure modes when routes MOVE to a new file:**
1. The guard's `SOURCE_FILES` list does not include the new file, so those routes leave
   the scan **entirely** — not "counted with zero slack", *unchecked*. This never shows
   up as a count failure, because floors are `>=` and the count only falls.
2. A floor drifts below the true count and silently becomes fail-open. Measured here:
   `routesRequireAuthGuard`'s floor sat at 224 against a true count of 232 — 8 stale,
   i.e. 8 silent deletions absorbed — despite that file's own header insisting the floor
   must equal the CURRENT count.

**A guard that stops covering something STAYS GREEN.** So "the full suite passes" is not
evidence the other scanners are unaffected. Only reading them is. Prove coverage by
mutation: strip the guard argument off a moved route and confirm tests go red — measured
0 killed pre-fix vs 3 at baseline vs 3 after adding the file to `SOURCE_FILES`.

**Also:** exact-equality lists (`expect(setOfX).toEqual([literal list])`) are safe under
DELETION and hostile under RENAME — a deletion removes the entry from both the scan and
the expected array, a rename removes it from one side and adds an unrecognised key to the
other, producing a sorted-string-array diff that never says "rename".

Related: [[feedback_survivorpulse_source_text_guards_fooled_by_text]],
[[project_survivorpulse_prepublish_gate_mechanism]]
