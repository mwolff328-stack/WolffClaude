---
name: project-survivorpulse-new-npm-dependency-needs-replit-preinstall-before-push
description: "Replit Sync is git reset --hard only, so a commit adding a new npm dependency crashes the dev app until the founder installs it in the Replit shell; hold the push and ask first"
metadata:
  node_type: memory
  type: project
  originSessionId: dedfca8e-b67e-44c6-bdf5-3a7cbc2b39bf
  modified: 2026-10-02T18:52:46.682Z
---

2026-10-02 (SST-1792, compression@1.8.2): `.github/workflows/replit-sync.yml` runs `git fetch` + `git reset --hard FETCH_HEAD` on the Replit workspace and NOTHING else. A push to `2026-v1` that adds a dependency (here `compression` and its dep `destroy`, neither was in the lockfile before) leaves the dev app's `node_modules` stale and the server fails to boot with `ERR_MODULE_NOT_FOUND`.

**Why:** the dev app is the founder's shared test environment and is also what live verification runs against; an unannounced outage there blocks both. Same root as [[project_survivorpulse_stale_node_modules_per_environment]], but that note covers the diagnosis after the crash; this one is the prevention at push time.

**How to apply:** before pushing, check `git diff --name-only <base>..HEAD -- package.json package-lock.json`; compare `node_modules/<pkg>` entries in the lockfile diff against the base to see whether a NEW package arrives. If so, hold the push, ask the founder to run `npm install <pkg>@<exact-version> --no-save` in the Replit Shell (the dev workspace, not the deployment), push only after they confirm, then verify the boot with a read-only curl against the dev URL. `--no-save` keeps package.json and the lockfile untouched; the sync brings the real versions. The founder did exactly this for SST-1792 and the dev app booted cleanly (Replit runs Node 20.20.0 while local runs Node 22, which was fine here). Production publish builds normally install from package.json; confirm that at the publish step rather than assuming it.
