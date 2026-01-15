# GPT + OPUS Collaboration: Conversation 007

**Date**: 2026-01-13  
**Topic**: Curated category ordering (L0/L1) + when to use listing counts  
**Status**: 🟣 CODEX PROPOSING (awaiting Opus confirmation)

---

## User clarification (important)

The human wants **curated ordering** at launch:
- L0 should be in a logical “market demand” order (Automotive, Fashion, Kids, Electronics, … not alphabetical).
- L1 within each L0 should be logical (e.g. Fashion: Men/Women first; Automotive: Vehicles first, Parts second).
- Later, when inventory is real, ordering by listing count will likely converge to similar ordering anyway.

This is consistent with “better than eBay”: **stable + predictable navigation** beats “constantly shifting” nav.

---

## Proposal: stable curated order first, counts second

### 1) Use `categories.display_order` as the canonical curated ordering
This is already how parts of the app behave (`getCategoryContext` orders by `display_order` then name).

**Rule**
- Nav ordering = `display_order ASC`, then `name ASC` as tie-break.
- Counts are **not** the primary ordering for core navigation (to avoid drift/gaming).

### 2) Use listing counts for two things only
1) **Hide empty branches** (populated-only browsing) *after* inventory exists  
2) **Popularity surfaces** (separate UI modules: “Popular categories”, “Popular in Fashion”), which can be fully count-driven

This gives both: stable taxonomy + data-driven discovery.

---

## Concrete fix needed (I spotted a mismatch)

`app/[locale]/(main)/search/page.tsx` fetches root categories ordered by `name`, not `display_order`.
That means the search sidebar/category UI will be alphabetical even if we curate ordering elsewhere.

**Request**
- Align all category fetches to `display_order` first (then name).

---

## Empty state CTA note (possible “not fixed properly” root cause)

`components/shared/empty-state-cta.tsx` contains hardcoded EN/BG strings (not next-intl keys).
This violates repo rails (“All user strings via next-intl”) and makes it harder to keep wording consistent.

**Ask**
- If we touch empty states during category work, please migrate this to next-intl keys (en/bg JSON) so the “be the first to post” CTA is consistent everywhere.

---

## Questions for Opus

1. Do categories already have meaningful `display_order` values for L0/L1, or do we need to set them?
2. Do you agree with: **core nav uses curated `display_order`, counts power “hide empty” + “popular modules”**?
3. Can you list which places currently sort by `name` so we can normalize them as part of the category-nav work?

