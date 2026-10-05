---
name: project_survivorpulse_sst1797_signed_out_week_cap_regroomed_after_founder_rulings
description: "SST-1797 (signed-out /rankings capped at current week) is DONE (2026-10-04): built, on 2026-v1 (358aae2a..fef5390e), live on dev and production, Vlad QA PASS WITH FINDINGS; design, evidence, accepted residuals and the follow-ups Pam owes."
metadata:
  node_type: memory
  type: project
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-04T16:00:45.601Z
---

**State (2026-10-04):** SST-1797 is `Done`. Size L ~56 h, Priority High. Page id
`3ed29ce5-833d-8191-bb94-f820d80b0477`. Ten commits on `origin/2026-v1`: `358aae2a` core, `eddafe68` pins,
`7b7a4f31` gate + field, `3f836639` real-clock/date matrix, `afc799e8` + `e4695ea2` client, `bfdf8d27`
Playwright, `1965a06b` + `c8520bc5` review fixes, `fef5390e` stale-login test flake fix. Gate (full suite) green
on `1965a06b` and `c8520bc5`. Live in production since the 10/3 release (REL-65), re-smoked read-only on
survivorpulse.com 10/4 after a later publish: matches the spec. Vlad's QA (22 mutations all red, restores
proven) was done AFTER production shipped, so the formal gate lagged the release.
When `fef5390e` was pushed the tip's gate was RED for SST-1739 tests (openAccess/signup), none in this story.
Product rule: [[project_survivorpulse_paywall_model_signed_in_means_subscribed]].

**Design:** the SERVER owns the last good clock: `createSignedOutCapResolver(lookup)` in
`server/services/publicWeekAccess.ts` (closure memory; remembers a database answer with integer week 1 to
22; reuses it for a fallback answer only for the SAME season; cold instance = cap 1). ONE module-scope
instance feeds the route gate (`/api/public/week-picks`, gate BEFORE the shared memo) AND an additive
`signedOutWeekCap { maxWeek, currentWeek }` on `GET /api/seasons/current`. The signed-out client reads the
field; a failed poll keeps the last response. 403 shows the existing error panel; page-owned Try again
awaits one clock refetch, re-reads the cap from the cache, re-derives min(intent, cap). Pure rule in
`shared/publicWeekCap.ts` (non-integer season fails closed). Founder rulings 2026-10-02: failed poll keeps
last good clock; after Week 18 with no playoff rows the last good clock is kept; cheaper recovery; (e)(f)(i).

**Evidence:** Playwright CI (real session) 26 passed / 4 NOT RUN (currentWeek-null branch) / 0 failed; live
dev TC-34 signed-out rows all as spec (curl + built-in Browser pane at `?publicview=1`, 44px select at 375px);
signed-in live rows NOT RUN (cookie-less `/api/me` is 401 on dev, so no auto-login for curl) and the
independent DB oracle NOT RUN (dev app reads helium). Cass code review r1 PASS WITH MINORS (0/0/4); an
independent code-reviewer PASS. The build found one spec error (AC-35/TC-31/TC-33 said two live regions
while pending; the pending loader has no live role, so one) and fixed the spec in Notion.

**Accepted residuals:** 7 per-instance memory (cold autoscale instance answers Week 1 in the post-Week-18
no-playoff-rows window); 8 a later successful answer without a valid field shows Week 1 for one poll; a
selection made during Try again can trigger one extra request (Cass minor).

**Follow-ups Pam files:** single-flight/cached gate clock (every signed-out request for week 2+ now costs one
season-summary read), the stateless cap-18 alternative (Felix: needs founder approval, contradicts ruling p'),
persist the last good clock (~3 to 4 h, `system_flags`), the entitlement swap (blocked by SST-1718), the
free-copy audit, explain a first-fetch failure, stale `openapi.yaml` `/api/seasons/current` entries. Also
open from earlier: SST-1789 and SST-1791 In Review; SST-1798 Backlog.

Process lessons: [[feedback_survivorpulse_cass_rounds_converge_by_deleting_mechanisms_not_patching]],
[[project_survivorpulse_notion_grooming_property_write_limits_and_safe_recovery]],
[[feedback_survivorpulse_resumed_persona_agent_can_hit_its_own_message_limit_start_fresh_from_handoff]],
[[project_survivorpulse_playwright_can_run_locally_against_a_self_booted_server]].
