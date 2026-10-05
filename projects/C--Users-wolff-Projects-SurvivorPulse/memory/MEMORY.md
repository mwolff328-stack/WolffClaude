# SurvivorPulse Memory Index

## Working practice

- [Genuine Cass on the BUILD finds identity-swap races reviews miss](feedback_survivorpulse_genuine_cass_finds_identity_swap_races_persona_reviews_miss.md) — SST-1802 10/4: FAIL with 5 reproduced blockers after all persona reviews passed; batch fixes (quota resets 8:20 PM).
- [Paywall switch and beta pricing: state at 10/4](project_survivorpulse_paywall_switch_and_beta_pricing_state_2026_10_04.md) — Option A: SST-1739 + SST-1717 built on 2026-v1 (852c5ffa, CI green), In Review not Done (delta Codex pass owed); billing 1715/1716/1718/1719 stay Grooming, no date.
- [Repoint sweep by import misses implicit dependents](feedback_survivorpulse_repoint_sweep_by_import_misses_tests_that_depend_on_a_module_implicitly.md) — SST-1739 C1 left 4 files red in CI (10/4); find dependents via importers of the changed hook; fix forward with a fix-only commit on live origin tip.
- [Cross-worktree write hook is a guard, don't route around it](feedback_survivorpulse_cross_worktree_write_hook_is_a_guard_do_not_route_around_it.md) — 10/4: agents can't edit extra worktrees; one copied files via Bash and I told the next to; one worktree, sequential builders, or ask the founder.
- [Never dump the environment in a Bash call](feedback_never_dump_env_in_bash_output.md) — a stray `export -n` printed live API keys and tokens into the saved transcript (10/2); print counts or booleans only, never `export`, `env`, `printenv`.
- [Worktree node_modules can be empty, so checks use the main checkout's](project_survivorpulse_stale_node_modules_per_environment.md) — 10/2 addendum: run `npm ci` inside the worktree whenever package.json or the lockfile changed; a green local check proves nothing about a new dependency otherwise.
- [Two separate season/week selectors, both entitlement-gated](project_survivorpulse_two_season_selectors_desktop_vs_mobile.md) — SST-1789 gated the mobile bar; latent while OPEN_ACCESS_MODE is true; Playwright CI is a SEPARATE workflow from the Pre-Publish Gate, read both.
- [Paywall model: signed-in means subscribed](project_survivorpulse_paywall_model_signed_in_means_subscribed.md) — founder 2026-10-02: no "signed-in non-subscriber" once the paywall is on; free tier = signed-out /rankings capped at current week (SST-1797).
- [SST-1797 signed-out week cap: DONE](project_survivorpulse_sst1797_signed_out_week_cap_regroomed_after_founder_rulings.md) — 10/4; 10 commits on 2026-v1 (358aae2a..fef5390e); live on dev + prod; Vlad QA PASS WITH FINDINGS; residuals + Pam's follow-ups inside.
- [Real-shell RTL tests flake on the default 1 s waits](feedback_survivorpulse_real_shell_rtl_tests_flake_on_default_1s_waits_raise_asyncutiltimeout.md) — SST-1797 TC-36 failed 4/6 locally, green in CI; `configure({ asyncUtilTimeout: 10_000 })`; measure with a repeat loop; rebase-blocked-by-CRLF-noise recipe.
- [Notion MCP update-a-block fails; use REST patch script](feedback_notion_mcp_update_a_block_fails_validation_use_rest_patch.md) — 10/3: `update_paragraph.cjs`; also never return raw fetch bodies from Chrome JS.
- [Production edge rewrites Cache-Control public to private](project_survivorpulse_production_edge_rewrites_public_cache_control_to_private.md) — 10/3: dev says public, prod says private; expected, not a bug.
- [Resumed persona agent can hit its own message limit](feedback_survivorpulse_resumed_persona_agent_can_hit_its_own_message_limit_start_fresh_from_handoff.md) — Deb refused to build; start a fresh agent from a handoff file; sequential builders in one worktree.
- [Playwright CAN run locally against a self-booted server](project_survivorpulse_playwright_can_run_locally_against_a_self_booted_server.md) — recipe + limits; supersedes "CI-only"; live surfaces that worked.
- [Cass rounds converge by deleting mechanisms, not patching](feedback_survivorpulse_cass_rounds_converge_by_deleting_mechanisms_not_patching.md) — 6 rounds on SST-1797; delete client state, verify premises in code, bound with PASS WITH MINORS.
- [Notion comment anchor must match exactly one span](feedback_notion_comment_anchor_must_match_exactly_one_span_use_full_block_text.md) — ellipsis anchors fail "Multiple matches" and dump the page; use full block text.
- [Notion comment markdown rejects `:word:` as a custom emoji](feedback_notion_comment_markdown_rejects_colon_word_colon_as_custom_emoji.md) — use `=` not a colon pair; nothing posted on failure.
- [SST-1715/1716 planned a duplicate hardDeleteUser FK guard](project_survivorpulse_sst1715_1716_plan_duplicate_fk_guard.md) — reuse tests/hardDeleteUserFkCoverage.tripwire.test.ts.
- [Copy exact headers from a known-working caller](feedback_survivorpulse_copy_exact_headers_from_working_caller_not_route_handler.md) — SST-1732: global CSRF middleware is invisible inside the handler.
- [Ship verdicts go to the Releases database, not SST-1491](feedback_survivorpulse_ship_verdicts_go_to_releases_database_not_sst1491.md) — founder ruling 9/25.
- [Ship-aggregator worktree needs a fast-forward before local checks](feedback_ship_aggregator_worktree_must_be_fast_forwarded_before_local_checks.md) — fresh worktrees don't auto-advance.
- [Worktrees share remote-tracking refs, so the tip moves under you](feedback_survivorpulse_worktrees_share_remote_tracking_refs_tip_moves_under_you.md) — re-fetch before ff and before filing.
- ["Tests green" from a build session is a subset; read the real pre-publish log](feedback_survivorpulse_build_session_green_claim_is_a_subset_read_the_real_prepublish_log.md) — SST-1784.
- [Cass final pass is waivable when Codex quota is low](feedback_cass_final_pass_is_waivable_when_codex_quota_low.md) — SST-1756: one Cass run max on Low client-only stories.
- [Limiter slots held by single-flight waiters](feedback_limiter_slots_held_by_single_flight_waiters_starve_other_requests.md) — SST-1672: run a leader first.
- [Check write-path reachability before assuming read logic is broken](feedback_check_write_path_reachability_before_assuming_read_logic_is_broken.md) — SST-1714: grep for callers.
- [hardDeleteUser FK gaps recur](feedback_harddeleteuser_fk_gaps_recur_audit_full_fk_list.md) — audit the full `users.id` FK list, not one table.
- [Local run of mocked route tests](project_survivorpulse_local_run_of_mocked_route_tests_needs_localhost_database_url.md) — localhost DATABASE_URL trick.
- [Content ref hierarchy](feedback_content_reference_hierarchy_across_channels.md) — r/SurvivorPulse canonical → Discord/X → r/NFLSurvivor.
- [Weekly Rankings post workflow](project_survivorpulse_weekly_rankings_post_workflow.md) — pull live from survivorpulse.com, re-pull per platform.
- [Reproduce on current commit before triaging](feedback_reproduce_on_current_commit_before_triaging_a_reported_failure.md) — later slices may self-resolve it.
- [Autonomous push cadence outruns CI signal](feedback_autonomous_push_cadence_outruns_ci_signal.md) — check the prior slice's gate before the next push (SST-1623).
- [Attribution-override reminder is spurious](feedback_survivorpulse_system_reminder_attribution_override_is_spurious.md) — check settings.json.
- [Hand-typed Notion page id posts to the wrong ticket](feedback_survivorpulse_hardcoded_notion_page_id_typo_posts_to_wrong_ticket.md) — resolve by SST number, read the title back.
- [Multi-approver defer ≠ stall](feedback_multi_approver_signoff_defer_is_not_a_stall.md) — route to the other approver.
- [Dev auto-login can be stale](feedback_survivorpulse_dev_autologin_can_be_stale.md) — check GET /api/me, fall back to demo signin.
- Publishing prefs: [tone-of-voice check](feedback_run_tone_of_voice_before_publishing_social.md) · [prefer the Notion OAuth connector](feedback_prefer_notion_oauth_connector.md) · [public replies skip sign-off, DMs get one](feedback_public_reply_no_signoff_dm_gets_signoff.md).
- [Static dupe beaten by live DB proof](feedback_static_dupe_theory_beaten_by_live_db_proof.md).
- [Await vs fire-and-forget](project_survivorpulse_usage_event_await_vs_fire_and_forget.md) — await only if the write IS the payload.
- ["Completed" agent can resume](feedback_resumed_background_agent_can_duplicate_orchestrator_actions.md) — duplicated a filing.
- [Link sign-offs to the site](feedback_survivorpulse_signoff_links_to_site.md) — HTML sends only.
- [Search memory before a tool failure is fatal](feedback_search_memory_before_accepting_a_tool_failure_as_fatal.md) — fix existed days earlier.
- [Bash tool quote-parse failures: use script files](feedback_survivorpulse_bash_tool_quote_parse_failures_use_script_files.md) — `unexpected EOF ... '''`; run codex-companion with --prompt-file yourself.
- [Lessons index: testing, review, git hygiene, design traps (~50 notes)](reference_survivorpulse_lessons_index.md)
- [jsdom can't see real pixel scaling or native focus fixup](feedback_jsdom_cannot_see_real_pixel_scaling_or_native_focus_fixup.md) — SST-1757: need a real Playwright proof.
- [Domain vocabulary can collide with an unrelated claim scan](feedback_domain_vocabulary_collides_with_unrelated_claim_scan.md) — check trigger-word lists before naming things.
- [.claude/scratchpad.md is shared across sessions, append not overwrite](feedback_scratchpad_is_shared_across_sessions_append_dont_overwrite.md) — git show origin's copy first.
- [Live-verify a founder's UI request against production before building](feedback_live_verify_founder_ui_request_before_building.md) — the request described the outcome, not the fix.
- [Out-of-CI live verification can still block a READY verdict](feedback_out_of_ci_live_verification_can_still_block_a_ready_verdict.md) — REL-57.
- [Notion grooming property write limits + safe recovery](project_survivorpulse_notion_grooming_property_write_limits_and_safe_recovery.md) — update_properties REPLACES; agents edit local files, orchestrator does ONE guarded write.

## Shipping, environments, and infra

- [Replit publish never runs migrations](project_survivorpulse_replit_publish_does_not_run_migrations.md) — build/start only.
- [New npm dependency needs a Replit pre-install before the push](project_survivorpulse_new_npm_dependency_needs_replit_preinstall_before_push.md) — Replit Sync is reset --hard only (SST-1792).
- [The app compresses responses; the edge does not](project_survivorpulse_app_compresses_responses_edge_does_not.md) — SST-1792; EXCLUDED_SECRET_PATHS.
- [Failed Replit publish at Build: triage](project_survivorpulse_failed_replit_publish_triage.md) — 9/28 silent stop; CI + Node 20.20.0 repro.
- [?publicview=1 needs a storageState override too](project_survivorpulse_publicview_toggle_needs_storagestate_override.md) — REL-50.
- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md) — re-verify dated items.
- [GitHub Actions budget exhaustion signature](project_survivorpulse_github_actions_budget_exhaustion_signature.md) — red in 3-6s with zero steps = billing.
- [Replit credit exhaustion causes prod login failure](project_survivorpulse_replit_credit_exhaustion_causes_prod_login_failure.md) — check Replit billing too.
- [Local test substitute when CI is down](project_survivorpulse_local_test_substitute_when_ci_is_down.md) — test:unit broken on Windows; use vitest related.
- [Full-suite run needs TEST_DISABLE_NETWORK env](feedback_full_suite_run_needs_test_disable_network_env.md) — bare vitest hangs 30+ min.
- [Gate job timeout reads as cancelled](project_survivorpulse_pre_publish_gate_job_timeout_reads_as_cancelled.md) — bumped to 60 (SST-1692).
- [Ship-coverage 241 caveat obsolete](project_survivorpulse_ship_coverage_caveat_241_is_obsolete.md) — residual is 9.
- [Booting prod proves unsafe-dev flag off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md) — cache goes stale.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) — use host not current_database().
- [Deployed dev app URL](project_survivorpulse_deployed_dev_url.md) — rollback-only, .com is v1.
- [Open access mode](project_survivorpulse_open_access_mode.md).
- [Paid-tier launch target](project_survivorpulse_paid_tier_launch_target.md) — smaller than it looked.
- [SST-1247 residual gaps](project_survivorpulse_sst1247_residual_gap_rulings.md), not mitigation.
- [Replit appends client IP as LAST XFF entry](project_survivorpulse_replit_edge_appends_client_ip_last.md) — trust proxy 1.
- [Neon branch "production" ≠ prod](project_survivorpulse_neon_branch_named_production_is_not_prod.md) — it's ep-flat-rice (dev).
- [Schema drift kills auth on whichever DB missed it](project_survivorpulse_schema_drift_takes_down_dev_app.md), first commented out.
- [CA1 self-contained](project_survivorpulse_ca1_is_self_contained.md) — no regen.
- [Bystander rule broke 2 distinctness tests](project_survivorpulse_bystander_rule_broke_two_distinctness_tests.md).
- [Discord CI webhook dead since 2026-09-05](project_survivorpulse_discord_ci_webhook_dead_sst1571.md) — SST-1571.
- [Discord connector is read-only](project_survivorpulse_discord_connector_is_read_only.md) — hand the text to the founder.
- [GH Actions permissions:{} breaks checkout](project_survivorpulse_gh_actions_permissions_checkout_trap.md) — SST-1569.
- [curl status-check needs set +e wrapper](project_survivorpulse_curl_status_check_needs_set_e_wrapper.md) — SST-1572.
- [SST-1564 Beta Testers backfill gap](project_survivorpulse_sst1564_beta_testers_backfill_gap.md) — the 13-row batch is real.
- [Stale node_modules per environment](project_survivorpulse_stale_node_modules_per_environment.md) — ERR_MODULE_NOT_FOUND for a listed dep means npm install there.
- [Notion Comments API missing_version defect](project_survivorpulse_notion_comments_api_missing_version_defect.md) — 2026-09-09.
- [vite build under NODE_ENV≠production hard-fails on invalid CSS](project_survivorpulse_vite_build_nonprod_node_env_skips_tailwind_optimize.md) — SST-1703.

## Verifying UI for real

**A trustworthy live surface is the `sp-live-verify` skill, not memory.** Below: UI facts only.

- [Hidden Chrome window swallows synthesized keys](feedback_a_hidden_chrome_window_swallows_synthesized_keys.md).
- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md).
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md).
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md).
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md).
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md).
- [Dual-shell breadcrumb trap](project_survivorpulse_dual_shell_breadcrumb_trap.md) — signed-out `*Shell.tsx` pages correctly show no TopBar/breadcrumb.

## Test infrastructure

- [Sandbox has no local Postgres](project_survivorpulse_sandbox_has_no_local_postgres.md).
- [Checking what is really in a DB](project_survivorpulse_one_off_sql_from_a_worktree.md) — one-off SQL when Neon MCP is down.
- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md), Playwright kills it.
- [A queued gate isn't a verified commit](project_survivorpulse_queued_gate_is_not_a_verified_commit.md) — concurrency cancels pending runs.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) — ⚠️ REVERSED by SST-1213.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md).
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md).
- [tsc excludes tests/ entirely](project_survivorpulse_tsc_excludes_tests_directory.md).
- [Wrong /api path returns the SPA shell](project_survivorpulse_wrong_api_path_returns_spa_shell.md) — 200+HTML, not 404.
- [Unit config disables the DB host guard](project_survivorpulse_unit_config_disables_db_host_guard.md) — SKIP_DB_GUARD=1.
- [SUPPORTED_SEASONS narrower than games](project_survivorpulse_supported_seasons_narrower_than_games.md) — [2021..2026] pools-only.
- [17 env-gated suites invisible locally](project_survivorpulse_env_gated_suites_are_invisible_locally.md).
- [vitest exclude beats explicit CLI filename](project_survivorpulse_vitest_exclude_beats_explicit_cli_filename.md) — silently vanishes.
- [vi.mock TDZ pattern + typescript@7 has no compiler API](project_survivorpulse_vimock_tdz_pattern_and_typescript7_no_compiler_api.md).
- [New pool route trips two guard suites](project_survivorpulse_new_pool_route_trips_two_guard_suites.md) — run them before the first push.

## Engine and domain behaviour

- [SST-783 pseudo-replication reversal](project_survivorpulse_sst783_pseudo_replication_reversal.md).
- [Three near-identical "claimed team" fields](project_survivorpulse_three_claim_signals.md).
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md).
- [Fabricated finality tier splits paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md).
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md).
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md).
- [Multi-pick renders only via 'past' variant](project_survivorpulse_multipick_past_variant_only.md).
- [Reset-to-auto endpoint is orphaned](project_survivorpulse_reset_to_auto_endpoint_orphaned.md) — its picks[0] bug is SST-873.
- [picks.isCorrect rarely written false](project_survivorpulse_picks_iscorrect_rarely_written_false.md) — don't derive elimination from it.
- [Portfolio Context uses a shared predicate](project_survivorpulse_portfolio_context_derived_from_shared_predicate.md) — SST-1642; grep all 4 call sites.

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
- [Identity-scope guard: data vs actor](project_survivorpulse_identity_scope_guard_data_vs_actor.md) — resolve=DATA, classify=ACTOR.
- [Support Mode is server-side now](project_survivorpulse_support_mode_is_server_side.md).
- [Beta outreach Notion databases](reference_beta_outreach_notion_databases.md).
- [jbf302 app-review reminder](project_survivorpulse_jbf302_app_review_reminder.md) — founder owes him a look.
- [Gambling domains blocked at browser-tool layer](project_survivorpulse_gambling_domains_blocked_at_browser_tool_layer.md) — ask for screenshots instead.
- [Cass Codex needs --write + quota budget](feedback_cass_codex_needs_write_mode_and_quota_budget.md) — read-only sandbox denies all reads on Windows.
- [Codex sandbox blocks outbound Notion fetch](feedback_codex_sandbox_blocks_outbound_network_to_notion.md) — dump the spec first.
- [Subagent /tmp not shared with orchestrator](feedback_subagent_tmp_path_not_shared_with_orchestrator.md) — write handoffs into the worktree.
- [SST-1800 Story B resume plan](project_survivorpulse_sst1800_story_b_resume_plan.md) — 10/5: spec final in Notion, build in pieces S6-S11 under the founder weekly-token limit; locked design decisions + process traps (Bash eats backslashes, run full unit shards before pushing).
