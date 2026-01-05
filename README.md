# Amazong Marketplace

A modern e-commerce marketplace built with Next.js 16, Supabase, and Stripe.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS + shadcn/ui
- **i18n**: next-intl

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests (Playwright)
pnpm test:e2e

# Open the latest Playwright HTML report
pnpm exec playwright show-report playwright-report

# Clean generated artifacts (reports, test output, Next build output)
pnpm clean
```

## Project Structure

See [agents.md](./agents.md) for code placement boundaries and day-to-day rules.
For production readiness and refactoring plans, start with [docs/README.md](./docs/README.md).

## Where does this file go?

Use these rules before adding new files (see [agents.md](./agents.md) for full details):

- `app/[locale]/(group)/.../_components/*`: UI used only by a single route group (account/admin/auth/business/chat/checkout/main/plans/sell).
- `app/[locale]/(group)/.../_actions/*`: server actions used only by that route group.
- `components/ui/*`: shadcn-style primitives only (buttons, inputs, dialogs). No feature composites, no route coupling.
- `components/common/*`: shared composites (cards, tables, shared UI blocks used across multiple routes).
- `components/layout/*`: shared layout shells (headers, sidebars, navigation).
- `components/providers/*`: React providers/contexts.
- `hooks/*`: reusable hooks (do not put hooks under `components/ui`).
- `lib/*`: pure utilities/clients/domain helpers (avoid React components/providers here).

## Documentation

Docs are organized under `docs/`:

- `docs/production/` — go-live, operations, env vars, production readiness
- `docs/dev/` — testing and architecture notes
- `docs/archive/` — older masterplans and superseded docs

## Caching (Next.js 16)

- Cache Components are enabled (`cacheComponents: true`) and cache profiles live in `next.config.ts` under `cacheLife` (`categories`, `products`, `deals`, `user`).
- Cached server data fetchers should use `'use cache'` + `cacheLife()` + `cacheTag()` for targeted invalidation.
- Reference guides: `docs/production/01-nextjs.md` and `docs/production/07-performance.md`.

## Environment Variables
#### AI Search (optional)

- Recommended: set `AI_GATEWAY_API_KEY` (Vercel AI Gateway) for the most reliable chat/tool calling and simple model routing.
- Optional: set `AI_CHAT_MODEL` / `AI_VISION_MODEL` to override the default Gateway models.
- Fallback: if you don’t use Gateway, set `OPENAI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` or `GROQ_API_KEY`.
- The AI search API route is `POST /api/ai/search` and uses your existing Supabase product catalog as the search source.

Copy `.env.local.example` to `.env.local` and fill in your values (never commit real keys).
