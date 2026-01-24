# .specs — Spec-Driven Development for Treido

> **"Spec first, implement second, verify always"**

This folder implements a Kiro-inspired spec-driven workflow adapted for multi-agent collaboration (Claude + Codex).

## Structure

```
.specs/
├── README.md                    # This file
├── AGENT-PROTOCOL.md            # How Claude ↔ Codex collaborate
├── ROADMAP.md                   # Production launch master roadmap
├── templates/                   # Reusable spec templates
│   ├── feature-spec.md
│   ├── audit-spec.md
│   └── refactor-spec.md
├── active/                      # Currently in-progress specs (1-3 max)
│   └── <spec-name>/
│       ├── requirements.md      # EARS-notation requirements
│       ├── design.md            # Technical design (if needed)
│       ├── tasks.md             # Implementation tasks (checked off)
│       └── context.md           # Agent-to-agent handoff context
├── queue/                       # Specs ready to start (prioritized)
│   └── <spec-name>/
├── completed/                   # Done specs (context preserved)
│   └── <spec-name>/
│       ├── requirements.md
│       ├── tasks.md             # All checked
│       └── summary.md           # Compressed context for future reference
└── blocked/                     # Specs waiting on external (human/API)
    └── <spec-name>/
```

## Workflow

### 1. **Create Spec** (before implementation)
```
SPEC: <feature or audit>
```
Claude creates a spec in `queue/` with requirements + tasks.

### 2. **Start Spec** (move to active)
Only 1-3 specs active at once. Move from `queue/` → `active/`.

### 3. **Execute Tasks** (Claude implements)
```
FRONTEND: <task>   # UI work
BACKEND: <task>    # Server/data
SUPABASE: <task>   # DB/RLS
TEST: <task>       # Testing
```
Check off tasks in `tasks.md` as completed.

### 4. **Verify** (Codex reviews)
Codex runs gates, reviews changes, updates `context.md`.

### 5. **Complete** (move to completed)
When all tasks done + verified, move to `completed/`.
Create `summary.md` with compressed context.

## Agent Collaboration

| Agent | Role | Triggers |
|-------|------|----------|
| **Claude (Opus)** | Implement, fix, create | `FRONTEND:`, `BACKEND:`, `TREIDO:` |
| **Codex** | Verify, review, orchestrate | `/verify`, `/gates`, `/review` |

See `AGENT-PROTOCOL.md` for detailed handoff rules.

## Key Files

- **ROADMAP.md** — Master production launch plan (phases + specs)
- **active/*/context.md** — Live state for agent handoffs
- **completed/*/summary.md** — Compressed context (read instead of full spec)

## Quick Commands

```bash
# Claude: Create new spec
SPEC: <description>

# Claude: Pick next from queue
COORD: What's the next highest priority spec to start?

# Codex: Verify current active spec
/verify active/<spec-name>

# Codex: Run all gates
/gates
```
