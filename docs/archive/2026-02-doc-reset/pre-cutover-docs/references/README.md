# References — External Documentation Cache

> Pre-fetched external tool documentation that agents can read without leaving the repo.
> Modeled after OpenAI's `docs/references/` pattern with `llms.txt` files.

---

## Purpose

When agents need to reference external library APIs, framework docs, or service
documentation, having a local cache avoids:

1. Runtime external fetches that may fail or be slow
2. Inconsistent documentation versions across agent runs
3. Context window waste on fetching + parsing live pages

## Contents

| File | Source | Purpose |
|------|--------|---------|
| `supabase-auth-llms.txt` | Supabase Docs | Auth API reference for `@supabase/ssr` |
| `stripe-connect-llms.txt` | Stripe Docs | Connect + marketplace payment flows |
| `next-intl-llms.txt` | next-intl docs | i18n patterns for App Router |

## Maintenance

- Refresh when upgrading a major dependency version
- Include version number in the file header
- Keep files focused (API surface only, not tutorials)
- Format: plain text, not HTML — optimized for LLM consumption

---

*Last updated: 2026-02-12*
