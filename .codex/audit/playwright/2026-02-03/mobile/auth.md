# Mobile Auth Audit — treido.eu (Production)

> Authentication surfaces on mobile viewport (390x844).

| Status | 🔄 Partial |
|--------|-----------|
| Viewport | Mobile iOS (390x844) |
| Locale | `/bg` |

---

## What Was Tested

- Login page loads: `/bg/auth/login`
- Auth walls from Chat/Sell routes include `next=` parameter

---

## Notes

- Chat auth wall uses `next=%2Fchat` (locale-less). This may be OK if your redirect logic correctly re-applies locale.
- Profile auth navigation is **broken via client navigation** (ISSUE-004).

---

## Issues Found (Mobile)

| ID | Severity | Description |
|----|----------|-------------|
| ISSUE-004 | 🔴 | Profile tab client navigation can land on 404 |

---

*Last updated: 2026-02-03*

