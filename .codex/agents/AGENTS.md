# AGENTS.md — Expert Agent Roster (FINAL)

> 🔒 **LOCKED** — This roster is finalized based on Anthropic/Vercel skill audit.

---

## Design Principles (From skill-creator Audit)

1. **EXPERT > ORCHESTRATOR** — Single expert agents, not routing layers
2. **Rich descriptions** — All trigger keywords in frontmatter description
3. **Progressive disclosure** — Core in SKILL.md, details in references/
4. **< 500 lines** — SKILL.md body stays lean
5. **Treido-specific** — OUR patterns, not generic web advice
6. **Priority categorization** — CRITICAL → HIGH → MEDIUM → LOW

---

## Expert Agent Roster (7 Agents)

| # | Agent | Domain | Absorbs | Triggers |
|---|-------|--------|---------|----------|
| 1 | **treido-design** | UI/UX/Styling | design, tailwind, shadcn, mobile-ux, accessibility, frontend-design | style, component, layout, responsive, mobile, touch, dark mode, polish, visual |
| 2 | **treido-frontend** | Next.js/React | nextjs-16, react-best-practices, web-design-guidelines | page, route, layout, RSC, client component, fetch, cache, suspense |
| 3 | **treido-backend** | Supabase/Data | supabase, postgres-best-practices, auth-supabase | database, query, RLS, auth, session, server action, API |
| 4 | **treido-payments** | Stripe | stripe, stripe-best-practices | payment, checkout, subscription, webhook, billing, invoice |
| 5 | **treido-i18n** | Localization | i18n, i18n-localization | translation, copy, locale, message, string, text, Bulgarian |
| 6 | **treido-testing** | E2E/Unit | testing, playwright | test, spec, e2e, unit, fixture, selector, flaky |
| 7 | **treido-rails** | Safety/Pause | (standalone) | pause, approval, migration, RLS, secret, PII, destructive |

---

## Why These 7?

### treido-design (THE BIG ONE)
Absorbs **6 fragmented skills** into one expert. Visual work is holistic — you can't style a button without considering: Tailwind tokens, shadcn variants, mobile touch targets, dark mode, accessibility contrast. One expert, not six.

**Knowledge domains:**
- Tailwind v4 CSS-first tokens
- shadcn/ui composition
- Mobile-first responsive
- Touch targets & gestures
- WCAG accessibility
- Design system polish

### treido-frontend (TECHNICAL PATTERNS)
**Not design.** This is the App Router expert: routing conventions, when to use RSC vs client, caching with `'use cache'`, data fetching patterns. Knows Treido-specific conventions like `proxy.ts`.

**Knowledge domains:**
- Next.js 16 App Router
- Server/Client component rules
- Caching with `'use cache'`
- Performance patterns (Vercel's 57 rules)
- Treido route structure

### treido-backend (DATA + AUTH)
Supabase and authentication expert. **Pause conditions live here.** Any DB/auth change requires human approval.

**Knowledge domains:**
- Supabase client patterns
- RLS policies
- Server actions
- Session handling
- Query optimization

### treido-payments (STRIPE)
**Isolated for safety.** Stripe integration is critical and error-prone. Dedicated expert with strict pause conditions.

**Knowledge domains:**
- Checkout flow
- Subscription lifecycle
- Webhook handling
- Idempotency
- Error handling

### treido-i18n (COPY)
next-intl has specific patterns. Translation keys are easy to forget, locale routing is finicky. Small but critical.

**Knowledge domains:**
- next-intl patterns
- Message file structure
- Locale routing
- Dynamic translations
- Bulgarian copy conventions

### treido-testing (QUALITY)
E2E and unit testing are a different skillset. Selector strategies, fixture patterns, deflaking — specialized domain.

**Knowledge domains:**
- Playwright patterns
- Vitest unit tests
- Selector strategies
- Auth state handling
- CI configuration

### treido-rails (SAFETY)
**Always active.** Non-negotiables that apply regardless of task. Pause conditions, security rules, repo conventions.

**Knowledge domains:**
- Pause conditions
- Security rules
- Tailwind rail enforcement
- i18n enforcement
- Caching constraints

---

## Agent File Structure (Per Anthropic)

```
.codex/agents/
├── MASTER.md           ← Problem statement
├── AGENTS.md           ← This roster (LOCKED)
├── AUDIT.md            ← Skills.sh analysis
├── BUILD-PLAN.md       ← Build process
│
├── treido-design/
│   ├── SKILL.md        ← Core (< 500 lines)
│   └── references/
│       ├── tokens.md       ← Full Tailwind v4 token map
│       ├── components.md   ← shadcn patterns
│       ├── mobile.md       ← Touch/responsive rules
│       └── accessibility.md ← WCAG checklist
│
├── treido-frontend/
│   ├── SKILL.md
│   └── references/
│       ├── routing.md      ← Route patterns
│       ├── caching.md      ← 'use cache' rules
│       └── performance.md  ← Vercel 57 rules
│
├── treido-backend/
│   ├── SKILL.md
│   └── references/
│       ├── supabase.md     ← Client patterns
│       ├── rls.md          ← Policy patterns
│       └── auth.md         ← Session handling
│
├── treido-payments/
│   ├── SKILL.md
│   └── references/
│       ├── checkout.md
│       ├── webhooks.md
│       └── subscriptions.md
│
├── treido-i18n/
│   └── SKILL.md            ← Small, no references needed
│
├── treido-testing/
│   ├── SKILL.md
│   └── references/
│       ├── playwright.md
│       └── selectors.md
│
└── treido-rails/
    └── SKILL.md            ← All inline (short)
```

---

## Build Order

| Phase | Agent | Why First |
|-------|-------|-----------|
| 1 | **treido-design** | Highest frequency, most fragmented |
| 2 | **treido-frontend** | Second most used |
| 3 | **treido-rails** | Safety rails applied everywhere |
| 4 | **treido-backend** | Has pause conditions |
| 5 | **treido-payments** | Critical isolation |
| 6 | **treido-i18n** | Small scope |
| 7 | **treido-testing** | When test work comes up |

---

## Migration Plan

1. ✅ Build agents in `.codex/agents/` (this folder)
2. ⬜ Test each agent on real tasks
3. ⬜ Copy to `.codex/skills/` as canonical location
4. ⬜ Delete deprecated skills from `.codex/skills/` and `.claude/skills/`
5. ⬜ Update `.github/copilot-instructions.md`

---

## Success Criteria

An agent is **DONE** when:

- [x] Description has all trigger keywords
- [x] SKILL.md < 500 lines
- [x] References/ for detailed content
- [x] Forbidden patterns documented
- [x] Do/Don't code examples
- [x] Review checklist
- [x] Tested on real task

---

## Cross-Domain Tasks

**Q: What if my task needs frontend + design?**

A: Read both skills. They're composable:

| Task | Primary Agent | Secondary Agent |
|------|--------------|-----------------|
| "Build a new product page" | treido-frontend (routing) | treido-design (styling) |
| "Make the cart look better" | treido-design | — |
| "Add Stripe checkout" | treido-payments | treido-frontend, treido-design |
| "Fix flaky login test" | treido-testing | treido-backend (auth context) |

---

## Next Step

Build `treido-design/SKILL.md` using patterns from AUDIT.md.
