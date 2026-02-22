# UI/UX Model (Treido)

Treido is a **trust-first** marketplace. Users must be able to: discover, evaluate, purchase, and (optionally) sell items with minimal friction.

## Navigation model (mobile)

Primary navigation is a 5-tab bottom bar:
1. **Home** — personalized feed grid
2. **Categories** — browse by taxonomy
3. **Sell** — create listing (wizard)
4. **Chat** — conversations
5. **Profile** — account area entry point

Headers are contextual:
- Browse header: brand + search + quick actions.
- Contextual header: back + title (+ optional action).

## Discovery & browse

- Users browse via grid pages with:
  - category pills / rails
  - filters + sort
  - 2-column cards optimized for scanning
- Search supports:
  - suggestion overlay (history + popular)
  - results with filter state visible and reversible

## Product detail (PDP)

PDP answers three questions immediately:
1. What is it? (title + primary image)
2. How much? (price + key purchase constraints)
3. Can I trust it? (seller preview + condition/meta + protection cues)

Primary actions:
- **Add to cart** / **Buy**
- **Message seller**

## Cart & checkout

- Cart is a review + edit surface (quantity, remove, delivery availability cues).
- Checkout is step-like even if rendered as one page:
  - order summary
  - delivery address
  - shipping method
  - payment (Stripe embed placeholder in design)
- “Success” confirms outcome and points to next action (track order / continue browsing).

## Account & identity

- Auth screens are simple and reassuring: minimal fields, clear errors, secure messaging.
- Account is a list-first IA:
  - profile
  - security
  - notifications
  - orders + order detail
  - payments/billing/plans
  - addresses

## Selling

- Sell is a wizard:
  - photos → details → pricing/shipping → review/publish
- Always surface payout readiness early to avoid last-step failures.

## Chat

- Inbox: preview rows prioritized by recency/unread.
- Conversation: clear ownership of messages, time separators, safe input bar.

## Desktop-only areas

Admin and business dashboard routes exist but are **desktop-first**.
On mobile, they should show a clear placeholder explaining that these areas require desktop.

