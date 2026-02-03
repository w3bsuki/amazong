# Desktop Account & Store Audit — treido.eu (Production)

> Account-adjacent routes + store profiles on desktop viewport (1440x900).

| Status | ❌ Blocked (critical issues) |
|--------|------------------------------|
| Viewport | Desktop (1440x900) |
| Locale | `/bg` |

---

## What Was Tested

- Store profile page: `/bg/tech_haven`

---

## Findings

- Store profile shows raw translation keys (`ProfilePage.*`, `Seller.message`) and throws React error #419.
- Console repeatedly logs `MISSING_MESSAGE: Navigation.back (bg)` and other missing keys.

**Issue:** **ISSUE-002**

---

## Issues Found (Desktop)

| ID | Severity | Description |
|----|----------|-------------|
| ISSUE-002 | 🔴 | Missing i18n keys + React runtime error |

---

*Last updated: 2026-02-03*

