# SurvivorPulse Memory Index

## Working practice

- [Prefer Notion OAuth connector](feedback_prefer_notion_oauth_connector.md) — MCP server is fallback-only.
- [Await vs fire-and-forget for usage events](project_survivorpulse_usage_event_await_vs_fire_and_forget.md) — await only when the write IS the response's payload.
- [A "completed" agent can resume and act again](feedback_resumed_background_agent_can_duplicate_orchestrator_actions.md) — duplicated a ticket filing.
- [Link "SurvivorPulse" sign-offs to the site](feedback_survivorpulse_signoff_links_to_site.md) — HTML sends only.
- [Proving a test is load-bearing](feedback_proving_a_test_is_load_bearing.md) / [proving a change is comment-only](feedback_proving_a_change_is_comment_only.md) — RED-proof and the +/- filter both miss MOVES.
- [Search memory before a tool failure is fatal](feedback_search_memory_before_accepting_a_tool_failure_as_fatal.md) — a fix existed days earlier.
- [Guard the wire, not just the helper](feedback_guard_the_wire_not_just_the_helper.md) / [source guard must assert wire is reached](feedback_a_source_guard_must_assert_the_wire_is_reached.md) — 0/109 mutants killed; an unreachable call still read correct.
- [Paired assertions both go vacuous](feedback_paired_assertions_both_vacuous_when_op_never_ran.md) — clear+preserve both pass on a no-op.
- [An AC with no test citing it](feedback_an_ac_with_no_test_citing_it.md) — orphan check beat two review rounds.
- [Enumerate a typed return's fields](feedback_enumerate_a_typed_returns_fields_before_signing_off.md) / [enumerate by the structural anchor](feedback_enumerate_by_the_structural_anchor.md) — grepping formatting found 2 of 3; assertions found 1 of 2 fields.
- [Verify a reviewer's evidence](feedback_verify_a_reviewers_evidence_not_their_judgement.md) — scope right, 2 of 5 files wrong.
- [Check distribution before inferring convention](feedback_check_distribution_before_inferring_convention.md) — don't override from 2 examples.
- [Renaming for clarity can recreate the defect](feedback_renaming_for_clarity_can_recreate_the_defect.md) — a new name can lie on one branch.
- [Sweep for the class, not the change](feedback_sweep_for_the_class_not_the_change.md) — a behaviour flip invalidates a CLASS of tests.
- [Confirm the check covers what changed](feedback_confirm_the_check_covers_what_you_changed.md) — read `include`/`exclude` first.
- [Local run differs from CI by construction](feedback_local_run_differs_from_ci_by_construction.md) — POSIX-broken/Windows-fine; exits 0 silently.
- [Derive test expectations from the DB](feedback_derive_test_expectations_from_the_db_not_the_fixture.md) — CI's DB is fuller than your fixture.
- [Source-text guards fooled by text](feedback_survivorpulse_source_text_guards_fooled_by_text.md) / [fail four ways](feedback_source_scanning_guards_need_three_meta_tests.md) — comments/build output trip `toMatch()`; NUL hides the file.
- [A green test certifies its stale comments](feedback_a_green_test_certifies_its_stale_comments.md) — a "call shape" check misses a moved site.
- [The naive fix is green](feedback_survivorpulse_gate_page_not_viewer.md) — three wrong fixes passed; gate the page, not the viewer.
- [One sampled error, many root causes](feedback_survivorpulse_one_sampled_error_many_root_causes.md) — 13 failures, two causes; grep each.
- [Guard the query you're reading](feedback_read_the_querys_own_loading_state.md) — a sibling's loading state lies when both invalidate.
- [Grep callers before changing a resolver](feedback_grep_callers_before_changing_a_shared_resolver.md) — scoped ruling ≠ scoped blast radius.
- [Duplicate vi.mock for one module](feedback_duplicate_vi_mock_same_module.md) — winner varies by worker.
- [Proving a flake fix without reproducing it](feedback_proving_a_flake_fix_without_reproducing_it.md) — measure the PRECURSOR, not the rare event.
- [Relocating an entry point](feedback_relocating_an_entry_point_changes_its_threat_model.md) — a moved button re-exposes an endpoint.
- [Verify a deferral reason, don't inherit it](feedback_survivorpulse_verify_a_deferral_reason.md) — never inherit a blocker from a peer.
- [Collapse stale backlogs](feedback_survivorpulse_collapse_stale_backlogs.md) — ONE re-survey story, not upkeep.
- [Fetch and search before working](feedback_survivorpulse_fetch_and_search_before_work.md) — a stale branch and no ticket search cost a session.
- [Semantic duplicate guardrails git can't see](feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see.md) / [claim-ledger timestamps aren't orderable](feedback_survivorpulse_claim_ledger_timestamps_are_not_orderable.md) — 2 sessions duplicated a ticket.
- [Concurrent-session git discipline](feedback_survivorpulse_shared_worktree_staging_discipline.md) — stage by path; bare `push -u` moves 2026-v1.
- [A task premise may describe a sibling branch](feedback_task_premise_may_describe_an_unmerged_sibling_branch.md) — true elsewhere, false here.
- [Shared-resource outages get misattributed](feedback_shared_resource_outages_are_misattributed.md) — a 4-worker suite killed the dev app.
- [Never pkill by shared entry point](feedback_never_pkill_by_shared_entry_point.md) — kill by port owned, not by name.
- [A 200 is not proof the server lived](feedback_a_200_is_not_proof_the_server_lived.md) — can serve one response then exit(1).
- [Prefix-mounted guards](feedback_prefix_mounted_guards_have_prefix_bounded_coverage.md) — blind past the mount.
- [No em dashes in drafts](feedback_no_em_dashes_in_drafts.md) — use periods and commas instead.
- [Rely on self-learning, not monitoring](feedback_survivorpulse_rely_on_self_learning_not_manual_monitoring.md) — the queue replaces polling.
- [A doc saying code was deleted isn't evidence](feedback_a_doc_saying_code_was_deleted_is_not_evidence.md) — a "deleted" resolver was live.
- [Staged ticket headers rot into instructions](feedback_staged_ticket_headers_rot_into_harmful_instructions.md) — a status line inverted twice.
- [An AC can launder an ungroomed commit](feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision.md) — git log -S the behaviour first.
- [Derive from the quantity the reader validates](feedback_derive_from_the_quantity_the_reader_validates.md) — write/read quantities drift apart.
- [Rounding a display input destroys ordering](feedback_rounding_a_display_input_destroys_ordering.md) — two precisions manufactured a tie.
- [A value in output is not a constant](feedback_a_value_in_output_is_not_a_constant.md) — read the producer before warning of a consequence.
- [Ticket's Proposed resolution can carry the defect](feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect.md).
- [Validated identifiers still carry wildcards](feedback_validated_identifiers_still_carry_sql_wildcards.md) — `_` is a LIKE wildcard.
- [Tests that win an animation race](feedback_tests_that_pass_by_winning_an_animation_race.md) — a click UNMOUNTING its target still passes.
- [Assert after the effect, not before it](feedback_assert_after_the_effect_not_before_it.md) — passed with BOTH fixes reverted.
- [A third verdict can silence a signal](feedback_a_third_verdict_can_silence_a_signal.md) — "never returns none" hid an unreachable warning.
- [A premise measured at a boundary inherits it](feedback_a_premise_measured_at_a_boundary_inherits_it.md) — true at week 1, false after.
- [A harness disagreement is evidence](feedback_a_harness_disagreement_is_evidence_about_the_harness.md) — shared arm state faked a split.
- [Concurrent reviewers race on file reverts](feedback_concurrent_reviewer_agents_race_on_shared_file_reverts.md) — transient, harmless.
- [Verify a fix site is live before citing it](feedback_verify_fix_site_is_live_before_citing_it.md) — matched the bug, wired to a frozen router.
- [A new error code activates dead UI](feedback_a_new_error_code_activates_old_dead_ui_code.md) — a 409 became reachable for an unready caller.
- [A helper can implement half a rule](feedback_a_helper_can_implement_half_a_rule.md) — other half lived in the caller; a new call site broke.
- [jsdom rewrites inline styles](feedback_jsdom_normalises_inline_styles_two_traps.md) — drops a var() `border` shorthand; hex reads as rgb().
- [Removal tests need the most-rendered state](feedback_removal_tests_need_the_most_rendered_state.md) — a loading branch satisfies "it's gone".
- [Verify the commit, not the exit line](feedback_verify_the_commit_not_the_exit_line.md) — `git rm` broke an `add &&` chain; `echo` masked exit 1.
- [Python round-trip edits flip files to CRLF](feedback_python_roundtrip_edits_flip_files_to_crlf.md) — invisible in `git diff`; breaks source-shape guards.

## Shipping, environments, and infra

- [Pre-publish gate is CI-only](project_survivorpulse_prepublish_gate_mechanism.md) — how to run the real gate.
- [Publish prerequisites](project_survivorpulse_publish_prerequisites.md) — checklist before SHIP; re-verify dated items.
- [A booting prod proves the unsafe-dev flag is off](project_survivorpulse_unsafe_dev_flag_is_self_proving.md) — env validation exits(1) first.
- [Replit deployment is autoscale](project_survivorpulse_replit_deployment_is_autoscale.md) — multi-instance; in-process cache serves stale data.
- [Stale SPA bundle after publish](project_survivorpulse_stale_spa_bundle_after_publish.md) — read the deployed bundle, not source.
- [Production smoke access](project_survivorpulse_production_smoke_access.md) — `current_database()` can't tell the 3 DBs apart, use host.
- [Deployed dev app URL](project_survivorpulse_deployed_dev_url.md) — ask founder to refresh if stale.
- [Legacy Repl is rollback-only](project_survivorpulse_legacy_repl_is_rollback_only.md) — cutover COMPLETE; survivorpulse.com serves v1.
- [Open access mode](project_survivorpulse_open_access_mode.md) — one constant hides the beta gate and paywall.
- [Beta launch site decisions](project_survivorpulse_beta_launch_site_decisions.md) — founder rulings; access-gate + screenshots items superseded.
- [SST-1247 residual-gap rulings](project_survivorpulse_sst1247_residual_gap_rulings.md) — zero-entry pool fix RESOLVED (SST-1257+1258, both Done).
- [Replit edge forwards X-Forwarded-Host](project_survivorpulse_replit_edge_passes_forwarded_host.md) — not a mitigation; APP_BASE_URL unset everywhere.
- [Schema drift kills the dev app](project_survivorpulse_schema_drift_takes_down_dev_app.md) — a missing column 502s the whole app.
- [.env has two DATABASE_URL lines](project_survivorpulse_env_database_url_two_lines.md) — first is commented out; Playwright loads `.env.test`.
- [CA1 self-contained](project_survivorpulse_ca1_is_self_contained.md) / [CRLF churn](project_survivorpulse_ca1_snapshot_crlf_churn.md) — no regen.
- [Bystander rule broke 2 distinctness tests](project_survivorpulse_bystander_rule_broke_two_distinctness_tests.md) — 0fe9aadb, not the newest commit; one flakes on a UUID coin flip.
- [Back Tester goldens re-baselined](project_survivorpulse_backtester_goldens_rebaselined_sst1342.md) — regen reintroduces the bug.

## Verifying UI for real

**A trustworthy live surface is the `sp-live-verify` skill, not memory — it loads every time.** Below: UI facts only.

- [Chrome click coordinate traps](project_survivorpulse_chrome_click_coordinate_traps.md) — a resizing dialog re-centres; stale coords dismiss it.
- [Compact-grid card layout trap](project_survivorpulse_compact_grid_card_layout_trap.md) — space-between crushes fixed-width content.
- [Hover shading over inline backgrounds](project_survivorpulse_hover_shade_over_inline_backgrounds.md) — `:hover{background}` loses to inline.
- [Flex % height + Radix focus traps](project_survivorpulse_flex_percentage_height_and_radix_traps.md) — `h-full` in `flex-1` degrades to `auto`.
- [position:fixed inside a dialog](project_survivorpulse_fixed_position_inside_dialog.md) — a `fixed bottom-0` bar detaches, eats taps.
- [Radix outside-click arming race](project_survivorpulse_radix_outside_click_arming_race.md) — an immediate click after open is dropped.
- [Wouter redirect-chain trap](project_survivorpulse_wouter_redirect_chain_trap.md) — Redirect-to-Redirect blank-pages silently.
- [react-query mock render loop](project_survivorpulse_react_query_mock_render_loop.md) — a fresh array per mock call causes infinite render.
- [Dual app-entry trap](project_survivorpulse_dual_app_entry_trap.md) — prod compiles App-v1.tsx, dev uses App.tsx.
- [login ?next= is same-origin only](project_survivorpulse_login_next_param_is_same_origin_only.md) — cross-origin pushState throws, swallowed.
- [Per-user persistence late-auth trap](project_survivorpulse_per_user_client_persistence_late_auth_trap.md) — pre-auth read overwrites real.

## Test infrastructure

- [Sandbox has no local Postgres](project_survivorpulse_sandbox_has_no_local_postgres.md) — DB proof needs a targeted CI dispatch.
- [registerRoutes skips customSessionMiddleware](project_survivorpulse_customsessionmiddleware_not_in_registerroutes.md) — hand-built test apps 401 real sessions.
- [Playwright/CI evidence traps](project_survivorpulse_playwright_ci_evidence_traps.md) — narrowed runs aren't controls.
- [Dev preview runs an UNBUNDLED Vite server](project_survivorpulse_dev_preview_runs_vite_dev_server.md) — any Playwright run kills the container.
- [E2E CI drift traps](project_survivorpulse_e2e_ci_drift_traps.md) — a persistent E2E DB masked months of drift.
- [E2E fixture provisioning](project_survivorpulse_e2e_fixture_provisioning.md) — ⚠️ REVERSED by SST-1213: the POST now succeeds.
- [Playwright teardown coverage](project_survivorpulse_playwright_teardown_coverage.md) — `teardown:` skips a globalTimeout abort.
- [Local flake-repro traps](project_survivorpulse_local_flake_repro_traps.md) — use an event-loop blocker, not CPU load.
- [Worktree prune "Permission denied"](project_survivorpulse_worktree_prune_readonly_attr.md) — two causes share one message.
- [openid-client PKCE broken in tests](project_survivorpulse_openid_client_pkce_broken_in_tests.md) — initiation routes redirect to ?error= instead; stub one hash.
- [tsc excludes tests/ entirely](project_survivorpulse_tsc_excludes_tests_directory.md) — a compile-probe there never runs.

## Engine and domain behaviour

- [SST-783 pseudo-replication reversal](project_survivorpulse_sst783_pseudo_replication_reversal.md) — pooled-CI bug reversed the "confirmed" mild-lean claim and part of the contrarian claim, 2026-08-25.
- [SST-782 rank and scope errors](project_survivorpulse_sst782_rank_and_scope_errors.md) — "#5-#18 everywhere" was wrong in 2/36 setups; wipeout table was unscoped. Quiet non-repeat on posts 1/2, 2026-08-25.
- [Three near-identical "claimed team" fields](project_survivorpulse_three_claim_signals.md) — wrong one wired to the badge survived 7 tickets.
- [Elimination predicate rulings](project_survivorpulse_elimination_predicate_rulings.md) — tie=loss, strikeCount is real, buyback at read time.
- [Per-call-site rules recur](project_survivorpulse_per_call_site_rules_recur.md) — re-implemented per site; one defect, nine tickets.
- [greedyPath fixture facts](project_survivorpulse_greedypath_fixture_facts.md) — rows carry no `score`, hand-set ties are ignored.
- [Fabricated finality tier splits the paths](project_survivorpulse_fabricated_finality_tier_splits_the_paths.md).
- [Apply write-order collision](project_survivorpulse_apply_write_order_collision.md) / [past-season cascades](project_survivorpulse_past_season_apply_cascades.md).
- [Planning override leaks as truth](project_survivorpulse_planning_override_leaks_as_truth.md) — overriding `currentWeek` re-classifies old weeks.
- [Shared pool-week optimizer context](project_survivorpulse_shared_pool_week_context.md) — pool/week is shareable, per-entry is not.
- [Entry-recommendations payload](project_survivorpulse_entry_recommendations_payload.md) — `allTeams`/`available` meaning + caching invariant.
- [Missing field exposure collapses archetypes](project_survivorpulse_missing_field_exposure_collapses_archetypes.md) — no popularity data.
- [Multi-pick renders only via 'past' variant](project_survivorpulse_multipick_past_variant_only.md) — never resolves as odds/projected.
- [Allocation order blessed](project_survivorpulse_allocation_order_blessed.md) — UUID-order greedy for UNIFORM stakes.
- [Reset-to-auto stays grid-matched](project_survivorpulse_reset_to_auto_apply_scope_divergence.md) — PoolSwitcher-as-scope rejected.

## App structure and data ownership

- [Notion "outage" is connector-specific](project_survivorpulse_notion_comment_outage_is_connector_specific.md) — OAuth before Chrome.
- [Notion via Chrome composer](project_survivorpulse_notion_comments_via_chrome_composer.md) — ⚠️ can corrupt the last comment; OAuth first.
- [Notion via Chrome overwrites fields](project_survivorpulse_notion_via_chrome_field_overwrite.md) — property + comment-splice traps.
- [get-comments can't see replies](project_survivorpulse_notion_create_comment_write_path_defect.md) — write succeeds, the read tool is blind.
- [A page read truncates long rich_text](project_survivorpulse_notion_page_read_truncates_rich_text.md) — 12,274 chars → 7,577, silently.
- [Use OAuth for comments, not notionApi](project_survivorpulse_notion_mcp_create_comment_missing_version.md) — `missing_version` is known-bad.
- [Deleting a Notion row needs notionApi](project_survivorpulse_notion_page_delete_path.md) — OAuth connector has no delete tool.
- [Notion select options aren't auto-created](project_survivorpulse_notion_select_options_not_autocreated.md) — writes reject; ALTER replaces the WHOLE option set.
- [No branch protection, CI is advisory](project_survivorpulse_no_branch_protection_ci_advisory_only.md) — `gh pr merge` isn't gated.
- [Route auth is opt-in](project_survivorpulse_route_auth_is_opt_in.md) / [bearer token](project_survivorpulse_session_cookie_is_a_bearer_token.md).
- [client/src/content/ is governance-scanned](project_survivorpulse_content_dir_governance_scan.md) — exports must be PLAIN DATA; a RegExp or a 1-arg function fails a GOVERNANCE-CRITICAL test.
- [Split route registration](project_survivorpulse_split_route_registration.md) — routes live in BOTH routes.ts and index.ts.
- [A dead page's route is still load-bearing](project_survivorpulse_dead_page_live_redirect_route.md) — my-picks deleted, live CTAs remain.
- [Cockpit wrapper global-nav trap](project_survivorpulse_pool_cockpit_wrapper_global_nav_trap.md) — must NOT seed the nav week.
- [maxEntriesPerUser dual-mirror default](project_survivorpulse_max_entries_default_dual_mirror.md) — the default lives in 4 places.
- [Admin pool marker](project_survivorpulse_admin_pool_classification.md) / [default-user-id trap](project_survivorpulse_default_user_id_ownership_trap.md).
- [SST number is an auto-increment column](project_survivorpulse_notion_sst_id_is_auto_increment.md) — never invent one.
- [PickGrid.tsx is dead; SeasonGrid/WeekView shared](project_survivorpulse_pickgrid_dead_seasongrid_shared.md) — same instances render everywhere.
- [My Strategy wizard: deleted](project_survivorpulse_my_strategy_wizard_unreachable.md) — Step3/4/Context/Modal survive via /tools/*.
- [TanStack Query keys hash by value](project_survivorpulse_tanstack_query_keys_hash_by_value.md) — same literal key shares ONE cache entry.
- [Support Mode is server-side now](project_survivorpulse_support_mode_is_server_side.md) — SST-1439; ?supportUserId= retired.
- [A glob in a comment breaks block strippers](project_survivorpulse_glob_in_comment_breaks_block_stripper.md) — ate 45 of 231 route registrations.
- [Beta outreach Notion databases](reference_beta_outreach_notion_databases.md) — Prospect Tracker + Outreach Log; update both.
