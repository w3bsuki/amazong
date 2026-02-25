# Iteration 4 — Surgical Duplicate Reduction

> **Goal:** Reduce duplicated lines from 1,111 → <800 (eliminate ≥311 lines of duplication).
> **Current:** 89 clone clusters, 1,111 duplicated lines (0.7%).
> **Source:** `pnpm dupes` (jscpd --min-lines 10), run 2026-02-24.
> **Strategy:** Fix the highest-impact clones first. Self-clones are safest. Skip auth/payment-sensitive files.

---

## Rules

1. Read `AGENTS.md` before starting.
2. Work in batches. After each batch: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`
3. **Do NOT touch** payment webhook handlers (`app/api/payments/webhook`, `app/api/subscriptions/webhook`, `app/api/checkout/webhook`) or auth session logic — these are flagged for human approval.
4. When deduplicating, prefer extracting shared helpers/functions over adding parameters to existing functions.
5. Preserve all existing behavior — dedup is structural, not functional.
6. Import paths: use `@/` aliases. Navigation: `@/i18n/routing`. No `next/link`.

---

## Batch 1 — Server Action Self-Clones (~165L)

These are internal duplications within the same action file. Extract local helpers.

### 1A. `app/actions/products-discounts.ts` — 3 clones (42L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 15L   | 144-158 | 90-104  |
| Self  | 12L   | 114-125 | 54-65   |
| Self  | 15L   | 144-158 | 90-104  |

**Pattern:** Repeated Supabase query + error-handling blocks for discount create vs update. Extract a shared `upsertDiscount(supabase, data)` helper within the file.

### 1B. `app/actions/profile-avatar-mutations.ts` — 2 clones (28L, shared target :27-40)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 14L   | 157-170 | 27-40   |
| Self  | 14L   | 109-122 | 27-40   |

**Pattern:** Repeated storage cleanup/delete logic. Extract a local `cleanupOldAvatar(supabase, path)` helper.

### 1C. `app/actions/orders-rating.ts` — 1 clone (15L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 15L   | 77-91   | 26-40   |

**Pattern:** Repeated auth + order-ownership validation. Extract `validateOrderOwnership(orderId)`.

### 1D. `app/actions/subscriptions-mutations.ts` — 1 clone (15L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 15L   | 153-167 | 91-105  |

**Pattern:** Repeated subscription status check pattern. Extract `getActiveSubscription(userId)` helper.

### 1E. `app/actions/seller-follows.ts` — 1 clone (14L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 14L   | 59-72   | 34-47   |

**Pattern:** Repeated follow/unfollow auth + validation. Extract shared validation block.

### 1F. `app/actions/profile-mutations.ts` — 2 clones (26L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 13L   | 173-185 | 54-136  |
| Self  | 13L   | 124-136 | 54-66   |

**Pattern:** Repeated auth guard + profile fetch pattern. Extract `getAuthenticatedProfile()`.

### 1G. `app/actions/seller-feedback.ts` — 1 clone (13L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 13L   | 222-234 | 205-217 |

**Pattern:** Repeated validation + response formatting. Extract validation helper.

### 1H. `app/actions/payments.ts` — 1 clone (12L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 12L   | 201-212 | 171-182 |

**Pattern:** Repeated Stripe session creation pattern. Extract shared config builder.

### 1I. `app/actions/products-create.ts` — 1 self + 1 cross-file (23L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 11L   | 240-250 | 215-225 |
| Cross | 12L   | 44-55   | `app/actions/products-update.ts` 241-252 |

**Pattern:** Repeated product validation/image handling. Extract shared `validateProductData()` or `processProductImages()`.

### 1J. `lib/auth/server-actions.ts` — 1 clone (12L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 12L   | 363-374 | 158-169 |

**Pattern:** Repeated auth error response formatting. Extract `formatAuthError()`.

**Batch 1 verification:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Batch 2 — UI Component Self-Clones (~200L)

Internal duplications within the same component file. Extract local sub-components or helper functions.

### 2A. `app/[locale]/(account)/account/_components/account-badges.tsx` — 2 clones (30L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 18L   | 199-216 | 102-166 |
| Self  | 12L   | 225-236 | 175-186 |

**Pattern:** Repeated badge rendering blocks. Extract a `<BadgeCard>` sub-component.

### 2B. `app/[locale]/(account)/account/addresses/addresses-content.tsx` — 3 clones (39L, overlapping target :146-158)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 13L   | 208-220 | 146-158 |
| Self  | 13L   | 179-191 | 146-158 |
| Self  | 13L   | 129-141 | 104-115 |

**Pattern:** Repeated address card UI blocks. Extract `<AddressCard>` sub-component. Fixing target :146-158 once should eliminate 2 of 3 clones.

### 2C. `app/[locale]/(main)/(support)/security/page.tsx` — 2 clones (28L, shared target :118-131)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 14L   | 141-154 | 118-131 |
| Self  | 14L   | 164-177 | 118-131 |

**Pattern:** Repeated security section UI blocks. Extract `<SecuritySection>` sub-component.

### 2D. `app/[locale]/(main)/_components/desktop/use-desktop-home-controller.ts` — 1 clone (18L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 18L   | 232-249 | 215-232 |

**Pattern:** Repeated section-loading logic. Extract parameterized loader.

### 2E. `app/[locale]/(main)/_components/desktop-home.tsx` — 1 clone (16L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 16L   | 128-143 | 100-115 |

**Pattern:** Repeated section rendering block. Extract `<HomeSection>` wrapper.

### 2F. `components/mobile/chrome/smart-rail.tsx` — 1 clone (15L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 15L   | 196-210 | 176-190 |

**Pattern:** Repeated animation/transition block. Parameterize.

### 2G. `components/auth/sign-up-form-identity-fields.tsx` — 1 clone (15L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 15L   | 42-56   | 7-21    |

**Pattern:** Repeated form field blocks. Extract shared field config.

### 2H. `app/[locale]/(main)/_components/category/subcategory-tabs.tsx` — 1 clone (13L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 13L   | 93-105  | 71-81   |

**Pattern:** Repeated tab rendering logic. Extract `<TabItem>`.

### 2I. `app/[locale]/(checkout)/_components/shipping-method-section.tsx` — 1 clone (13L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 13L   | 88-100  | 48-60   |

**Pattern:** Repeated shipping option rendering. Extract `<ShippingOption>`.

### 2J. `app/[locale]/(account)/account/_components/account-recent-activity.tsx` — 1 clone (13L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 13L   | 192-204 | 133-145 |

**Pattern:** Repeated activity item rendering. Extract `<ActivityItem>`.

### 2K. `app/[locale]/(business)/_components/products-table-mappers.ts` — 1 clone (14L)

| Clone | Lines | Range A | Range B |
|-------|-------|---------|---------|
| Self  | 14L   | 29-42   | 7-20    |

**Pattern:** Repeated mapping logic. Parameterize mapper function.

### 2L. Additional self-clones (smaller, 11-12L each, ~48L total)

| File | Lines | Range A | Range B |
|------|-------|---------|---------|
| `seller-payout-setup-layouts.tsx` | 12L | 267-278 | 86-97 |
| `mobile-category-browser-contextual.tsx` | 12L | 234-245 | 209-222 |
| `desktop-specs-accordion.tsx` | 11L | 190-200 | 107-118 |
| `business-command-palette.tsx` | 11L | 245-255 | 211-220 |
| `wishlist-page-client.tsx` (×2) | 13L+11L | 165-177/52-62 | 130-142/37-47 |

**Batch 2 verification:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Batch 3 — Cross-File Structural Dedup (~130L)

These require extracting shared code to a common location.

### 3A. Nav/Account Sidebar — 2 clones (35L)

| Clone | Lines | File A | Range A | File B | Range B |
|-------|-------|--------|---------|--------|---------|
| Cross | 18L   | `app/[locale]/_components/nav/nav-user.tsx` | 50-67 | `app/[locale]/(account)/account/_components/account-sidebar.tsx` | 185-203 |
| Cross | 17L   | `app/[locale]/_components/nav/nav-user.tsx` | 29-45 | `app/[locale]/(account)/account/_components/account-sidebar.tsx` | 164-179 |

**Strategy:** Extract shared user menu items/avatar rendering to `components/shared/user-menu-items.tsx`.

### 3B. Auth Forms — 2 clones (28L)

| Clone | Lines | File A | Range A | File B | Range B |
|-------|-------|--------|---------|--------|---------|
| Cross | 16L   | `components/auth/login-form-body.tsx` | 65-80 | `components/auth/sign-up-form-body.tsx` | 72-85 |
| Cross | 12L   | `components/auth/login-form-body.tsx` | 132-143 | `components/auth/sign-up-form-body.tsx` | 155-166 |

**Strategy:** Extract shared form layout/social auth section to `components/auth/auth-form-shared.tsx`.

### 3C. Onboarding Profile Pages — 1 clone (18L)

| Clone | Lines | File A | Range A | File B | Range B |
|-------|-------|--------|---------|--------|---------|
| Cross | 18L   | `app/[locale]/(onboarding)/onboarding/business-profile/business-profile-page-client.tsx` | 144-161 | `app/[locale]/(onboarding)/onboarding/profile/profile-page-client.tsx` | 128-146 |

**Strategy:** Extract shared profile form submission logic.

### 3D. Account Page Shell — 2 clones (32L, shared target :30-46)

| Clone | Lines | File A | Range A | File B | Range B |
|-------|-------|--------|---------|--------|---------|
| Cross | 16L   | `app/[locale]/(account)/account/page.tsx` | 32-47 | `app/[locale]/(account)/account/_lib/account-page-shell.tsx` | 30-46 |
| Cross | 16L   | `app/[locale]/(account)/account/orders/page.tsx` | 134-149 | `app/[locale]/(account)/account/_lib/account-page-shell.tsx` | 30-46 |

**Strategy:** Both pages duplicate the shell. Ensure they USE the shell component instead of reimplementing.

### 3E. Category Pages — 2 clones (30L)

| Clone | Lines | File A | Range A | File B | Range B |
|-------|-------|--------|---------|--------|---------|
| Cross | 15L   | `app/[locale]/(main)/categories/[slug]/page.tsx` | 37-51 | `app/[locale]/(main)/categories/[slug]/[subslug]/page.tsx` | 38-52 |
| Cross | 15L   | `app/[locale]/(main)/categories/[slug]/_components/category-page-content.tsx` | 18-32 | `app/[locale]/(main)/categories/[slug]/_components/category-page-dynamic-content.tsx` | 21-35 |

**Strategy:** Extract shared category data-fetching/rendering pattern.

### 3F. AI Assistant Routes — 1 clone (17L)

| Clone | Lines | File A | Range A | File B | Range B |
|-------|-------|--------|---------|--------|---------|
| Cross | 17L   | `app/api/assistant/find-similar/route.ts` | 26-42 | `app/api/assistant/sell-autofill/route.ts` | 21-37 |

**Strategy:** Extract shared AI route auth/validation boilerplate.

**Batch 3 verification:**
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Batch 4 — Admin & Remaining Cross-File (~100L, stretch goal)

Only needed if Batches 1-3 don't reach <800. These are lower-impact and some are structural boilerplate.

### 4A. Admin Pages — 4 clones (52L)

| Clone | Lines | File A | File B |
|-------|-------|--------|--------|
| 15L   | `admin/orders/page.tsx:1-15` | `admin/sellers/page.tsx:1-14` |
| 15L   | `admin/products/page.tsx:84-98` | `admin/users/page.tsx:75-89` |
| 11L   | `admin/docs/page.tsx:22-32` | `admin/tasks/page.tsx:17-25` |
| 11L   | `admin/notes/page.tsx:26-36` | `admin/tasks/page.tsx:15-25` |

**Strategy:** Extract shared admin page layout/table wrapper.

### 4B. Auth Pages — 3 clones (37L)

| Clone | Lines | File A | File B |
|-------|-------|--------|--------|
| 13L   | `auth/forgot-password/page.tsx:2-14` | `auth/sign-up/page.tsx:2-14` |
| 13L   | `auth/login/page.tsx:2-14` | `auth/sign-up/page.tsx:2-14` |
| 11L   | `auth/sign-up/page.tsx:3-13` | `auth/welcome/page.tsx:2-12` |

**Strategy:** Extract shared auth page layout wrapper.

### 4C. Miscellaneous Cross-File (skip-or-do, ~50L)

| Clone | Lines | File A | File B | Note |
|-------|-------|--------|--------|------|
| 15L   | `require-account-page-context.ts:13-27` | `get-upgrade-data.ts:14-28` | Extract shared auth guarding |
| 15L   | `api/billing/invoices/route.ts:11-25` | `api/seller/limits/route.ts:13-50` | Extract shared route auth |
| 14L   | `products/search/route.ts:58-71` | `lib/ai/tools/search-listings.ts:37-49` | Extract search query builder |
| 14L   | `boosts-status.ts:8-21` | `boosts-use-subscription.ts:12-22` | Extract shared boost query |
| 14L   | `messages.queries.ts:14-27` | `lib/types/messages.ts:99-112` | Deduplicate type definition |

---

## Acceptance Criteria

1. `pnpm dupes` reports <800 duplicated lines (currently 1,111)
2. All 5 gates green: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`
3. No behavioral changes — dedup is structural only
4. No new files >300 lines
5. Payment/auth webhook handlers untouched

## Estimated Impact

| Batch | Clones | Est. Lines Eliminated |
|-------|--------|-----------------------|
| 1     | ~14    | ~165L                 |
| 2     | ~17    | ~200L                 |
| 3     | ~10    | ~130L                 |
| 4     | ~12    | ~100L (stretch)       |
| **Total** | **~53** | **~495-595L**     |

Batches 1-3 alone should get us to ~620 duplicated lines (<800 target).

---

## Codex Prompt (paste this)

```
Read AGENTS.md. Then read codex/DEDUP-ITERATION-4.md.

Execute Batches 1-3 of the duplicate reduction plan. Each batch has exact file paths,
line numbers, and dedup strategies. Work one batch at a time. After each batch, run:
  pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit

Rules:
- Do NOT touch payment/auth webhook handlers.
- Extract helpers/sub-components per the strategy notes.
- Use @/ import aliases. Navigation from @/i18n/routing.
- Preserve all existing behavior.

After all 3 batches, run `pnpm dupes` and report the new clone count + duplicated lines.
If still >800 duplicated lines, continue with Batch 4.
```
