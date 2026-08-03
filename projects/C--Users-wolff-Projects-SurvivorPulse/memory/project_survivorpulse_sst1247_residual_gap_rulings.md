---
name: project-survivorpulse-sst1247-residual-gap-rulings
description: Founder rulings (2026-08-02) on two residual Home-page copy gaps surfaced during SST-1247 code review but deliberately not built in that fix.
metadata: 
  node_type: memory
  type: project
  originSessionId: 4c359c28-bc54-4271-8b4c-ee0e1871d8fa
  modified: 2026-08-03T13:39:37.298Z
---

SST-1247 fixed Home's "Add your first pool" empty state wrongly showing for users with a real pool in a non-current season. Code review surfaced two related, NOT-fixed residual gaps (documented in `tests/currentSeasonDebriefHasPoolsInOtherSeasons.sst1247.test.ts` TC-3/4/6 and `server/services/currentSeasonDebriefService.ts`'s off-season branch). Brought to the founder for a product call; both are now resolved:

1. **Off-season copy — ruling: leave as-is, no change.** During off-season, `resolveHomeState` always resolves `"new-user"`, and the existing `HOME_PRIMARY_ACTION_RETURNING_USER_COPY` ("No pools yet this season... get started this season") fires unmodified whenever `hasPoolsInOtherSeasons` is true — including for a user whose only pool was in the season that JUST ended. Verified via `currentSeasonDebriefHasPoolsInOtherSeasons.sst1247.test.ts` TC-3 that `seasonInfo.season` during off-season already refers to the UPCOMING season, so this copy path is reached correctly, it's just not off-season-specific. Founder judged this cosmetic (copy isn't false, just occasionally early) and not worth a distinct variant.
   **Why:** low severity — nothing shown is inaccurate, only potentially premature deep in the off-season.
   **How to apply:** don't re-raise this as a gap; if UI copy work touches `client/src/components/home/homePrimaryActionCopy.ts` again, no off-season branch is expected or missing.

2. **Zero-entry current-season pool — ruling: approved for build, both halves.** `PoolCreationWizard.tsx`'s entry-creation step (~line 425-427) fails non-fatally and silently ("logged, not surfaced as modal"), which can leave a real current-season pool with zero entries. Confirmed reachable and covered by TC-6. Because `hasPoolsInOtherSeasons` is correctly `false` for these users (no OTHER-season pools), they see the plain "Add your first pool" copy despite already having a pool — this one reads as actively wrong, not just imprecise. Founder chose **"fix root cause + add copy"**: make entry creation surface/retry failures so this stops occurring going forward, AND add a distinct Home copy variant for any pool already stuck empty. Routed to Pam (scope) → Ann (requirements) per the normal grooming flow, per [[feedback_an_ac_with_no_test_citing_it]]-style discipline — see the resulting groomed ticket for current status rather than this memory once one exists.
   **Why:** a copy-only fix would leave the underlying data-integrity bug (silently empty pools) able to recur indefinitely.
   **How to apply:** when picking up the resulting ticket, both halves are in scope — don't downscope to copy-only or root-cause-only without checking back with the founder.
