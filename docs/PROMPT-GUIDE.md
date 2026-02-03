# PROMPT-GUIDE.md — How to Prompt AI (V2)

> **Master guide for humans.** Use this every time you ask the AI to work on Treido.

| Scope | Human → AI communication |
|-------|-------------------------|
| Audience | Developers, product owners |
| Type | How-To |

---

## TL;DR (5 Rules)

1. **State the goal** — 1–2 sentences.
2. **Name the scope** — paths/routes + what not to touch.
3. **Cite docs** — point to the relevant `/docs/*.md`.
4. **Define “done”** — expected behavior + outputs.
5. **Include verification** — gates/tests to run.

---

## The Treido Prompt Packet

Copy this template:

```
Goal:
<What you want to achieve in 1-2 sentences>

Scope:
<Relevant paths/routes + what NOT to change>

Docs to follow:
<List the /docs/*.md files that apply>

Deliverables:
<Exact outputs expected — files, behavior, UI, etc.>

Verification:
<Commands to run: typecheck, lint, styles:gate, test:unit, e2e smoke>

Risk:
<Low-risk | High-risk (DB/auth/payments/destructive operations)>
```

---

## Example Prompts

**UI polish**

```
Goal:
Fix the mobile product card spacing and ensure consistent shadows.

Scope:
- components/shared/product/product-card.tsx
- Do not change data fetching.

Docs to follow:
- /docs/04-DESIGN.md
- /docs/03-ARCHITECTURE.md

Deliverables:
- Updated product-card.tsx with consistent spacing
- No arbitrary Tailwind values

Verification:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit

Risk:
Low-risk
```

**New page**

```
Goal:
Create the /account/notifications page.

Scope:
- app/[locale]/(account)/account/notifications/page.tsx
- Add next-intl messages in both locales.

Docs to follow:
- /docs/05-ROUTES.md
- /docs/04-DESIGN.md
- /docs/10-I18N.md

Deliverables:
- New page route
- messages/en.json + messages/bg.json entries

Verification:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit

Risk:
Low-risk
```

**High-risk change (DB / RLS)**

```
Goal:
Add a "saved_searches" table for users.

Scope:
- supabase/migrations/*
- app/actions/*

Docs to follow:
- /docs/06-DATABASE.md
- /docs/03-ARCHITECTURE.md

Deliverables:
- Proposed migration SQL
- Proposed RLS policies
- Updated TypeScript types

Verification:
Explain how you would validate RLS for different users.

Risk:
High-risk — pause and ask for approval before applying DB changes
```

---

## What to Avoid

- “Just fix it” with no scope (you’ll get broad changes).
- Omitting verification (you’ll get untested changes).
- Asking for DB/auth/payments changes without calling out that it’s high-risk.

---

## When to Ask for an Audit

Ask for an audit (read-only investigation) when:

- You don’t know the cause
- You want a checklist of findings + risks
- The scope is large and you want a plan first

Otherwise, default to “implement + verify”.

---

*Last updated: 2026-02-03*
