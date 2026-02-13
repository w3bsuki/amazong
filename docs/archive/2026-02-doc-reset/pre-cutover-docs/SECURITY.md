# SECURITY.md — Security Posture

> Security practices, threat model, and guardrails for Treido.

| Scope | Authentication security, data protection, secrets management |
|-------|--------------------------------------------------------------|
| Audience | AI agents, developers |
| Last updated | 2026-02-12 |

---

## Security Principles

1. **Parse at the boundary** — validate all external input with Zod schemas before processing
2. **Least privilege** — RLS policies restrict data access to the minimum needed
3. **No secrets in code** — all credentials in environment variables, never committed
4. **Defense in depth** — auth checks at middleware, server action, AND database layer

---

## Authentication Security

| Control | Implementation |
|---------|----------------|
| Password hashing | Supabase Auth (bcrypt, server-side) |
| Session tokens | HTTP-only cookies via `@supabase/ssr` |
| CSRF protection | SameSite cookies + PKCE flow |
| JWT verification | `getUser()` verifies JWT signature (not just `getSession()`) |
| OAuth | Infrastructure ready, PKCE-only (no implicit flow) |
| Rate limiting | Supabase Auth built-in rate limits |

---

## Data Protection

| Data Type | Protection |
|-----------|------------|
| User passwords | Never stored in app — Supabase Auth handles |
| Payment data | Never touches our servers — Stripe handles tokenization |
| PII (email, name, address) | RLS: owner-only read/write |
| Product images | Supabase Storage with auth policies |
| Session cookies | HTTP-only, Secure, SameSite=Lax |

---

## Secrets Management

| Secret | Location | Notes |
|--------|----------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` / Vercel env | Admin-only operations |
| `STRIPE_SECRET_KEY` | `.env.local` / Vercel env | Never exposed to client |
| `STRIPE_WEBHOOK_SECRET` | `.env.local` / Vercel env | Webhook signature verification |
| `NEXT_PUBLIC_*` keys | `.env.local` / Vercel env | Safe for client exposure |

**Rules:**
- Never log secrets or PII
- Never paste real secrets into docs, PRs, or chat
- Describe *where* a secret is configured, not its value
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side admin functions (`createAdminClient`)

---

## Threat Model

| Threat | Likelihood | Impact | Mitigation |
|--------|------------|--------|------------|
| SQL injection | Low | High | Supabase parameterized queries, no raw SQL in app |
| XSS | Low | Medium | React auto-escaping, no `dangerouslySetInnerHTML` |
| CSRF | Low | Medium | SameSite cookies, server actions are POST-only |
| Auth bypass | Low | Critical | Triple-layer auth (middleware + action + RLS) |
| Stripe webhook spoofing | Low | High | Signature verification with endpoint secret |
| Mass scraping | Medium | Low | Rate limiting, no public API for bulk data |
| Junk/spam listings | Medium | Medium | Moderation queue, trust scores (see trust-safety.md) |

---

## Security Checklist (for agents)

Before merging changes that touch auth, data access, or payments:

- [ ] Input validated with Zod at the boundary
- [ ] Server action uses `requireAuth()` or `requireAdmin()`
- [ ] RLS policy covers the new/modified table
- [ ] No secrets or PII in client-visible code
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Webhook handlers verify signatures

---

## Known Gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| No CSP headers | Medium | Should add Content-Security-Policy |
| No rate limiting on server actions | Medium | Supabase Auth has limits, but custom actions don't |
| No security audit trail | Low | Admin actions not logged |

---

*Last updated: 2026-02-12*
