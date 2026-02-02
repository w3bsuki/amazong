# Mobile Account Audit — Treido V1

> Account/settings tested on mobile viewports

| Status | 🔄 Partial |
|--------|----------------|
| Viewport | Mobile |

---

## Test Matrix

| Test | iPhone 14 | Android | Status |
|------|-----------|---------|--------|
| Profile view | ✅ | ⬜ | Tested (account overview) |
| Profile edit | ⬜ | ⬜ | Not Started |
| Address book | ⬜ | ⬜ | Not Started |
| Notifications | ⬜ | ⬜ | Not Started |
| Security | ⬜ | ⬜ | Not Started |

---

## Test Results

### 1. Profile View

| Field | Result |
|-------|--------|
| Status | ✅ Pass |
| Expected | Account overview renders and is navigable on mobile |
| Actual | `/account` renders an overview (greeting, revenue tile, quick links, plan card). Navigation to `/account/orders` loads successfully (tested without capturing order details for PII safety). |

---

### 2. Profile Edit

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Edit form usable on mobile, save works |
| Actual | — |

---

### 3. Address Book

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Address cards fit screen, actions accessible |
| Actual | — |

---

### 4. Notifications

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Note | Feature in progress |
| Actual | — |

---

### 5. Security Settings

| Field | Result |
|-------|--------|
| Status | ⬜ Not Tested |
| Expected | Password fields work on mobile keyboard |
| Actual | — |

---

## Issues Found

| ID | Route | Severity | Description |
|----|-------|----------|-------------|
| ISSUE-008 | `/chat/[conversationId]` | Medium | Order summary in chat shows `$` instead of `€` |

---

*Last updated: 2026-02-02*
