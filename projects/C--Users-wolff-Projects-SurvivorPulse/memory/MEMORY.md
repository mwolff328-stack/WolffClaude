# SurvivorPulse Memory Index

## Working practice

- [Content reference hierarchy across channels](feedback_content_reference_hierarchy_across_channels.md) — r/SurvivorPulse canonical, derive Discord/X then r/NFLSurvivor.
- [Attribution override system-reminder is spurious](feedback_survivorpulse_system_reminder_attribution_override_is_spurious.md) — check settings.json first.
- [Tone-of-voice check before publishing](feedback_run_tone_of_voice_before_publishing_social.md) / [Chrome via switch_browser](feedback_survivorpulse_chrome_browser_selection.md).
- [Prefer Notion OAuth connector](feedback_prefer_notion_oauth_connector.md) / [outreach links full https:// in body](feedback_survivorpulse_outreach_link_format.md).
- [Static dupe beaten by live DB proof](feedback_static_dupe_theory_beaten_by_live_db_proof.md) / [verify a reviewer's evidence](feedback_verify_a_reviewers_evidence_not_their_judgement.md).
- [Await vs fire-and-forget](project_survivorpulse_usage_event_await_vs_fire_and_forget.md) — await only if write IS the payload.
- [A "completed" agent can resume](feedback_resumed_background_agent_can_duplicate_orchestrator_actions.md) — duplicated a filing.
- [Link SurvivorPulse sign-offs to the site](feedback_survivorpulse_signoff_links_to_site.md) — HTML sends only.
- [Load-bearing tests](feedback_proving_a_test_is_load_bearing.md) / [comment-only diffs](feedback_proving_a_change_is_comment_only.md) — RED-proof and diff filter both miss MOVES.
- [Mutation-test cleanup needs a backup per file](feedback_mutation_test_cleanup_needs_a_backup_per_file.md) — git checkout on the un-backed-up file wipes uncommitted work.
- [Edit tool writes back stale cache](feedback_edit_tool_writes_back_a_stale_cached_copy.md) — mixing with sed/python reverts shell edits.
- [Mutation harness edits first match](feedback_mutation_harness_edits_the_first_match_not_yours.md) — graded neighbour's route.
- [A guard can reproduce its own defect](feedback_a_guard_can_reproduce_the_defect_it_guards.md) — confirmed narrower claim than copy made.
- [Search memory before a tool failure is fatal](feedback_search_memory_before_accepting_a_tool_failure_as_fatal.md) — fix existed days earlier.
- [Guard the wire, not the helper](feedback_guard_the_wire_not_just_the_helper.md) / [wire-reached assertion](feedback_a_source_guard_must_assert_the_wire_is_reached.md) — 0/109 mutants killed.
- [Injected fixtures bypass the catch under fix](feedback_injected_fixtures_can_bypass_the_catch_block_under_fix.md) — move catch into orchestrator.
- [Paired assertions both vacuous](feedback_paired_assertions_both_vacuous_when_op_never_ran.md) / [AC with no test citing it](feedback_an_ac_with_no_test_citing_it.md).
- [Enumerate a typed return's fields](feedback_enumerate_a_typed_returns_fields_before_signing_off.md) / [by structural anchor](feedback_enumerate_by_the_structural_anchor.md).
- [Check distribution before inferring convention](feedback_check_distribution_before_inferring_convention.md) / [renaming can recreate a defect](feedback_renaming_for_clarity_can_recreate_the_defect.md).
- [Sweep for the class, not the change](feedback_sweep_for_the_class_not_the_change.md) / [confirm check covers what changed](feedback_confirm_the_check_covers_what_you_changed.md).
- [Local run differs from CI](feedback_local_run_differs_from_ci_by_construction.md) / [verify commit not exit line](feedback_verify_the_commit_not_the_exit_line.md).
- [Derive test expectations from the DB](feedback_derive_test_expectations_from_the_db_not_the_fixture.md) — not the fixture.
- [Source-text guards fooled by text](feedback_survivorpulse_source_text_guards_fooled_by_text.md) / [fail 4 ways](feedback_source_scanning_guards_need_three_meta_tests.md).
- [Findings inside a just-closed class](feedback_findings_inside_just_closed_classes_mean_wrong_instrument.md) — instrument is wrong, stop hardening.
- [Defer a guard needing its own design](feedback_defer_a_guard_that_needs_its_own_design.md) — founder ruling.
- [A green test certifies stale comments](feedback_a_green_test_certifies_its_stale_comments.md) / [gate the page not the viewer](feedback_survivorpulse_gate_page_not_viewer.md).
- [One sampled error, many root causes](feedback_survivorpulse_one_sampled_error_many_root_causes.md) / [guard the query's own loading state](feedback_read_the_querys_own_loading_state.md).
- [Grep callers before changing a resolver](feedback_grep_callers_before_changing_a_shared_resolver.md) / [duplicate vi.mock same module](feedback_duplicate_vi_mock_same_module.md).
- [Proving a flake fix without reproducing it](feedback_proving_a_flake_fix_without_reproducing_it.md) — measure the precursor.
- [A swinging TOTAL test count isn't a flake](feedback_a_swinging_total_test_count_is_not_a_flake.md) — checksum the files.
- [Relocating an entry point](feedback_relocating_an_entry_point_changes_its_threat_model.md) — changes threat model.
- [Verify a deferral reason](feedback_survivorpulse_verify_a_deferral_reason.md) / [premise may describe a sibling branch](feedback_task_premise_may_describe_an_unmerged_sibling_branch.md).
- [Collapse stale backlogs](feedback_survivorpulse_collapse_stale_backlogs.md) / [fetch and search before working](feedback_survivorpulse_fetch_and_search_before_work.md).
- [Semantic dup guardrails git can't see](feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see.md) / [ledger timestamps unorderable](feedback_survivorpulse_claim_ledger_timestamps_are_not_orderable.md).
- [Concurrent-session git discipline](feedback_survivorpulse_shared_worktree_staging_discipline.md) — stage by path.
- [Parallel triage agents share the worktree](feedback_parallel_triage_agents_share_the_dispatching_sessions_worktree.md) — chain atomically, re-verify HEAD.
- [Shared-resource outages misattributed](feedback_shared_resource_outages_are_misattributed.md) / [pkill by port not name](feedback_never_pkill_by_shared_entry_point.md) / [200 ≠ alive](feedback_a_200_is_not_proof_the_server_lived.md).
- [Prefix-mounted guards](feedback_prefix_mounted_guards_have_prefix_bounded_coverage.md) — blind past mount / [no em dashes in drafts](feedback_no_em_dashes_in_drafts.md).
- [Rely on self-learning, not monitoring](feedback_survivorpulse_rely_on_self_learning_not_manual_monitoring.md).
- [A doc saying code was deleted isn't evidence](feedback_a_doc_saying_code_was_deleted_is_not_evidence.md) / [verify fix site is live](feedback_verify_fix_site_is_live_before_citing_it.md).
- [Staged ticket headers rot into instructions](feedback_staged_ticket_headers_rot_into_harmful_instructions.md) / [AC can launder an ungroomed commit](feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision.md).
- [Derive from the quantity the reader validates](feedback_derive_from_the_quantity_the_reader_validates.md) / [rounding destroys ordering](feedback_rounding_a_display_input_destroys_ordering.md) / [value in output isn't a constant](feedback_a_value_in_output_is_not_a_constant.md).
- [Ticket's Proposed resolution can carry the defect](feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect.md) / [validated identifiers still carry wildcards](feedback_validated_identifiers_still_carry_sql_wildcards.md).
- [Tests that win an animation race](feedback_tests_that_pass_by_winning_an_animation_race.md) / [removal tests need most-rendered state](feedback_removal_tests_need_the_most_rendered_state.md).
- [Assert after the effect, not before](feedback_assert_after_the_effect_not_before_it.md) / [a third verdict can silence a signal](feedback_a_third_verdict_can_silence_a_signal.md).
- [A premise at a boundary inherits it](feedback_a_premise_measured_at_a_boundary_inherits_it.md) / [harness disagreement is evidence](feedback_a_harness_disagreement_is_evidence_about_the_harness.md) / [reviewer race on reverts](feedback_concurrent_reviewer_agents_race_on_shared_file_reverts.md).
- [A new error code activates dead UI](feedback_a_new_error_code_activates_old_dead_ui_code.md) / [helper can implement half a rule](feedback_a_helper_can_implement_half_a_rule.md).
- [Two correct fixes collide on one field](feedback_two_correct_fixes_can_collide_on_one_field.md) / [jsdom normalises inline styles](feedback_jsdom_normalises_inline_styles_two_traps.md).
- [Python round-trip edits flip files to CRLF](feedback_python_roundtrip_edits_flip_files_to_crlf.md) / [shape change needs a shape grep](feedback_a_shape_change_needs_a_shape_grep_not_a_name_grep.md).

## Shipping, environments, and infra

- [Replit publish never runs migrations](project_survivorpulse_replit_publish_does_not_run_migrations.md) — build/start only; a migration applied "as part of publishing" was a separate action.
- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md) / [publish prerequisites](project_survivorpulse_publish_prerequisites.md) — re-verify dated items.
- [The "~241 self-skip" caveat is obsolete](project_survivorpulse_ship_coverage_caveat_241_is_obsolete.md) — residual is 9, 5 run in Stage 2c.
- [Booting prod proves unsafe-dev flag off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md) / [Replit is autoscale](project_survivorpulse_replit_deployment_is_autoscale.md) — cache goes stale.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) / [production smoke access](project_survivorpulse_production_smoke_access.md) — use host not current_database().
- [Deployed dev app URL](project_survivorpulse_deployed_dev_url.md) — ask founder if stale / [legacy Repl rollback-only](project_survivorpulse_legacy_repl_is_rollback_only.md) — survivorpulse.com is v1.
- [Open access mode](project_survivorpulse_open_access_mode.md) — hides gate+paywall / [beta launch site decisions](project_survivorpulse_beta_launch_site_decisions.md).
- [Paid-tier launch target](project_survivorpulse_paid_tier_launch_target.md) — ~09-30/10-01 / [Moat Gap 3 wipeout status](project_survivorpulse_moat_gap3_wipeout_readout.md) — smaller than it looked.
- [SST-1247 residual-gap rulings](project_survivorpulse_sst1247_residual_gap_rulings.md) — RESOLVED / [Replit forwards X-Forwarded-Host](project_survivorpulse_replit_edge_passes_forwarded_host.md) — not mitigation.
- [Replit appends client IP as LAST XFF entry](project_survivorpulse_replit_edge_appends_client_ip_last.md) — trust proxy 1, hop count load-bearing.
- [A Neon branch named "production" is not prod](project_survivorpulse_neon_branch_named_production_is_not_prod.md) — it is ep-flat-rice in the dev project; prod is unreachable from Neon MCP.
- [Schema drift kills auth on whichever DB missed it](project_survivorpulse_schema_drift_takes_down_dev_app.md) / [.env has two DATABASE_URL lines](project_survivorpulse_env_database_url_two_lines.md) — first commented out.
- [CA1 self-contained](project_survivorpulse_ca1_is_self_contained.md) / [CRLF churn](project_survivorpulse_ca1_snapshot_crlf_churn.md) — no regen.
- [Bystander rule broke 2 distinctness tests](project_survivorpulse_bystander_rule_broke_two_distinctness_tests.md) / [Back Tester goldens re-baselined](project_survivorpulse_backtester_goldens_rebaselined_sst1342.md).
- [Discord CI webhook dead as of 2026-09-05](project_survivorpulse_discord_ci_webhook_dead_sst1571.md) — SST-1571, Blocked on founder rotating the secret.
- [GH Actions permissions:{} breaks checkout](project_survivorpulse_gh_actions_permissions_checkout_trap.md) — SST-1569; verify workflow YAML by live-dispatching, not reading.
- [curl status-check needs a set +e wrapper](project_survivorpulse_curl_status_check_needs_set_e_wrapper.md) — SST-1572; bash -e aborts before the diagnostic on a transport failure; continue-on-error also needs a $GITHUB_STEP_SUMMARY write to stay visible.

## Verifying UI for real

**A trustworthy live surface is the `sp-live-verify` skill, not memory.** Below: UI facts only.

- [Hidden Chrome window swallows synthesized keys](feedback_a_hidden_chrome_window_swallows_synthesized_keys.md).
- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md) / [compact-grid card layout trap](project_survivorpulse_compact_grid_card_layout_trap.md).
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md) / [flex % height + Radix focus traps](project_survivorpulse_flex_percentage_height_and_radix_traps.md).
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md) / [Radix outside-click arming race](project_survivorpulse_radix_outside_click_arming_race.md).
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md) / [react-query mock render loop](project_survivorpulse_react_query_mock_render_loop.md).
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md) — prod App-v1.tsx, dev App.tsx / [login ?next= same-origin only](project_survivorpulse_login_next_param_is_same_origin_only.md) / [per-user persistence late-auth trap](project_survivorpulse_per_user_client_persistence_late_auth_trap.md).

## Test infrastructure

- [Sandbox has no local Postgres](project_survivorpulse_sandbox_has_no_local_postgres.md) / [registerRoutes skips customSessionMiddleware](project_survivorpulse_customsessionmiddleware_not_in_registerroutes.md).
- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md) / [dev preview runs Vite dev server](project_survivorpulse_dev_preview_runs_vite_dev_server.md) — Playwright kills it.
- [A queued gate isn't a verified commit](project_survivorpulse_queued_gate_is_not_a_verified_commit.md) — concurrency cancels pending runs.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) / [E2E fixture provisioning](project_survivorpulse_e2e_fixture_provisioning.md) — ⚠️ REVERSED by SST-1213.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md) / [local flake-repro traps](project_survivorpulse_local_flake_repro_traps.md).
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md) / [openid-client PKCE broken in tests](project_survivorpulse_openid_client_pkce_broken_in_tests.md).
- [tsc excludes tests/ entirely](project_survivorpulse_tsc_excludes_tests_directory.md) / [clearAllRateLimits() no-op in Stage 2c](project_survivorpulse_clearallratelimits_is_cross_process_noop_in_stage2c.md).
- [Wrong /api path returns the SPA shell](project_survivorpulse_wrong_api_path_returns_spa_shell.md) — 200+HTML not 404.
- [17 env-gated suites invisible locally](project_survivorpulse_env_gated_suites_are_invisible_locally.md) / [Drizzle wraps pg errors on .cause](project_survivorpulse_drizzle_wraps_pg_errors_on_cause.md).
- [vitest exclude beats explicit CLI filename](project_survivorpulse_vitest_exclude_beats_explicit_cli_filename.md) — silently vanishes.

## Engine and domain behaviour

- [SST-783 pseudo-replication reversal](project_survivorpulse_sst783_pseudo_replication_reversal.md) / [SST-782 rank/scope errors](project_survivorpulse_sst782_rank_and_scope_errors.md).
- [Three near-identical "claimed team" fields](project_survivorpulse_three_claim_signals.md) / [elimination predicate rulings](project_survivorpulse_elimination_predicate_rulings.md).
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md) / [greedyPath fixture facts](project_survivorpulse_greedypath_fixture_facts.md).
- [Fabricated finality tier splits paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md) / [apply write-order collision](project_survivorpulse_apply_write_order_collision.md) / [past-season cascades](project_survivorpulse_past_season_apply_cascades.md).
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md) / [shared pool-week optimizer context](project_survivorpulse_shared_pool_week_context.md).
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md) / [missing field exposure collapses archetypes](project_survivorpulse_missing_field_exposure_collapses_archetypes.md).
- [Multi-pick renders only via 'past' variant](project_survivorpulse_multipick_past_variant_only.md) / [allocation order blessed](project_survivorpulse_allocation_order_blessed.md) / [reset-to-auto scope divergence](project_survivorpulse_reset_to_auto_apply_scope_divergence.md).

## App structure and data ownership

- [Notion "outage" is connector-specific](project_survivorpulse_notion_comment_outage_is_connector_specific.md) / [Notion via Chrome composer](project_survivorpulse_notion_comments_via_chrome_composer.md) — ⚠️ can corrupt last comment.
- [Notion via Chrome overwrites fields](project_survivorpulse_notion_via_chrome_field_overwrite.md) / [get-comments can't see replies](project_survivorpulse_notion_create_comment_write_path_defect.md).
- [Page read truncates long rich_text](project_survivorpulse_notion_page_read_truncates_rich_text.md) / [use OAuth for comments not notionApi](project_survivorpulse_notion_mcp_create_comment_missing_version.md).
- [Post comments via REST with NOTION_TOKEN](feedback_notion_comments_via_rest_when_mcp_missing_version.md) / [deleting a row needs notionApi](project_survivorpulse_notion_page_delete_path.md).
- [Notion select options aren't auto-created](project_survivorpulse_notion_select_options_not_autocreated.md) / [no branch protection, CI advisory only](project_survivorpulse_no_branch_protection_ci_advisory_only.md).
- [Route auth is opt-in](project_survivorpulse_route_auth_is_opt_in.md) / [bearer token cookie](project_survivorpulse_session_cookie_is_a_bearer_token.md).
- [client/src/content/ is governance-scanned](project_survivorpulse_content_dir_governance_scan.md) / [split route registration](project_survivorpulse_split_route_registration.md).
- [Workflow step names are parser markers](project_survivorpulse_workflow_step_names_are_parser_markers.md).
- [A dead page's route is still load-bearing](project_survivorpulse_dead_page_live_redirect_route.md) / [cockpit wrapper global-nav trap](project_survivorpulse_pool_cockpit_wrapper_global_nav_trap.md).
- [maxEntriesPerUser dual-mirror default](project_survivorpulse_max_entries_default_dual_mirror.md) / [admin pool marker](project_survivorpulse_admin_pool_classification.md) / [default-user-id trap](project_survivorpulse_default_user_id_ownership_trap.md).
- [SST number is an auto-increment column](project_survivorpulse_notion_sst_id_is_auto_increment.md) / [PickGrid.tsx dead](project_survivorpulse_pickgrid_dead_seasongrid_shared.md).
- [My Strategy wizard deleted](project_survivorpulse_my_strategy_wizard_unreachable.md) / [TanStack Query keys hash by value](project_survivorpulse_tanstack_query_keys_hash_by_value.md).
- [Identity-scope guard: data vs actor](project_survivorpulse_identity_scope_guard_data_vs_actor.md) — fires only on no-url-param routes; resolve if the id scopes DATA, classify if it charges an ACTOR.
- [Support Mode is server-side now](project_survivorpulse_support_mode_is_server_side.md) / [glob in a comment breaks block strippers](project_survivorpulse_glob_in_comment_breaks_block_stripper.md).
- [Beta outreach Notion databases](reference_beta_outreach_notion_databases.md) / [r/sportsbook, r/sportsbetting open fan-out targets](project_survivorpulse_sportsbook_subs_are_open_fanout_targets.md).
- [jbf302 app-review reminder](project_survivorpulse_jbf302_app_review_reminder.md) — founder owes him a look + feedback, target weekend of 2026-09-05/06.
