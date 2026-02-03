# Treido Verify — References Index

## Verification playbooks

- `verify-playbook.md` — what to run, what “done” means, and how to select risk-based tests
- `triage-guide.md` — how to interpret failures and identify the smallest next fix
- `decision-tree.md` — full verify decision tree (gates → risk-based tests → escalation)

## Automation scripts

- `../scripts/run-gates.mjs` — runs the always-on verification gates (`typecheck`, `lint`, `styles:gate`)
- `../scripts/lint-plan.mjs` — lints `.codex/audit/*` + `.codex/TASKS.md` for structural drift (IDs/required fields)
