# SurvivorPulse Memory Index

## Working practice

- [Run tone-of-voice check before publishing social](feedback_run_tone_of_voice_before_publishing_social.md) — proactively, not on request.

- [Prefer Notion OAuth connector](feedback_prefer_notion_oauth_connector.md) — MCP is fallback-only.
- [Static dupe beaten by live DB proof](feedback_static_dupe_theory_beaten_by_live_db_proof.md) — re-fetch both tickets first.
- [Await vs fire-and-forget](project_survivorpulse_usage_event_await_vs_fire_and_forget.md) — await only if write IS the payload.
- [A "completed" agent can resume](feedback_resumed_background_agent_can_duplicate_orchestrator_actions.md) — duplicated a ticket filing.
- [Link "SurvivorPulse" sign-offs to the site](feedback_survivorpulse_signoff_links_to_site.md) — HTML sends only.
- [Load-bearing tests](feedback_proving_a_test_is_load_bearing.md) / [comment-only diffs](feedback_proving_a_change_is_comment_only.md) — RED-proof and +/- filter both miss MOVES.
- [Search memory before a tool failure is fatal](feedback_search_memory_before_accepting_a_tool_failure_as_fatal.md) — fix existed days earlier.
- [Guard the wire, not the helper](feedback_guard_the_wire_not_just_the_helper.md) / [wire-reached assertion](feedback_a_source_guard_must_assert_the_wire_is_reached.md) — 0/109 mutants killed.
- [Paired assertions both go vacuous](feedback_paired_assertions_both_vacuous_when_op_never_ran.md) — on a no-op.
- [An AC with no test citing it](feedback_an_ac_with_no_test_citing_it.md) — orphan check beat 2 review rounds.
- [Enumerate a typed return's fields](feedback_enumerate_a_typed_returns_fields_before_signing_off.md) / [by structural anchor](feedback_enumerate_by_the_structural_anchor.md).
- [Verify a reviewer's evidence](feedback_verify_a_reviewers_evidence_not_their_judgement.md) — 2 of 5 files wrong.
- [Check distribution before inferring convention](feedback_check_distribution_before_inferring_convention.md).
- [Renaming for clarity can recreate the defect](feedback_renaming_for_clarity_can_recreate_the_defect.md).
- [Sweep for the class, not the change](feedback_sweep_for_the_class_not_the_change.md).
- [Confirm the check covers what changed](feedback_confirm_the_check_covers_what_you_changed.md) — read include/exclude.
- [Local run differs from CI by construction](feedback_local_run_differs_from_ci_by_construction.md) — exits 0 silently.
- [Derive test expectations from the DB](feedback_derive_test_expectations_from_the_db_not_the_fixture.md) — not the fixture.
- [Source-text guards fooled by text](feedback_survivorpulse_source_text_guards_fooled_by_text.md) / [fail 4 ways](feedback_source_scanning_guards_need_three_meta_tests.md).
- [A green test certifies stale comments](feedback_a_green_test_certifies_its_stale_comments.md).
- [The naive fix is green](feedback_survivorpulse_gate_page_not_viewer.md) — gate the page, not the viewer.
- [One sampled error, many root causes](feedback_survivorpulse_one_sampled_error_many_root_causes.md) — grep each.
- [Guard the query you're reading](feedback_read_the_querys_own_loading_state.md) — a sibling's state lies.
- [Grep callers before changing a resolver](feedback_grep_callers_before_changing_a_shared_resolver.md).
- [Duplicate vi.mock for one module](feedback_duplicate_vi_mock_same_module.md) — winner varies by worker.
- [Proving a flake fix without reproducing it](feedback_proving_a_flake_fix_without_reproducing_it.md) — measure the precursor.
- [Relocating an entry point](feedback_relocating_an_entry_point_changes_its_threat_model.md) — changes its threat model.
- [Verify a deferral reason](feedback_survivorpulse_verify_a_deferral_reason.md) — don't inherit from a peer.
- [Collapse stale backlogs](feedback_survivorpulse_collapse_stale_backlogs.md) — ONE re-survey story.
- [Fetch and search before working](feedback_survivorpulse_fetch_and_search_before_work.md).
- [Semantic dup guardrails git can't see](feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see.md) / [ledger timestamps unorderable](feedback_survivorpulse_claim_ledger_timestamps_are_not_orderable.md).
- [Concurrent-session git discipline](feedback_survivorpulse_shared_worktree_staging_discipline.md) — stage by path.
- [A task premise may describe a sibling branch](feedback_task_premise_may_describe_an_unmerged_sibling_branch.md).
- [Shared-resource outages get misattributed](feedback_shared_resource_outages_are_misattributed.md) / [pkill by port not name](feedback_never_pkill_by_shared_entry_point.md) / [200 ≠ alive](feedback_a_200_is_not_proof_the_server_lived.md).
- [Prefix-mounted guards](feedback_prefix_mounted_guards_have_prefix_bounded_coverage.md) — blind past the mount.
- [No em dashes in drafts](feedback_no_em_dashes_in_drafts.md).
- [Rely on self-learning, not monitoring](feedback_survivorpulse_rely_on_self_learning_not_manual_monitoring.md).
- [A doc saying code was deleted isn't evidence](feedback_a_doc_saying_code_was_deleted_is_not_evidence.md) / [verify fix site is live](feedback_verify_fix_site_is_live_before_citing_it.md).
- [Staged ticket headers rot into instructions](feedback_staged_ticket_headers_rot_into_harmful_instructions.md).
- [An AC can launder an ungroomed commit](feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision.md) — `git log -S` first.
- [Derive from the quantity the reader validates](feedback_derive_from_the_quantity_the_reader_validates.md).
- [Rounding a display input destroys ordering](feedback_rounding_a_display_input_destroys_ordering.md).
- [A value in output is not a constant](feedback_a_value_in_output_is_not_a_constant.md) — read the producer.
- [Ticket's Proposed resolution can carry the defect](feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect.md).
- [Validated identifiers still carry wildcards](feedback_validated_identifiers_still_carry_sql_wildcards.md) — `_` is LIKE.
- [Tests that win an animation race](feedback_tests_that_pass_by_winning_an_animation_race.md) — UNMOUNT still passes.
- [Assert after the effect, not before it](feedback_assert_after_the_effect_not_before_it.md).
- [A third verdict can silence a signal](feedback_a_third_verdict_can_silence_a_signal.md).
- [A premise measured at a boundary inherits it](feedback_a_premise_measured_at_a_boundary_inherits_it.md).
- [A harness disagreement is evidence](feedback_a_harness_disagreement_is_evidence_about_the_harness.md) / [reviewer race on reverts](feedback_concurrent_reviewer_agents_race_on_shared_file_reverts.md).
- [A new error code activates dead UI](feedback_a_new_error_code_activates_old_dead_ui_code.md).
- [A helper can implement half a rule](feedback_a_helper_can_implement_half_a_rule.md) — new call site broke.
- [Two correct fixes can collide on one field](feedback_two_correct_fixes_can_collide_on_one_field.md) — each suite green.
- [jsdom normalizes inline styles](feedback_jsdom_normalises_inline_styles_two_traps.md) — drops var() border.
- [Removal tests need the most-rendered state](feedback_removal_tests_need_the_most_rendered_state.md).
- [Verify the commit, not the exit line](feedback_verify_the_commit_not_the_exit_line.md) — `echo` masked exit 1.
- [Python round-trip edits flip files to CRLF](feedback_python_roundtrip_edits_flip_files_to_crlf.md) — invisible in diff.

## Shipping, environments, and infra

- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md).
- [Publish prerequisites](project_survivorpulse_publish_prerequisites.md) — re-verify dated items.
- [A booting prod proves the unsafe-dev flag is off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md).
- [Replit deployment is autoscale](project_survivorpulse_replit_deployment_is_autoscale.md) — in-process cache goes stale.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) — read the deployed bundle.
- [Production smoke access](project_survivorpulse_production_smoke_access.md) — use host, not `current_database()`.
- [Deployed dev app URL](project_survivorpulse_deployed_dev_url.md) — ask founder to refresh if stale.
- [Legacy Repl is rollback-only](project_survivorpulse_legacy_repl_is_rollback_only.md) — survivorpulse.com serves v1.
- [Open access mode](project_survivorpulse_open_access_mode.md) — one constant hides gate + paywall.
- [Beta launch site decisions](project_survivorpulse_beta_launch_site_decisions.md) — founder rulings.
- [SST-1247 residual-gap rulings](project_survivorpulse_sst1247_residual_gap_rulings.md) — RESOLVED.
- [Replit edge forwards X-Forwarded-Host](project_survivorpulse_replit_edge_passes_forwarded_host.md) — not a mitigation.
- [Schema drift kills the dev app](project_survivorpulse_schema_drift_takes_down_dev_app.md).
- [.env has two DATABASE_URL lines](project_survivorpulse_env_database_url_two_lines.md) — first is commented out.
- [CA1 self-contained](project_survivorpulse_ca1_is_self_contained.md) / [CRLF churn](project_survivorpulse_ca1_snapshot_crlf_churn.md) — no regen.
- [Bystander rule broke 2 distinctness tests](project_survivorpulse_bystander_rule_broke_two_distinctness_tests.md).
- [Back Tester goldens re-baselined](project_survivorpulse_backtester_goldens_rebaselined_sst1342.md) — regen reintroduces bug.

## Verifying UI for real

**A trustworthy live surface is the `sp-live-verify` skill, not memory — it loads every time.** Below: UI facts only.

- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md) — a resizing dialog re-centres.
- [Compact-grid card layout trap](project_survivorpulse_compact_grid_card_layout_trap.md) — space-between crushes content.
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md) — loses to inline.
- [Flex % height + Radix focus traps](project_survivorpulse_flex_percentage_height_and_radix_traps.md) — `h-full` degrades.
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md) — detaches, eats taps.
- [Radix outside-click arming race](project_survivorpulse_radix_outside_click_arming_race.md) — immediate click dropped.
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md) — blank-pages silently.
- [react-query mock render loop](project_survivorpulse_react_query_mock_render_loop.md) — fresh array per call.
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md) — prod is App-v1.tsx, dev is App.tsx.
- [login ?next= is same-origin only](project_survivorpulse_login_next_param_is_same_origin_only.md).
- [Per-user persistence late-auth trap](project_survivorpulse_per_user_client_persistence_late_auth_trap.md).

## Test infrastructure

- [Sandbox has no local Postgres](project_survivorpulse_sandbox_has_no_local_postgres.md) — needs targeted CI dispatch.
- [registerRoutes skips customSessionMiddleware](project_survivorpulse_customsessionmiddleware_not_in_registerroutes.md).
- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md) — narrowed runs aren't controls.
- [Dev preview runs an unbundled Vite server](project_survivorpulse_dev_preview_runs_vite_dev_server.md) — Playwright kills it.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) — persistent DB masked months of drift.
- [E2E fixture provisioning](project_survivorpulse_e2e_fixture_provisioning.md) — ⚠️ REVERSED by SST-1213.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md) — skips globalTimeout abort.
- [Local flake-repro traps](project_survivorpulse_local_flake_repro_traps.md) — block the event loop, not CPU.
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md) — two causes, one message.
- [openid-client PKCE broken in tests](project_survivorpulse_openid_client_pkce_broken_in_tests.md) — stub one hash.
- [tsc excludes tests/ entirely](project_survivorpulse_tsc_excludes_tests_directory.md).
- [clearAllRateLimits() is cross-process no-op in Stage 2c](project_survivorpulse_clearallratelimits_is_cross_process_noop_in_stage2c.md).

## Engine and domain behaviour

- [SST-783 pseudo-replication reversal](project_survivorpulse_sst783_pseudo_replication_reversal.md) — RE-confirmed at 10 seasons.
- [SST-782 rank and scope errors](project_survivorpulse_sst782_rank_and_scope_errors.md) — wipeout table was unscoped.
- [Three near-identical "claimed team" fields](project_survivorpulse_three_claim_signals.md) — wrong one wired to the badge.
- [Elimination predicate rulings](project_survivorpulse_elimination_predicate_rulings.md) — tie=loss, buyback at read time.
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md) — one defect, nine tickets.
- [greedyPath fixture facts](project_survivorpulse_greedypath_fixture_facts.md) — rows carry no `score`.
- [Fabricated finality tier splits the paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md).
- [Apply write-order collision](project_survivorpulse_apply_write_order_collision.md) / [past-season cascades](project_survivorpulse_past_season_apply_cascades.md).
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md).
- [Shared pool-week optimizer context](project_survivorpulse_shared_pool_week_context.md) — per-entry is not.
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md) — caching invariant.
- [Missing field exposure collapses archetypes](project_survivorpulse_missing_field_exposure_collapses_archetypes.md).
- [Multi-pick renders only via 'past' variant](project_survivorpulse_multipick_past_variant_only.md).
- [Allocation order blessed](project_survivorpulse_allocation_order_blessed.md) — UUID-order for UNIFORM stakes.
- [Reset-to-auto stays grid-matched](project_survivorpulse_reset_to_auto_apply_scope_divergence.md).

## App structure and data ownership

- [Notion "outage" is connector-specific](project_survivorpulse_notion_comment_outage_is_connector_specific.md) — OAuth first.
- [Notion via Chrome composer](project_survivorpulse_notion_comments_via_chrome_composer.md) — ⚠️ can corrupt last comment.
- [Notion via Chrome overwrites fields](project_survivorpulse_notion_via_chrome_field_overwrite.md).
- [get-comments can't see replies](project_survivorpulse_notion_create_comment_write_path_defect.md) — write succeeds, read blind.
- [A page read truncates long rich_text](project_survivorpulse_notion_page_read_truncates_rich_text.md) — silently.
- [Use OAuth for comments, not notionApi](project_survivorpulse_notion_mcp_create_comment_missing_version.md).
- [Deleting a Notion row needs notionApi](project_survivorpulse_notion_page_delete_path.md) — OAuth has no delete.
- [Notion select options aren't auto-created](project_survivorpulse_notion_select_options_not_autocreated.md) — ALTER replaces ALL.
- [No branch protection, CI is advisory](project_survivorpulse_no_branch_protection_ci_advisory_only.md).
- [Route auth is opt-in](project_survivorpulse_route_auth_is_opt_in.md) / [bearer token cookie](project_survivorpulse_session_cookie_is_a_bearer_token.md).
- [client/src/content/ is governance-scanned](project_survivorpulse_content_dir_governance_scan.md) — exports must be plain data.
- [Split route registration](project_survivorpulse_split_route_registration.md) — routes.ts AND index.ts.
- [A dead page's route is still load-bearing](project_survivorpulse_dead_page_live_redirect_route.md).
- [Cockpit wrapper global-nav trap](project_survivorpulse_pool_cockpit_wrapper_global_nav_trap.md) — don't seed nav week.
- [maxEntriesPerUser dual-mirror default](project_survivorpulse_max_entries_default_dual_mirror.md) — lives in 4 places.
- [Admin pool marker](project_survivorpulse_admin_pool_classification.md) / [default-user-id trap](project_survivorpulse_default_user_id_ownership_trap.md).
- [SST number is an auto-increment column](project_survivorpulse_notion_sst_id_is_auto_increment.md) — never invent one.
- [PickGrid.tsx is dead](project_survivorpulse_pickgrid_dead_seasongrid_shared.md) — SeasonGrid/WeekView shared.
- [My Strategy wizard: deleted](project_survivorpulse_my_strategy_wizard_unreachable.md) — pieces survive via /tools/*.
- [TanStack Query keys hash by value](project_survivorpulse_tanstack_query_keys_hash_by_value.md) — one cache entry.
- [Support Mode is server-side now](project_survivorpulse_support_mode_is_server_side.md) — ?supportUserId= retired.
- [A glob in a comment breaks block strippers](project_survivorpulse_glob_in_comment_breaks_block_stripper.md).
- [Beta outreach Notion databases](reference_beta_outreach_notion_databases.md) — update Prospect Tracker + Outreach Log.
