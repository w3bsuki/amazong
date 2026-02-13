# REFERENCE.md — Deep Context Pointers

> Pointer-only map to deeper docs and runtime truth paths.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever references move |

## Domain Links

- Auth: `docs/domain/AUTH.md`
- Payments: `docs/domain/PAYMENTS.md`
- Database: `docs/domain/DATABASE.md`
- API: `docs/domain/API.md`
- Routes: `docs/domain/ROUTES.md`
- i18n: `docs/domain/I18N.md`
- UI design: `docs/ui/DESIGN.md`
- Frontend implementation: `docs/ui/FRONTEND.md`

## Cross-Cutting References

- Golden principles: `docs/PRINCIPLES.md`
- Domain quality grades: `docs/QUALITY.md`
- Decision log: `docs/DECISIONS.md`
- Generated DB schema: `docs/generated/db-schema.md`

## Code Truth Paths

- App routes and layouts: `app/[locale]/**`
- Server actions: `app/actions/**`
- API handlers: `app/api/**`
- Shared components: `components/**`
- Core utilities/clients: `lib/**`
- DB and migrations: `supabase/**`

## When To Ignore Docs And Read Code

- Behavior conflicts with prose docs
- High-risk domain changes
- Missing or stale implementation details

Code and migrations are runtime truth.

*Last updated: 2026-02-13*
