# Codex Review Prompt — Category & Catalog Architecture Redesign

> Paste this into Codex CLI. This is a REVIEW task — no code changes.

---

## Task

Read and critically review the category architecture redesign proposal. Your job is to find flaws, missing considerations, and impractical suggestions before we commit to this plan.

## Context to Load

```
Read AGENTS.md.
Read refactor/supabase/CATEGORY-REDESIGN.md (the document you're reviewing).
Read refactor/supabase/AUDIT.md (live DB audit data).
Read docs/database.md (current schema docs).
Read docs/PRD.md (product requirements — understand what Treido IS).
```

## What to Review

### 1. Category Tree Design
- Are the 14 proposed verticals right for a Bulgarian-first marketplace? Is anything important missing?
- Are the ~8 subcategories per vertical sufficient? Too many? Too few?
- Is the "Other" catch-all pattern per vertical a good idea or a junk drawer?
- Does merging `E-Mobility` into `Automotive` make sense? E-bikes and e-scooters are a growing BG market.
- Does merging `Bulgarian Traditional` into tags/aspects lose Treido's identity?

### 2. Aspects Engine Design
- Is the `category_aspects` schema correct? Any missing columns?
- Is JSONB `allowed_values` the right choice vs. a separate `aspect_values` table?
- How should universal aspects (condition, brand) be implemented? Inheritance from a root? Duplicated per category? Magic IDs?
- Is `is_variation` sufficient for the variants use case, or does the current `product_variants` / `variant_options` table design need to be preserved somehow?
- How do aspects interact with search? Should aspect values feed into `search_vector`?

### 3. Products Table Slim-Down
- Check every column proposed for deletion — is it actually unused/redundant?
- Specifically verify: `images` array vs `product_images` table — which does the codebase actually query?
- Is `shipping` JSONB the right choice vs. keeping normalized columns? (JSONB can't be indexed/filtered as easily)
- Are there any columns proposed for keeping that should also be restructured?

### 4. Migration Strategy
- With only 233 products, is a phased migration overkill? Should we just nuke and rebuild?
- URL redirects from old category slugs — how many unique URLs are we talking about? Are old slugs indexed by search engines?
- Frontend coordination risk — can the category tree change and frontend be done atomically, or does it need a feature flag?

### 5. Deferred Verticals Decision
- Read the PRD carefully. Does Treido's vision include Jobs, Real Estate, Services as core differentiators? If so, deferring them changes the product identity.
- Is `Software` really a separate vertical? Or should digital goods be a listing type flag?
- `Wholesale` — does the business model depend on B2B? Check `docs/business/monetization.md`.

### 6. What's Missing
- **Search implications** — the document doesn't discuss how category flattening affects full-text search, category filters in the search UI, or the `category_stats` materialized view.
- **Admin panel** — current admin likely has category management. What happens to it?
- **SEO** — 13K category pages generating SEO value vs. 135 focused ones. Which is better?
- **i18n** — translating 135 names is easy, but what about aspect names and values? That's potentially 500+ strings.

## Output Format

Write your review as a structured document with:
1. **PASS** items — things that are correct and well-reasoned
2. **CONCERNS** — things that need discussion or have tradeoffs
3. **BLOCKERS** — things that are wrong or dangerous and must be fixed before proceeding
4. **MISSING** — important considerations not covered in the document
5. **RECOMMENDATIONS** — your concrete suggestions for improvements

Save your review to `refactor/supabase/CATEGORY-REDESIGN-REVIEW.md`.

Do NOT make any code changes. This is review-only.
Do NOT modify the original document.
Verify: `pnpm -s typecheck && pnpm -s lint` (just to confirm you didn't break anything while reading).
