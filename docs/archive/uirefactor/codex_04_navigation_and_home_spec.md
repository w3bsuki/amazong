# Codex — Navigation + Home (mobile-first, desktop parity)

## Mobile bottom nav (proposed)
Keep the 5-tab mental model (already matches the codebase):
- Home
- Search (renamed from Categories/Обяви)
- Sell (central CTA)
- Chat (drawer)
- Profile

Desktop parity:
- Same destinations, but presented as a side rail or top nav.
- Sheets become side panels where appropriate.

## Search surface (the key upgrade)
Search must be the “do everything” discovery surface:
- AI search input (primary, autofocus when opened)
- Category circles (same as Home)
- Subcategories + filters (in the sheet, not inline on Home)
- Recent searches + saved filters (“watchlist” behavior)

Implementation note:
- Start by evolving the existing mobile categories sheet (`components/mobile/mobile-menu-sheet.tsx`) rather than adding a new parallel UI.

Design rule:
- Home stays clean; Search owns complexity.

## Home = feed, not a catalog
Home should feel alive and social:
- Top: AI search bar (collapsed) + category circles row
- Feed modules:
  - Seller-led “store strip” cards (avatar/name/location + 3–4 items)
  - “New listings near you”
  - “Trending sellers”
  - Optional: “Price drops” / “Your watchlist”
- View toggle:
  - Feed (default)
  - Grid (classic marketplace scanning)

## Sellers discoverability
“Sellers” does not need its own bottom tab in v1 if:
- Home feed contains seller modules
- Search surface has a Sellers sub-tab/segment (inside sheet)

If Sellers becomes core later:
- Add as a 5th tab by merging Chat into a persistent drawer/Inbox button inside Profile.

## i18n copy (mobile tabs)
To avoid confusing labels across languages, plan explicit keys:
- `Navigation.search` (instead of repurposing `Navigation.categories`)
- `Navigation.profile` (optional; replace `Navigation.account` if needed)
