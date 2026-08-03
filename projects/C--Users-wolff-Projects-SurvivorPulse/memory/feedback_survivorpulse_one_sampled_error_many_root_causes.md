---
name: feedback-survivorpulse-one-sampled-error-many-root-causes
description: "A batch of identically-shaped test failures can have several root causes; read each failure's own error text and route before attributing the batch to one cause."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a88b9871-2ff9-4144-9eab-6b35bd21c12e
  modified: 2026-07-29T02:17:05.426Z
---

When many tests fail with the same-looking symptom, identify each failure's root cause from **its own error text and the route/service it came from** — never generalize one sampled message across the batch.

On SST-1088 (2026-07-28), 13 Stage 2a failures all read `expected 503 to be 200`. Only one printed a body, so `COCKPIT_DATA_ERROR` was attributed to all 13 and the earlier "no historical data" hypothesis was retracted as wrong. It was two causes on two routes:

- `/api/me/strategy/cockpit` → `COCKPIT_DATA_ERROR` — test cleanup nulling the shared current-season spread fixture.
- `/api/me/strategy/recommendation` → `STRATEGY_DATA_ERROR` — that route has **no** cockpit-error path at all; its only 503 is empty historical seasons.

Grepping each route handler for what actually emits 503 separated them in minutes.

**Why:** the retraction was itself the error. Discarding a correct hypothesis on evidence from a different test cost a ~30-minute CI cycle, and would have cost more had the "one root cause" framing been carried into the fix.

**How to apply:** before declaring a batch to share a cause, confirm each member hits the same code path — the failing endpoint/service, not just the same status code or assertion shape. When only some failures print a body, that is a sampling problem, not evidence. Fix the tests to surface the body (assert the diagnostic before the status) so the next run answers it. Same family as [[feedback_check_distribution_before_inferring_convention]]: don't infer the population from the one member you happened to see.

Related: [[project_survivorpulse_prepublish_gate_mechanism]], [[feedback_proving_a_test_is_load_bearing]].
