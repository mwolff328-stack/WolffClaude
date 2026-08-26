---
name: project-survivorpulse-usage-event-await-vs-fire-and-forget
description: "logCockpitUsageEvent has THREE call sites in server/routes.ts; two are correctly fire-and-forget (GET /api/me/strategy/cockpit's recommendation_viewed, the entries-connected route's entries_connected), one MUST be awaited (POST /api/me/gameplan/events, SST-1478) -- don't generalize either way by analogy."
metadata:
  type: project
  originSessionId: 8b8b496f-ec1f-4ddc-94fc-6d0c171b830d
  modified: 2026-08-26T20:51:18.204Z
---

`server/services/cockpitUsageEventLogger.ts`'s `logCockpitUsageEvent` never throws (catches all its own errors internally) — every call site is safe to `await` from a correctness standpoint. Whether to actually await it is a per-route judgment call, not a fixed convention, and the two existing patterns look interchangeable but aren't:

- **GET /api/me/strategy/cockpit** (`recommendation_viewed`) and the entries-connected route (`entries_connected`): fire-and-forget, and their own tests (`tests/strategyRecommendation.cockpit.sst788.integration.test.ts:550-554`, `tests/cockpitEntries.sst789.integration.test.ts:446-450`) correctly poll for the row rather than assuming synchronous consistency. Legitimate: the response's real payload is the recommendation/entries data; the event write is incidental secondary telemetry riding along. Blocking the response on it would add latency for zero correctness benefit.
- **POST /api/me/gameplan/events** (`no_line_week_interaction`): must be awaited (fixed in SST-1478, commit `f2bd9774`, 2026-08-26). This endpoint has no other payload — the event write IS the entire contract of a 204 response. Left fire-and-forget, a 204 asserts nothing: the HTTP loopback response reliably beats a remote Neon insert, so a caller reading the event back immediately after 204 found 0 rows (`tests/gameplanEvents.sst812.integration.test.ts:127`), deterministically under CI, not as a rare flake.

**Why this matters:** a future session skimming for "consistency" could go either direction and be wrong — reverting the SST-1478 await to match the other two fire-and-forget sites reintroduces the race; converting the other two to `await` "for consistency" adds needless latency to hot-path GET responses and would break their own tests' polling assumption if the tests were "simplified" to assume sync writes.

**The generalizable rule:** await a side-effect write when it IS the response's entire payload/contract (success means nothing without it); fire-and-forget + polling tests is fine when the write is incidental telemetry on a response that has real substantive content of its own.

Related: [[feedback_assert_after_the_effect_not_before_it]], [[feedback_a_value_in_output_is_not_a_constant]].
