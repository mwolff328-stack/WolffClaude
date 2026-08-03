---
name: feedback_sweep_for_the_class_not_the_change
description: "A behaviour change invalidates a CLASS of existing assertions — re-sweep after every behaviour change, not once at the start."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 606235bf-b91b-432d-b211-7da816a9d0aa
  modified: 2026-07-29T08:06:01.196Z
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

Related: [[feedback_survivorpulse_source_text_guards_fooled_by_text]],
[[project_survivorpulse_prepublish_gate_mechanism]]
