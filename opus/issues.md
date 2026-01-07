# Issues Registry — Treido Marketplace

> **Generated**: January 2026  
> **Purpose**: Comprehensive list of all identified issues requiring attention  
> **Organization**: By severity and category

---

## 🔴 Critical Issues (Ship Blockers)

### SEC-001: Supabase Security Advisors Not Verified
- **Category**: Security
- **Location**: Supabase Dashboard
- **Description**: Security advisors haven't been run to verify RLS policies are complete
- **Impact**: Potential data exposure or unauthorized access
- **Resolution**: Run `mcp_supabase_get_advisors({ type: "security" })` and fix all warnings
- **Effort**: 2-4 hours

### SEC-002: Leaked Password Protection Disabled
- **Category**: Security
- **Location**: Supabase Auth Dashboard
- **Description**: Supabase's leaked password protection feature is not enabled
- **Impact**: Users could register with compromised passwords
- **Resolution**: Enable in Supabase Dashboard > Authentication > Settings
- **Effort**: 15 minutes

### PAY-001: Stripe Products/Prices Not Created
- **Category**: Payments
- **Location**: Stripe Dashboard + Supabase
- **Description**: Subscription tier products and prices need to be created in Stripe
- **Impact**: Paid subscriptions won't work
- **Resolution**: Create products in Stripe, set price IDs in `subscription_plans` table
- **Effort**: 1-2 hours

### PAY-002: Stripe Webhook Not Configured
- **Category**: Payments
- **Location**: Stripe Dashboard
- **Description**: Webhook endpoint needs to be registered for production
- **Impact**: Payment status updates won't be received
- **Resolution**: Configure `https://treido.eu/api/subscriptions/webhook`
- **Effort**: 30 minutes

---

## 🟡 High Priority Issues

### UI-001: Gradient Violations (13 files)
- **Category**: Design System
- **Location**: Multiple files
- **Description**: 13 files use gradients which violate flat marketplace style
- **Files**:
  - `wishlist-page-client.tsx` (3)
  - `toast.tsx` (3)
  - `page.tsx` (home) (1)
  - `desktop-layout.tsx` (1)
  - `cookie-consent.tsx` (1)
  - `start-selling-banner.tsx` (1)
  - `mobile-filters.tsx` (1)
  - Wishlist shared pages (2)
- **Impact**: Inconsistent visual design
- **Resolution**: Replace gradients with solid semantic tokens
- **Effort**: 2-3 hours

### UI-002: Arbitrary Tailwind Values (189 instances)
- **Category**: Design System
- **Location**: 97 files
- **Description**: 189 uses of arbitrary values like `w-[560px]`, `h-[42px]`, `text-[13px]`
- **Top Offenders**:
  - `products-table.tsx` (6)
  - `chat/loading.tsx` (6)
  - `sidebar.tsx` (6)
  - `plan-card.tsx` (6)
  - `drawer.tsx` (5)
- **Impact**: Inconsistent sizing, harder to maintain
- **Resolution**: Replace with design tokens from `globals.css`
- **Effort**: 8-12 hours (across multiple sessions)

### PERF-001: Missing Performance Advisors Review
- **Category**: Performance
- **Location**: Supabase
- **Description**: Performance advisors haven't been reviewed for index recommendations
- **Impact**: Potential slow queries
- **Resolution**: Run `mcp_supabase_get_advisors({ type: "performance" })`
- **Effort**: 1-2 hours

### ARCH-001: MessageProvider Missing from Provider Stack
- **Category**: Architecture
- **Location**: `locale-providers.tsx`
- **Description**: Chat context provider not included in the main provider stack
- **Impact**: Chat features may have inconsistent state
- **Resolution**: Add MessageProvider to provider composition
- **Effort**: 30 minutes

---

## 🟢 Medium Priority Issues

### UI-003: Dark Mode Token Gaps (~5%)
- **Category**: Design System
- **Location**: `globals.css`
- **Description**: Some tokens lack explicit dark mode overrides
- **Impact**: Minor visual inconsistencies in dark mode
- **Resolution**: Add missing `.dark {}` overrides
- **Effort**: 1-2 hours

### ARCH-002: Unnecessary Client Directives
- **Category**: Architecture
- **Location**: Various components
- **Description**: Some files have `'use client'` but only use server-safe code
- **Files to Review**:
  - `category-icons.tsx` - Could be Server Component
  - Some simple display components
- **Impact**: Larger client bundle than necessary
- **Resolution**: Audit and remove unnecessary `'use client'` directives
- **Effort**: 2-4 hours

### DATA-001: Field Projection in Route Handlers
- **Category**: Data/Performance
- **Location**: `app/api/**`
- **Description**: Some route handlers may use wider selects than needed
- **Impact**: Increased data transfer, slower responses
- **Resolution**: Audit and add field projections
- **Effort**: 2-3 hours

### TEST-001: E2E Port Conflicts
- **Category**: Testing
- **Location**: `playwright.config.ts`
- **Description**: E2E tests don't auto-pick free port
- **Impact**: Tests may fail if port 3000 is in use
- **Resolution**: Implement dynamic port selection
- **Effort**: 1-2 hours

### I18N-001: Missing Translation Keys
- **Category**: i18n
- **Location**: `messages/*.json`
- **Description**: Some newer features may have untranslated strings
- **Impact**: UI shows English fallbacks in Bulgarian
- **Resolution**: Audit and add missing translations
- **Effort**: 2-4 hours

---

## 🔵 Low Priority Issues

### DOC-001: Missing Component Documentation
- **Category**: Documentation
- **Location**: `components/**`
- **Description**: Components lack JSDoc comments or Storybook stories
- **Impact**: Harder for new developers to understand
- **Resolution**: Add documentation as components are touched
- **Effort**: Ongoing

### TYPE-001: Unknown/Any Type Usage
- **Category**: TypeScript
- **Location**: Various files
- **Description**: Some files use `unknown` or type assertions
- **Impact**: Reduced type safety
- **Resolution**: Gradually improve types
- **Effort**: Ongoing

### CLEAN-001: Dead Code
- **Category**: Cleanup
- **Location**: Various
- **Description**: Unused components, functions, or imports
- **Impact**: Larger bundle, confusing codebase
- **Resolution**: Run `knip` and remove unused exports
- **Effort**: 2-4 hours

### LOG-001: Development Console Logs
- **Category**: Cleanup
- **Location**: Various
- **Description**: Some `console.log` statements remain in code
- **Impact**: Noisy production logs (though filtered by next.config)
- **Resolution**: Remove or convert to structured logging
- **Effort**: 1-2 hours

### STYLE-001: Tailwind Scan False Positives
- **Category**: Tooling
- **Location**: `scripts/scan-tailwind-palette.mjs`
- **Description**: Palette scan has false positives
- **Impact**: Noise in scan reports
- **Resolution**: Improve scanner patterns
- **Effort**: 1 hour

---

## 📋 Issue Summary

| Severity | Count | Effort Estimate |
|----------|-------|-----------------|
| 🔴 Critical | 4 | 4-7 hours |
| 🟡 High | 4 | 12-20 hours |
| 🟢 Medium | 5 | 8-14 hours |
| 🔵 Low | 5 | 6-12 hours |
| **Total** | **18** | **30-53 hours** |

---

## 🔗 Issue References

### By Component/Area

| Area | Issues |
|------|--------|
| Security | SEC-001, SEC-002 |
| Payments | PAY-001, PAY-002 |
| Design System | UI-001, UI-002, UI-003 |
| Performance | PERF-001, DATA-001 |
| Architecture | ARCH-001, ARCH-002 |
| Testing | TEST-001 |
| i18n | I18N-001 |
| Documentation | DOC-001 |
| TypeScript | TYPE-001 |
| Cleanup | CLEAN-001, LOG-001 |
| Tooling | STYLE-001 |

### By Fix Type

| Type | Issues |
|------|--------|
| Dashboard/Config | SEC-002, PAY-001, PAY-002 |
| Code Changes | UI-001, UI-002, UI-003, ARCH-001, ARCH-002, DATA-001 |
| Audit Required | SEC-001, PERF-001, I18N-001 |
| Testing | TEST-001 |
| Documentation | DOC-001 |
| Cleanup | CLEAN-001, LOG-001, STYLE-001, TYPE-001 |

---

## 🔗 Related Documents

- [frontend.md](./frontend.md) - Frontend patterns audit
- [backend.md](./backend.md) - Backend patterns audit
- [tasks.md](./tasks.md) - Phased execution plan
- [guide.md](./guide.md) - Execution guide
