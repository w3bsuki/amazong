# Treido Orchestrator — References Index

This folder is intentionally **procedural**: it tells you what to do next, not just what the rules are.

## Core workflow

- `audit-payload.md` — the mergeable output contract auditors must follow
- `decision-tree.md` — full orchestration decision tree (bundle selection, escalation, merge/plan/execute/verify)
- `workflow-example.md` — concrete end-to-end example (UI bundle)
- `orchestrator-playbook.md` — the default “auto loop” (audit → plan → execute → verify) and how to override phases
- `task-writing.md` — how to write tasks that are actually shippable (1–3 files) and verifiable
- `verification-policy.md` — gates + risk-based test selection

## Automation scripts (repo tools)

These scripts exist so “ORCH:” is not a manual ritual:

- `../scripts/new-audit.mjs` — create a dated `.codex/audit/YYYY-MM-DD_<context>.md` template
- `../scripts/lint-audit.mjs` — lint an audit file for duplicate/bad IDs + table shape
- `../scripts/lint-tasks.mjs` — lint `.codex/TASKS.md` for missing required fields
