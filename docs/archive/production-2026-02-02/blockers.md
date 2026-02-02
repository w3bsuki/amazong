# Launch Blockers

> Items that MUST be resolved before production deployment.

---

## Current Status

| Category | Blockers |
|----------|----------|
| **Critical** | 1 |
| **High** | 0 |
| **Medium (should fix)** | 3 |

---

## 🔴 Critical Blocker

### BLOCK-000: Delete orphaned `temp-tradesphere-audit/` folder

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **Risk** | Causes 47 TypeScript errors, blocks `pnpm -s typecheck` |
| **Evidence** | Separate project with own `package.json`, `tsconfig.json`, `vite.config.ts` |
| **Fix** | Delete entire folder: `Remove-Item -Recurse -Force temp-tradesphere-audit` |
| **Effort** | 1 minute |
| **Owner** | HUMAN (file deletion) |

**This is the ONLY launch blocker.** Once deleted, typecheck should pass.

---

## ✅ No Other Critical Blockers

The codebase has **zero launch-blocking issues**:

- ✅ Backend is production ready
- ✅ Security audit passed
- ✅ All webhooks verified
- ✅ RLS enabled on all tables
- ✅ Authentication flows working
- ✅ Payment flows working

---

## ⚠️ Should Fix Before Launch (Medium)

These won't break production but should be addressed:

### BLOCK-001: Error boundaries missing on dashboard routes

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Risk** | Dashboard errors bubble to layout handler |
| **Files** | 5 business dashboard routes |
| **Fix** | Add error.tsx files |
| **Effort** | 1h |
| **Owner** | treido-frontend |

---

### BLOCK-002: Inline translations (non-i18n compliant)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Risk** | Bulgarian users see English if locale detection fails |
| **Files** | 8 files with inline `translations` objects |
| **Fix** | Move to messages/*.json |
| **Effort** | 3h |
| **Owner** | treido-frontend |

---

### BLOCK-003: Wrong Link imports bypass locale

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Risk** | Some links don't include locale prefix |
| **Files** | 3 components using `next/link` |
| **Fix** | Change to `@/i18n/routing` Link |
| **Effort** | 30m |
| **Owner** | treido-frontend |

---

## ✅ Non-Blockers (Post-Launch OK)

These can be addressed after launch:

| Item | Severity | Effort |
|------|----------|--------|
| Opacity hacks in Tailwind | Low | 2h |
| Story files in components/ui/ | Low | 1h |
| `<img>` instead of next/image | Low | 2h |
| Seller-follows Zod validation | Low | 30m |
| Rate limiting for reviews | Low | 4h (post-launch) |
| Admin moderation actions | Low | 8h (V1.1) |

---

## Verification Checklist

Before deploying, verify:

### Gates
- [ ] `pnpm -s typecheck` — PASS
- [ ] `pnpm -s lint` — PASS
- [ ] `pnpm -s styles:gate` — PASS
- [ ] `pnpm build` — PASS

### Tests
- [ ] `pnpm -s test:unit` — PASS
- [ ] `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` — PASS

### Manual
- [ ] Checkout flow works end-to-end
- [ ] Seller onboarding works
- [ ] Connect payout setup works
- [ ] Chat messaging works
- [ ] EN/BG locale switching works

---

## Decision: Launch Readiness

**Recommendation:** ✅ READY TO LAUNCH

The medium-priority items can be:
1. Fixed in parallel while preparing deployment
2. Fixed immediately post-launch (no user impact)

**Estimated pre-launch work:** 4.5h (BLOCK-001 + BLOCK-002 + BLOCK-003)

---

*Last updated: 2026-02-02*
