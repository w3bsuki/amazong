# spec-typescript — reference index

Use these as lightweight anchors (load only when needed):

- `decision-tree.md` - quick decision framework for auditing (start here)
- Repo rails + boundaries: `.codex/AGENTS.md`
- Workflow + audit contract: `.codex/WORKFLOW.md`, `.codex/skills/treido-orchestrator/references/audit-payload.md`
- TS configuration: `tsconfig.json`
- TS safety gate: `scripts/ts-safety-gate.mjs` (runs via `pnpm -s ts:gate`)

Common audit targets:
- exported APIs in `lib/**`
- server actions under `app/actions/**` and route `_actions/**`
- client boundaries (`"use client"` files) and their imports

