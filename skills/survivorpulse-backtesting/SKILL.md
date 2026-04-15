---
name: survivorpulse-backtesting
description: >
  SurvivorPulse CMEA (Coordinated Multi-Entry Allocation) prototype development. Use when working in
  or posting to the #backtesting-prototype Discord channel (1491887015053099068). Covers: prototype
  build coordination, UI/UX for the allocation interface, backtesting validation, 2025 season replay,
  and design system implementation. Felix builds, Deb designs, Vlad validates. Trigger on: prototype
  work, CMEA features, allocation UI, season replay, or design system application.
triggers:
  - "#backtesting-prototype"
  - "CMEA prototype"
  - "prototype"
  - "allocation"
  - "season replay"
---

# SurvivorPulse CMEA Prototype

You are operating in the SurvivorPulse #backtesting-prototype channel context. This channel coordinates build work on the CMEA (Coordinated Multi-Entry Allocation) prototype.

## What CMEA is

The core UVP of SurvivorPulse. Coordinated multi-entry allocation validates that different teams can still be the same bet. The prototype demonstrates this via 2025 NFL season replay, showing how portfolio-aware allocation outperforms independent entry management.

## Repos

- **Main SurvivorPulse:** `git@github.com:mwolff328-stack/SurvivorPulse.git` (1,631 files, 2,400+ unit tests, 180+ integration)
- **CMEA Prototype:** `git@github.com:mwolff328-stack/SurvivorPulse-BackTesting-Prototype.git` (React+Vite, separate repo)

## Tech stack

- React 18 + Vite + Tailwind CSS + shadcn/ui
- Design system: Linear-based, dark-first (#08090a canvas), Inter Variable + JetBrains Mono
- IBM Carbon status tokens (danger/success/warning/info)
- Custom DESIGN.md: 797 lines, Stitch format

## Agent routing

- **Felix the Forge:** Technical implementation, component building, API integration
- **Deb the Designer:** UX design, component styling, design system enforcement
- **Vlad the Verifier:** QA, acceptance criteria validation, testing
- **Ann the Analyst:** Requirements and acceptance criteria (must be in hand before Felix or Deb start)

Build sequence: Ann's requirements first, then Felix/Deb build, then Vlad validates.

## Current focus

Getting CMEA Prototype to a state that convinces early adopters to sign up. Demonstrating coordinated allocation value through 2025 season replay.

## Key backtesting findings (from Stan's research)

- 70/30 Blend (70% EV + 30% Future Value) is the baseline winning strategy for small portfolios (3-5 entries)
- Strategy should adapt to portfolio size (70/30 loses crown at n=10, reclaims at n=50)
- Product implication: recommendation engine must be portfolio-size-aware

## Channel formatting

- Bullet lists only (no markdown tables)
- Reference PRs by number, link to specific commits for code discussion
- Screenshot UI changes when posting design updates
- Tag work items as: `[BUILD]`, `[DESIGN]`, `[QA]`, `[SPEC]`
