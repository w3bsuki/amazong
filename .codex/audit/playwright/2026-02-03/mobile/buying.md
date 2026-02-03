# Mobile Buying Audit — treido.eu (Production)

> Core buyer flows on mobile viewport (390x844).

| Status | 🔄 Partial (blocked by critical issues) |
|--------|----------------------------------------|
| Viewport | Mobile iOS (390x844) |
| Locale | `/bg` |

---

## Test Matrix

| Test | Status | Notes |
|------|--------|------|
| Home (`/bg`) | ✅ | Footer overlaps bottom nav (ISSUE-010) |
| Categories sheet | ✅ | Word-break issues in labels (ISSUE-010) |
| Category page (`/bg/categories/fashion`) | ✅ | Sort label mismatch observed; junk listings (ISSUE-001) |
| Search (`/bg/search`) | ✅ | Pagination hrefs missing locale (ISSUE-005) |
| Search AI mode | ❌ | `/api/assistant/chat` 404 (ISSUE-003 / ISSUE-B01) |
| Product detail | ✅ | Similar items links missing locale (ISSUE-005) |
| Product quick view drawer | ✅ | A11y warnings + `{count}` interpolation bug (ISSUE-008/009) |
| Add to cart | ✅ | Works but lacks clear feedback/toast |
| Cart (`/bg/cart`) | ✅ | Qty updates OK |
| Checkout (`/bg/checkout`) | ❌ | Auth blocked at end via English browser alert (ISSUE-006) |

---

## Key Findings (Brutal)

- Mobile has the right foundation (bottom tabs, drawers, filters), but **production feels unfinished** due to missing i18n keys, broken AI mode, and broken Profile nav.
- Conversion-killers are present: **junk catalog content**, broken AI mode, and checkout auth wall revealed via a browser alert.

---

## Issues Found (Mobile)

| ID | Severity | Description |
|----|----------|-------------|
| ISSUE-001 | 🔴 | Junk/test listings visible in grids |
| ISSUE-003 / ISSUE-B01 | 🔴 | AI mode endpoint 404; no user-facing error |
| ISSUE-004 | 🔴 | Profile bottom-nav can land on an English 404 |
| ISSUE-005 | 🟠 | Locale-less pagination + similar links |
| ISSUE-006 | 🟠 | Checkout uses English `alert` sign-in gating |
| ISSUE-008 | 🟡 | `{count}` / `"0"` interpolation issues |
| ISSUE-009 | 🟡 | Dialog a11y warning (missing DialogTitle) |
| ISSUE-010 | 🟡 | Bottom nav overlaps footer; word-break issues |

---

## iOS-like mobile polish checklist (after blockers)

- [ ] Bottom tabs: consistent height + safe-area inset; no content overlap (ISSUE-010).
- [ ] Sheets/drawers: consistent corner radius + drag handle + snap behavior; one sheet style across app.
- [ ] Touch targets: all primary actions ≥ 44px; reduce tiny icon-only buttons on product cards.
- [ ] Feedback: toast/snackbar for add-to-cart, saved, errors (localized).
- [ ] Typography: fewer sizes; stronger hierarchy; more whitespace to feel “native”.

---

*Last updated: 2026-02-03*

