# RELIABILITY.md — System Reliability

> Reliability patterns, targets, and operational guardrails for Treido.

| Scope | Uptime, error budgets, resilience patterns |
|-------|-------------------------------------------|
| Audience | AI agents, developers |
| Last updated | 2026-02-12 |

---

## Reliability Targets

| Metric | Target | Current |
|--------|--------|---------|
| App availability | 99.5% (Vercel SLA) | ~99.5% |
| Page load (LCP) | < 2.5s | Needs measurement |
| API response (p95) | < 500ms | Needs measurement |
| Error rate (5xx) | < 0.1% | Needs measurement |
| Build success rate | > 95% | ~90% (flaky E2E) |

---

## Resilience Patterns

### 1. Database

- **Connection pooling:** Supabase manages via Supavisor
- **RLS everywhere:** All user-facing tables have Row Level Security
- **Migration safety:** Sequential numbered migrations, no destructive DDL without pause-rule approval
- **Backup:** Supabase automatic daily backups

### 2. Auth

- **Session refresh:** Middleware calls `getUser()` to refresh JWT on every request
- **Graceful degradation:** Auth failures redirect to login, never show raw errors
- **PKCE flow:** No implicit grants, no tokens in URLs

### 3. Payments

- **Idempotency:** Stripe webhook handlers use idempotency keys
- **Escrow pattern:** Funds held until delivery confirmation
- **Webhook verification:** All Stripe webhooks verified with endpoint secret
- **Error recovery:** Failed charges create failed-payment order state, user can retry

### 4. Frontend

- **Error boundaries:** `global-error.tsx` catches unhandled errors
- **Not-found handling:** `global-not-found.tsx` for missing routes
- **Loading states:** Skeleton components for async content
- **Offline tolerance:** Cart persisted in cookies, not just server state

---

## Failure Modes & Mitigations

| Failure | Impact | Mitigation |
|---------|--------|------------|
| Supabase outage | Full app downtime | Monitor status page, error boundaries show friendly message |
| Stripe outage | Checkout unavailable | Detect in `checkout.ts`, show maintenance message |
| Image CDN slow | Degraded browsing | `next/image` with blur placeholder, lazy loading |
| Auth token expired | 401 on server actions | Middleware refresh, client redirect to login |
| E2E flake | False CI failure | One retry with trace, then classify as real (per HARNESS.md) |

---

## Monitoring (Current State)

| What | Tool | Status |
|------|------|--------|
| Uptime | Vercel Analytics | Active |
| Errors | Browser console + global-error | Basic |
| Structured logging | — | **Gap** (TD-006) |
| APM / Traces | — | **Gap** (TD-007) |
| Alerts | — | **Gap** (TD-008) |

---

## Operational Runbooks

- [PROD-DATA-002: Junk Listings](runbooks/PROD-DATA-002-junk-listings.md) — handling spam/junk product listings

---

*Last updated: 2026-02-12*
