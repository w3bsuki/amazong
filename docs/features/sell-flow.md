# Feature: Sell Flow (Listing Creation)

## What it does
Multi-step listing wizard: title, description, category, attributes, photos, pricing → draft → publish.
Edit and unpublish existing listings. Seller order management.

## Key files
- `app/[locale]/(sell)/` — Sell route group
- `app/[locale]/(sell)/_actions/sell.ts` — Sell server actions (create, update, delete)
- `app/[locale]/(sell)/_components/sell-form-unified.tsx` — Main form component
- `app/[locale]/(sell)/_components/sell-form-provider.tsx` — Form context provider (react-hook-form)
- `app/[locale]/(sell)/_components/fields/` — Individual form fields (photos, pricing, attributes, etc.)
- `app/[locale]/(sell)/_components/layouts/` — Mobile and desktop form layouts
- `app/[locale]/(sell)/_components/ai/ai-listing-assistant.tsx` — AI-powered listing helper
- `app/[locale]/(sell)/_components/ui/` — Sell-specific UI (category modal, brand combobox, etc.)
- `lib/sell/schema.ts` — Zod validation schema for listings

## How it works
- Form managed by react-hook-form with Zod resolver (`lib/sell/schema.ts`)
- Multi-step wizard with mobile and desktop layouts
- Photos: multi-image upload with drag-reorder and compression (`lib/image-compression.ts`)
- Category selection opens modal with tree navigation
- Server action validates with Zod, writes to Supabase
- AI assistant can help generate title/description from photos

## Conventions
- Schema is the source of truth: `lib/sell/schema.ts`
- Route-private code stays in `(sell)/_components/` and `(sell)/_actions/`
- Form fields use `Field`, `FieldLabel`, `FieldError` from shared field component
- Auth guard: middleware redirects unauthenticated users

## Dependencies
- react-hook-form + zod
- Supabase Storage for image uploads
- Category tree data for selection
- Stripe Connect for payout eligibility gating

## Last modified
- 2026-02-16: Documented during docs system creation. Schema path standardized to `lib/sell/schema.ts`.
