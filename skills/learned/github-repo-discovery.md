# GitHub Repo Discovery by Topic

**Extracted:** 2026-04-02
**Context:** Researching tools, libraries, or solution landscapes on GitHub

## Problem
Finding the best GitHub repos on a topic requires more than a single search — naive queries miss curated lists, topic pages, and aggregators that surface the highest-quality results.

## Solution

Use this layered approach in order:

1. **GitHub topic pages** — check `github.com/topics/[keyword]` and common variants (hyphenated, concatenated, pluralized). Example: `lead-generation`, `lead-generator`, `leadgeneration`.
2. **Awesome lists** — search for `awesome-[topic]` repos. These curated lists are the highest signal-to-noise source and often link to the best tools in a space.
3. **Aggregators** — check aibase.com, libhunt.com, or similar for ranked/starred lists when topic pages are sparse.
4. **Direct search** — search `[topic] site:github.com` for project repos not tagged with topics.

## What to capture per repo

- Star count and trajectory (rising vs. stale)
- Last commit date (active vs. abandoned)
- License (open source vs. source-available)
- A "so what" — why it matters for the research brief

## Example

Query: "lead generation GitHub repos"
→ Check `github.com/topics/lead-generation`, `github.com/topics/lead-generator`
→ Find `awesome-ai-lead-generation` curated list
→ Surface top 3–5 with star counts and maintenance status

## When to Use

Activate when:
- Researching tools or libraries in any domain
- Mapping an "existing solutions landscape" for a new feature
- Validating whether a problem is already solved before building
- Competitive analysis of open-source tooling
