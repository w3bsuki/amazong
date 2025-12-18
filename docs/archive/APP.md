# 📁 APP FOLDER - DETAILED CLEANUP PLAN

> **Parent:** PRODUCTION_CLEANUP.md  
> **Priority:** CRITICAL  
> **Status:** ⬜ Not Started

---

## 📊 APP FOLDER STRUCTURE

```
📁 app/
├── globals.css                    ✅ KEEP
├── globals.css.backup             ❌ DELETE
│
├── 📁 actions/
│   ├── checkout.ts               ✅ KEEP - Review logs
│   └── revalidate.ts             ✅ KEEP - Review logs
│
├── 📁 api/
│   ├── 📁 auth/
│   │   └── 📁 sign-out/
│   │       └── route.ts          ✅ KEEP
│   │
│   ├── 📁 boost/
│   │   └── 📁 checkout/
│   │       └── route.ts          ✅ KEEP
│   │
│   ├── 📁 categories/
│   │   ├── route.ts              ✅ KEEP
│   │   ├── 📁 attributes/
│   │   ├── 📁 products/
│   │   └── 📁 [slug]/
│   │
│   ├── 📁 checkout/
│   │   └── 📁 webhook/
│   │       └── route.ts          ✅ KEEP
│   │
│   ├── 📁 geo/
│   │   └── route.ts              ✅ KEEP
│   │
│   ├── 📁 payments/
│   │   ├── 📁 delete/
│   │   ├── 📁 set-default/
│   │   ├── 📁 setup/
│   │   └── 📁 webhook/
│   │
│   ├── 📁 products/
│   │   ├── route.ts              ✅ KEEP
│   │   ├── 📁 create/
│   │   └── 📁 search/
│   │
│   ├── 📁 revalidate/
│   │   └── route.ts              ✅ KEEP
│   │
│   ├── 📁 stores/
│   │   └── route.ts              ✅ KEEP
│   │
│   ├── 📁 subscriptions/
│   │   ├── 📁 checkout/
│   │   ├── 📁 portal/
│   │   └── 📁 webhook/
│   │
│   └── 📁 upload-image/
│       └── route.ts              ✅ KEEP
│
├── 📁 auth/
│   ├── 📁 callback/
│   │   └── route.ts              ✅ KEEP
│   └── 📁 confirm/
│       └── route.ts              ✅ KEEP
│
└── 📁 [locale]/
    ├── error.tsx                 ✅ KEEP
    ├── layout.tsx                ✅ KEEP
    ├── loading.tsx               ✅ KEEP
    ├── not-found.tsx             ✅ KEEP
    │
    ├── 📁 (account)/
    │   ├── layout.tsx            ✅ KEEP
    │   ├── account-layout-content.tsx  ✅ KEEP
    │   │
    │   ├── 📁 @modal/
    │   │   ├── default.tsx       ✅ KEEP
    │   │   └── 📁 (.)account/
    │   │
    │   └── 📁 account/
    │       ├── page.tsx          ✅ KEEP
    │       ├── error.tsx         ✅ KEEP
    │       ├── loading.tsx       ✅ KEEP
    │       │
    │       ├── 📁 addresses/
    │       │   ├── page.tsx
    │       │   └── addresses-content.tsx
    │       │
    │       ├── 📁 messages/
    │       │   ├── page.tsx
    │       │   └── messages-client.tsx
    │       │
    │       ├── 📁 orders/
    │       │   ├── page.tsx
    │       │   └── loading.tsx
    │       │
    │       ├── 📁 payments/
    │       │   ├── page.tsx
    │       │   └── payments-content.tsx
    │       │
    │       ├── 📁 plans/
    │       │   ├── page.tsx
    │       │   ├── plans-content.tsx
    │       │   └── 📁 upgrade/
    │       │
    │       ├── 📁 security/
    │       │   ├── page.tsx
    │       │   └── security-content.tsx
    │       │
    │       ├── 📁 selling/
    │       │   ├── page.tsx
    │       │   ├── 📁 edit/
    │       │   └── 📁 [id]/
    │       │
    │       └── 📁 wishlist/
    │           ├── page.tsx
    │           └── loading.tsx
    │
    ├── 📁 (auth)/
    │   ├── layout.tsx            ✅ KEEP
    │   │
    │   └── 📁 auth/
    │       ├── 📁 error/
    │       ├── 📁 login/
    │       ├── 📁 sign-up/
    │       └── 📁 sign-up-success/
    │
    ├── 📁 (main)/
    │   ├── layout.tsx            ✅ KEEP
    │   ├── page.tsx              ✅ KEEP (Homepage)
    │   │
    │   ├── 📁 about/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 cart/
    │   │   ├── page.tsx          ✅ KEEP
    │   │   ├── error.tsx         ✅ KEEP
    │   │   └── loading.tsx       ✅ KEEP
    │   │
    │   ├── 📁 categories/
    │   │   ├── page.tsx          ✅ KEEP
    │   │   ├── error.tsx         ✅ KEEP
    │   │   ├── loading.tsx       ✅ KEEP
    │   │   └── 📁 [slug]/
    │   │
    │   ├── 📁 checkout/
    │   │   ├── page.tsx          ✅ KEEP
    │   │   ├── error.tsx         ✅ KEEP
    │   │   ├── loading.tsx       ✅ KEEP
    │   │   └── 📁 success/
    │   │
    │   ├── 📁 contact/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 customer-service/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 demo/
    │   │   └── page.tsx          ❓ REVIEW - Demo page needed?
    │   │
    │   ├── 📁 gift-cards/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 privacy/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 product/
    │   │   ├── 📁 [...slug]/
    │   │   └── 📁 [id]/
    │   │
    │   ├── 📁 registry/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 returns/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 search/
    │   │   ├── page.tsx          ✅ KEEP
    │   │   ├── error.tsx         ✅ KEEP
    │   │   └── loading.tsx       ✅ KEEP
    │   │
    │   ├── 📁 sell/
    │   │   └── 📁 demo1/         ❓ REVIEW - Demo folder needed?
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       ├── 📁 _actions/
    │   │       └── 📁 _components/
    │   │
    │   ├── 📁 seller/
    │   │   └── 📁 dashboard/
    │   │
    │   ├── 📁 sellers/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 terms/
    │   │   └── page.tsx          ✅ KEEP
    │   │
    │   ├── 📁 todays-deals/
    │   │   ├── page.tsx          ✅ KEEP
    │   │   ├── error.tsx         ✅ KEEP
    │   │   └── loading.tsx       ✅ KEEP
    │   │
    │   └── 📁 wishlist/
    │       ├── error.tsx         ✅ KEEP
    │       ├── loading.tsx       ✅ KEEP
    │       └── 📁 shared/
    │
    └── 📁 (sell)/
        ├── layout.tsx            ✅ KEEP
        │
        └── 📁 sell/
            ├── page.tsx          ✅ KEEP
            ├── client.tsx        ✅ KEEP
            └── loading.tsx       ✅ KEEP
```

---

## ❌ FILES TO DELETE

| File | Reason |
|------|--------|
| `app/globals.css.backup` | Backup file not needed |
| `app/[locale]/(main)/sell/demo1/` | Demo folder - review if needed |
| `app/[locale]/(main)/demo/page.tsx` | Demo page - review if needed |

---

## 🔍 CLEANUP TASKS BY SECTION

### 1. Root Files
- [x] ~~Review `globals.css` for unused styles~~ (Keep as is)
- [ ] **DELETE `globals.css.backup`**

### 2. Actions Folder (`app/actions/`)
- [ ] Review `checkout.ts` for console.logs
- [ ] Review `revalidate.ts` for console.logs

### 3. API Routes (`app/api/`)

#### Files to Audit:
| Route | Tasks |
|-------|-------|
| `api/auth/sign-out/route.ts` | Remove console.logs |
| `api/boost/checkout/route.ts` | Remove console.logs |
| `api/categories/route.ts` | Remove console.logs |
| `api/checkout/webhook/route.ts` | Remove console.logs |
| `api/geo/route.ts` | Remove console.logs |
| `api/payments/*/route.ts` | Remove console.logs |
| `api/products/route.ts` | Remove console.logs |
| `api/revalidate/route.ts` | Remove console.logs |
| `api/stores/route.ts` | Remove console.logs |
| `api/subscriptions/*/route.ts` | Remove console.logs |
| `api/upload-image/route.ts` | Remove console.logs |

### 4. Auth Callbacks (`app/auth/`)
- [ ] Review `callback/route.ts` for console.logs
- [ ] Review `confirm/route.ts` for console.logs

### 5. Locale Pages (`app/[locale]/`)

#### (account) Route Group
| File | Tasks |
|------|-------|
| All page.tsx files | Remove console.logs |
| All content.tsx files | Remove console.logs |
| All client.tsx files | Remove console.logs |

#### (auth) Route Group
| File | Tasks |
|------|-------|
| `login/page.tsx` | Remove console.logs |
| `sign-up/page.tsx` | Remove console.logs |
| `error/page.tsx` | Remove console.logs |

#### (main) Route Group
| File | Tasks |
|------|-------|
| `page.tsx` (Homepage) | Remove console.logs |
| All route pages | Remove console.logs |
| **REVIEW: `demo/page.tsx`** | Delete if not needed |
| **REVIEW: `sell/demo1/`** | Delete if not needed |

#### (sell) Route Group
| File | Tasks |
|------|-------|
| `page.tsx` | Remove console.logs |
| `client.tsx` | Remove console.logs |

---

## 🎯 EXECUTION CHECKLIST

### Step 1: Delete Files
```bash
# Delete backup file
del "j:\amazong\app\globals.css.backup"

# Review and potentially delete demo folders
# - j:\amazong\app\[locale]\(main)\demo\
# - j:\amazong\app\[locale]\(main)\sell\demo1\
```

### Step 2: Console Log Removal
```bash
# Search for all console statements in app folder
grep -r "console\." app/ --include="*.ts" --include="*.tsx"
```

### Step 3: Unused Import Cleanup
- Run ESLint with `--fix`
- Or use VS Code's "Organize Imports" on each file

### Step 4: Code Quality
- [ ] Remove commented-out code
- [ ] Remove TODO comments (or document them)
- [ ] Fix any `any` types
- [ ] Ensure error handling is proper

---

## 📊 PROGRESS TRACKER

| Section | Files | Console Logs | Imports | Status |
|---------|-------|--------------|---------|--------|
| Root Files | ⬜ | ⬜ | ⬜ | ⬜ |
| actions/ | ⬜ | ⬜ | ⬜ | ⬜ |
| api/ | ⬜ | ⬜ | ⬜ | ⬜ |
| auth/ | ⬜ | ⬜ | ⬜ | ⬜ |
| [locale]/(account)/ | ⬜ | ⬜ | ⬜ | ⬜ |
| [locale]/(auth)/ | ⬜ | ⬜ | ⬜ | ⬜ |
| [locale]/(main)/ | ⬜ | ⬜ | ⬜ | ⬜ |
| [locale]/(sell)/ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 🚀 WHEN COMPLETE

After all tasks are done:
1. Run `pnpm build` to verify no errors
2. Run `pnpm lint` to verify code quality
3. Test all routes manually
4. Update PRODUCTION_CLEANUP.md status

---

**Ready to clean app folder? Execute Phase by Phase!**
