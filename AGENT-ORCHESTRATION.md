# UI/UX Production Sprint - Master Orchestration

> **Goal**: Bring the Amazong marketplace UI to professional, consistent state before launch.
> **Strategy**: 4 agents working in parallel on non-overlapping concerns.

---

## 🚀 Quick Start Commands

### Terminal 1 - Foundation Agent (Run First)

```bash
# Start Opus 4.5 with:
Read AGENT-0-DESIGN-SYSTEM-AUDIT.md and execute the tasks.
You have access to Playwright MCP for visual testing and Context7 MCP for best practices lookup.
Run gates after each change. No redesigns - preserve existing behavior.
```

### Terminal 2 - Typography Agent (After Agent-0)

```bash
# Start Opus 4.5 with:
Read AGENT-1-TYPOGRAPHY-AUDIT.md and execute the tasks.
You have access to Playwright MCP for visual testing and Context7 MCP for best practices lookup.
Your scope: Typography ONLY (font sizes, weights, line heights).
Do NOT touch: Colors, spacing, shadows.
Run gates after each change.
```

### Terminal 3 - Spacing Agent (After Agent-0)

```bash
# Start Opus 4.5 with:
Read AGENT-2-SPACING-LAYOUT-AUDIT.md and execute the tasks.
You have access to Playwright MCP for visual testing and Context7 MCP for best practices lookup.
Your scope: Spacing ONLY (gaps, padding, margins, layout).
Do NOT touch: Colors, typography, shadows.
Run gates after each change.
```

### Terminal 4 - Colors Agent (After Agent-0)

```bash
# Start Opus 4.5 with:
Read AGENT-3-COLORS-THEMING-AUDIT.md and execute the tasks.
You have access to Playwright MCP for visual testing and Context7 MCP for best practices lookup.
Your scope: Colors ONLY (tokens, theming, shadows, gradients, dark mode).
Do NOT touch: Typography, spacing, layout.
Run gates after each change.
```

---

## 📋 Agent Scope Matrix (Avoid Conflicts)

| Concern | Agent-0 | Agent-1 | Agent-2 | Agent-3 |
|---------|---------|---------|---------|---------|
| Design System Setup | ✅ | ❌ | ❌ | ❌ |
| Font sizes | ❌ | ✅ | ❌ | ❌ |
| Font weights | ❌ | ✅ | ❌ | ❌ |
| Line heights | ❌ | ✅ | ❌ | ❌ |
| Gap/spacing | ❌ | ❌ | ✅ | ❌ |
| Padding/margins | ❌ | ❌ | ✅ | ❌ |
| Layout/grids | ❌ | ❌ | ✅ | ❌ |
| Container classes | ❌ | ❌ | ✅ | ❌ |
| Background colors | ❌ | ❌ | ❌ | ✅ |
| Text colors | ❌ | ❌ | ❌ | ✅ |
| Border colors | ❌ | ❌ | ❌ | ✅ |
| Shadows | ❌ | ❌ | ❌ | ✅ |
| Border radius | ❌ | ❌ | ❌ | ✅ |
| Gradients (removal) | ❌ | ❌ | ❌ | ✅ |
| Dark mode | ❌ | ❌ | ❌ | ✅ |

---

## 📁 Files by Agent

### Agent-0 Files (Foundation)
```
app/globals.css               # Token definitions
components.json               # shadcn config
cleanup/palette-scan-report.txt
cleanup/arbitrary-scan-report.txt
```

### Agent-1 Files (Typography)
```
app/[locale]/(sell)/_components/**     # Form typography
app/[locale]/(account)/**              # Account typography
components/pricing/plan-card.tsx       # Pricing typography
app/[locale]/(main)/product/**         # Product typography
components/ui/button.tsx               # Button text
components/ui/badge.tsx                # Badge text
```

### Agent-2 Files (Spacing)
```
app/[locale]/(sell)/_components/**     # Form spacing
app/[locale]/(account)/**              # Account layout
components/shared/product/**           # Product grid spacing
components/layout/**                   # Layout containers
app/[locale]/(main)/cart/**            # Cart spacing
```

### Agent-3 Files (Colors)
```
components/ui/toast.tsx                # Has gradients!
app/[locale]/(main)/wishlist/**        # Has gradients!
app/[locale]/(sell)/_components/layouts/desktop-layout.tsx  # Has gradient!
components/layout/cookie-consent.tsx   # Has gradient!
components/sections/start-selling-banner.tsx  # Has gradient!
components/shared/filters/mobile-filters.tsx  # Has gradient!
```

---

## 🚦 Execution Order

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 0: Foundation (Agent-0)                                  │
│  • Audit token coverage in globals.css                          │
│  • Document missing tokens                                      │
│  • Create reference sheet for other agents                      │
│  • Duration: ~2 hours                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: Parallel Audit & Fix (Agents 1-3 simultaneously)      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Agent-1    │  │   Agent-2    │  │   Agent-3    │          │
│  │  Typography  │  │   Spacing    │  │   Colors     │          │
│  │  ~3 hours    │  │  ~3 hours    │  │  ~3 hours    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  Non-overlapping scopes = no merge conflicts                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Phase 2: Integration & Verification                            │
│  • Merge all branches                                           │
│  • Run full E2E suite                                           │
│  • Visual regression check (screenshots)                        │
│  • Duration: ~1 hour                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Priority Pages to Fix

All agents should prioritize these pages:

1. **`/sell`** - Product listing form (worst offender for all concerns)
2. **`/account`** - Account dashboard
3. **`/plans`** - Pricing/subscription page
4. **`/product/[slug]`** - Product detail page
5. **`/cart`** - Shopping cart
6. **`/`** - Homepage

---

## ✅ Verification Gates (All Agents)

After EVERY change, run:

```bash
# Typecheck (must pass)
pnpm -s exec tsc -p tsconfig.json --noEmit

# Build (should not break)
pnpm build

# E2E smoke (should not regress)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## 📊 Success Metrics

### From Scan Reports (Target: Zero)

| Metric | Current | Target |
|--------|---------|--------|
| Gradient violations | 13 | 0 |
| Arbitrary values | 189 | < 20 |
| Palette violations | 0 | 0 |

### Visual Quality (Manual Check)

- [ ] All pages consistent white/blue theme
- [ ] No gradients visible anywhere
- [ ] Dark mode works on all pages
- [ ] Typography consistent (no random sizes)
- [ ] Spacing consistent (no random gaps)
- [ ] Cards are flat (no heavy shadows)
- [ ] Mobile touch targets adequate (32px+)

---

## 🔧 MCP Tools Reference

### Context7 MCP (Best Practices)

```javascript
// Typography
context7.search("Tailwind CSS v4 typography scale")
context7.search("Inter font line height recommendations")

// Spacing
context7.search("Tailwind CSS v4 spacing tokens")
context7.search("Dense UI spacing patterns")

// Colors
context7.search("OKLCH color space Tailwind")
context7.search("shadcn/ui semantic color tokens")
context7.search("Dark mode CSS variables")
```

### Playwright MCP (Visual Testing)

```javascript
// Screenshot before/after
await page.goto('/sell');
await page.screenshot({ path: 'before.png', fullPage: true });
// Make changes...
await page.screenshot({ path: 'after.png', fullPage: true });

// Test dark mode
await page.evaluate(() => document.documentElement.classList.add('dark'));
await page.screenshot({ path: 'dark-mode.png', fullPage: true });

// Test mobile
await page.setViewportSize({ width: 375, height: 812 });
await page.screenshot({ path: 'mobile.png', fullPage: true });
```

---

## 📝 Commit Message Format

```bash
# Typography (Agent-1)
git commit -m "fix(typography): standardize /sell form typography"

# Spacing (Agent-2)
git commit -m "fix(spacing): standardize /account page layout"

# Colors (Agent-3)
git commit -m "fix(colors): eliminate gradients from toast component"
```

---

## 🚨 Non-Negotiable Rules (All Agents)

1. **No gradients** - Flat marketplace UI
2. **No heavy shadows** - `shadow-sm` max for hover
3. **No arbitrary values** - Use tokens from `globals.css`
4. **No redesigns** - Preserve existing behavior
5. **No Tailwind palette colors** - Use semantic tokens
6. **No hardcoded colors** - Use CSS variables
7. **Cards are flat** - `rounded-md` max, no drop shadows
8. **Dense spacing** - Mobile `gap-2`, Desktop `gap-3`
9. **Touch targets** - 24px minimum, prefer 32px+
10. **Run gates** - Typecheck after every change

---

## 🎉 Done Criteria

The UI/UX sprint is complete when:

- [ ] All 4 agent checklists completed
- [ ] Scan reports show zero critical violations
- [ ] Typecheck passes
- [ ] E2E smoke tests pass
- [ ] Visual review approved on all priority pages
- [ ] Dark mode works consistently
- [ ] Mobile experience is polished

**LET'S SHIP THIS! 🚀**
