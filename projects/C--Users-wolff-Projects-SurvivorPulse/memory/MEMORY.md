# SurvivorPulse Memory Index

## Working practice

- [Proving a test is load-bearing](feedback_proving_a_test_is_load_bearing.md) — seven ways a RED proof gets faked; nothing is proven until shown red against wrong code.
- [Guard the wire, not just the helper](feedback_guard_the_wire_not_just_the_helper.md) — a tested helper behind a severed call site killed 0 of 109 mutants.
- [An AC with no test citing it](feedback_an_ac_with_no_test_citing_it.md) — two review rounds missed it; the AC→TC orphan check found it in seconds.
- [Verify a reviewer's evidence, not their judgement](feedback_verify_a_reviewers_evidence_not_their_judgement.md) — the scope call was right, 2 of 5 supporting files were wrong.
- [Delegating is not agreeing](feedback_delegating_is_not_agreeing.md) — "same by construction" is a claim to execute, not to comment on.
- [Check the distribution before inferring convention](feedback_check_distribution_before_inferring_convention.md) — don't override a documented standard from 2 nearby examples.
- [Renaming for clarity can re-create the defect](feedback_renaming_for_clarity_can_recreate_the_defect.md) — the new name can lie on one branch, guard fail-open on its subject.
- [Sweep for the class, not the change](feedback_sweep_for_the_class_not_the_change.md) — a behaviour flip invalidates a CLASS of assertions; re-sweep after each.
- [Confirm the check covers what you changed](feedback_confirm_the_check_covers_what_you_changed.md) — read `include` AND `exclude` before quoting a green typecheck.
- [The local run differs from CI by construction](feedback_local_run_differs_from_ci_by_construction.md) — POSIX-broken/Windows-fine `file://` parsing; a runner can exit 0 silently.
- [Derive test expectations from the DB, not the fixture](feedback_derive_test_expectations_from_the_db_not_the_fixture.md) — CI's DB is fuller than your fixture.
- [Source-text guards fooled by text](feedback_survivorpulse_source_text_guards_fooled_by_text.md) — comments and compiled output trip `toMatch()`.
- [A green test certifies its stale comments](feedback_a_green_test_certifies_its_stale_comments.md) — a hand-built "ACTUAL call shape" can't notice the call site moved; 74 commits stale.
- [The naive fix is green](feedback_survivorpulse_gate_page_not_viewer.md) — three fixes that passed and were wrong; gate the page, not the viewer.
- [One sampled error, many root causes](feedback_survivorpulse_one_sampled_error_many_root_causes.md) — 13 identical failures were two causes on two routes; grep each route.
- [Guard the query you're reading](feedback_read_the_querys_own_loading_state.md) — inferring loading from a sibling query fails when both invalidate; use `!isFetching`.
- [Grep callers before changing a shared resolver](feedback_grep_callers_before_changing_a_shared_resolver.md) — a scoped founder ruling scopes intent, not blast radius.
- [Duplicate vi.mock for one module](feedback_duplicate_vi_mock_same_module.md) — the winner varies by worker; passes alone, fails in a full run.
- [Proving a flake fix without reproducing it](feedback_proving_a_flake_fix_without_reproducing_it.md) — measure the PRECURSOR, not the rare compound event.
- [Relocating an entry point changes its threat model](feedback_relocating_an_entry_point_changes_its_threat_model.md) — a moved affordance re-exposes its endpoint with no server diff.
- [Verify a deferral reason, don't inherit it](feedback_survivorpulse_verify_a_deferral_reason.md) — confirm a stated blocker still holds; never inherit one from a peer.
- [Collapse stale backlogs, don't maintain them](feedback_survivorpulse_collapse_stale_backlogs.md) — when a groomed epic's premises rot, cancel it into ONE re-survey story.
- [Fetch and search before working](feedback_survivorpulse_fetch_and_search_before_work.md) — a stale branch and no ticket search cost a session.
- [Semantic duplicate guardrails git can't see](feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see.md) — two sessions built the same repo-wide test, different names.
- [Claim-ledger timestamps are not orderable](feedback_survivorpulse_claim_ledger_timestamps_are_not_orderable.md) — two sessions claimed correctly and still duplicated a ticket.
- [Concurrent-session git discipline](feedback_survivorpulse_shared_worktree_staging_discipline.md) — stage by explicit path; `worktree add -b` + bare `push -u` can move remote 2026-v1.
- [A task premise may describe an unmerged sibling branch](feedback_task_premise_may_describe_an_unmerged_sibling_branch.md) — "X was just extracted" can be true elsewhere, false on your branch.
- [Shared-resource outages get misattributed](feedback_shared_resource_outages_are_misattributed.md) — a 4-worker suite killed the dev app; the investigator ruled itself out first.
- [Never pkill by shared entry point](feedback_never_pkill_by_shared_entry_point.md) — over-match kills every concurrent session; prove liveness by log growth.
- [A 200 is not proof the server lived](feedback_a_200_is_not_proof_the_server_lived.md) — it can serve one response then exit(1); an empty-id DELETE returns 200 + the SPA shell.
- [Prefix-mounted guards have prefix-bounded coverage](feedback_prefix_mounted_guards_have_prefix_bounded_coverage.md) — verifying the mount can't ask what isn't behind it.
- [No em dashes in drafts](feedback_no_em_dashes_in_drafts.md) — not in drafted outbound messages; restructure with periods and commas.
- [Rely on self-learning, not manual monitoring](feedback_survivorpulse_rely_on_self_learning_not_manual_monitoring.md) — the learnings queue + weekly review mean no manual polling.
- [A doc saying code was deleted is not evidence](feedback_a_doc_saying_code_was_deleted_is_not_evidence.md) — CLAUDE.md said a resolver was deleted; it was live and load-bearing.
- [Staged ticket headers rot into harmful instructions](feedback_staged_ticket_headers_rot_into_harmful_instructions.md) — a `pending-notion-tickets` STATUS line inverted twice in 48h.
- [An AC can launder an ungroomed commit into a decision](feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision.md) — git log -S the behaviour before treating an AC as a ruling.
- [Derive from the quantity the reader validates](feedback_derive_from_the_quantity_the_reader_validates.md) — a field computed from different quantities on write vs read drifts.
- [Rounding a display input destroys ordering](feedback_rounding_a_display_input_destroys_ordering.md) — one formula at two precisions manufactured a tie the tie-break outranked.
- [Enumerate by the structural anchor](feedback_enumerate_by_the_structural_anchor.md) — grepping a VALUE's formatting found 2 of 3 pool inserts and read as complete.
- [A value in output is not a constant](feedback_a_value_in_output_is_not_a_constant.md) — read the producing code before warning anyone about a consequence.
- [A bug ticket's Proposed resolution can carry the defect](feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect.md) — "just reuse the helper" can silently DELETE a cap.
- [Validated identifiers still carry SQL wildcards](feedback_validated_identifiers_still_carry_sql_wildcards.md) — `_` is a LIKE wildcard; a validated `my_run` also matches `myXrun`.
- [Proving a change is comment-only](feedback_proving_a_change_is_comment_only.md) — the +/- filter works for edits but not MOVES; strip comments and compare.
- [Source-scanning guards fail four ways](feedback_source_scanning_guards_need_three_meta_tests.md) — prose satisfies it; a per-line regex misses multi-line matches; NUL hides the file.
- [Tests that pass by winning an animation race](feedback_tests_that_pass_by_winning_an_animation_race.md) — a click that UNMOUNTS its target still passes inside the exit window.
- [A premise measured at a boundary inherits it](feedback_a_premise_measured_at_a_boundary_inherits_it.md) — "directional, not causal" was true at week 1, false after, unchallenged.
- [A harness disagreement is evidence about the harness](feedback_a_harness_disagreement_is_evidence_about_the_harness.md) — shared test-arm state faked a 5-of-7 split; mutation testing proves only the fixture.

## Shipping, environments, and infra

- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md) — how to run the real gate, what each stage runs, and the publish-time secret deletion.
- [Publish prerequisites](project_survivorpulse_publish_prerequisites.md) — the continuously-updated checklist of what must be applied before SHIP.
- [A booting prod proves the unsafe-dev flag is off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md) — env validation exits(1) before listening; probe prod, don't ask.
- [Replit deployment is autoscale](project_survivorpulse_replit_deployment_is_autoscale.md) — prod runs multiple instances, so any in-process cache serves inconsistent data.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) — read the deployed bundle before debugging source.
- [Production smoke access](project_survivorpulse_production_smoke_access.md) — prod IS reachable for read-only smoke; its admin API is the only read path to prod data.
- [Legacy Repl is rollback-only](project_survivorpulse_legacy_repl_is_rollback_only.md) — cutover COMPLETE 2026-07-28; survivorpulse.com serves v1, legacy is rollback-only.
- [Open access mode](project_survivorpulse_open_access_mode.md) — one constant hides the beta-code gate and the Stripe paywall; gate the hook, not the pages.
- [Beta launch site decisions](project_survivorpulse_beta_launch_site_decisions.md) — founder rulings on public-site copy; the access-gate half is superseded.
- [Schema drift kills the dev app](project_survivorpulse_schema_drift_takes_down_dev_app.md) — a column in schema.ts not applied to helium 502s the entire dev app.
- [.env has two DATABASE_URL lines](project_survivorpulse_env_database_url_two_lines.md) — the first is commented out; Playwright loads `.env.test`, not `.env`.
- [CA1 is self-contained](project_survivorpulse_ca1_is_self_contained.md) / [snapshot CRLF churn](project_survivorpulse_ca1_snapshot_crlf_churn.md) — no snapshot regen needed for scoring changes; a full suite shows golden .snap files as modified with ZERO real change.

## Verifying UI for real

**Getting a trustworthy live surface is the `sp-live-verify` skill, not memory — it loads every time.** Below are only UI facts with no procedure attached.

- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md) — clicks use screenshot-space coords; a resizing dialog re-centres, stale coords dismiss it.
- [Compact-grid card layout trap](project_survivorpulse_compact_grid_card_layout_trap.md) — a space-between card with fixed-width action clusters crushes its content.
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md) — a class `:hover{background}` loses to inline styles; use an inset box-shadow.
- [Flex percentage-height + Radix focus traps](project_survivorpulse_flex_percentage_height_and_radix_traps.md) — `h-full` in a `flex-1` parent degrades to `auto`.
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md) — a `fixed bottom-0` bar detaches from the modal and eats taps on its edge.
- [Radix outside-click arming race](project_survivorpulse_radix_outside_click_arming_race.md) — Radix arms the listener in `setTimeout(…,0)`; an immediate click is dropped silently.
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md) — a Redirect pointing at another redirect blank-pages silently; keep chains flat.
- [react-query mock render loop](project_survivorpulse_react_query_mock_render_loop.md) — mocking useQuery with a fresh array literal per call causes infinite-render OOM.
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md) — production compiles App-v1.tsx, dev uses App.tsx; a root hook added to one ships without it.
- [login ?next= is same-origin only](project_survivorpulse_login_next_param_is_same_origin_only.md) — wouter's pushState throws cross-origin and the sign-in catch swallows it.
- [Per-user client persistence late-auth trap](project_survivorpulse_per_user_client_persistence_late_auth_trap.md) — a pre-auth read of the legacy localStorage key overwrites the real one.

## Test infrastructure

- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md) — narrowed runs aren't controls; `retain-on-failure` records EVERY test; the gate runs none.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) — a persistent E2E DB masked months of drift; shards share one DB, so any spec can break the run.
- [E2E fixture provisioning reality](project_survivorpulse_e2e_fixture_provisioning.md) — ⚠️ REVERSED by SST-1213: the POST now succeeds, writing to whatever DB is targeted.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md) — a `teardown:` project skips a globalTimeout abort; wrong for sharding over one DB.
- [Local flake-repro traps](project_survivorpulse_local_flake_repro_traps.md) — machine-wide CPU load scales everything; use an in-process event-loop blocker.
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md) — two different causes wear the same message; inspect before escalating.

## Engine and domain behaviour

- [Elimination predicate rulings (2026-08-01)](project_survivorpulse_elimination_predicate_rulings.md) — tie=loss, strikeCount is a real feature, buyback assumed at read time only.
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md) — used-team and ranking rules re-implemented at every call site; one defect, nine tickets.
- [greedyPath fixture facts](project_survivorpulse_greedypath_fixture_facts.md) — rows carry no `score` field so hand-set ties are silently ignored.
- [A fabricated finality tier splits the spread paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md) — a fabricated closing_at_kickoff stamp splits analytics from the UI.
- [Apply write-order collision](project_survivorpulse_apply_write_order_collision.md) / [past-season cascades](project_survivorpulse_past_season_apply_cascades.md) — cell-at-a-time writes make a MOVE collide with itself; completed-week writes inherit kickoff-lock + elimination duties.
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md) — overriding cockpit `currentWeek` re-classifies every concluded week as live.
- [Shared pool-week optimizer context](project_survivorpulse_shared_pool_week_context.md) — pool/week work is shareable, per-entry work is not.
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md) — what `allTeams` carries, what `available` means, and the caching invariant.
- [Missing field exposure collapses the archetypes](project_survivorpulse_missing_field_exposure_collapses_archetypes.md) — with no popularity data all 3 archetypes rank identically.
- [Multi-pick renders only via 'past' cell variant](project_survivorpulse_multipick_past_variant_only.md) — playoff picks never resolve as odds or projected.
- [Allocation order blessed](project_survivorpulse_allocation_order_blessed.md) — UUID-order greedy blessed for UNIFORM stakes; stake-weighted ordering shipped as SST-1073.

## App structure and data ownership

- [Notion via Chrome overwrites fields](project_survivorpulse_notion_via_chrome_field_overwrite.md) / [get-comments can't see replies](project_survivorpulse_notion_create_comment_write_path_defect.md) — ⚠️ there is NO write defect, writes always worked; get-comments is blind to replies in every mode tried. Verify by looking at the real page.
- [No branch protection, CI is advisory](project_survivorpulse_no_branch_protection_ci_advisory_only.md) — `gh pr merge` isn't gated; trace red checks via logs + a control run.
- [Route auth is opt-in](project_survivorpulse_route_auth_is_opt_in.md) / [sp_session is a bearer token](project_survivorpulse_session_cookie_is_a_bearer_token.md) — no blanket /api guard (missing middleware arg = anonymous-reachable); session has no IP/UA binding, 12h idle / 7d absolute.
- [Split route registration](project_survivorpulse_split_route_registration.md) — routes live in BOTH server/routes.ts and server/index.ts; grepping one gives false negatives.
- [A dead page's route is still load-bearing](project_survivorpulse_dead_page_live_redirect_route.md) — the my-picks subtree is deleted but live CTAs still navigate there.
- [Per-pool cockpit wrapper global-nav trap](project_survivorpulse_pool_cockpit_wrapper_global_nav_trap.md) — a multi-pool wrapper must NOT seed the global top-nav week.
- [maxEntriesPerUser dual-mirror default trap](project_survivorpulse_max_entries_default_dual_mirror.md) — the default lives in 4 places; re-check all 4 on any change.
- [Admin Real/Test pool marker](project_survivorpulse_admin_pool_classification.md) / [default-user-id trap](project_survivorpulse_default_user_id_ownership_trap.md) — `isTestData` arms hard-deletion (superseded for pools); "View all pools"-only visibility means dev-stub ownership.
- [SST number is an auto-increment column](project_survivorpulse_notion_sst_id_is_auto_increment.md) — never invent one; never match titles on "SST-".
