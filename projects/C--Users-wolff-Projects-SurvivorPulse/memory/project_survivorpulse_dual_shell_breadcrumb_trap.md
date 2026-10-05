---
name: survivorpulse-dual-shell-breadcrumb-trap
description: "Pages reachable both signed-in and signed-out (BuybackSurvivalShell and siblings like WeekOnePicksShell, MethodologyShell) render a completely different container depending on auth state -- a signed-out live-check will correctly show NO breadcrumb/TopBar even when one was just shipped, because that chrome only exists in AppShell."
metadata:
  node_type: memory
  type: project
  originSessionId: 45ac0a60-925d-4cba-9dea-987a4e92efce
  modified: 2026-10-01T12:48:09.378Z
---

Several public SurvivorPulse pages (`/research/buyback-survival`, `/week-1`, `/methodology`, and the Back Tester research pages) use a "shell" wrapper component (`BuybackSurvivalShell.tsx` and siblings) that picks between two completely different containers based on `useAuth().isAuthenticated`: a signed-in visitor gets `AppShell` (full app chrome: TopBar, sidebar, `AppBreadcrumb`), a signed-out visitor gets the bare public `Layout` (logo + Sign In/Create Account only, no breadcrumb, no TopBar at all). This is a deliberate founder ruling (2026-07-29, cited directly in the shell component's own comment): "a page reachable both signed in and signed out renders inside the container it was reached FROM" -- the point is that an anonymous visitor arriving cold from a shared Reddit link never gets bounced toward login.

**Why this matters for live verification:** on 2026-09-30 (REL-58), SST-1772 added a new breadcrumb ("Back Tester > Buyback Survival Curves") via `AppBreadcrumb.tsx`, which only renders inside `TopBar` inside `AppShell`. A post-publish live-verify browsing the page **signed out** correctly showed no breadcrumb anywhere in the page tree -- this is NOT a regression or a failed deploy, it is the intended behavior for that auth state. The team's own live verification (Felix, same day) used the founder's real signed-in Chrome session specifically to see this feature; an anonymous check would have (correctly) seen nothing.

**How to apply:** before treating a missing piece of app chrome (breadcrumb, TopBar, sidebar) as a live-verification failure on one of these dual-render pages, check whether the feature lives in `AppShell`/`TopBar` rather than the page component itself, and whether the live check was done signed-in or signed-out. Grep for the page's own `*Shell.tsx` wrapper (e.g. `BuybackSurvivalShell.tsx`) to confirm the founder's "reached-from" dual-container ruling before escalating. Other known pages following this exact pattern: `WeekOnePicksShell.tsx`, `MethodologyShell.tsx`.
