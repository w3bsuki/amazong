# Backend Issues — Playwright Audit (2026-02-03)

> Server/API issues observed from production UI during Playwright testing.

| Started | 2026-02-03 |
|---------|------------|
| Status | ✅ Complete |
| Target | https://www.treido.eu |

---

## Issue Log

### ISSUE-B01: AI assistant endpoint missing in production (`/api/assistant/chat` → 404)

| Field | Value |
|-------|-------|
| Severity | 🔴 Critical |
| Endpoint | `POST /api/assistant/chat` (also observed as `GET` in console logs) |
| Impact | AI feature is exposed in production but cannot work; UI silently fails |

**Expected**
- Endpoint exists and returns a valid response shape (or feature is disabled in production).

**Actual**
- Endpoint returns `404`, which makes the AI dialog appear broken/fake.

**Tasks**
- [ ] Implement and deploy the endpoint (with auth/rate-limiting) OR remove the UI entry points in production until it’s ready.
- [ ] Standardize error response format so frontend can show a localized error state.

**Acceptance criteria**
- Production no longer returns 404 for this endpoint when AI UI is enabled.

