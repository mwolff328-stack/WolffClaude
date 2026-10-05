---
name: project_survivorpulse_two_season_selectors_desktop_vs_mobile
description: "The shell has TWO separate season/week selector components (desktop `hidden lg:flex`, mobile `lg:hidden`) with different test ids, both gated on entitlement via isActive||isAdmin||isTestUser; who reaches AppShell non-entitled; stale e2e selector SST-1791."
metadata:
  node_type: memory
  type: reference
  originSessionId: agent-a3a05360ba470c470
  modified: 2026-10-02T18:49:50.704Z
---

**SST-1786, updated after SST-1787 and SST-1789 (2026-10-02).** SurvivorPulse's app shell
renders the season/week selector TWICE, as two entirely separate components, each visible
only in its own viewport band, and BOTH withheld from a non-entitled viewer:

- `client/src/components/shell/TopBar.tsx` renders `SidebarSeasonSelector` +
  `SidebarWeekSelector` inside a `topbar-selectors` div with className `hidden lg:flex`
  — visible only at **>= 1024px** (Tailwind `lg`), gated by `showSelectors`. The season
  trigger here carries `data-testid="season-selector-trigger"` and is what 4+
  desktop-viewport e2e specs target via their own local `switchSeason()` wrapper (there is
  no single shared `switchSeason` — only the underlying `selectShadcnOption` driver in
  `e2e/helpers/shadcnSelect.ts` is shared).
- `client/src/components/shell/MobileSeasonWeekBar.tsx`, mounted in `AppShell.tsx` as
  `{hasAppAccess && <MobileSeasonWeekBar />}`, is a SEPARATE component with its own
  `<Select>`, visible at **< 1024px** (`lg:hidden`; it was `md:hidden` / < 768px until
  SST-1787 closed the 768-1023px gap). Its season trigger carries
  `data-testid="mobile-season-selector-trigger"` — deliberately DIFFERENT from the desktop
  one (both are always mounted in the DOM regardless of viewport; the same id would cause a
  Playwright strict-mode violation since CSS visibility doesn't remove a DOM node).

**The entitlement predicate** `isActive || isAdmin || isTestUser` is hand-copied in
TopBar.tsx (`showSelectors`), AppShell.tsx (`hasAppAccess`, also gates MobileBottomTabs),
Sidebar.tsx (`showNav`), router-v1.tsx and SubscriptionGuard.tsx. SST-1789 gated the mobile
bar (it had been unconditional, an oversight: SST-590 scoped it "untouched", never ruled it
public). `tests/…/appAccessChrome.sst1789.test.tsx` now drives AppShell + TopBar + the
real bar from one actor table; it does NOT cover Sidebar or SubscriptionGuard. SST-1798
(Tech Debt) tracks a shared `useHasAppAccess` hook and a single decision on the still-loading
behavior (`isActive` is false until the subscription query resolves, so every gate makes
chrome appear late on a cold load).

**Latent today:** `OPEN_ACCESS_MODE = true` makes `useSubscription().isActive` true for
everyone, so none of this is observable live until the paywall is switched on. Don't try to
live-verify entitlement gating in the browser; use a unit test with mutable mocks.

**Who reaches AppShell while NOT entitled** (the normal paywall path does NOT):
`SubscriptionGateShell` sends a non-entitled user to the public `Layout`, not AppShell. They
get AppShell via `/account` and `/settings` (ProtectedRoute only), the signed-in view of the
dual-render shells (Methodology, Legal, Series, BuybackSurvival, two DuplicatingPicks,
BackTester Lite/Overview, WeekOnePicks i.e. /week-1 and /rankings), and admin Support Mode on
a non-entitled target. Support Mode needs no special client handling: `/api/me` and
`/api/me/subscription` return the TARGET's role and entitlement.

**NOT a gap (SST-1790, cancelled by founder ruling):** `/week-1` and `/rankings` hide their
own week dropdown for any signed-in viewer and rely on the top-nav selector, so a signed-in
non-entitled viewer has no week control there. That looked like a stranded-user bug, but the
founder ruled there is no such user group once the paywall is on (see
[[project_survivorpulse_paywall_model_signed_in_means_subscribed]]). Only transient or
support cases reach it, and for those a missing control is accurate.

**The trap SST-1786 caused:** a new 375px e2e spec used the desktop `season-selector-trigger`
id. The element resolves in the DOM (both components always render) but is `display:none`
at 375px, so Playwright says "locator resolved to a real button" then times out waiting for
visibility — a signature that reads like a CSS-overlap bug but is "wrong component for this
viewport." Check the actual breakpoint classNames before clicking a testid in a viewport-
scoped spec; a live `getComputedStyle(el).display` check settles it in seconds.

**Known stale e2e (SST-1791, CONFIRMED by CI):** `e2e/mobile-se17.spec.ts:741` finds the
mobile dropdown via `div.md\:hidden:has(button[aria-label="Previous week"])`, which no longer
matches after SST-1787 changed the bar to `lg:hidden`. "Playwright CI (ephemeral)" has been
red since c10a474a (shard 6, 12 failures, "Season selector: expected at least 1 visible
match(es)"). The Pre-Publish Gate does NOT run Playwright, so it stayed green: check BOTH
workflows on a push, not just the gate. Prefer test ids over responsive-class selectors.
