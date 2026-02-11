# Phase 14: Static & Legal Pages

> Validate the mobile experience across 16+ static, legal, and informational pages — legal document layouts with accordion sections, about page, support/help pages, and placeholder pages. All pages use the `(main)` layout group with `StorefrontShell`.

| Field | Value |
|-------|-------|
| **Scope** | 16+ static/info/legal pages — about, legal docs, support pages, placeholder pages |
| **Routes** | `/about`, `/accessibility`, `/assistant`, `/cookies`, `/privacy`, `/returns`, `/terms`, `/contact`, `/customer-service`, `/faq`, `/feedback`, `/help`, `/security`, `/gift-cards`, `/members`, `/messages`, `/registry`, `/todays-deals` |
| **Priority** | P2 |
| **Dependencies** | Phase 1 (Shell) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/(main)/(legal)/_components/legal-page-layout.tsx` | `LegalPageLayout` — shared template: hero, breadcrumb, sidebar TOC, accordion sections, markdown rendering, contact CTA, related links |
| `app/[locale]/(main)/(legal)/_components/legal-doc-loading.tsx` | Shared loading skeleton for legal pages |
| `app/[locale]/(main)/(legal)/cookies/page.tsx` | Cookie policy page — uses `LegalPageLayout` |
| `app/[locale]/(main)/(legal)/privacy/page.tsx` | Privacy policy page — uses `LegalPageLayout` |
| `app/[locale]/(main)/(legal)/privacy/loading.tsx` | Privacy page loading skeleton |
| `app/[locale]/(main)/(legal)/returns/page.tsx` | Returns policy page — uses `LegalPageLayout` |
| `app/[locale]/(main)/(legal)/returns/loading.tsx` | Returns page loading skeleton |
| `app/[locale]/(main)/(legal)/terms/page.tsx` | Terms of service page — uses `LegalPageLayout` |
| `app/[locale]/(main)/(legal)/terms/loading.tsx` | Terms page loading skeleton |
| `app/[locale]/(main)/about/page.tsx` | About page — Suspense + `AboutPageContent` |
| `app/[locale]/(main)/about/loading.tsx` | About page loading skeleton |
| `app/[locale]/(main)/about/_components/about-page-content.tsx` | `AboutPageContent` — custom about page layout |
| `app/[locale]/(main)/about/_components/about-page-skeleton.tsx` | `AboutPageSkeleton` — Suspense fallback |
| `app/[locale]/(main)/accessibility/page.tsx` | Accessibility statement page |
| `app/[locale]/(main)/(support)/contact/page.tsx` | Contact page |
| `app/[locale]/(main)/(support)/contact/loading.tsx` | Contact page loading skeleton |
| `app/[locale]/(main)/(support)/customer-service/page.tsx` | Customer service page |
| `app/[locale]/(main)/(support)/customer-service/loading.tsx` | Customer service loading skeleton |
| `app/[locale]/(main)/(support)/faq/page.tsx` | FAQ page |
| `app/[locale]/(main)/(support)/feedback/page.tsx` | Feedback page |
| `app/[locale]/(main)/(support)/help/page.tsx` | Help center page |
| `app/[locale]/(main)/(support)/help/loading.tsx` | Help page loading skeleton |
| `app/[locale]/(main)/(support)/security/page.tsx` | Security info page |
| `app/[locale]/(main)/gift-cards/page.tsx` | Gift cards placeholder page |
| `app/[locale]/(main)/gift-cards/loading.tsx` | Gift cards loading skeleton |
| `app/[locale]/(main)/members/page.tsx` | Members placeholder page |
| `app/[locale]/(main)/members/loading.tsx` | Members loading skeleton |
| `app/[locale]/(main)/messages/page.tsx` | Messages page |
| `app/[locale]/(main)/registry/page.tsx` | Registry placeholder page |
| `app/[locale]/(main)/registry/loading.tsx` | Registry loading skeleton |
| `app/[locale]/(main)/todays-deals/page.tsx` | Today's deals placeholder page |
| `app/[locale]/(main)/todays-deals/loading.tsx` | Today's deals loading skeleton |
| `app/[locale]/(main)/assistant/page.tsx` | AI assistant placeholder page |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — mobile shell, bottom nav, header verified | Phase 1 audit green |
| 2 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 3 | Locale set to `en` | URL prefix `/en/` |
| 4 | No auth required — all pages are public | Unauthenticated browser context |
| 5 | Overlays dismissed (cookie consent + geo modal) | `localStorage.setItem('cookie-consent', 'accepted'); localStorage.setItem('geo-welcome-dismissed', 'true')` |

---

## Routes Under Test

| # | Route | Layout Group | Type | Template |
|---|-------|-------------|------|----------|
| 1 | `/about` | `(main)` | Custom | `AboutPageContent` |
| 2 | `/accessibility` | `(main)` | Static | — |
| 3 | `/assistant` | `(main)` | Placeholder | — |
| 4 | `/cookies` | `(main)/(legal)` | Legal | `LegalPageLayout` |
| 5 | `/privacy` | `(main)/(legal)` | Legal | `LegalPageLayout` |
| 6 | `/returns` | `(main)/(legal)` | Legal | `LegalPageLayout` |
| 7 | `/terms` | `(main)/(legal)` | Legal | `LegalPageLayout` |
| 8 | `/contact` | `(main)/(support)` | Support | — |
| 9 | `/customer-service` | `(main)/(support)` | Support | — |
| 10 | `/faq` | `(main)/(support)` | Support | — |
| 11 | `/feedback` | `(main)/(support)` | Support | — |
| 12 | `/help` | `(main)/(support)` | Support | — |
| 13 | `/security` | `(main)/(support)` | Support | — |
| 14 | `/gift-cards` | `(main)` | Placeholder | — |
| 15 | `/members` | `(main)` | Placeholder | — |
| 16 | `/messages` | `(main)` | Placeholder | — |
| 17 | `/registry` | `(main)` | Placeholder | — |
| 18 | `/todays-deals` | `(main)` | Placeholder | — |

---

## Known Bugs

None identified for static or legal pages.

---

## Scenarios

### S14.1 — Legal Page Rendering: LegalPageLayout Structure (Terms)

**Goal:** Verify the `/terms` page renders the full `LegalPageLayout` template on mobile — hero section with icon + title + last-updated date, breadcrumb navigation, intro notice, accordion sections with icons, contact CTA, and related links.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to terms page | `await page.goto('/en/terms')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert hero section renders | `page.locator('.bg-primary')` — colored hero banner with `text-primary-foreground` |
| 4 | Assert hero icon is visible | FileText or similar icon within hero container |
| 5 | Assert page title in hero | `await expect(page.locator('h1')).toBeVisible()` — title text |
| 6 | Assert "last updated" date displays | `page.locator('text=/last updated|updated/i')` — date string below title |
| 7 | Assert `AppBreadcrumb` navigation renders | `page.locator('nav').filter({ hasText: /home/i })` — breadcrumb trail |
| 8 | Assert intro notice card | `page.locator('[class*="bg-info/10"], [class*="bg-warning/10"]')` — notice with WarningCircle icon |
| 9 | Assert table of contents sidebar (or collapsed on mobile) | TOC label heading or sidebar element — may collapse below `md:` breakpoint |
| 10 | Assert accordion sections render | `page.getByRole('button', { name: /.+/ }).filter({ has: page.locator('[data-state]') })` — AccordionTrigger elements |
| 11 | Assert section count ≥ 3 | At least 3 accordion items visible |
| 12 | Assert contact CTA at bottom | `page.getByRole('link', { name: /contact/i })` or email link — Envelope icon |
| 13 | Assert related links section | Related page cards with icons and descriptions |
| 14 | Assert page is wrapped in `PageShell` | `pb-20 sm:pb-12` bottom padding for tab bar clearance |
| 15 | 📸 Screenshot | `phase-14-S14.1-terms-legal-layout.png` |

**Expected:**
- `LegalPageLayout` renders inside `PageShell` with `className="pb-20 sm:pb-12"`.
- Hero: `bg-primary text-primary-foreground`, `container py-10 md:py-14`, icon + `h1` title + last-updated text.
- Breadcrumb: `AppBreadcrumb` in hero section with custom styling overrides for contrast.
- Intro: Card with `bg-info/10 border-info` (or warning variant), WarningCircle icon, markdown body via `ReactMarkdown` + `remarkGfm`.
- Accordion: shadcn/Radix `Accordion` with `AccordionItem`, `AccordionTrigger` (icon + title + description), `AccordionContent` (markdown rendered).
- Contact CTA: Envelope icon, email link as `Button`, questions heading.
- Related links: `Card` components with icon, title, description, and `Link` to related legal pages.
- No horizontal overflow on 390px / 393px viewport.

---

### S14.2 — Legal Page Accordion: Expand/Collapse Sections

**Goal:** Verify accordion sections in `LegalPageLayout` expand and collapse on tap, revealing section content rendered via `ReactMarkdown`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to privacy page | `await page.goto('/en/privacy')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Identify first accordion trigger | `const firstTrigger = page.locator('[data-state="closed"]').first()` |
| 4 | Assert first section is initially collapsed | `await expect(firstTrigger).toHaveAttribute('data-state', 'closed')` |
| 5 | Tap the first accordion trigger | `await firstTrigger.tap()` |
| 6 | Assert section expands | `await expect(firstTrigger).toHaveAttribute('data-state', 'open')` |
| 7 | Assert content panel is visible | `page.locator('[data-state="open"] + [role="region"], [data-state="open"] ~ [data-state="open"]')` — expanded content |
| 8 | Assert content contains markdown-rendered text | `page.locator('[role="region"] p, [role="region"] ul, [role="region"] ol')` — rendered markdown |
| 9 | Tap the same trigger again to collapse | `await firstTrigger.tap()` |
| 10 | Assert section collapses | `await expect(firstTrigger).toHaveAttribute('data-state', 'closed')` |
| 11 | Tap a different section | `const secondTrigger = page.locator('[data-state="closed"]').nth(1); await secondTrigger.tap()` |
| 12 | Assert second section expands | `await expect(secondTrigger).toHaveAttribute('data-state', 'open')` |
| 13 | 📸 Screenshot | `phase-14-S14.2-accordion-expand.png` — screenshot with one section expanded |

**Expected:**
- Accordion uses `defaultValue` to auto-open the `defaultSection` on load.
- Each `AccordionTrigger` shows an icon (from section definition) + title + description.
- `AccordionContent` renders markdown via `ReactMarkdown` with `remarkGfm` — supports headings, lists, links, tables, bold/italic.
- Expand/collapse transitions are smooth (Radix Accordion default animation).
- Tapping a trigger toggles only that section (no multi-select unless `type="multiple"` is set).
- Expanded content fits within mobile viewport width — long markdown lines wrap properly.
- Touch target for each trigger is ≥ 44px height.

---

### S14.3 — Mobile Readability: Text Size, Spacing, and Scrolling

**Goal:** Verify that legal page content is readable on mobile — text is not too small, line lengths are comfortable, spacing is adequate, and the page scrolls smoothly without layout issues.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to returns page | `await page.goto('/en/returns')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert body text size ≥ 14px | `await page.evaluate(() => { const p = document.querySelector('p'); return p ? parseFloat(getComputedStyle(p).fontSize) : 0 })` — should be ≥ 14 |
| 4 | Assert headings are visually distinct | `h1` is larger than body text, section titles are prominent |
| 5 | Assert container has horizontal padding | Content does not touch viewport edges — `container` class applies `px-4` or similar |
| 6 | Assert no horizontal scrollbar | `await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)` — returns `true` |
| 7 | Scroll to bottom of page | `await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` |
| 8 | Assert footer/related links section is reachable | Related links or contact CTA visible at bottom |
| 9 | Assert tab bar clearance | Content does not overlap with bottom tab bar — `pb-20` padding on `PageShell` |
| 10 | Navigate to cookies page and repeat overflow check | `await page.goto('/en/cookies')` — assert no horizontal overflow |
| 11 | 📸 Screenshot | `phase-14-S14.3-mobile-readability.png` — bottom of returns page showing related links + tab bar spacing |

**Expected:**
- Body text: ≥ 14px (`text-sm` = 14px or `text-base` = 16px).
- Line height: ≥ 1.5 for body text (Tailwind default `leading-normal` = 1.5).
- Container padding: `container` class with responsive horizontal padding (typically `px-4` on mobile).
- No horizontal overflow: all content, including markdown tables and code blocks, wraps or scrolls within container.
- `PageShell` provides `pb-20 sm:pb-12` for mobile tab bar clearance.
- Scroll is smooth and uninterrupted — no jumpiness from lazy-loaded content.
- All 4 legal pages (`/terms`, `/privacy`, `/cookies`, `/returns`) pass the same readability criteria.

---

### S14.4 — Links and CTAs: Minimum Touch Target Size (44px)

**Goal:** Verify all interactive elements (links, buttons, accordion triggers) on legal and static pages meet the 44×44px minimum touch target recommendation for mobile.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to terms page | `await page.goto('/en/terms')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Measure breadcrumb link touch targets | `await page.evaluate(() => { const links = document.querySelectorAll('nav a'); return Array.from(links).map(l => ({ text: l.textContent, height: l.getBoundingClientRect().height })) })` |
| 4 | Assert breadcrumb links ≥ 44px height (or padded to 44px equivalent) | Each link box height ≥ 44px or has sufficient surrounding padding |
| 5 | Measure accordion trigger touch targets | `await page.evaluate(() => { const triggers = document.querySelectorAll('[data-state]'); return Array.from(triggers).map(t => ({ text: t.textContent?.slice(0, 30), height: t.getBoundingClientRect().height })) })` |
| 6 | Assert accordion triggers ≥ 44px height | Each trigger button ≥ 44px |
| 7 | Measure contact CTA button | `await page.evaluate(() => { const btn = document.querySelector('a[href*="contact"], a[href*="mailto"]'); return btn ? btn.getBoundingClientRect().height : 0 })` |
| 8 | Assert contact CTA ≥ 44px height | Button/link height ≥ 44px |
| 9 | Measure related link cards | Card elements in related links section — tap targets should be entire card |
| 10 | Assert related link cards are tappable with adequate size | Each card height ≥ 44px |
| 11 | Tap a related link | `await page.locator('a[href*="/privacy"], a[href*="/returns"]').first().tap()` |
| 12 | Assert navigation to linked page | URL changes to target route |
| 13 | 📸 Screenshot | `phase-14-S14.4-touch-targets.png` |

**Expected:**
- Breadcrumb links: may be small text but should have adequate padding for 44px equivalent touch area.
- Accordion triggers: typically ≥ 48px height with padded content — icon + title + description layout.
- Contact CTA: `Button` component renders at ≥ 44px height (`h-10` = 40px — check if sufficient with padding).
- Related link cards: `Card` components are large enough to tap without precision (entire card is clickable).
- IntraPage links within markdown content: rendered as styled `<a>` tags — may be inline and below 44px; document as known limitation if so.
- External links open in new tab or handle navigation appropriately.

---

### S14.5 — About Page: Custom Layout and Sections

**Goal:** Verify the `/about` page renders its custom `AboutPageContent` component with sections specific to Treido marketplace — mission, team, contact info — distinct from the `LegalPageLayout` template.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to about page | `await page.goto('/en/about')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert page renders (not loading skeleton) | `AboutPageContent` visible — `AboutPageSkeleton` dismissed |
| 4 | Assert page title / heading | `await expect(page.locator('h1')).toContainText(/about/i)` |
| 5 | Assert at least 2 content sections | Multiple content blocks or sections visible |
| 6 | Assert mission or value proposition section | Text block describing Treido's purpose |
| 7 | Assert page does NOT use `LegalPageLayout` | No accordion sections, no TOC sidebar — custom layout |
| 8 | Scroll to bottom | `await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` |
| 9 | Assert no horizontal overflow | `await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)` — returns `true` |
| 10 | Assert mobile shell intact | Header and tab bar visible around about page content |
| 11 | 📸 Screenshot | `phase-14-S14.5-about-page.png` |

**Expected:**
- `AboutPageContent` renders as a custom component, NOT using `LegalPageLayout`.
- Wrapped in `Suspense` with `AboutPageSkeleton` fallback.
- Content sections describe Treido marketplace — Bulgarian e-commerce focus.
- Page is fully scrollable and readable on mobile viewports.
- No accordion pattern — content is directly visible (unlike legal pages).
- `PageShell` or equivalent wrapper provides proper mobile padding.

---

### S14.6 — Placeholder Pages Render Without Errors

**Goal:** Verify that all placeholder/stub pages (`/gift-cards`, `/members`, `/registry`, `/todays-deals`, `/assistant`, `/messages`) render without JavaScript errors, blank screens, or broken layouts on mobile.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Define placeholder routes | `['/gift-cards', '/members', '/registry', '/todays-deals', '/assistant', '/messages']` |
| 2 | For each route: navigate | `await page.goto('/en/<route>')` |
| 3 | Wait for load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert page renders visible content | `await expect(page.locator('main, [role="main"], .container').first()).toBeVisible()` — not blank |
| 5 | Assert no error boundary triggered | No error.tsx content, no "Something went wrong" text |
| 6 | Assert no console errors | `page.on('console', msg => ...)` — no `error` level messages |
| 7 | Assert mobile shell intact | Header and bottom tab bar visible and functional |
| 8 | Assert no horizontal overflow | `await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)` |
| 9 | 📸 Screenshot per page | `phase-14-S14.6-<route-name>.png` — e.g., `phase-14-S14.6-gift-cards.png` |

**Expected:**
- Each placeholder page renders a basic UI — may be a "coming soon" message, feature preview, or minimal content.
- No JavaScript runtime errors or unhandled exceptions.
- No blank white screens — at minimum, the page shell renders with header and tab bar.
- Pages with `error.tsx` and `loading.tsx` (gift-cards, members, todays-deals) handle error/loading states gracefully.
- Pages without `loading.tsx` (assistant, faq, feedback, accessibility) still render without flash of unstyled content.
- All pages are inside the `(main)` layout group — `StorefrontShell` wraps content.

---

## Execution Evidence Log

> Required for release sign-off. Add one row per executed scenario.

| Scenario ID | Auto Result | Manual Result | Owner | Build/Commit | Screenshot/Video | Defect ID | Severity | Retest Result | Sign-off |
|-------------|-------------|---------------|-------|--------------|------------------|-----------|----------|---------------|---------|
| S14.1 | Pass | N/A (code audit) | Codex | `2d8d4379 (dirty worktree)` | N/A (code trace) | — | — | Pass | Pending |
| S14.2 | Pass | N/A (code audit) | Codex | `2d8d4379 (dirty worktree)` | N/A (code trace) | — | — | Pass | Pending |
| S14.3 | Pass | N/A (code audit) | Codex | `2d8d4379 (dirty worktree)` | N/A (code trace) | — | — | Pass | Pending |
| S14.4 | Fail | N/A (code audit) | Codex | `2d8d4379 (dirty worktree)` | N/A (code trace) | F14-001 | P2 | Fail | Pending |
| S14.5 | Pass | N/A (code audit) | Codex | `2d8d4379 (dirty worktree)` | N/A (code trace) | — | — | Pass | Pending |
| S14.6 | Pass | N/A (code audit) | Codex | `2d8d4379 (dirty worktree)` | N/A (code trace) | — | — | Pass | Pending |

---

## Findings

| ID | Scenario | Severity | Description | Screenshot | Device |
|----|----------|----------|-------------|------------|--------|
| F14-001 | S14.4 | P2 | Legal contact CTA uses compact sizing (`app/[locale]/(main)/(legal)/_components/legal-page-layout.tsx:203`) and maps to `h-(--control-compact)` in the button variant (`components/ui/button.tsx:37`, `app/globals.css:568`), which is 36px and below the 44px touch-target contract. | N/A (code trace) | N/A (code audit) |

---

## Summary

| Metric | Value |
|--------|-------|
| Scenarios | 6 |
| Executed | 6 |
| Passed | 5 |
| Failed | 1 |
| Blocked | 0 |
| Issues found | 1 (P2:1) |
| Blockers | 0 |
| Status | ✅ Complete |

Phase 14 covers 18 routes across 3 layout sub-groups: `(legal)` (4 pages sharing `LegalPageLayout`), `(support)` (6 pages), and direct `(main)` children (8 pages including about and placeholders). The `LegalPageLayout` template is the primary component under test — it composes hero sections, `AppBreadcrumb`, `Accordion` (shadcn/Radix), `ReactMarkdown` + `remarkGfm` rendering, contact CTAs, and related links into a consistent legal document experience. The about page uses a distinct custom layout via `AboutPageContent`. Placeholder pages (gift-cards, members, registry, todays-deals, assistant) are verified for error-free rendering only. No `data-testid` attributes exist in any of these pages — all selectors must rely on structural queries, ARIA roles, `data-state` attributes (accordion), or text content. Key risk areas are accordion interactivity on touch devices, markdown rendering overflow on narrow viewports, and touch target compliance for inline links within legal content.
