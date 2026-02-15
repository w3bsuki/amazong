# DECISIONS.md — Decision Log

Append-only. Agents read this to understand *why* patterns exist.

## Format

```
### DEC-NNN: <title>
- **Date:** YYYY-MM-DD
- **Context:** <what problem or question prompted this>
- **Decision:** <what was decided>
- **Rationale:** <why this option was chosen>
- **Alternatives considered:** <what else was evaluated>
- **Consequences:** <tradeoffs, follow-up work, or risks accepted>
```

---

## Decisions

### DEC-001: Pointer-first AGENTS.md instead of monolithic instruction file
- **Date:** 2026-02-13
- **Context:** The original AGENTS.md was growing into a monolithic instruction manual. Agents were missing key constraints because the file crowded out task context.
- **Decision:** Restructure AGENTS.md as a ~80-line table of contents with progressive disclosure. Deeper knowledge lives in domain docs loaded on demand.
- **Rationale:** Follows OpenAI Harness Engineering principle: "give the agent a map, not a 1,000-page manual." Context is scarce — a lean entry point preserves it for the actual task.
- **Alternatives considered:** (a) Keep one large file. (b) Multiple AGENTS.md files per directory. (c) External knowledge base.
- **Consequences:** Requires mechanical enforcement that pointer targets exist and contain substance. Agents must follow the progressive disclosure chain.

### DEC-002: Semantic tokens enforced by mechanical gates, not documentation alone
- **Date:** 2026-02-13
- **Context:** Agents and humans repeatedly introduced palette utilities (`bg-gray-100`, `text-white`) and arbitrary values despite documentation prohibiting them.
- **Decision:** Build scanner scripts (`scan-tailwind-palette.mjs`, `scan-tailwind-arbitrary.mjs`, `scan-tailwind-token-alpha.mjs`) and wire them into `pnpm -s styles:gate` as a required CI check.
- **Rationale:** Principle #12 — mechanical enforcement over prose promises. A rule that can't be checked will be violated.
- **Alternatives considered:** (a) ESLint plugin for Tailwind. (b) Documentation-only covenant. (c) PostCSS plugin.
- **Consequences:** Every code change must pass `styles:gate`. False positives in edge cases (color swatches, CSS custom property definitions) are handled via explicit allowlists.

### DEC-003: Supabase client selection as a non-negotiable contract
- **Date:** 2026-02-13
- **Context:** Early bugs were caused by using `createClient()` (cookie-reading) inside cached functions, or `createStaticClient()` for user-specific data.
- **Decision:** Define four clients with strict selection rules. Document in `docs/DOMAINS.md` and `ARCHITECTURE.md`. Treat violations as bugs.
- **Rationale:** Wrong client selection causes hard-to-diagnose failures: cache pollution, broken auth, or accidental RLS bypass.
- **Alternatives considered:** (a) Single client with mode parameter. (b) Wrapper that detects context automatically.
- **Consequences:** Agents must know which client to use before writing any Supabase query. The selection table is the first thing in the DATABASE domain doc.

### DEC-004: Server Actions for UI mutations, Route Handlers for integrations
- **Date:** 2026-02-13
- **Context:** Inconsistent patterns — some mutations used fetch-to-API-route, others used server actions, some mixed both.
- **Decision:** Standardize on server actions (`app/actions/**`) for same-origin UI mutations with typed `Envelope` returns. Route handlers (`app/api/**`) for webhook endpoints, integration callbacks, and cacheable public GETs.
- **Rationale:** Server actions give typed, prop-driven mutation handling. Route handlers give stable URL surfaces for external callers.
- **Alternatives considered:** (a) All route handlers. (b) tRPC. (c) GraphQL.
- **Consequences:** Two patterns to maintain, but clear ownership. `Envelope` type is the single return contract for actions.

### DEC-005: Route-private `_components/` convention to prevent cross-group coupling
- **Date:** 2026-02-13
- **Context:** Components in route group A were importing from route group B's `_components/`, creating hidden coupling that broke when layouts changed.
- **Decision:** Enforce that `_components/`, `_actions/`, `_lib/`, `_providers/` prefixed with underscore are private to their route group. Shared code must live in `components/shared/`, `hooks/`, or `lib/`.
- **Rationale:** Route groups are layout boundaries. Code that crosses them creates fragile dependencies.
- **Alternatives considered:** (a) Single flat components directory. (b) Package-per-feature.
- **Consequences:** Sometimes requires extracting code to `components/shared/` that started life as route-private (see STRUCT-006, STRUCT-007 in TASKS.md).

### DEC-006: `getUser()` over `getSession()` for security checks
- **Date:** 2026-02-13
- **Context:** `getSession()` reads JWTs from cookies without server-side verification. A tampered cookie could pass `getSession()` checks even if the session is invalid.
- **Decision:** Ban `getSession()` for any security-critical decision. Use `supabase.auth.getUser()` which makes a server call to verify the token.
- **Rationale:** Defense in depth — server-verified auth is the only safe option for authorization decisions.
- **Alternatives considered:** (a) Accept `getSession()` risk and add CSRF tokens. (b) Custom JWT verification.
- **Consequences:** Slightly higher latency for auth checks (server roundtrip), but eliminates token spoofing risk. `requireAuth()` in `lib/auth/require-auth.ts` enforces this.

### DEC-007: Business context moves to Google Drive, lean pointers stay in-repo
- **Date:** 2026-02-13
- **Context:** `context/business/**` contains roadmap, investor, and operational strategy docs that are not implementation-relevant but inflate the repo.
- **Decision:** Migrate full docs to Google Drive. Keep `context/business/AGENTS.md` as a pointer explaining the archive-only status. Retain `index.mdx` and key summaries as entry points.
- **Rationale:** Agents don't need business strategy for implementation. Keeping full docs in-repo wastes context and creates stale-docs risk.
- **Alternatives considered:** (a) Delete entirely. (b) Keep everything in-repo. (c) Move to Notion.
- **Consequences:** Business context becomes invisible to agents unless explicitly loaded. Acceptable because `context/business/**` is explicitly marked as "must not override runtime behavior" in AGENTS.md.

### DEC-008: Webhook secret rotation via comma/newline-separated env vars
- **Date:** 2026-02-13
- **Context:** During Stripe webhook secret rotation, there's a window where both old and new secrets are valid. Deploying a single `STRIPE_WEBHOOK_SECRET` means dropping events during rotation.
- **Decision:** `lib/env.ts` parses `STRIPE_WEBHOOK_SECRET` by splitting on commas and newlines. Signature verification tries each secret and succeeds if any match.
- **Rationale:** Zero-downtime secret rotation without code changes or deployment coordination.
- **Alternatives considered:** (a) Separate env vars (`STRIPE_WEBHOOK_SECRET_OLD`, `_NEW`). (b) Accept brief downtime during rotation.
- **Consequences:** Must clean up old secrets after rotation window closes. Multiple secrets in the env var is a known pattern.

### DEC-009: Vitest shims for `server-only` / `client-only`
- **Date:** 2026-02-13
- **Context:** Next.js relies on `server-only`/`client-only` runtime constraints which can break unit tests in Vitest (Node environment) when those modules are imported.
- **Decision:** Shim `server-only` and `client-only` in Vitest via aliases to minimal no-op modules under `test/shims/`.
- **Rationale:** Keep unit tests focused on business logic without requiring Next runtime wiring.
- **Alternatives considered:** (a) Stub per-test. (b) Avoid importing server-only modules in tests. (c) Custom transform pipeline.
- **Consequences:** Tests won’t catch accidental server/client boundary mistakes on their own; structural tests and Next build remain the safety net.

### DEC-010: Structural tests for security and architecture invariants
- **Date:** 2026-02-13
- **Context:** Regressions around boundary rules (cross-route `_components/` imports, `getSession()` usage, `select('*')`, webhook write-before-verify) are easy to introduce and hard to spot in review.
- **Decision:** Expand `__tests__/architecture-boundaries.test.ts` to mechanically enforce key invariants (route-private import boundaries, `getSession()` ban, `select('*')` ban, webhook signature verification ordering).
- **Rationale:** Principle #12 (mechanical enforcement over prose promises).
- **Alternatives considered:** (a) ESLint-only. (b) Documentation-only. (c) Code review checklist.
- **Consequences:** Structural tests may need occasional allowlists/tuning, but prevent silent erosion of system boundaries.

### DEC-011: Generated schema summary from migrations for audits
- **Date:** 2026-02-13
- **Context:** RLS audits based on manual migration reading are slow and error-prone; earlier schema summaries missed quoted policy names and mis-parsed `ALTER TABLE IF EXISTS`.
- **Decision:** Generate `docs/generated/db-schema.md` from `supabase/migrations/**` via `node scripts/generate-db-schema.mjs`, and fix the generator to correctly capture quoted policy names and ignore non-public schema references.
- **Rationale:** Provide a searchable, reproducible schema snapshot derived from the source-of-truth migrations.
- **Alternatives considered:** (a) Introspect a live DB. (b) Use external schema tooling. (c) Keep manual spreadsheets.
- **Consequences:** Generator is best-effort (regex-based); when in doubt, migrations remain the final authority.

### DEC-012: Notifications INSERT is service-role-only
- **Date:** 2026-02-13
- **Context:** `authenticated` has broad table privileges in production migrations, and an INSERT policy on `notifications` used `WITH CHECK (true)` without scoping to `service_role`, allowing authenticated users to insert arbitrary notifications.
- **Decision:** Draft an RLS hardening migration that scopes the INSERT policy to `TO service_role`, and update server-side notification inserts to use the service role client.
- **Rationale:** Prevent abuse/spoofing of in-app notifications and reduce PII integrity risk.
- **Alternatives considered:** (a) Revoke broad table grants. (b) Use RPC functions for notification inserts. (c) Accept risk and rely on application code only.
- **Consequences:** Applying the migration is high-risk and requires human approval and rollback planning (per `AGENTS.md § High-Risk Pause`).

---

## How To Add A Decision

1. Use the next `DEC-NNN` number.
2. Follow the format template above.
3. Keep entries concise (5-8 lines).
4. Link to related docs or TASKS.md entries if applicable.
5. Bump `Last verified` date.

*Last updated: 2026-02-13*
