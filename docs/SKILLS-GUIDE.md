# Skills Guide - How to Use AI Skills for Treido

This guide explains how to effectively prompt AI agents to leverage the installed skills for improving the Treido codebase.

## Installed Skills

| Skill | Trigger Keywords | Use Case |
|-------|------------------|----------|
| `vercel-react-best-practices` | react, performance, optimization, rendering | Optimize React components |
| `web-design-guidelines` | design, UI review, layout, spacing | Review UI against best practices |
| `tailwind-v4-shadcn` | tailwind, styling, shadcn, tokens | Tailwind v4 patterns |
| `supabase-postgres-best-practices` | database, query, postgres, RLS | DB optimization |
| `stripe-best-practices` | stripe, payment, checkout, webhook | Payment integration |
| `frontend-design` | build UI, create component, design | Build polished UIs |
| `ui-ux-pro-max` | UI/UX, user experience, design system | Advanced design patterns |
| `mobile-ux-optimizer` | mobile, touch, responsive, native feel | Mobile optimization |
| `pwa-expert` | PWA, offline, service worker, install | Progressive web app |
| `nextjs-supabase-auth` | auth, login, session, middleware | Auth patterns |
| `playwright` | test, e2e, playwright | E2E testing |
| `accessibility-compliance` | a11y, accessibility, screen reader | Accessibility audit |
| `i18n-localization` | i18n, translation, locale | Internationalization |
| `typescript-advanced-types` | types, typescript, generics | Type patterns |
| `seo-audit` | SEO, meta, ranking | SEO optimization |

---

## Prompt Templates

### 1. UI/UX Review & Improvement

```
Review [component/page] for UI/UX best practices. 
Check mobile responsiveness, touch targets, and native app feel.
```

**Example:**
```
Review the ProductCard component for mobile UX. 
Make it feel more like a native iOS app with proper touch feedback and animations.
```

### 2. Performance Optimization

```
Analyze [file/component] for React performance issues.
Apply Vercel best practices for rendering optimization.
```

**Example:**
```
Optimize the product grid for performance. 
Check for unnecessary re-renders and apply proper memoization.
```

### 3. Database Query Review

```
Review this Supabase query for performance.
Apply Postgres best practices and proper indexing.
```

**Example:**
```
Optimize the products fetch query. Check for N+1 issues and suggest indexes.
```

### 4. Accessibility Audit

```
Audit [component/page] for WCAG 2.2 compliance.
Check keyboard navigation, screen reader support, and color contrast.
```

**Example:**
```
Audit the checkout flow for accessibility. 
Ensure it works with screen readers and keyboard-only navigation.
```

### 5. Mobile-First Optimization

```
Make [component] feel like a native mobile app.
Apply iOS-style interactions, gestures, and animations.
```

**Example:**
```
Transform the navigation into a native app-style bottom tab bar.
Add swipe gestures and haptic-like feedback.
```

### 6. PWA Enhancement

```
Add PWA capabilities to [feature].
Implement offline support and install prompts.
```

**Example:**
```
Make the product browsing work offline with proper caching.
Add an install prompt for mobile users.
```

### 7. Auth Flow Review

```
Review the auth implementation for security and UX.
Check middleware, session handling, and protected routes.
```

**Example:**
```
Audit the login flow. Ensure proper session refresh 
and secure token handling following Supabase+Next.js patterns.
```

### 8. Stripe Integration Review

```
Review Stripe integration for best practices.
Check webhook handling, error states, and security.
```

**Example:**
```
Audit the checkout webhook handler. 
Ensure idempotency and proper error handling.
```

### 9. i18n Completeness Check

```
Check [component/page] for i18n compliance.
Find hardcoded strings and ensure translation parity.
```

**Example:**
```
Scan the seller dashboard for hardcoded strings.
Add missing translations to en.json and bg.json.
```

### 10. E2E Test Writing

```
Write Playwright tests for [feature/flow].
Follow testing best practices with proper selectors.
```

**Example:**
```
Write E2E tests for the checkout flow.
Cover happy path, error states, and edge cases.
```

---

## Power Prompts (Combining Multiple Skills)

### Full Page Audit
```
Do a complete audit of the [page]:
1. UI/UX review (mobile-first, native feel)
2. Accessibility compliance (WCAG 2.2)
3. Performance optimization
4. i18n completeness
```

### Native App Transformation
```
Transform [component/page] to feel like a native iOS app:
- Smooth animations and transitions
- Touch-optimized interactions
- Bottom sheet modals
- Pull-to-refresh
- Haptic-like feedback
```

### Production Readiness Check
```
Check [feature] for production readiness:
- Security audit (auth, data access)
- Performance review
- Error handling
- Accessibility
- SEO optimization
```

---

## Quick Commands

| Goal | Prompt |
|------|--------|
| Make component feel native | "Make this feel like iOS" |
| Fix performance | "Optimize for performance" |
| Add offline support | "Add PWA offline support" |
| Audit accessibility | "Check a11y compliance" |
| Review database | "Audit this query" |
| Check translations | "Find missing i18n strings" |
| Write tests | "Write Playwright tests for this" |
| Review design | "Review against design guidelines" |

---

## Best Practices for Prompting

### Be Specific
❌ "Make it better"
✅ "Optimize the ProductCard for mobile UX with native iOS feel"

### Reference Files
❌ "Fix the component"
✅ "Review components/shared/ProductCard.tsx for performance"

### Combine Skills
❌ "Check everything"
✅ "Audit for accessibility + mobile UX + performance"

### Ask for Explanations
✅ "Explain why this pattern is better before implementing"

### Request Verification
✅ "After changes, run typecheck and lint to verify"

---

## Skill Activation Tips

Skills are **automatically activated** based on:
1. Keywords in your prompt
2. Files you're working with
3. Context of the conversation

You don't need to explicitly mention skill names - just describe what you want to achieve.

**Example triggers:**
- "mobile" → activates `mobile-ux-optimizer`
- "PWA" → activates `pwa-expert`  
- "accessibility" → activates `accessibility-compliance`
- "Supabase query" → activates `supabase-postgres-best-practices`

---

## Treido-Specific Workflows

### New Feature Development
1. Design UI with `frontend-design` + `ui-ux-pro-max`
2. Implement with `vercel-react-best-practices`
3. Style with `tailwind-v4-shadcn`
4. Add translations with `i18n-localization`
5. Write tests with `playwright`
6. Audit with `accessibility-compliance`

### Mobile Optimization Sprint
1. Audit with `mobile-ux-optimizer`
2. Add PWA features with `pwa-expert`
3. Review touch targets and gestures
4. Test on real devices

### Database Optimization
1. Query analysis with `supabase-postgres-best-practices`
2. Index recommendations
3. RLS policy review
4. Performance benchmarking
