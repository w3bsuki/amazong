# Desktop Auth Audit — treido.eu (Production)

> Authentication surfaces on desktop viewport (1440x900).

| Status | 🔄 Partial |
|--------|-----------|
| Viewport | Desktop (1440x900) |
| Locale | `/bg` |

---

## What Was Tested

- Chat auth wall and login screen: `/bg/chat` → `/bg/auth/login?next=%2Fchat`
- Login screen renders correctly (no sign-in executed)

---

## Minor Polish

- Many non-auth pages show repeated `MISSING_MESSAGE: Navigation.back (bg)` in console (see ISSUE-002).

---

*Last updated: 2026-02-03*

