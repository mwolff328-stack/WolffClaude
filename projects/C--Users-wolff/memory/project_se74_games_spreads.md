---
name: project-se74-games-spreads
description: "SE-74 epic status — NFL Games & Spreads page redesign, what shipped, what's deferred"
metadata: 
  node_type: memory
  type: project
  originSessionId: a40f1686-6b68-4182-b199-13fc1a071fb7
---

SE-74 epic (NFL Games & Spreads page revamp) is complete as of 2026-06-16 on branch `2026-v1`.

**Why:** Replace card-based game view with a compact 2-row-per-game table with admin controls, design system compliance, and security-gated data.

**How to apply:** When picking up SE-74 follow-on work, start from `2026-v1`. All 12 stories (SE-74-1 through SE-74-12) are Done in Notion except SE-74-11 (deferred).

## Stories Done (all on 2026-v1)
- SE-74-1 through SE-74-9: Core table, columns, auth, admin controls, slide-overs, override badges
- SE-74-10: Column widths, font consistency, Edit Games popover, Spread Used chip, losing score red (#f1998e)
- SE-74-12: Winning/losing team name colors, center-aligned numeric columns, left-aligned Spread Used, alternating row backgrounds

## Deferred
- SE-74-11: Resizable column headers with localStorage persistence — Backlog, medium priority

## Key implementation notes
- `GameTable.tsx` split into: GameRowPair, AdminActionBar, OverrideBadge, DeltaCell, GameTableSkeleton, gameTableTokens.ts
- spreadUsedSource encoded as suffix in overrideReason: `[spread_used_source: manual]` — no DB column
- "Final" = `completed === true` AND both scores non-null (no status enum)
- Win/loss derived client-side in GameRowPair.tsx (isFinal/isTie/awayWins/homeWins)
- Admin-only fields stripped server-side in /api/games/with-spreads behind `role === 'ADMIN'` check
