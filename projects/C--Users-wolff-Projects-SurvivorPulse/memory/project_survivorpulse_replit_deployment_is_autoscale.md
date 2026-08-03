---
name: survivorpulse-replit-deployment-is-autoscale
description: ".replit sets deploymentTarget=\"autoscale\", so production can run MULTIPLE instances — any in-process cache or in-memory state is per-instance and will serve inconsistent data"
metadata: 
  node_type: memory
  type: project
  originSessionId: 21161978-e055-4d72-ab00-4e13ee7e87f4
  modified: 2026-07-30T05:30:04.880Z
---

`.replit` contains:

```
[deployment]
deploymentTarget = "autoscale"
```

So **production can run more than one instance.** Verified 2026-07-29. Also verified there is no `cluster`, `cluster.fork`, PM2, or `WEB_CONCURRENCY` anywhere in `server/`, `package.json`, or `.replit`, so it is one Node process *per instance*, but the instance count is not pinned at one and varies with load.

**Why this matters:** any design that keeps state or a cache in process memory is per-instance with no cross-instance invalidation. The failure mode is nasty because it is intermittent and load-dependent: publish/write on instance A, instance A refreshes its own cache, B and C do not, and a user refreshing gets old-then-new-then-old depending on which instance they land on. It looks like the write failed. It is quiet at low traffic and worst exactly when traffic is highest, i.e. when autoscale adds instances.

This was caught while designing the admin homepage-copy CMS (SST-1116), whose architecture had an explicit "depends on a single Node process" assumption for its 15s in-process content cache. The assumption was disproven, not merely unconfirmed. Resolution: drop the in-process cache and rely on HTTP caching (`max-age`/`stale-while-revalidate`), or cap it at 2-3s and state the tradeoff, rather than building cross-instance invalidation for a low-traffic page.

**Do not settle this question from the Repl "Resources" page.** That panel describes the *development* workspace container (4 vCPU / 8 GiB) and says nothing about the deployment that serves production traffic. The authoritative answer is `deploymentTarget` in `.replit`.

Related: [[project_survivorpulse_e2e_ci_drift_traps]], [[project_survivorpulse_prepublish_gate_mechanism]]
