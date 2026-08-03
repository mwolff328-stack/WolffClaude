---
name: feedback_survivorpulse_gate_page_not_viewer
description: "When shell chrome must differ on admin vs user pages, gate on the PAGE (a prop at the shell wrapper), never on isAdmin — and prove the guard tests by implementing the wrong version deliberately."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 515ac9ce-220f-4755-b974-8f44a68dacc8
  modified: 2026-07-29T04:49:07.172Z
---

In SurvivorPulse, `/admin/*` routes render through `AdminShell` → **the same `AppShell`** as `/pools`. So "show this only on non-admin-facing pages" must be gated on the page (a prop set once at `AdminShell`), never on the viewer's `isAdmin`.

**Why:** `{!isAdmin && <Footer/>}` satisfies both obvious checks — no footer on `/admin`, footer on `/pools` for a standard user — while silently stripping the footer from an **admin browsing `/pools`**. `/admin` is only ever reached by admins, so the role check and the page check agree everywhere except that one case.

**How to apply:**
1. Gate on a prop at the single shell wrapper, defaulting ON so new user-facing routes inherit it, with the wrapper as the only opt-out. Add a guardrail asserting it is the *only* opt-out — nothing else catches the prop being dropped.
2. Always write the test for the viewer-who-is-an-admin-on-an-ordinary-page case. Without it the wrong implementation ships green.
3. **Prove which tests are load-bearing: implement the wrong version on purpose and re-run.** On SST-1091 the deliberate `{!isAdmin && ...}` mutation failed exactly 2 of 10 tests while 8 stayed green — including "omits the footer on admin pages", which passes trivially when there is no footer at all. RED-against-HEAD was insufficient evidence here because HEAD had no footer, so *every* footer test failed for the wrong reason.

Same bug class as [[project_survivorpulse_per_user_client_persistence_late_auth_trap]] and SST-1082: behaviour that depends on **where a component happens to mount**, invisible from inside the component.

## The generalised pattern: the naive fix is GREEN because the suite encodes the two obvious cases and the defect lives in the third

Three instances inside 24 hours, two mine and one from a concurrent session:

| Naive fix | Passes | Silently breaks |
|---|---|---|
| `{!isAdmin && <Footer/>}` | no footer on `/admin`; footer on `/pools` for a user | **admin on `/pools`** |
| `mt-12` on the footer (SST-1092) | "there is a gap" | **bottom-pinning on short pages** |
| `<button>` instead of `<Link>` for legal modals (SST-1093) | every open/close assertion | **middle-click, ctrl/cmd-click, open-in-new-tab, crawlability** |

Deliberately implementing the wrong version is the only cheap way to learn which tests are load-bearing versus merely present. The concurrent session measured **44 of 46 still green** on theirs; mine was 8 of 10. Both numbers are the point: a suite that stays overwhelmingly green against a known-wrong implementation is telling you its coverage is decorative in exactly the region you care about.

## Concrete trap: `cn()` is `clsx` + `twMerge`, so a className prop REPLACES, it does not add

`client/src/lib/utils.ts` runs tailwind-merge. Passing `mt-8` into a component whose base classes contain `mt-auto` **removes** `mt-auto` — last conflicting utility wins. On SST-1092 that would have killed the footer's bottom-pinning on short pages (a measured 448px auto-margin on `/game-plan` and `/my-picks`) while looking like a correct spacing fix. Proven, not reasoned: the mutation's assertion output was `expected 'bg-panel border-t border-(--sp-border…' to match /\bmt-auto\b/`.

**How to apply:** when a component owns a layout-critical utility and also accepts `className`, do NOT pass a conflicting utility through it. Put the spacing on the parent instead — a flex `gap` composes with `mt-auto` rather than replacing it (on a tall page the auto-margin is 0 and the gap supplies the buffer; on a short page the auto-margin absorbs whatever the gap leaves, so those pages stay pixel-identical). Add a test asserting the base utility survives.

Related trap from the same change: a role gate evaluated ABOVE `ProtectedRoute` reads the pre-auth `isAdmin === false` and bounces real admins on every cold load. Put role gates INSIDE `ProtectedRoute`, which already blocks until auth resolves. And have the route gate call the same visibility predicate as the nav link, or "flip one function to restore it" reopens the link but leaves the route blocked.
