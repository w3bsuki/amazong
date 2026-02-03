# Desktop Buying Audit — treido.eu (Production)

> Core buyer flows on desktop viewport (1440x900).

| Status | 🔄 Partial (blocked by major issues) |
|--------|--------------------------------------|
| Viewport | Desktop (1440x900) |
| Locale | `/bg` |

---

## Test Matrix

| Test | Status | Notes |
|------|--------|------|
| Home (`/bg`) | ⚠️ | Category navigation lacks deep linking; “Виж всички” appears non-functional (ISSUE-007) |
| Search (`/bg/search`) | ⚠️ | Pagination hrefs missing locale (ISSUE-005) |
| AI assistant (search) | ❌ | `/api/assistant/chat` 404 (ISSUE-003 / ISSUE-B01) |
| Category page (`/bg/categories/fashion`) | ⚠️ | Junk listings visible (ISSUE-001) |
| Product detail (`/bg/tech_haven/running-shoes-pro`) | ⚠️ | Similar items links missing locale (ISSUE-005); view count shows `\"0\"` (ISSUE-008) |
| Cart (`/bg/cart`) | ✅ | Items/qty controls OK |
| Checkout (`/bg/checkout`) | ❌ | Auth blocked via English browser alert; direct `/checkout` can show empty cart (ISSUE-006) |

---

## Notable Desktop UX Problems

- Header shows redundant auth CTAs (“Здравей, Влез…” plus separate “Вход/Регистрация”) → noisy and not premium.
- Home category “tabs” feel like stateful filters, not navigation; users can’t deep-link or share.

---

## Issues Found (Desktop)

| ID | Severity | Description |
|----|----------|-------------|
| ISSUE-001 | 🔴 | Junk/test listings visible |
| ISSUE-003 / ISSUE-B01 | 🔴 | AI mode endpoint 404; UI silently fails |
| ISSUE-005 | 🟠 | Locale-less pagination + similar links |
| ISSUE-006 | 🟠 | Checkout gating uses English `alert`; state mismatch on direct `/checkout` |
| ISSUE-007 | 🟠 | Home category navigation doesn’t deep-link |
| ISSUE-008 | 🟡 | Product view count shows `\"0\"` |
| ISSUE-011 | 🟡 | Broken image resource errors |

---

*Last updated: 2026-02-03*

