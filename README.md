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

## Documentation

All project documentation is located in `/docs`:
- `/docs/archive/` - Historical planning documents and audits
- `/docs/guides/` - Development guides
- `/docs/planning/` - Active planning documents

## Environment Variables
#### AI Search (optional)

- Recommended: set `AI_GATEWAY_API_KEY` (Vercel AI Gateway) for the most reliable chat/tool calling and simple model routing.
- Optional: set `AI_CHAT_MODEL` / `AI_VISION_MODEL` to override the default Gateway models.
- Fallback: if you don’t use Gateway, set `OPENAI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` or `GROQ_API_KEY`.
- The AI search API route is `POST /api/ai/search` and uses your existing Supabase product catalog as the search source.

Copy `.env.local.example` to `.env.local` and fill in your values (never commit real keys).
