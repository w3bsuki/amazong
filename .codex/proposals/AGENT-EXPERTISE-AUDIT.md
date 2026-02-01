# Agent Domain Expertise Audit

**Date:** 2026-02-01  
**Auditor:** codex-iteration  
**Scope:** All 12 skills in `.codex/skills/`

---

## Executive Summary

Most skills are **operationally competent** but **philosophically shallow**. They enforce rules without teaching *why*, and provide checklists without decision frameworks. The skills read like procedure manuals rather than embodying domain expertise.

**Key Finding:** Skills tell agents *what not to do* but rarely explain *how to think* about the domain.

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 3 | Zero domain philosophy (treido-ui, spec-shadcn, spec-tailwind) |
| 🟠 High | 4 | Surface-level expertise (treido-frontend, treido-backend, spec-supabase, spec-typescript) |
| 🟡 Medium | 3 | Procedural but needs depth (treido-orchestrator, treido-verify, treido-alignment) |
| 🟢 Adequate | 2 | Appropriate for scope (spec-nextjs, codex-iteration) |

---

## Per-Skill Audit

### 1. treido-ui (DESIGN)

**Expected Mindset:** Senior UI designer who thinks about visual hierarchy, spacing rhythm, visual weight, typography scale, color harmony, and user attention flow.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | ❌ 1/5 | Claims "hierarchy, spacing rhythm" but never defines what these mean or how to achieve them |
| Teaches vs Checklists | ❌ 1/5 | "Don't use palette colors" without explaining WHY (themability, semantic meaning) |
| Decision Frameworks | ❌ 2/5 | Has step-by-step but no design tradeoff guidance |
| Senior Wisdom | ❌ 1/5 | No discussion of when rules CAN be broken, no aesthetic judgment |

#### What's Missing

- **Visual hierarchy fundamentals:** Size, weight, color, spacing, and position create hierarchy. No guidance on HOW to create hierarchy, just "don't break tokens."
- **Spacing philosophy:** 8px base unit? Golden ratio? Vertical rhythm tied to line-height? Nothing.
- **Typography as a system:** Type scale, when to use which weight, reading flow - absent.
- **Component density guidance:** When is "premium" sparse vs. information-dense?
- **Motion and interaction:** How transitions communicate state changes.
- **"Feel premium" is undefined:** The skill claims to make things "feel premium" but has zero guidance on what premium means aesthetically.

#### Verdict: 🔴 CRITICAL - Skill claims design expertise but has none.

---

### 2. treido-frontend (FRONTEND ARCHITECTURE)

**Expected Mindset:** Frontend architect who thinks about component composition, render performance, bundle optimization, accessibility by default, and user experience flows.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 2/5 | Mentions RSC vs client but lacks depth on WHY |
| Teaches vs Checklists | 🟡 2/5 | "Server Components first" without explaining render cascade benefits |
| Decision Frameworks | 🟡 3/5 | Has escalation paths but no architectural tradeoff matrices |
| Senior Wisdom | 🟡 2/5 | No performance budgets, no progressive enhancement philosophy |

#### What's Missing

- **Component composition patterns:** When to use composition vs. configuration. Render props vs. children vs. slots.
- **Performance mental models:** What causes re-renders, how to minimize them, when virtualization matters.
- **Accessibility-first thinking:** Not just "labels and focus states" but semantic HTML choices, ARIA patterns, keyboard flow.
- **State management philosophy:** When local state, when lifted, when global, when server state.
- **Error boundary strategy:** What to catch where, graceful degradation patterns.
- **Loading state patterns:** Skeleton vs. spinner vs. progressive reveal decisions.

#### Verdict: 🟠 HIGH - Procedurally sound but lacks frontend architectural depth.

---

### 3. treido-backend (BACKEND ARCHITECTURE)

**Expected Mindset:** Backend architect who thinks about API contracts, data modeling, security layers, scalability patterns, and failure modes.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 2/5 | Strong on security paranoia, weak on architecture |
| Teaches vs Checklists | 🟡 2/5 | "RLS everywhere" without explaining threat modeling |
| Decision Frameworks | 🟡 3/5 | Good pause conditions but no API design guidance |
| Senior Wisdom | 🟡 2/5 | Security-focused but no scalability or maintainability |

#### What's Missing

- **API design principles:** RESTful resource naming, action verbs, pagination contracts, versioning strategy.
- **Data modeling philosophy:** When to normalize vs. denormalize, entity relationships, audit trails.
- **Idempotency patterns:** Not just "be idempotent" but HOW (idempotency keys, conditional updates).
- **Error handling strategy:** Error codes, client-friendly messages, logging vs. user-facing.
- **Rate limiting and abuse prevention:** Protecting endpoints beyond auth.
- **Background job patterns:** Queue design, retry strategies, dead letter handling.

#### Verdict: 🟠 HIGH - Security-conscious but shallow on backend architecture.

---

### 4. spec-shadcn (COMPONENT LIBRARY DESIGN)

**Expected Mindset:** Component library author who thinks about composition, API stability, extensibility, accessibility primitives, and ecosystem integration.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | ❌ 1/5 | Focuses on boundaries, not component design philosophy |
| Teaches vs Checklists | ❌ 1/5 | "No app logic in primitives" without explaining composability |
| Decision Frameworks | 🟡 2/5 | File placement rules, no component API design guidance |
| Senior Wisdom | ❌ 1/5 | No discussion of when primitives should have opinions |

#### What's Missing

- **Composition over configuration:** Why shadcn uses composition, when to add props vs. slots.
- **API surface area philosophy:** Minimal props that compose well vs. convenience props that couple.
- **Variant design:** When to add variants vs. create new components.
- **Accessibility primitives:** How ARIA roles flow through composition, focus management strategies.
- **Styling boundaries:** What should be themeable vs. fixed, how to design for style extensibility.
- **Breaking change philosophy:** What constitutes a breaking change, how to evolve APIs.

#### Verdict: 🔴 CRITICAL - Boundary enforcer, not component library expertise.

---

### 5. spec-nextjs (NEXT.JS PHILOSOPHY)

**Expected Mindset:** Next.js core team member who thinks about RSC rendering philosophy, caching strategy, streaming patterns, and performance optimization.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟢 3/5 | Clear on RSC philosophy, cached-server rules |
| Teaches vs Checklists | 🟢 3/5 | Explains "why" for caching hazards |
| Decision Frameworks | 🟢 4/5 | Good decision trees for boundaries and caching |
| Senior Wisdom | 🟡 3/5 | Could use more on streaming, PPR, and edge cases |

#### What's Missing

- **Streaming mental models:** How streaming changes UX, when to use loading.tsx vs. Suspense.
- **PPR (Partial Prerendering):** When to use it, the static shell + dynamic slots model.
- **Edge vs. Node runtime:** When each makes sense, cold start implications.
- **Parallel data fetching:** Request waterfalls, Promise.all patterns.
- **Incremental adoption patterns:** Migrating pages router to app router incrementally.

#### Verdict: 🟢 ADEQUATE - Best spec skill, could still deepen streaming/PPR.

---

### 6. spec-tailwind (DESIGN SYSTEMS)

**Expected Mindset:** Design systems engineer who thinks about token semantics, constraint-based design, themability architecture, and design/dev handoff.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | ❌ 1/5 | Enforcement-only, no design systems philosophy |
| Teaches vs Checklists | ❌ 1/5 | "Don't use palette" without explaining token semantics |
| Decision Frameworks | 🟡 2/5 | Has violation detection, no token design guidance |
| Senior Wisdom | ❌ 1/5 | No guidance on creating new tokens or when constraints should flex |

#### What's Missing

- **Token semantics:** What makes a good semantic token (intent vs. value encoding).
- **Token naming philosophy:** Tier system (primitive → semantic → component-specific).
- **Constraint-based design:** Why constraints enable consistency and speed.
- **Themability architecture:** How tokens enable dark mode, brand variants, contrast modes.
- **When to break constraints:** Magic numbers for optical alignment, one-off exceptions.
- **Token evolution:** Adding tokens without breaking existing usage.

#### Verdict: 🔴 CRITICAL - Rule enforcer with no design systems expertise.

---

### 7. spec-supabase (DATABASE ARCHITECTURE)

**Expected Mindset:** Database architect who thinks about schema design, query optimization, RLS philosophy, data integrity, and observability.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 2/5 | Security-heavy, architecture-light |
| Teaches vs Checklists | 🟡 2/5 | "RLS required" without policy design philosophy |
| Decision Frameworks | 🟡 3/5 | Good client selection, weak on schema decisions |
| Senior Wisdom | 🟡 2/5 | No query optimization, no schema evolution patterns |

#### What's Missing

- **Schema design philosophy:** Normalization tradeoffs, when to denormalize for reads.
- **Index strategy:** What to index, composite indexes, covering indexes.
- **Query optimization:** N+1 detection, join strategies, EXPLAIN ANALYZE interpretation.
- **RLS performance:** Policy complexity impact, when RLS hurts performance.
- **Migration patterns:** Zero-downtime migrations, backwards compatible changes.
- **Observability:** Query logging, slow query detection, connection pooling.

#### Verdict: 🟠 HIGH - Security-focused but lacks database architect wisdom.

---

### 8. spec-typescript (TYPE THEORY)

**Expected Mindset:** Type theorist who thinks about type soundness, inference optimization, generic patterns, and maintainable type APIs.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 2/5 | Focuses on "unsafe escapes" not type design |
| Teaches vs Checklists | 🟡 2/5 | "No any" without teaching narrowing strategies |
| Decision Frameworks | 🟡 3/5 | Good unsafe detection, weak on type design |
| Senior Wisdom | 🟡 2/5 | No advanced patterns, no inference optimization |

#### What's Missing

- **Generic patterns:** When to use generics, constraint design, inference sites.
- **Conditional types:** Practical uses, performance implications.
- **Type branding/nominal typing:** When structural typing isn't enough.
- **Inference optimization:** Helping TypeScript infer vs. explicit annotations.
- **Type API design:** Public types vs. internal, backwards compatible evolution.
- **Error message design:** Writing types that produce helpful errors.

#### Verdict: 🟠 HIGH - Safety-focused but lacks type design expertise.

---

### 9. treido-orchestrator (TECH LEAD)

**Expected Mindset:** Tech lead who thinks about prioritization, risk assessment, team coordination, and shipping velocity.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 2/5 | Procedural but lacks leadership judgment |
| Teaches vs Checklists | 🟡 3/5 | Good workflow explanation |
| Decision Frameworks | 🟡 3/5 | Pause conditions exist, prioritization is weak |
| Senior Wisdom | 🟡 2/5 | No scope negotiation, no technical debt strategy |

#### What's Missing

- **Prioritization frameworks:** Urgency vs. importance, ROI estimation, dependency chains.
- **Risk assessment:** Blast radius analysis, reversibility scoring.
- **Scope negotiation:** When to push back, how to propose alternatives.
- **Technical debt strategy:** When to pay down, when to accept, tracking.
- **Team coordination patterns:** Avoiding merge conflicts, parallel work strategies.
- **Estimation heuristics:** Breaking down unknowns, buffer allocation.

#### Verdict: 🟡 MEDIUM - Procedural but lacks tech lead judgment depth.

---

### 10. treido-verify (QA ENGINEERING)

**Expected Mindset:** QA engineer who thinks about coverage strategy, risk-based testing, confidence building, and regression prevention.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 3/5 | "Smallest relevant tests" shows good thinking |
| Teaches vs Checklists | 🟡 3/5 | Has risk-based selection logic |
| Decision Frameworks | 🟢 4/5 | Good test selection matrix |
| Senior Wisdom | 🟡 3/5 | Could use more on flakiness, coverage tradeoffs |

#### What's Missing

- **Coverage philosophy:** What coverage numbers mean, when 100% is harmful.
- **Flakiness management:** Detection, quarantine, root cause patterns.
- **Test pyramid strategy:** Unit vs. integration vs. e2e balance.
- **Regression risk scoring:** Which changes need more testing.
- **Test data management:** Fixtures, factories, state isolation.
- **Performance testing triggers:** When to run performance tests.

#### Verdict: 🟡 MEDIUM - Solid foundation, needs QA depth.

---

### 11. treido-alignment (DATA ARCHITECTURE)

**Expected Mindset:** Data architect who thinks about contracts, schema evolution, consistency guarantees, and cross-system synchronization.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟡 2/5 | Gap detection, not architecture |
| Teaches vs Checklists | 🟡 2/5 | Finds mismatches without teaching prevention |
| Decision Frameworks | 🟡 3/5 | Good audit process, weak on design |
| Senior Wisdom | 🟡 2/5 | No schema evolution patterns |

#### What's Missing

- **Contract design:** Backwards compatibility, versioning strategies.
- **Schema evolution patterns:** Adding fields, deprecating fields, migrations.
- **Consistency models:** Eventual vs. strong, conflict resolution.
- **DTO design:** What to include, transformation layers.
- **Cross-system sync:** Webhook reliability, idempotent updates.
- **Data lifecycle:** Retention, archival, deletion cascades.

#### Verdict: 🟡 MEDIUM - Good auditor, needs architect wisdom.

---

### 12. codex-iteration (META)

**Expected Mindset:** System maintainer who keeps the skill system reliable and enforceable.

#### Audit Results

| Criterion | Score | Evidence |
|-----------|-------|----------|
| Domain DNA | 🟢 4/5 | Appropriate for meta-skill scope |
| Teaches vs Checklists | 🟢 3/5 | Explains SSOT hierarchy |
| Decision Frameworks | 🟢 4/5 | Good small-vs-redesign decision |
| Senior Wisdom | 🟢 3/5 | Appropriate caution on system changes |

#### What's Missing

- This skill is appropriately scoped for system maintenance.
- Could use more on skill testing patterns and backwards compatibility.

#### Verdict: 🟢 ADEQUATE - Appropriate for its meta scope.

---

## Prioritized Task List

### Priority 1: Critical Skills (Zero Domain DNA)

| Rank | Skill | Problem | Work Required |
|------|-------|---------|---------------|
| 1 | treido-ui | Claims design skill but has no design philosophy | Add 3 new sections: Visual Hierarchy Fundamentals, Spacing System Philosophy, Premium Design Principles |
| 2 | spec-tailwind | Rule enforcer with no design systems thinking | Add 2 new sections: Token Semantics Philosophy, Constraint-Based Design Principles |
| 3 | spec-shadcn | Boundary police, not component library expertise | Add 2 new sections: Composition Philosophy, Component API Design |

### Priority 2: High-Need Skills (Surface-Level Expertise)

| Rank | Skill | Problem | Work Required |
|------|-------|---------|---------------|
| 4 | treido-frontend | Procedural without architectural thinking | Add: Component Composition Patterns, Accessibility Philosophy |
| 5 | treido-backend | Security-focused but architecture-shallow | Add: API Design Principles, Error Handling Strategy |
| 6 | spec-supabase | RLS expert but not database architect | Add: Schema Design Philosophy, Query Optimization Thinking |
| 7 | spec-typescript | Safety gate but not type designer | Add: Generic Patterns, Type API Design |

### Priority 3: Medium-Need Skills (Procedural, Missing Depth)

| Rank | Skill | Problem | Work Required |
|------|-------|---------|---------------|
| 8 | treido-orchestrator | Workflow executor, not tech lead | Add: Prioritization Frameworks, Risk Assessment |
| 9 | treido-verify | Test runner, not QA strategist | Add: Coverage Philosophy, Flakiness Strategy |
| 10 | treido-alignment | Gap finder, not data architect | Add: Schema Evolution Patterns, Contract Design |

### Priority 4: Adequate (Minor Enhancements)

| Rank | Skill | Notes |
|------|-------|-------|
| 11 | spec-nextjs | Best spec skill - add streaming/PPR depth |
| 12 | codex-iteration | Appropriate scope - minor enhancements only |

---

## Draft Content for Top 3 Priorities

### Draft 1: treido-ui - Visual Hierarchy Fundamentals (NEW SECTION)

```markdown
## Visual Hierarchy Fundamentals

Design is not decoration. Design is communication through visual structure.

### The Hierarchy Stack (in order of visual weight)

1. **Size** - Larger elements demand attention first
2. **Weight** - Bold text pulls the eye before regular text
3. **Color** - High contrast foreground/background creates emphasis
4. **Position** - Top-left (in LTR) and center command attention
5. **Spacing** - Isolation creates importance; proximity creates grouping

### Applying Hierarchy in Treido

**Primary Actions:** Size (larger buttons) + Color (primary token) + Position (prominent placement)
- Use `size="lg"` or `size="xl"` for primary CTAs
- Primary token (`bg-primary`) for main actions only

**Secondary Information:** Reduced size + muted color + increased density
- Use `text-muted-foreground` for supporting text
- `text-sm` for metadata, timestamps, helper text

**The Squint Test:** Blur your eyes and look at the screen. Can you still identify:
- What's the main action?
- What's the primary content?
- What's secondary/supporting?

If everything looks the same when blurred, hierarchy has failed.

### When to Break Hierarchy Rules

**Optical alignment:** Sometimes mathematically equal spacing looks unequal. Trust your eyes over your ruler.
**Dense information displays:** Data tables and dashboards need tighter hierarchy (smaller deltas between levels).
**Emergency states:** Destructive actions can break the hierarchy to demand attention.
```

---

### Draft 2: treido-ui - Spacing System Philosophy (NEW SECTION)

```markdown
## Spacing System Philosophy

Spacing is not "add padding until it looks good." Spacing is a system that creates rhythm and relationships.

### The 4px/8px Foundation

All spacing in Treido should be multiples of 4px (ideally 8px for major spacing):
- `gap-1` (4px) - Tight grouping (icon + label)
- `gap-2` (8px) - Standard element spacing
- `gap-4` (16px) - Section separation within a component
- `gap-6` (24px) - Component separation
- `gap-8` (32px) - Major section breaks

### Spacing Encodes Relationships

**Proximity Principle:** Elements that are related should be closer together than elements that are unrelated.

```
WRONG:                         RIGHT:
┌────────────────┐            ┌────────────────┐
│ Product Name   │            │ Product Name   │
│                │            │ $49.99         │
│ $49.99         │            │                │
│                │            │                │
│ Add to Cart    │            │ Add to Cart    │
└────────────────┘            └────────────────┘
```

The price belongs WITH the product name, not floating equidistant.

### Vertical Rhythm

Line-height and spacing should share a baseline grid:
- Body text: `leading-relaxed` (1.625)
- Headings: `leading-tight` (1.25)
- Spacing between paragraphs: Match the line-height of body text

### When to Use Which Spacing Utility

| Situation | Utility | Token |
|-----------|---------|-------|
| Inside components (padding) | `p-*` | 4-6 for cards, 2-4 for buttons |
| Between sibling elements | `gap-*` | Prefer gap over margin |
| Between sections | `space-y-*` or wrapper padding | 6-8 for page sections |
| Creating emphasis through isolation | Larger gap above/below | 8-12 for hero elements |
```

---

### Draft 3: spec-tailwind - Token Semantics Philosophy (NEW SECTION)

```markdown
## Token Semantics Philosophy

Tokens are not "colors with names." Tokens are **design decisions encoded as code**.

### Primitive vs. Semantic Tokens

**Primitive tokens** describe what something IS:
- `gray-500` - A gray color at 50% of the scale
- `blue-600` - A blue color at 60% of the scale

**Semantic tokens** describe what something MEANS:
- `background` - The default page background (could be white, could be dark gray)
- `foreground` - The default text color (adapts to background)
- `primary` - The brand action color (changes with brand, not with theme)
- `muted-foreground` - Secondary text (always lower contrast than foreground)

### Why Semantic Tokens Win

**Theming:** When dark mode is toggled, `background` knows to become dark. `gray-100` does not know this.

**Consistency:** Every `bg-background` is the same. Every ad-hoc `bg-gray-50 dark:bg-gray-900` might be slightly different.

**Intent:** `text-destructive` tells the next developer this is an error state. `text-red-600` tells them nothing.

**Refactoring:** Want to change all hover states? Update `bg-hover` once. Good luck finding all your `bg-gray-100 hover:bg-gray-200`.

### Token Naming Tiers (Treido)

```
Tier 1 - Primitive (AVOID using directly)
├── gray-*, blue-*, etc.
│
Tier 2 - Semantic (USE these)
├── background, foreground, card, popover
├── primary, secondary, muted, accent
├── destructive, success, warning
├── border, input, ring
│
Tier 3 - Component-specific (USE when provided)
├── button-*, input-*, card-*
```

### Decision Framework: "Can I use this color?"

1. Is there a semantic token for this intent? → Use it
2. Is this a one-off brand requirement? → Propose a new semantic token
3. Is this a data visualization or product swatch? → Exception allowed (document it)
4. None of the above? → You're probably doing something wrong
```

---

## Next Steps

1. **Immediate:** Implement drafts for treido-ui (Priority 1)
2. **This week:** Add semantic sections to spec-tailwind and spec-shadcn
3. **Next sprint:** Deepen treido-frontend, treido-backend, spec-supabase, spec-typescript
4. **Future:** Enhance procedural skills with decision frameworks

## Validation Criteria

After each skill update:
- `pnpm -s validate:skills` must pass
- Skill should answer: "How would a senior practitioner THINK about this?"
- Less "don't do X" → More "consider Y because Z"
- Include "when to break the rules" guidance

---

## Appendix: Audit Methodology

Each skill was evaluated against four criteria:

1. **Domain DNA** - Does it embody how a senior practitioner thinks?
2. **Teaches vs. Checklists** - Does it explain WHY, not just WHAT?
3. **Decision Frameworks** - Does it help navigate tradeoffs?
4. **Senior Wisdom** - Does it acknowledge edge cases and exceptions?

Scoring: 1 = Missing, 2 = Surface, 3 = Adequate, 4 = Good, 5 = Exemplary
