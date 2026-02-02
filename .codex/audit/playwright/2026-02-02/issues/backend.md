# Backend Issues — Playwright Audit

> API/data issues discovered during Playwright testing

| Started | 2026-02-02 |
|---------|------------|
| Status | 🔄 Collecting |

---

## Issue Count by Severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 High | 0 |
| 🟡 Medium | 0 |
| 🟢 Low | 0 |

---

## Issue Log

### ISSUE-001: Onboarding Completion API Returns 500

| Field | Value |
|-------|-------|
| Endpoint | `POST /<locale>/api/onboarding/complete` |
| Severity | 🔴 Critical |
| Type | API/Auth/Data |
| Evidence | Request returns `500`; onboarding completion UI shows generic failure and offers “Try Again” |
| Expected | `200 { success: true }` and onboarding marked complete |
| Actual | `500` (onboarding never completes) |
| Impact | Onboarding deadlock. Any route gated by `onboarding_completed` becomes inaccessible (observed: `/cart` redirects to onboarding) |
| Related | Frontend ISSUE-005 |

**Notes:** This is currently the top production blocker because it prevents completing onboarding and therefore blocks cart/checkout.

### Template

```markdown
### ISSUE-XXX: [Short description]

| Field | Value |
|-------|-------|
| Endpoint | /api/path or action |
| Severity | Critical/High/Medium/Low |
| Type | API/Data/Auth/Performance |
| Evidence | Error response/network tab |
| Expected | What should happen |
| Actual | What happened |
| Impact | User-facing impact |
| Related | Linked frontend issues |
```

---

## Issues by Category

### API Response Issues

*None yet*

### Data Integrity Issues

*None yet*

### Auth/Session Issues

- **ISSUE-001**: Onboarding completion fails despite authenticated session

### Performance Issues

*None yet*

---

## Resolution Tracking

| Issue | Status | Fixed In |
|-------|--------|----------|
| ISSUE-001 | 🔴 Open | — |

---

*Last updated: 2026-02-02*
