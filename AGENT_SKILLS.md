# Agent Skills in this repo

This repo uses “Agent Skills” as small, repo-local playbooks that help an AI agent do work consistently.

Skills live in `.github/skills/<skill-name>/SKILL.md`.

## What a skill is

A skill is just a folder with a `SKILL.md` file:

- The **YAML frontmatter** (`name`, `description`) is the primary *triggering mechanism*.
- The **body** is loaded only after the skill triggers; it should contain the workflow, constraints, and “how to use” guidance.

## Where skills live here

- Real skills: `.github/skills/<skill-name>/SKILL.md`
- Copyable template (NOT a real skill): `templates/agent-skill-template/`

## Current skills

- `.github/skills/frontend-ui-shadcn-tailwind/SKILL.md` — single frontend skill (design direction + implementation using shadcn/ui + Tailwind v4)
- `.github/skills/ux-flow-sell-orders/SKILL.md` — UX flow design for `/sell` and order-management experiences (steps, states, edge cases)
- `.github/skills/nextjs-16-app-router/SKILL.md`
- `.github/skills/i18n-next-intl/SKILL.md`
- `.github/skills/supabase-auth-db/SKILL.md`
- `.github/skills/stripe-payments/SKILL.md`
- `.github/skills/backend-architect/SKILL.md`

## Avoiding duplicate triggers (rubric)

- Use `frontend-ui-shadcn-tailwind` for: frontend design direction (“less generic”, new look-and-feel) and implementation (layout fixes, a11y/responsiveness, shadcn primitives).
- Use `ux-flow-sell-orders` for: UX flow mapping and IA for `/sell` and orders (steps, states, edge cases, acceptance criteria) before building UI.
- Use `nextjs-16-app-router` for: routing/layouts/route handlers/server actions/caching behavior.
- Use `i18n-next-intl` for: message keys/locales/language switch/routing by locale.
- Use `supabase-auth-db` for: auth/session, RLS/data access, server/client Supabase usage.
- Use `stripe-payments` for: checkout/payment intents/subscriptions/webhooks.
- Use `backend-architect` for: schema/APIs/boundaries/RLS strategy and end-to-end backend design.

## Using skills in VS Code

- In Copilot Chat, switch to **Agent** mode.
- Ask for work using phrases that match a skill’s `description` (the YAML frontmatter is what triggers).
- If a skill isn’t triggering reliably, explicitly mention it by name (e.g., “Use the `frontend-ui-shadcn-tailwind` skill”).

### How to get “great” results (without over-constraining)

- If you want exploration: ask for “2–3 options” first, then “pick one and implement.”
- If you want strict execution: specify constraints (pages, components, tokens, a11y, performance) and request verification (typecheck/e2e).

Examples:

- “Use `frontend-ui-shadcn-tailwind`: propose 3 design directions for this screen, pick the best, then implement it with shadcn + Tailwind.”
- “Use `frontend-ui-shadcn-tailwind`: keep the existing look, just fix alignment, spacing rhythm, and mobile behavior.”

## Naming and frontmatter rules

- `name` must be **hyphen-case**: lowercase letters, digits, hyphens.
- Keep `name` reasonably short (practically: <= 64 chars).
- `name` **must match the parent directory name** (for example, `.github/skills/my-skill/SKILL.md` must use `name: my-skill`).
- `description` should be a single, comprehensive sentence (or two short ones) that includes:
  - what the skill does
  - and *specific triggers* (“Use when…”, file types, domains, workflows)
- Prefer minimal frontmatter: always include `name` and `description`; optionally include `license`, `compatibility`, `metadata`, and/or `allowed-tools` when needed.

Example:

---
name: my-skill
description: Do X in this repo using Y. Use when the user asks for Z, when editing A, or when debugging B.
---

## Keep skills lean (progressive disclosure)

Treat a skill like an onboarding doc for another agent:

- Keep `SKILL.md` short and action-oriented.
- Put long / optional details into **reference files** under `references/`.
- Put deterministic helpers into **scripts** under `scripts/`.
- Put reusable templates/files into **assets** under `assets/`.

Recommended structure:

- Overview (1–2 sentences)
- Non-negotiables (repo constraints)
- Workflow (step-by-step)
- Resources (when to read which reference / run which script)
- Examples (prompts that should trigger)

## When to add references/scripts/assets

Add bundled resources only when they reduce repeated effort:

- `references/` (read into context as needed)
  - API docs, schemas, conventions, long examples
  - Prefer one-level linking: `SKILL.md` should link directly to each reference file.

- `scripts/` (deterministic helpers)
  - validation scripts, generators, formatters
  - keep usage lines in the skill body: command + args + expected output

- `assets/` (files copied into outputs)
  - templates, boilerplate directories, images/icons, sample fixtures

## What NOT to put in a skill

Avoid adding extra “human documentation” inside an actual skill folder (e.g. `README.md`, changelogs, design docs). Keep only what the agent needs to execute. If you must include additional docs, place them under `references/` and link them from `SKILL.md`.

## Validate skills

Before merging changes to skills, validate that each skill’s `SKILL.md` frontmatter is spec-compliant (especially the `name` rules).

- Preferred: run the repo validator script: `pnpm -s validate:skills`
- Alternative: use the upstream reference CLI (`skills-ref validate <path>`) if you have it installed.

## Workflow for adding a new skill

1. Copy the template folder from `templates/agent-skill-template/` into `.github/skills/<skill-name>/`.
2. Edit the frontmatter (`name`, `description`).
3. Replace all TODOs in the body.
4. If the skill needs references/scripts/assets, add them and link to them from the body.
5. Use the skill on a real task and refine based on what was missing.

## Repo-specific reminders

- Respect `STRUCTURE.md` boundaries (primitives vs shared vs route-owned UI).
- Prefer existing project primitives and conventions over inventing new ones.
