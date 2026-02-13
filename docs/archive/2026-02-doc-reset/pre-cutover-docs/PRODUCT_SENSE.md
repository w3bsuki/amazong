# PRODUCT_SENSE.md — Product Judgment Guide

> Codified product intuition so agents understand not just *how* to build but *what*
> good product decisions look like. Modeled after OpenAI's product-sense pattern.

| Scope | Product principles, user empathy, decision heuristics |
|-------|------------------------------------------------------|
| Audience | AI agents, developers |
| Last updated | 2026-02-12 |

---

## Who Uses Treido

### Primary Users

| Persona | Context | What they care about |
|---------|---------|---------------------|
| **Casual seller** | Cleaning out closet, selling a few items | Fast listing, no fees, easy communication |
| **Casual buyer** | Browsing for deals, impulse buys | Discovery, trust signals, fair prices |
| **Power seller** | Running a small business on the platform | Bulk tools, analytics, subscription value |
| **Returning user** | Has bought/sold before, coming back | Order status, saved items, familiar navigation |

### Market Context

- **Geography:** Bulgaria (primary), potentially expanding to Balkans
- **Competitors:** OLX.bg (classifieds), Bazar.bg (legacy), Facebook Marketplace
- **Differentiator:** Modern UX, buyer protection, structured categories (not just classifieds)
- **Price sensitivity:** High. Users compare EUR prices carefully. Free shipping is a major driver.

---

## Product Principles

### 1. Speed to Value

The fastest path from "I want to sell/buy something" to accomplishing that goal wins.

- **Selling:** < 3 minutes from "I want to sell" to live listing
- **Buying:** < 2 taps from homepage to product detail
- **Checkout:** Minimal steps, pre-filled where possible

### 2. Trust Through Transparency

Bulgarian online marketplace trust is low. Every interaction must build confidence.

- Show seller verification status prominently
- Show buyer protection fee breakdown at checkout (not hidden)
- Show order status with clear next steps
- Use real product photos, not stock images

### 3. Mobile Feels Native

If a user has to pinch-zoom or struggles to tap a button, we've failed.

- Bottom navigation for one-handed use
- Swipe-friendly interactions
- Touch-confident tap targets (44px+)
- Instant feedback on all interactions (press states, optimistic updates)

### 4. Calm Over Loud

The app should feel like a curated shop, not a bazaar.

- No visual noise: 70/20/10 color ratio
- Typography hierarchy creates scanning paths
- White space is a feature, not wasted space
- Notifications are informative, never nagging

### 5. Revenue Without Friction

Monetization should feel like added value, not a tax.

- Buyer protection fee is the primary revenue — frame it as safety, not cost
- Boosts are optional and clearly show value (increased visibility stats)
- Subscription tiers unlock tools, not basic functionality
- Never paywall core buying/selling

---

## Decision Heuristics (for agents)

When making product decisions, use these heuristics:

| Situation | Heuristic |
|-----------|-----------|
| "Should I add a confirmation modal?" | Only for destructive/financial actions. Don't interrupt browse flows. |
| "How much copy should this page have?" | Minimal. Labels > paragraphs. Users scan, they don't read. |
| "Should this be a separate page or a modal?" | Mobile: drawer/modal. Desktop: depends on content depth. |
| "What should the empty state say?" | Tell the user what to do, not that nothing exists. CTA first. |
| "Should I show all options or progressive disclose?" | Default to progressive disclosure. Power features for power users. |
| "Error message tone?" | Helpful, not technical. Say what went wrong AND what to do. Never show stack traces. |
| "Should this feature exist?" | Does it serve one of the 4 personas? If not, question it. |
| "Should I optimize for new or returning users?" | New users see onboarding once. Optimize recurring flows for returning users. |

---

## Anti-Patterns (Product Slop)

- **Feature dumping:** Adding features because they're easy, not because users need them
- **Settings sprawl:** Every preference as a toggle; should be smart defaults
- **Copy-paste marketplace:** Generic marketplace language instead of Treido voice
- **Notification spam:** Alerting on everything instead of what matters
- **Dashboard disease:** Charts and stats that don't drive action

---

*Last updated: 2026-02-12*
