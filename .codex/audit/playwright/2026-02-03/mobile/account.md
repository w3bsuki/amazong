# Mobile Account & Store Audit — treido.eu (Production)

> Account-related navigation + store profiles on mobile viewport (390x844).

| Status | ❌ Blocked (critical issues) |
|--------|------------------------------|
| Viewport | Mobile iOS (390x844) |
| Locale | `/bg` |

---

## What Was Tested

- Bottom navigation tabs: Home / Categories / Sell / Chat / Profile
- Store profile: `/bg/tech_haven`
- Chat auth wall: `/bg/chat` → login link

---

## Key Failures

### 1) Profile tab navigation breaks (ship-stopper)

- **Repro:** from `/bg/search?q=iphone` tap bottom-nav `Профил`
- **Actual:** navigates to `/bg/auth/login?next=%2Fbg%2Faccount` but renders an **English 404** (client-side). Direct navigation to the same URL works.
- **Issue:** **ISSUE-004**

### 2) Store profiles show missing translations + runtime errors

- **Repro:** open `/bg/tech_haven`
- **Actual:** labels show raw keys (`ProfilePage.listings`, `Seller.message`, etc.) + console `MISSING_MESSAGE` + React error #419
- **Issue:** **ISSUE-002**

---

## Issues Found (Mobile)

| ID | Severity | Description |
|----|----------|-------------|
| ISSUE-002 | 🔴 | Store profile missing i18n keys + React error |
| ISSUE-004 | 🔴 | Profile tab can land on 404 |

---

*Last updated: 2026-02-03*

