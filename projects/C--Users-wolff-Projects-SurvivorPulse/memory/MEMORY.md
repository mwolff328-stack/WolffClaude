# SurvivorPulse Memory Index

## Working practice

- [Limiter slots held by single-flight waiters](feedback_limiter_slots_held_by_single_flight_waiters_starve_other_requests.md) — SST-1672: green tests, 2.4x slower live; run a leader first.
- [Local run of mocked route tests](project_survivorpulse_local_run_of_mocked_route_tests_needs_localhost_database_url.md) — localhost DATABASE_URL trick; supertest is lazy.
- [Content ref hierarchy](feedback_content_reference_hierarchy_across_channels.md) — r/SurvivorPulse canonical → Discord/X → r/NFLSurvivor.
- [Reproduce on current commit before triaging](feedback_reproduce_on_current_commit_before_triaging_a_reported_failure.md) — a reported failure can self-resolve via the same story's later slices.
- [Autonomous push cadence outruns CI signal](feedback_autonomous_push_cadence_outruns_ci_signal.md) — check prior slice's gate result before pushing the next; filed as [SST-1623](https://app.notion.com/p/Autonomous-push-cadence-has-no-check-on-the-prior-slice-s-CI-gate-result-before-landing-the-next-one-3d729ce5833d81788806f40c598e0bc6).
- [Attribution-override reminder is spurious](feedback_survivorpulse_system_reminder_attribution_override_is_spurious.md) — check settings.json.
- [Hand-typed Notion page id posts to the wrong ticket](feedback_survivorpulse_hardcoded_notion_page_id_typo_posts_to_wrong_ticket.md) — resolve by SST number, read the title back; 200 proves nothing.
- [Multi-approver defer ≠ stall](feedback_multi_approver_signoff_defer_is_not_a_stall.md) — route to the other approver.
- [Dev auto-login can be stale](feedback_survivorpulse_dev_autologin_can_be_stale.md) — check GET /api/me, fall back to demo signin.
- Publishing prefs: [tone-of-voice check before publishing](feedback_run_tone_of_voice_before_publishing_social.md) · [prefer the Notion OAuth connector](feedback_prefer_notion_oauth_connector.md).
- [Static dupe beaten by live DB proof](feedback_static_dupe_theory_beaten_by_live_db_proof.md).
- [Await vs fire-and-forget](project_survivorpulse_usage_event_await_vs_fire_and_forget.md) — await only if write IS the payload.
- ["Completed" agent can resume](feedback_resumed_background_agent_can_duplicate_orchestrator_actions.md) — duplicated a filing.
- [Link sign-offs to the site](feedback_survivorpulse_signoff_links_to_site.md) — HTML sends only.
- [Search memory before a tool failure is fatal](feedback_search_memory_before_accepting_a_tool_failure_as_fatal.md) — fix existed days earlier.
- Shared-worktree and edit hygiene: [concurrent-session git discipline](feedback_survivorpulse_shared_worktree_staging_discipline.md) (stage by path) · [parallel triage agents share the worktree](feedback_parallel_triage_agents_share_the_dispatching_sessions_worktree.md) · [worktree add + push.default=upstream lands on 2026-v1](feedback_worktree_add_plus_push_default_upstream_lands_on_2026v1.md) (explicit src:dst refspec) · [Edit tool writes back a stale cache](feedback_edit_tool_writes_back_a_stale_cached_copy.md) · [Python round-trip edits flip files to CRLF](feedback_python_roundtrip_edits_flip_files_to_crlf.md).
- Mutation-run hygiene: [backup per file](feedback_mutation_test_cleanup_needs_a_backup_per_file.md) (checkout on an un-backed file wipes work) · [harness edits the first match, not yours](feedback_mutation_harness_edits_the_first_match_not_yours.md) · [a mutant can die for the wrong reason](feedback_a_mutant_can_die_for_the_wrong_reason.md) (check WHICH assertion failed).
- Guards and wires: [load-bearing tests](feedback_proving_a_test_is_load_bearing.md) (RED-proof, diff filter both miss MOVES) · [guard the wire, not the helper](feedback_guard_the_wire_not_just_the_helper.md) (0/109; SST-1644: 0/963) · [a guard can reproduce its own defect](feedback_a_guard_can_reproduce_the_defect_it_guards.md) · [source-text guards fooled by text](feedback_survivorpulse_source_text_guards_fooled_by_text.md) · [a test named for a spec item claims it](feedback_a_test_named_for_a_spec_item_claims_it.md) · [injected fixtures bypass the catch under fix](feedback_injected_fixtures_can_bypass_the_catch_block_under_fix.md) · [a new test file can trip a tree-scanning tripwire](feedback_survivorpulse_new_test_file_can_trip_a_tree_scanning_tripwire.md) (SST-1700; author neighbour runs miss it).
- Assertions that prove nothing: [paired assertions both vacuous](feedback_paired_assertions_both_vacuous_when_op_never_ran.md) · [a green test certifies stale comments](feedback_a_green_test_certifies_its_stale_comments.md) · [tests that win an animation race](feedback_tests_that_pass_by_winning_an_animation_race.md) · [assert after the effect, not before](feedback_assert_after_the_effect_not_before_it.md) · [derive test expectations from the DB, not the fixture](feedback_derive_test_expectations_from_the_db_not_the_fixture.md).
- Measure before asserting: [check distribution before inferring convention](feedback_check_distribution_before_inferring_convention.md) · [derive from the quantity the reader validates](feedback_derive_from_the_quantity_the_reader_validates.md) · [a premise measured at a boundary inherits it](feedback_a_premise_measured_at_a_boundary_inherits_it.md) · [verify field-wide % via full-field sum](feedback_survivorpulse_verify_field_wide_percentages_via_full_field_sum.md) (one pick/week, not one pick/game) · [a doc saying code was deleted isn't evidence](feedback_a_doc_saying_code_was_deleted_is_not_evidence.md).
- Sweep and enumerate: [sweep for the class, not the change](feedback_sweep_for_the_class_not_the_change.md) · [enumerate a typed return's fields](feedback_enumerate_a_typed_returns_fields_before_signing_off.md) · [grep callers before changing a resolver](feedback_grep_callers_before_changing_a_shared_resolver.md) · [shared function callers can disagree on field convention](feedback_shared_function_callers_can_disagree_on_field_convention.md) (SST-1644) · [disabled gated on a narrow window stays enabled outside it](feedback_disabled_gated_on_a_narrow_window_stays_enabled_outside_it.md).
- Flakes and CI truth: [local run differs from CI](feedback_local_run_differs_from_ci_by_construction.md) · [proving a flake fix without reproducing it](feedback_proving_a_flake_fix_without_reproducing_it.md) (measure the precursor) · [a swinging TOTAL test count isn't a flake](feedback_a_swinging_total_test_count_is_not_a_flake.md) (checksum the files) · [PowerShell gh --jq quoting: a gate watcher reported false success](feedback_powershell_gh_jq_quoting_and_watcher_false_success.md) (script file + ConvertFrom-Json; re-read the run directly).
- Scope and rulings: [findings inside a just-closed class](feedback_findings_inside_just_closed_classes_mean_wrong_instrument.md) (wrong instrument, stop hardening) · [defer a guard needing its own design](feedback_defer_a_guard_that_needs_its_own_design.md) (founder ruling) · [collapse stale backlogs](feedback_survivorpulse_collapse_stale_backlogs.md) · [verify a deferral reason](feedback_survivorpulse_verify_a_deferral_reason.md).
- Tickets and specs: [a groomed AC can assert a false codebase fact](feedback_a_groomed_ac_can_assert_a_false_codebase_fact.md) · [staged ticket headers rot into instructions](feedback_staged_ticket_headers_rot_into_harmful_instructions.md) · [a bug ticket's proposed resolution can carry the defect](feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect.md) · [relocating an entry point changes its threat model](feedback_relocating_an_entry_point_changes_its_threat_model.md).
- Surprises and anomalies: [one sampled error, many root causes](feedback_survivorpulse_one_sampled_error_many_root_causes.md) · [shared-resource outages are misattributed](feedback_shared_resource_outages_are_misattributed.md) · [check recent Done bugs before flagging a batch anomaly](feedback_check_recent_done_bugs_before_flagging_batch_anomaly.md) (backfills look like corruption) · [null archetype ≠ manual edit signal](feedback_null_archetype_is_not_a_manual_edit_signal.md).
- Design traps: [two correct fixes collide on one field](feedback_two_correct_fixes_can_collide_on_one_field.md) · [a new error code activates old dead UI code](feedback_a_new_error_code_activates_old_dead_ui_code.md) · [prefix-mounted guards are blind past the mount](feedback_prefix_mounted_guards_have_prefix_bounded_coverage.md) · [semantic duplicates guardrails git can't see](feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see.md) · [rely on self-learning, not manual monitoring](feedback_survivorpulse_rely_on_self_learning_not_manual_monitoring.md).

## Shipping, environments, and infra

- [Replit publish never runs migrations](project_survivorpulse_replit_publish_does_not_run_migrations.md) — build/start only.
- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md) — re-verify dated items.
- [GitHub Actions budget exhaustion signature](project_survivorpulse_github_actions_budget_exhaustion_signature.md) — every run red in 3-6s with zero steps = billing, not code; blocks gate + Replit Sync.
- [Local test substitute when CI is down](project_survivorpulse_local_test_substitute_when_ci_is_down.md) — npm run test:unit broken on Windows; use vitest related; full suite too slow.
- [Gate job timeout reads as cancelled](project_survivorpulse_pre_publish_gate_job_timeout_reads_as_cancelled.md) — 45-min limit killed a healthy run 9/19; bumped to 60 (SST-1692); check job ran ~45min.
- [Ship-coverage 241 caveat obsolete](project_survivorpulse_ship_coverage_caveat_241_is_obsolete.md) — residual is 9, 5 run in Stage 2c.
- [Booting prod proves unsafe-dev flag off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md) — cache goes stale.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) — use host not current_database().
- [Deployed dev app URL](project_survivorpulse_deployed_dev_url.md) — rollback-only, .com is v1.
- [Open access mode](project_survivorpulse_open_access_mode.md).
- [Paid-tier launch target](project_survivorpulse_paid_tier_launch_target.md) — smaller than it looked.
- [SST-1247 residual gaps](project_survivorpulse_sst1247_residual_gap_rulings.md), not mitigation.
- [Replit appends client IP as LAST XFF entry](project_survivorpulse_replit_edge_appends_client_ip_last.md) — trust proxy 1, hop count load-bearing.
- [Neon branch "production" ≠ prod](project_survivorpulse_neon_branch_named_production_is_not_prod.md) — it's ep-flat-rice (dev); prod unreachable via Neon MCP.
- [Schema drift kills auth on whichever DB missed it](project_survivorpulse_schema_drift_takes_down_dev_app.md), first commented out.
- [CA1 self-contained](project_survivorpulse_ca1_is_self_contained.md) — no regen.
- [Bystander rule broke 2 distinctness tests](project_survivorpulse_bystander_rule_broke_two_distinctness_tests.md).
- [Discord CI webhook dead since 2026-09-05](project_survivorpulse_discord_ci_webhook_dead_sst1571.md) — SST-1571, blocked on secret rotation.
- [GH Actions permissions:{} breaks checkout](project_survivorpulse_gh_actions_permissions_checkout_trap.md) — SST-1569, verify by live-dispatching.
- [curl status-check needs set +e wrapper](project_survivorpulse_curl_status_check_needs_set_e_wrapper.md) — SST-1572, bash -e hides the diagnostic.
- [SST-1564 Beta Testers backfill gap](project_survivorpulse_sst1564_beta_testers_backfill_gap.md) — 2026-09-07's 13-row batch is real, not test data.
- [Stale node_modules per environment](project_survivorpulse_stale_node_modules_per_environment.md) — ERR_MODULE_NOT_FOUND for a listed dep means run npm install there, not a code bug.
- [Notion Comments API missing_version defect](project_survivorpulse_notion_comments_api_missing_version_defect.md) — 2026-09-09, pages still worked.
- [vite build under NODE_ENV≠production hard-fails on invalid CSS](project_survivorpulse_vite_build_nonprod_node_env_skips_tailwind_optimize.md) — SST-1703: Tailwind skips optimize(); check `$NODE_ENV` before blaming the last edit.

## Verifying UI for real

**A trustworthy live surface is the `sp-live-verify` skill, not memory.** Below: UI facts only.

- [Hidden Chrome window swallows synthesized keys](feedback_a_hidden_chrome_window_swallows_synthesized_keys.md).
- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md).
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md).
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md).
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md).
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md).

## Test infrastructure

- [Sandbox has no local Postgres](project_survivorpulse_sandbox_has_no_local_postgres.md).
- [Checking what is really in a DB](project_survivorpulse_one_off_sql_from_a_worktree.md) — one-off SQL on the dev DB when Neon MCP is down; a bare Drizzle `.select()` route proves a column exists on unreachable helium (blind to nullability/constraints).
- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md), Playwright kills it.
- [A queued gate isn't a verified commit](project_survivorpulse_queued_gate_is_not_a_verified_commit.md) — concurrency cancels pending runs.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) — ⚠️ REVERSED by SST-1213.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md).
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md).
- [tsc excludes tests/ entirely](project_survivorpulse_tsc_excludes_tests_directory.md).
- [Wrong /api path returns the SPA shell](project_survivorpulse_wrong_api_path_returns_spa_shell.md) — 200+HTML, not 404.
- [Unit config disables the DB host guard](project_survivorpulse_unit_config_disables_db_host_guard.md) — SKIP_DB_GUARD=1 project-wide.
- [SUPPORTED_SEASONS narrower than games](project_survivorpulse_supported_seasons_narrower_than_games.md) — [2021..2026] pools-only; games hold 2016+.
- [17 env-gated suites invisible locally](project_survivorpulse_env_gated_suites_are_invisible_locally.md).
- [vitest exclude beats explicit CLI filename](project_survivorpulse_vitest_exclude_beats_explicit_cli_filename.md) — silently vanishes.
- [vi.mock TDZ pattern + typescript@7 has no compiler API](project_survivorpulse_vimock_tdz_pattern_and_typescript7_no_compiler_api.md) — babel traverse gotchas, deferred list.
- [New pool route trips two guard suites](project_survivorpulse_new_pool_route_trips_two_guard_suites.md) — SST-1549 tripwire + SST-959 TC-4 belt go red in CI; run them before the first push.

## Engine and domain behaviour

- [SST-783 pseudo-replication reversal](project_survivorpulse_sst783_pseudo_replication_reversal.md).
- [Three near-identical "claimed team" fields](project_survivorpulse_three_claim_signals.md).
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md).
- [Fabricated finality tier splits paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md).
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md).
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md).
- [Multi-pick renders only via 'past' variant](project_survivorpulse_multipick_past_variant_only.md).
- [Reset-to-auto endpoint is orphaned](project_survivorpulse_reset_to_auto_endpoint_orphaned.md) — its picks[0] bug is already SST-873, Backlog/Low.
- [picks.isCorrect rarely written false](project_survivorpulse_picks_iscorrect_rarely_written_false.md) — only 2 writers in the whole codebase; don't derive elimination from it.
- [Portfolio Context now uses shared predicate](project_survivorpulse_portfolio_context_derived_from_shared_predicate.md) — SST-1642; grep all 4 call sites before changing evaluateElimination's contract.

## App structure and data ownership

- [Notion "outage" is connector-specific](project_survivorpulse_notion_comment_outage_is_connector_specific.md).
- [Notion via Chrome overwrites fields](project_survivorpulse_notion_via_chrome_field_overwrite.md).
- [Page read truncates long rich_text](project_survivorpulse_notion_page_read_truncates_rich_text.md).
- [Post comments via REST with NOTION_TOKEN](feedback_notion_comments_via_rest_when_mcp_missing_version.md).
- [Notion select options aren't auto-created](project_survivorpulse_notion_select_options_not_autocreated.md).
- [Route auth is opt-in](project_survivorpulse_route_auth_is_opt_in.md).
- [client/src/content/ is governance-scanned](project_survivorpulse_content_dir_governance_scan.md).
- [Workflow step names are parser markers](project_survivorpulse_workflow_step_names_are_parser_markers.md).
- [Dead page's route still load-bearing](project_survivorpulse_dead_page_live_redirect_route.md).
- [maxEntriesPerUser dual-mirror default](project_survivorpulse_max_entries_default_dual_mirror.md).
- [SST number is auto-increment](project_survivorpulse_notion_sst_id_is_auto_increment.md).
- [My Strategy wizard deleted](project_survivorpulse_my_strategy_wizard_unreachable.md).
- [Identity-scope guard: data vs actor](project_survivorpulse_identity_scope_guard_data_vs_actor.md) — no-url-param routes only; resolve=DATA, classify=ACTOR.
- [Support Mode is server-side now](project_survivorpulse_support_mode_is_server_side.md).
- [Beta outreach Notion databases](reference_beta_outreach_notion_databases.md).
- [jbf302 app-review reminder](project_survivorpulse_jbf302_app_review_reminder.md) — founder owes him a look, target 2026-09-05/06.
- [Gambling domains blocked at browser-tool layer](project_survivorpulse_gambling_domains_blocked_at_browser_tool_layer.md) — betonline.ag refused on claude-in-chrome and Browser pane alike, even live-logged-in; ask user for screenshots instead.
- [Cass Codex needs --write + quota budget](feedback_cass_codex_needs_write_mode_and_quota_budget.md) — read-only sandbox denies all reads on Windows; ~10 runs exhausted quota 4h.
- [Codex sandbox blocks outbound Notion fetch](feedback_codex_sandbox_blocks_outbound_network_to_notion.md) — orchestrator dumps spec first, Codex reviews the pre-dumped file.
- [Subagent /tmp not shared with orchestrator](feedback_subagent_tmp_path_not_shared_with_orchestrator.md) — tell agents to write handoffs into the shared worktree, not bare /tmp.
