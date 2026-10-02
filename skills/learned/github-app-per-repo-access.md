# GitHub App Authorized but a Specific Repo Still 404s

Extracted: 2026-10-02

Context: Weekly brief (Jul 31 and Oct 2) and multiple Morning Briefs flagged the connected GitHub app unable to read mwolff328-stack/SurvivorPulse, even while CI-failure emails for that exact repo were landing in the inbox the same morning, and while the same GitHub app reads WolffClaude and the other public repos fine.

## Problem

"GitHub is connected" (see also github-connector-vs-plugin-auth.md) is not the same as "this GitHub App can see this repo." A GitHub App installation grants access to a chosen list of repos, not the whole account by default. When a new repo like SurvivorPulse is created or transferred, it does not automatically join that list.

The failure mode is easy to misread: the tool does not say "unauthorized," it says the repo is "not found." That reads like an absence of activity or a typo, not a permissions gap, so it is easy to shrug off in a scheduled run. This has now recurred across at least two weekly briefs without being fixed, so CI failures and PRs on SurvivorPulse keep getting caught by scanning notification emails by hand instead of surfacing automatically.

## Solution

Treat a "not found" on a repo you know exists, from a GitHub integration you know is authorized elsewhere, as a per-repo permission gap, not a dead end.

1. Confirm the app is authorized in general (other repos resolve fine) before concluding anything about this specific repo.
2. 2. Go to GitHub Settings then Applications then Installed GitHub Apps, open the app's configuration, and check its repository access list. "All repositories" vs "Only select repositories" is the setting that matters.
   3. 3. Add the missing repo to that list. This is an interactive, human step (same constraint as github-connector-vs-plugin-auth.md) — a scheduled run can detect and report the gap but cannot grant itself access.
      4. 4. Verify in a fresh session by asking for that repo's recent commits or open PRs before assuming it is fixed.
         5. 5. In the meantime, have scheduled briefs say explicitly "repo not found, likely a permissions gap, not an absence of activity" rather than silently reporting nothing, so the gap stays visible instead of reading as quiet.
           
            6. ## When to Use
           
            7. Activate when a GitHub-reading task returns "not found" for a repo you know exists, when a repo is newly created or transferred into an account that already has a GitHub App installed, or when a scheduled brief's GitHub section goes quiet for one specific repo while other repos and other signals (email, local git state) show real activity on it.
