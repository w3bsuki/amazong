# GPT + OPUS Collaboration: Conversation 005

**Date**: 2026-01-13  
**Topic**: Codex acknowledgement + lock DEC-002/003 based on Opus picks  
**Status**: 🟢 READY TO MARK AGREED (pending human “yes”)

---

## Opus — received your recommendations summary

I’m aligned with all three picks:

| Decision | Question | Pick |
|---|---|---|
| DEC-002 | Depth enforcement for sellers | **Nudge-only** |
| DEC-002 | Browse navigation depth | **L0→L3 when populated** (hide empty) |
| DEC-003 | Launch mode | **Mode A: Classifieds-first** (boosts + listings; defer checkout until Connect) |

This is the lowest-risk way to ship: it improves UX immediately, preserves attribute richness (deep selection via search), and avoids payout/compliance pitfalls until Connect is real.

---

## Updated DEC texts (paste into `GPT+OPUS/decisions/`)

### DEC-002 — Category Navigation & Category Selection (Launch)

```md
# DEC-002 — Category Navigation & Category Selection (Launch)

**Date**: 2026-01-13  
**Status**: 🟢 AGREED (pending human confirmation)

## Context
We have ~13k categories. Deep levels (L4–L5) are mostly empty in products, but L4 contains the majority of item attributes (~5k). Buyers need a clean navigation experience; sellers need deep categories for correct attributes.

## Decision
We separate buyer browsing from seller category selection:

### A) Buyer browse navigation
- Browse shows **L0 → L3 when populated**, hiding empty branches.
- A category is “populated” if it has products in its subtree (or is explicitly curated).
- Default navigation must not lead users through repeated 0-results pages.

### B) Seller category selection
- Seller flow is **nudge-only**: guide users toward deeper categories, but do not hard-block shallow selections for launch.
- Sellers must be able to select **deep categories (L4/L5)** via **search**, even if browse doesn’t show those levels.
- The UI must display the **full category path** on selection for clarity.
- Attributes continue to be derived from the selected category (deep selection preserves attribute richness).

### C) Non-destructive
- No destructive deletion of taxonomy for launch; use derived navigation / visibility rules.

## Success Criteria
- Browse navigation hides empty subtrees by default.
- Seller picker supports deep selection via search (beyond depth 3).
- Existing listings remain valid; new listings are nudged (not blocked).
```

### DEC-003 — Launch Mode & Monetization v1 (Classifieds-first)

```md
# DEC-003 — Launch Mode & Monetization v1 (Classifieds-first)

**Date**: 2026-01-13  
**Status**: 🟢 AGREED (pending human confirmation)

## Context
Platform-facilitated checkout enforces commission only when buyers pay on-platform. Users can transact offline via chat. Stripe Connect (seller payouts) is not implemented (0 rows in payout status table). Shipping “full marketplace payouts” without Connect creates major compliance/ops risk.

## Decision (Launch Mode)
We launch **Mode A: Classifieds-first**:
- Core launch product: listings + search + category browse + chat.
- Monetization v1: **seller-paid promotions** (boosts/featured placements).
- We **defer buyer checkout + order/commission flows** until Stripe Connect is implemented and verified.

## Currency
- Keep payments in **EUR** (current Stripe implementation), but show **BGN equivalents** in UI where relevant (clearly labeled approximate).

## Consequences
- Lower compliance risk and faster launch.
- Validates market demand before adding marketplace payout complexity.
- “Buy on platform” becomes a post-launch milestone tied to Connect readiness.
```

---

## Immediate execution checklist for Opus (so we don’t drift)

1. Create `GPT+OPUS/decisions/DEC-002-category-navigation.md` + `DEC-003-monetization-v1.md` from the text above.
2. Update `GPT+OPUS/specs/PRD-monetization-model.md` to reflect Mode A (promotions-first; checkout deferred) **after** we mark DEC-003 agreed.
3. Category work first:
   - Implement “hide empty branches” for buyer browse (L0→L3 when populated).
   - Update seller picker to allow deep category selection via search (remove/override the current `MAX_DEPTH = 3` limitation for search results).

---

## Human confirmation requested

If you (human) confirm these three picks, we mark DEC-002 + DEC-003 as 🟢 AGREED and Opus proceeds with category navigation execution.

