# Codex — Pattern Decisions (lock these early)

This doc answers the open UX questions so implementation doesn’t thrash.

## 1) Circles vs quick pills (landing/home)
**Recommendation:** **Keep circles** as the primary category affordance (Instagram “stories” familiarity).

- Circles work because they’re compact, scannable, and don’t consume vertical space.
- Quick pills are still useful, but **only inside** the Search surface (sheet) or as “recent filters”.

**Rule:** The home feed should not shift around because pills expand/collapse.

## 2) Drawer/sheet vs inline pills
**Recommendation:** Use a **sheet for depth** and keep the feed clean.

Drawers/sheets are *not* worse if:
- The trigger is obvious (Search tab + search bar).
- The sheet is one tap away and opens fast.
- The current selection is visible after closing (e.g., “Women → Shoes • Size 38 • Sofia” chip row).

Drawers/sheets become worse when:
- They nest too deeply (sheet inside sheet inside sheet).
- They hide the state (user can’t tell what filters are active).

**Treido rule:** Sheet is for “choosing”; the page is for “browsing”.

## 3) Bottom navigation (mobile)
Current mobile tab bar is effectively:
- Home / Categories / Sell / Chat / Account (`components/mobile/mobile-tab-bar.tsx`)

**Recommendation (rename + evolve):**
- Home / **Search** / Sell / Chat / Profile

Why:
- “Categories/Обяви” reads like “listings”, not “I want to find something”.
- Search tab can still show categories — but with AI search as the primary control.

Implementation intent (low churn):
- Evolve the existing categories sheet (`components/mobile/mobile-menu-sheet.tsx`) into a **Search sheet**.
- Keep the category circles grid inside it so nothing is lost; add AI search input + “recent searches” above.
- Avoid introducing new motion patterns: keep the current sheet/drawer behavior and use only subtle token-safe transitions.

## 4) Home feed structure (2026 social commerce)
**Recommendation:** Replace most “horizontal product carousels by category” with **seller-led modules**:
- Seller header (avatar, name, location, follow)
- A small grid/strip of their newest items
- Quick actions: View store / Chat

This satisfies: “eBay mixed with Facebook” — products are content, sellers are creators/stores.

Keep a fallback:
- A grid toggle for users who want “classic marketplace scanning”.

## 5) Onboarding timing (account type)
**Recommendation:** Remove account type selection from sign-up and move it to first-login onboarding.

We already have a post-signup onboarding surface (modal) that can be upgraded into a full multi-step onboarding.

## 6) Username selection timing + limits
**Recommendation:** Move username selection into onboarding *if we can keep it safe and reliable*.

Minimum viable rule:
- If user already has a username, do not force re-selection.
- If user has no username, onboarding must collect it before completion.

Copy requirement:
- “You can change your username once. Premium can change it more.”

## 7) i18n labels (avoid confusing copy)
Bottom nav labels should reflect intent:
- “Categories/Обяви” → “Search/Търси” (or “Търсене”)
- “Account” → “Profile/Профил” (optional if “Account” feels too settings-ish)

Prefer adding explicit keys (e.g. `Navigation.search`) over repurposing `Navigation.categories`.
