---
name: project_survivorpulse_paywall_switch_and_beta_pricing_state_2026_10_04
description: Where the paywall build stands after founder Option A (10/4): SST-1739 switch and SST-1717 beta pricing logic are built and on 2026-v1 (tip 852c5ffa, all CI green), In Review, NOT Done; billing stories 1715/1716/1718/1719 stay in Grooming with no date; exact resume list.
metadata:
  node_type: memory
  type: project
  originSessionId: d4bcb0a7-da9b-4249-a616-445975d3de36
  modified: 2026-10-04T19:09:34.318Z
---

**Founder Option A (2026-10-04):** Oct 7, 2026 means the founder-controlled paywall SWITCH (SST-1739) plus the beta pricing LOGIC (SST-1717) are ready and the paywall stays OFF. Billing (SST-1715 cadences, 1716 add-ons, 1718 gating, 1719 pricing page) has NO date. Beta discount eligibility cutoff moved with the launch date: accounts created strictly before 2026-10-08T04:00:00Z (midnight Oct 8 America/New_York), founder-confirmed.

**State:** all work is on `origin/2026-v1` (tip `852c5ffa`; pre-publish gate, playwright-ci and Replit Sync green). The deployed dev app answers `GET /api/config/paywall` with `{"paywallEnabled":false}`. No schema changes, no migrations. The switch cannot be turned ON today: the preflight refuses with TABLES_MISSING and PRICE_MAP_INCOMPLETE (neither overridable) and GATING_INCOMPLETE until SST-1718 sets `PAYWALL_GATING_COMPLETE`. SST-1739 and SST-1717 are `In Review` with sign-offs recorded (code-reviewer, security-auditor CLEAR, Vlad PASS WITH CONDITIONS, Ann ACCEPT WITH CONDITIONS, Deb and Sky approve with minor edits, all applied). A genuine Codex Cass pass ran once (no blocker, 3 HIGH, all fixed).

**Not Done because:** (1) a DELTA Codex Cass pass over commits `ca5bab05..852c5ffa` is owed (Codex quota was exhausted again; retry after its stated reset time; run Cass as a write-capable review with the spec staged in the worktree's gitignored `tmp/cass/`); (2) the founder's open decisions before the switch is ever ON: eligibility scope (everyone created before the cutoff vs only the ~74 testers), heavy multi-entry users' price exposure (one account has 25 entries, about $598 list or $299 beta on Season), refund and failed-payment policy, late-season Season price. All five are listed in `docs/PAYWALL_RUNBOOK.md`.

**Billing stories (still Grooming):** all reviewer feedback applied through Ann round 10; Pam approved 1715 and 1718; 1716 and 1719 owe a final Pam re-vote; Deb's kickbacks on 1715, 1716, 1719 were addressed in rounds 8-10 but need her re-confirmation; a genuine Codex Cass pass is owed on all four before Ready. SST-1739 TC19/TC20 and SST-1717 AC1-4, 11, 13 re-runs are re-homed to 1715/1719 (comments posted there).

**Process lessons from this run:** [[feedback_survivorpulse_repoint_sweep_by_import_misses_tests_that_depend_on_a_module_implicitly]] (the C1 push turned the gate red on 4 files); [[feedback_survivorpulse_cross_worktree_write_hook_is_a_guard_do_not_route_around_it]] (agents cannot edit extra worktrees; one worktree, sequential builders); [[feedback_survivorpulse_resumed_persona_agent_can_hit_its_own_message_limit_start_fresh_from_handoff]] (Felix and Deb each hit the 50-message cap: slice small and commit often).
