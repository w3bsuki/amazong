# Playwright UI/UX Audit — treido.eu (Production)

> Brutally honest mobile-first + desktop audit of core routes on production.

| Started | 2026-02-03 |
|---------|------------|
| Status | ✅ Complete (mobile + desktop) |
| Target | https://www.treido.eu |
| Tool | Playwright MCP |
| Locale | `bg` (primary) |

---

## Viewports Tested

| Viewport | Resolution | Device | Status |
|----------|------------|--------|--------|
| Desktop Medium | 1440x900 | Laptop | ✅ Tested |
| Mobile iOS | 390x844 | iPhone-like | ✅ Tested |

**Not tested (this run):**
- Desktop 1920x1080 / 4K
- Mobile Android viewport
- Logged-in flows (orders, seller dashboard, actual checkout payment)

---

## Routes Covered (High Level)

| Area | Desktop | Mobile | Notes |
|------|---------|--------|------|
| Home | ✅ | ✅ | `/bg` |
| Search | ✅ | ✅ | `/bg/search` + pagination + filters |
| Categories | ✅ | ✅ | `/bg/categories/*` + sort + filters |
| Product detail | ✅ | ✅ | `/bg/:store/:slug` |
| Cart | ✅ | ✅ | `/bg/cart` |
| Checkout | ⚠️ | ⚠️ | `/bg/checkout` blocked by auth at payment step |
| Store profile | ⚠️ | ⚠️ | `/bg/:store` has missing i18n + React error |
| Chat | ✅ | ✅ | `/bg/chat` auth wall (expected) |
| Sell | ✅ (auth wall) | ✅ (auth wall) | `/bg/sell` |
| Help / Legal | ✅ | ✅ | `/bg/customer-service`, `/bg/terms`, `/bg/privacy` |

---

## Issue Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 4 |
| 🟠 High | 3 |
| 🟡 Medium | 4 |
| 🟢 Low | 1 |

**Total:** 12 issues logged

---

## Critical Blockers (Ship-stoppers)

- **ISSUE-001**: Production contains obvious junk/test listings (destroys trust)
- **ISSUE-002**: Store profile pages show raw translation keys + React runtime error (#419) + repeated `MISSING_MESSAGE`
- **ISSUE-003**: AI assistant UI is live but backend endpoint returns 404; UI gets stuck with no user-facing error
- **ISSUE-004**: Mobile bottom-nav **Profile** can navigate to an English 404 (client-side navigation bug)

---

## Next Batch (High Priority)

- **ISSUE-005**: Locale-less internal links (search pagination + similar items + category links)
- **ISSUE-006**: Checkout auth gating is late + uses English `alert`; `/bg/checkout` state inconsistencies
- **ISSUE-007**: Desktop home category navigation doesn’t deep-link; “Виж всички” button appears non-functional

---

## File Map (This Run)

```
.codex/audit/playwright/2026-02-03/
├── 00-INDEX.md
├── desktop/
│   ├── auth.md
│   ├── buying.md
│   ├── selling.md
│   ├── orders.md
│   └── account.md
├── mobile/
│   ├── auth.md
│   ├── buying.md
│   ├── selling.md
│   ├── orders.md
│   └── account.md
└── issues/
    ├── frontend.md
    └── backend.md
```

---

## Quick Links

| Audit | Desktop | Mobile |
|------|---------|--------|
| Auth | [desktop/auth.md](./desktop/auth.md) | [mobile/auth.md](./mobile/auth.md) |
| Buying | [desktop/buying.md](./desktop/buying.md) | [mobile/buying.md](./mobile/buying.md) |
| Selling | [desktop/selling.md](./desktop/selling.md) | [mobile/selling.md](./mobile/selling.md) |
| Orders | [desktop/orders.md](./desktop/orders.md) | [mobile/orders.md](./mobile/orders.md) |
| Account | [desktop/account.md](./desktop/account.md) | [mobile/account.md](./mobile/account.md) |

| Issue Type | File |
|------------|------|
| Frontend Issues | [issues/frontend.md](./issues/frontend.md) |
| Backend Issues | [issues/backend.md](./issues/backend.md) |

---

## Notes (Important)

- Tested as **guest** (no credentials used). Where forms were required, dummy values were used.
- If you want “**iOS native app style**” on mobile: fix the **critical logic/i18n issues first**, then do design polish passes (see `issues/frontend.md` “iOS-style polish backlog”).

---

*Last updated: 2026-02-03*

