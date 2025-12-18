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
- Set `GOOGLE_GENERATIVE_AI_API_KEY` to use Gemini for the “Switch to AI” search experience.
- If `GOOGLE_GENERATIVE_AI_API_KEY` is not set, the route falls back to `OPENAI_API_KEY` (OpenAI).
- The API route is `POST /api/ai/search` and uses your existing Supabase product catalog as the search source.

Copy `.env.local.example` to `.env.local` and fill in your values (never commit real keys).
