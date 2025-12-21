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

## Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for the complete refactoring plan.

## Where does this file go?

Use these rules before adding new files (see [STRUCTURE.md](./STRUCTURE.md) for full details):

- `app/[locale]/(group)/.../_components/*`: UI used only by a single route group (account/admin/auth/business/chat/checkout/main/plans/sell).
- `app/[locale]/(group)/.../_actions/*`: server actions used only by that route group.
- `components/ui/*`: shadcn-style primitives only (buttons, inputs, dialogs). No feature composites, no route coupling.
- `components/common/*`: shared composites (cards, tables, shared UI blocks used across multiple routes).
- `components/layout/*`: shared layout shells (headers, sidebars, navigation).
- `components/providers/*`: React providers/contexts.
- `hooks/*`: reusable hooks (do not put hooks under `components/ui`).
- `lib/*`: pure utilities/clients/domain helpers (avoid React components/providers here).

## Documentation

Planning and audit docs live in-repo (this workspace does not use a `/docs` tree):

- [STRUCTURE.md](STRUCTURE.md) — canonical phased refactor plan
- [cleanup/FULL_CODEBASE_AUDIT.md](cleanup/FULL_CODEBASE_AUDIT.md) — dead code / duplicates / cycles
- [cleanup/FILE_INVENTORY.md](cleanup/FILE_INVENTORY.md) — file inventory (used/unused flags)
- [production/02-CLEANUP.md](production/02-CLEANUP.md) — cleanup execution checklist
- [production/03-REFACTOR.md](production/03-REFACTOR.md) — refactor execution notes
- [production/TECH-STACK.md](production/TECH-STACK.md) — tech stack audit

## Environment Variables
#### AI Search (optional)

- Recommended: set `AI_GATEWAY_API_KEY` (Vercel AI Gateway) for the most reliable chat/tool calling and simple model routing.
- Optional: set `AI_CHAT_MODEL` / `AI_VISION_MODEL` to override the default Gateway models.
- Fallback: if you don’t use Gateway, set `OPENAI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` or `GROQ_API_KEY`.
- The AI search API route is `POST /api/ai/search` and uses your existing Supabase product catalog as the search source.

Copy `.env.local.example` to `.env.local` and fill in your values (never commit real keys).
