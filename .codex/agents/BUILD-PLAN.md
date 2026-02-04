# BUILD-PLAN.md — How We Build Each Agent

> Systematic process for creating each skill agent.

---

## Phase 1: treido-design (UI/UX/Styling)

### Why First?
- Most frequent task type (styling, polish, mobile fixes)
- Highest token waste currently (searching for styling patterns)
- Most complex domain (Tailwind v4 + shadcn + mobile + a11y)

### Research Needed
Before writing the skill, gather:

1. **Tailwind v4 setup**
   - Where are tokens defined? (`globals.css`?)
   - What semantic tokens exist?
   - What's forbidden? (palette classes, gradients, arbitrary values)

2. **shadcn/ui setup**
   - Where are primitives? (`components/ui/*`)
   - How is CVA used?
   - What's the composition pattern?

3. **Design patterns**
   - What does good Treido UI look like?
   - Mobile-first patterns?
   - Touch target sizes?

4. **File inventory**
   - All styling-related files (exact paths)
   - Component structure
   - Where shared components live

### Deliverables
```
.codex/agents/treido-design/
├── SKILL.md          ← Main agent (triggers, knowledge, patterns)
├── files.md          ← File map (exact paths, what each file does)
├── tokens.md         ← Tailwind v4 semantic tokens reference
├── patterns.md       ← Code patterns (mobile, a11y, composition)
└── forbidden.md      ← Anti-patterns, common mistakes
```

### Validation
Test by prompting: "Fix the profile page mobile layout"
- Agent should NOT search for styling files
- Agent should know exactly where to look
- Agent should apply correct patterns without guessing

---

## Phase 2: treido-frontend (Next.js App Router)

### Why Second?
- Second most frequent task type
- RSC/client boundary mistakes are common
- Routing logic is Treido-specific

### Research Needed
1. **App Router structure**
   - Route groups, layouts, pages
   - Where server vs client components live
   - Data fetching patterns

2. **Treido-specific patterns**
   - How locale routing works
   - How auth-protected routes work
   - Layout hierarchy

3. **File inventory**
   - All route files
   - Layout files
   - Middleware/proxy patterns

### Deliverables
```
.codex/agents/treido-frontend/
├── SKILL.md          ← Main agent
├── files.md          ← Route map
├── patterns.md       ← RSC, data fetching, layouts
└── forbidden.md      ← Client component mistakes, import errors
```

---

## Phase 3: treido-backend (Supabase/Auth/Stripe)

### Why Third?
- Critical but less frequent
- Pause conditions matter (DB/auth/payments)
- Mistakes are expensive

### Research Needed
1. **Supabase patterns**
   - Client setup (server.ts, static.ts)
   - RLS patterns
   - Common queries

2. **Auth patterns**
   - Session handling
   - Protected routes
   - Middleware

3. **Stripe patterns**
   - Webhook handling
   - Checkout flow
   - Subscription logic

### Deliverables
```
.codex/agents/treido-backend/
├── SKILL.md          ← Main agent + PAUSE CONDITIONS
├── files.md          ← Supabase files, API routes
├── patterns.md       ← Query patterns, auth flows
└── forbidden.md      ← Security mistakes, leaking secrets
```

---

## Phase 4-6: treido-testing, treido-i18n, treido-docs

Lower priority. Build when needed. Same structure.

---

## Process for Each Agent

```
┌─────────────────────────────────────────────────────────────┐
│                   AGENT BUILD PROCESS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. RESEARCH                                                │
│     ├─ Grep codebase for relevant patterns                  │
│     ├─ Read existing files to understand structure          │
│     └─ Note exact file paths (not folders)                  │
│                                                             │
│  2. DRAFT                                                   │
│     ├─ Write SKILL.md with triggers + knowledge             │
│     ├─ Write files.md with exact paths                      │
│     ├─ Write patterns.md with code examples                 │
│     └─ Write forbidden.md with anti-patterns                │
│                                                             │
│  3. VALIDATE                                                │
│     ├─ Test agent on real task                              │
│     ├─ Measure: did it save context?                        │
│     ├─ Measure: did it know where to look?                  │
│     └─ Iterate until agent is useful                        │
│                                                             │
│  4. INTEGRATE                                               │
│     ├─ Update root AGENTS.md to reference new agent         │
│     └─ Update .github/copilot-instructions.md if needed     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline

| Phase | Agent | Status |
|-------|-------|--------|
| 1 | treido-design | 🔴 Not started |
| 2 | treido-frontend | 🔴 Not started |
| 3 | treido-backend | 🔴 Not started |
| 4 | treido-testing | 🔴 Not started |
| 5 | treido-i18n | 🔴 Not started |
| 6 | treido-docs | 🔴 Not started |

---

## Ready to Start?

Next action: Research for treido-design
- Audit `app/globals.css` for tokens
- Audit `components/ui/*` for primitives
- Audit `components/shared/*` for patterns
- Find mobile/a11y patterns in existing code
