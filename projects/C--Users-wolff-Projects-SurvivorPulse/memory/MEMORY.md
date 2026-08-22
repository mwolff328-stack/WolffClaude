# SurvivorPulse Memory Index

## Working practice

- [Prefer the Notion OAuth connector](feedback_prefer_notion_oauth_connector.md) — MCP server is fallback-only.
- [Proving a test is load-bearing](feedback_proving_a_test_is_load_bearing.md) — nothing's proven until shown red against wrong code.
- [Search memory before accepting a tool failure as fatal](feedback_search_memory_before_accepting_a_tool_failure_as_fatal.md) — a documented fix existed 3 days before 6 agents re-hit the same wall.
- [Guard the wire, not just the helper](feedback_guard_the_wire_not_just_the_helper.md) — 0 of 109 mutants killed; RECURRED 2026-08-20 on an ADDED SIDE EFFECT (audit logging), asserting its input instead of the call.
- [Paired assertions both go vacuous](feedback_paired_assertions_both_vacuous_when_op_never_ran.md) — clear+preserve both pass on a no-op; assert the run acted first.
- [An AC with no test citing it](feedback_an_ac_with_no_test_citing_it.md) — the AC→TC orphan check found in seconds what two review rounds missed.
- [Enumerate a typed return's fields before signing off](feedback_enumerate_a_typed_returns_fields_before_signing_off.md) — 6 assertions, all on one field of two; the HIGH defect sat in the other.
- [Verify a reviewer's evidence, not their judgement](feedback_verify_a_reviewers_evidence_not_their_judgement.md) — scope call was right, 2 of 5 files wrong.
- [Delegating is not agreeing](feedback_delegating_is_not_agreeing.md) — "same by construction" is a claim to execute, not comment on.
- [Check the distribution before inferring convention](feedback_check_distribution_before_inferring_convention.md) — don't override from 2 nearby examples.
- [Renaming for clarity can re-create the defect](feedback_renaming_for_clarity_can_recreate_the_defect.md) — a new name can lie on one branch.
- [Sweep for the class, not the change](feedback_sweep_for_the_class_not_the_change.md) — a behaviour flip invalidates a CLASS of tests.
- [Confirm the check covers what you changed](feedback_confirm_the_check_covers_what_you_changed.md) — read `include`/`exclude` first.
- [The local run differs from CI by construction](feedback_local_run_differs_from_ci_by_construction.md) — POSIX-broken/Windows-fine parsing; can exit 0 silently.
- [Derive test expectations from the DB, not the fixture](feedback_derive_test_expectations_from_the_db_not_the_fixture.md) — CI's DB is fuller than your fixture.
- [Source-text guards fooled by text](feedback_survivorpulse_source_text_guards_fooled_by_text.md) — comments and compiled output trip `toMatch()`.
- [A green test certifies its stale comments](feedback_a_green_test_certifies_its_stale_comments.md) — a hand-built "call shape" can't see the site moved.
- [The naive fix is green](feedback_survivorpulse_gate_page_not_viewer.md) — three fixes passed and were wrong; gate the page, not the viewer.
- [One sampled error, many root causes](feedback_survivorpulse_one_sampled_error_many_root_causes.md) — 13 failures, two causes, two routes; grep each.
- [Guard the query you're reading](feedback_read_the_querys_own_loading_state.md) — inferring loading from a sibling query fails when both invalidate.
- [Grep callers before changing a shared resolver](feedback_grep_callers_before_changing_a_shared_resolver.md) — scoped ruling ≠ scoped blast radius.
- [Duplicate vi.mock for one module](feedback_duplicate_vi_mock_same_module.md) — winner varies by worker; passes alone, fails in a full run.
- [Proving a flake fix without reproducing it](feedback_proving_a_flake_fix_without_reproducing_it.md) — measure the PRECURSOR, not the rare compound event.
- [Relocating an entry point changes its threat model](feedback_relocating_an_entry_point_changes_its_threat_model.md) — a moved button re-exposes its endpoint.
- [Verify a deferral reason, don't inherit it](feedback_survivorpulse_verify_a_deferral_reason.md) — confirm a blocker still holds; never inherit one from a peer.
- [Collapse stale backlogs, don't maintain them](feedback_survivorpulse_collapse_stale_backlogs.md) — rotted premises get ONE re-survey story, not upkeep.
- [Fetch and search before working](feedback_survivorpulse_fetch_and_search_before_work.md) — a stale branch and no ticket search cost a session.
- [Semantic duplicate guardrails git can't see](feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see.md) — same repo-wide test, different names.
- [Claim-ledger timestamps are not orderable](feedback_survivorpulse_claim_ledger_timestamps_are_not_orderable.md) — two correct sessions duplicated a ticket.
- [Concurrent-session git discipline](feedback_survivorpulse_shared_worktree_staging_discipline.md) — stage by explicit path; bare `push -u` can move 2026-v1.
- [A task premise may describe an unmerged sibling branch](feedback_task_premise_may_describe_an_unmerged_sibling_branch.md) — true elsewhere, false on yours.
- [Shared-resource outages get misattributed](feedback_shared_resource_outages_are_misattributed.md) — a 4-worker suite killed the dev app.
- [Never pkill by shared entry point](feedback_never_pkill_by_shared_entry_point.md) — over-match kills every session; kill by port owned.
- [A 200 is not proof the server lived](feedback_a_200_is_not_proof_the_server_lived.md) — it can serve one response then exit(1).
- [Prefix-mounted guards have prefix-bounded coverage](feedback_prefix_mounted_guards_have_prefix_bounded_coverage.md) — blind past the mount.
- [No em dashes in drafts](feedback_no_em_dashes_in_drafts.md) — not in drafted outbound messages; use periods and commas instead.
- [Rely on self-learning, not manual monitoring](feedback_survivorpulse_rely_on_self_learning_not_manual_monitoring.md) — the learnings queue replaces polling.
- [A doc saying code was deleted is not evidence](feedback_a_doc_saying_code_was_deleted_is_not_evidence.md) — a "deleted" resolver was live and load-bearing.
- [Staged ticket headers rot into harmful instructions](feedback_staged_ticket_headers_rot_into_harmful_instructions.md) — a status line inverted twice in 48h.
- [An AC can launder an ungroomed commit into a decision](feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision.md) — git log -S the behaviour first.
- [Derive from the quantity the reader validates](feedback_derive_from_the_quantity_the_reader_validates.md) — write vs read on different quantities drifts.
- [Rounding a display input destroys ordering](feedback_rounding_a_display_input_destroys_ordering.md) — two precisions manufactured a tie.
- [Enumerate by the structural anchor](feedback_enumerate_by_the_structural_anchor.md) — grepping a VALUE's formatting found 2 of 3 and read as complete.
- [A value in output is not a constant](feedback_a_value_in_output_is_not_a_constant.md) — read the producing code before warning anyone of a consequence.
- [A bug ticket's Proposed resolution can carry the defect](feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect.md) — "reuse the helper" deleted a cap.
- [Validated identifiers still carry SQL wildcards](feedback_validated_identifiers_still_carry_sql_wildcards.md) — `_` is a LIKE wildcard, even validated.
- [Proving a change is comment-only](feedback_proving_a_change_is_comment_only.md) — the +/- filter works for edits but not MOVES.
- [Source-scanning guards fail four ways](feedback_source_scanning_guards_need_three_meta_tests.md) — prose satisfies it; multi-line misses; NUL hides the file.
- [Tests that pass by winning an animation race](feedback_tests_that_pass_by_winning_an_animation_race.md) — a click UNMOUNTING its target still passes.
- [Assert after the effect, not before it](feedback_assert_after_the_effect_not_before_it.md) — a post-auth guard passed with BOTH fixes reverted.
- [A third verdict can silence a signal](feedback_a_third_verdict_can_silence_a_signal.md) — "never returns none" held while the warning became unreachable.
- [A premise measured at a boundary inherits it](feedback_a_premise_measured_at_a_boundary_inherits_it.md) — true at week 1, false after, unchallenged.
- [A harness disagreement is evidence about the harness](feedback_a_harness_disagreement_is_evidence_about_the_harness.md) — shared arm state faked a split.
- [Concurrent reviewer agents race on shared file reverts](feedback_concurrent_reviewer_agents_race_on_shared_file_reverts.md) — transient, harmless collisions.
- [Verify a fix site is live before citing it](feedback_verify_fix_site_is_live_before_citing_it.md) — matched the bug but was wired only to a frozen router.
- [A new error code activates old dead UI code](feedback_a_new_error_code_activates_old_dead_ui_code.md) — a 409 became reachable for an unready caller.
- [A helper can implement half a rule](feedback_a_helper_can_implement_half_a_rule.md) — the other half lived in the caller; a new call site broke silently.

## Shipping, environments, and infra

- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md) — how to run the real gate, what each stage runs.
- [Publish prerequisites](project_survivorpulse_publish_prerequisites.md) — continuously-updated checklist of what must be applied before SHIP.
- [A booting prod proves the unsafe-dev flag is off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md) — env validation exits(1) before listening.
- [Replit deployment is autoscale](project_survivorpulse_replit_deployment_is_autoscale.md) — multiple instances; an in-process cache serves inconsistent data.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) — read the deployed bundle before debugging source.
- [Production smoke access](project_survivorpulse_production_smoke_access.md) — read-only smoke IS reachable; admin API is the only path to prod data.
- [Deployed dev app URL](project_survivorpulse_deployed_dev_url.md) — founder-confirmed preview URL; ask founder to refresh if stale.
- [Legacy Repl is rollback-only](project_survivorpulse_legacy_repl_is_rollback_only.md) — cutover COMPLETE 2026-07-28; survivorpulse.com serves v1.
- [Open access mode](project_survivorpulse_open_access_mode.md) — one constant hides the beta gate and Stripe paywall; gate the hook, not the pages.
- [Beta launch site decisions](project_survivorpulse_beta_launch_site_decisions.md) — founder rulings on public-site copy; access-gate half superseded.
- [SST-1247 residual-gap rulings](project_survivorpulse_sst1247_residual_gap_rulings.md) — off-season Home copy stays; zero-entry pool gets root-cause fix.
- [Schema drift kills the dev app](project_survivorpulse_schema_drift_takes_down_dev_app.md) — a column not applied to helium 502s the entire dev app.
- [.env has two DATABASE_URL lines](project_survivorpulse_env_database_url_two_lines.md) — the first is commented out; Playwright loads `.env.test`.
- [CA1 is self-contained](project_survivorpulse_ca1_is_self_contained.md) / [snapshot CRLF churn](project_survivorpulse_ca1_snapshot_crlf_churn.md) — no regen.
- [Back Tester goldens re-baselined by SST-1342](project_survivorpulse_backtester_goldens_rebaselined_sst1342.md) — upstream regen reintroduces the bug.

## Verifying UI for real

**Getting a trustworthy live surface is the `sp-live-verify` skill, not memory — it loads every time.** Below are only UI facts with no procedure attached.

- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md) — a resizing dialog re-centres; stale coords dismiss it.
- [Compact-grid card layout trap](project_survivorpulse_compact_grid_card_layout_trap.md) — a space-between card with fixed-width clusters crushes its content.
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md) — `:hover{background}` loses to inline styles.
- [Flex percentage-height + Radix focus traps](project_survivorpulse_flex_percentage_height_and_radix_traps.md) — `h-full` in `flex-1` degrades to `auto`.
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md) — a `fixed bottom-0` bar detaches and eats edge taps.
- [Radix outside-click arming race](project_survivorpulse_radix_outside_click_arming_race.md) — armed via `setTimeout(…,0)`; an immediate click is dropped.
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md) — a Redirect to another redirect blank-pages silently.
- [react-query mock render loop](project_survivorpulse_react_query_mock_render_loop.md) — a fresh array literal per mocked call causes infinite-render OOM.
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md) — prod compiles App-v1.tsx, dev uses App.tsx; a root hook can ship without it.
- [login ?next= is same-origin only](project_survivorpulse_login_next_param_is_same_origin_only.md) — pushState throws cross-origin, swallowed silently.
- [Per-user client persistence late-auth trap](project_survivorpulse_per_user_client_persistence_late_auth_trap.md) — a pre-auth read overwrites the real one.

## Test infrastructure

- [Sandbox has no local Postgres](project_survivorpulse_sandbox_has_no_local_postgres.md) — DB-integration proof comes from a targeted CI dispatch, not local.
- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md) — narrowed runs aren't controls; the gate runs no retained tests.
- [The dev preview runs an UNBUNDLED Vite dev server](project_survivorpulse_dev_preview_runs_vite_dev_server.md) — 116 modules / ~7s per cold load; any Playwright run kills the container.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) — a persistent E2E DB masked months of drift; any shard's spec can break the run.
- [E2E fixture provisioning reality](project_survivorpulse_e2e_fixture_provisioning.md) — ⚠️ REVERSED by SST-1213: the POST now succeeds.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md) — `teardown:` skips a globalTimeout abort; wrong for one shared DB.
- [Local flake-repro traps](project_survivorpulse_local_flake_repro_traps.md) — CPU load scales everything; use an in-process event-loop blocker.
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md) — two different causes share one message; inspect first.
- [tsc excludes the tests/ directory entirely](project_survivorpulse_tsc_excludes_tests_directory.md) — a compile-probe placed in tests/ never runs.

## Engine and domain behaviour

- [Elimination predicate rulings (2026-08-01)](project_survivorpulse_elimination_predicate_rulings.md) — tie=loss, strikeCount is real, buyback at read time.
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md) — used-team/ranking rules re-implemented per call site; one defect, nine tickets.
- [greedyPath fixture facts](project_survivorpulse_greedypath_fixture_facts.md) — rows carry no `score` field so hand-set ties are silently ignored.
- [A fabricated finality tier splits the spread paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md) — a fake stamp splits analytics/UI.
- [Apply write-order collision](project_survivorpulse_apply_write_order_collision.md) / [past-season cascades](project_survivorpulse_past_season_apply_cascades.md) — a MOVE self-collides.
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md) — overriding cockpit `currentWeek` re-classifies concluded weeks.
- [Shared pool-week optimizer context](project_survivorpulse_shared_pool_week_context.md) — pool/week work is shareable, per-entry work is not.
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md) — what `allTeams`/`available` mean, and the caching invariant.
- [Missing field exposure collapses the archetypes](project_survivorpulse_missing_field_exposure_collapses_archetypes.md) — no popularity data, all 3 tie.
- [Multi-pick renders only via 'past' cell variant](project_survivorpulse_multipick_past_variant_only.md) — playoff picks never resolve as odds or projected.
- [Allocation order blessed](project_survivorpulse_allocation_order_blessed.md) — UUID-order greedy for UNIFORM stakes; stake-weighted shipped as SST-1073.
- [Reset-to-auto stays grid-matched, not Apply-scoped](project_survivorpulse_reset_to_auto_apply_scope_divergence.md) — PoolSwitcher-as-scope already rejected.

## App structure and data ownership

- [The Notion comment "outage" is connector-specific](project_survivorpulse_notion_comment_outage_is_connector_specific.md) — a second connector still works.
- [Notion comments via the Chrome composer](project_survivorpulse_notion_comments_via_chrome_composer.md) — ⚠️ composer click can silently corrupt the last comment; try OAuth connector FIRST, always.
- [Notion via Chrome overwrites fields](project_survivorpulse_notion_via_chrome_field_overwrite.md) / [get-comments can't see replies](project_survivorpulse_notion_create_comment_write_path_defect.md) — reads are blind.
- [A page read truncates long rich_text](project_survivorpulse_notion_page_read_truncates_rich_text.md) — 12,274 chars came back as 7,577, silently; it hid a real AC clause. Read long props via the OAuth SQL path.
- [Comments: use the OAuth connector, not notionApi](project_survivorpulse_notion_mcp_create_comment_missing_version.md) — `missing_version` is a known-bad server, not an outage; do NOT build a page-body workaround.
- [No branch protection, CI is advisory](project_survivorpulse_no_branch_protection_ci_advisory_only.md) — `gh pr merge` isn't gated; trace red checks via logs.
- [Route auth is opt-in](project_survivorpulse_route_auth_is_opt_in.md) / [sp_session is a bearer token](project_survivorpulse_session_cookie_is_a_bearer_token.md) — not blanket.
- [Split route registration](project_survivorpulse_split_route_registration.md) — routes live in BOTH routes.ts and index.ts; grepping one false-negatives.
- [A dead page's route is still load-bearing](project_survivorpulse_dead_page_live_redirect_route.md) — my-picks is deleted but live CTAs still navigate there.
- [Per-pool cockpit wrapper global-nav trap](project_survivorpulse_pool_cockpit_wrapper_global_nav_trap.md) — a multi-pool wrapper must NOT seed the nav week.
- [maxEntriesPerUser dual-mirror default trap](project_survivorpulse_max_entries_default_dual_mirror.md) — the default lives in 4 places; re-check all 4.
- [Admin Real/Test pool marker](project_survivorpulse_admin_pool_classification.md) / [default-user-id trap](project_survivorpulse_default_user_id_ownership_trap.md) — hard-delete flag.
- [SST number is an auto-increment column](project_survivorpulse_notion_sst_id_is_auto_increment.md) — never invent one; never match titles on "SST-".
- [PickGrid.tsx is dead; SeasonGridSection/WeekViewSection is shared](project_survivorpulse_pickgrid_dead_seasongrid_shared.md) — same instances render everywhere.
- [My Strategy wizard: deleted 2026-08-03](project_survivorpulse_my_strategy_wizard_unreachable.md) — Step1,2,5 gone; Step3/4/Context/Modal survive via /tools/*.
- [TanStack Query keys hash by value](project_survivorpulse_tanstack_query_keys_hash_by_value.md) — same literal queryKey in two files shares ONE cache entry.
- [Beta outreach Notion databases](reference_beta_outreach_notion_databases.md) — Prospect Tracker + Outreach Log locations; update both after sending outreach.
