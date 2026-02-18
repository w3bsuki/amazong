# Mobile UI Standardization — Codex Task File

> **Context:** `docs/features/mobile-ui-standardization.md` — full audit with current/target state.
> **Rules:** `refactor/shared-rules.md` — read before starting.
> **Design system:** `docs/DESIGN.md` — all tokens, spacing, motion, overlay specs.

---

## Goal

Standardize mobile overlays, navigation patterns, page chrome, and drawer wrappers so every mobile surface feels like the same app.

**Not in scope:** Desktop layouts, new features, design token changes, auth/payments.

---

## Task 1 — Migrate "Още" category picker from Sheet to Drawer

**Files:**
- `app/[locale]/(main)/_components/mobile-home/mobile-home-category-picker.tsx`

**Steps:**
1. Read the file completely.
2. Replace `Sheet`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetDescription` imports from `@/components/ui/sheet` with `Drawer`/`DrawerContent`/`DrawerHeader`/`DrawerTitle`/`DrawerDescription` from `@/components/ui/drawer`.
3. Replace `<Sheet>` → `<Drawer>`, `<SheetContent side="bottom">` → `<DrawerContent>`, `<SheetHeader>` → `<DrawerHeader>`, etc.
4. Remove the `side="bottom"` prop (Drawer defaults to bottom).
5. Keep the existing className on DrawerContent: `max-h-dialog overflow-hidden rounded-t-2xl p-0`.
6. The close button is currently provided by SheetContent automatically. Since Drawer doesn't auto-add one, add a `DrawerClose` with an `IconButton` in the header (follow the DrawerShell pattern from `components/shared/drawer-shell.tsx`). Or optionally refactor to use `DrawerShell` directly.
7. Verify the drag handle now appears automatically (DrawerContent shows it by default for bottom direction).

**Done when:**
- "Още" picker opens as a Vaul Drawer with drag handle and drag-to-dismiss
- `grep -rn "from.*components/ui/sheet" app/[locale]/(main)/_components/mobile-home/` returns 0 results
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 2 — Migrate account tab-bar overlay from Sheet to Drawer

**Files:**
- `app/[locale]/(account)/account/_components/account-tab-bar.tsx`

**Steps:**
1. Read the file completely.
2. Same Sheet → Drawer migration as Task 1.
3. This may be a bottom sheet for mobile tab switching. If it's not a bottom overlay (e.g., it's a side panel or desktop-only), leave it as Sheet and note why.

**Done when:**
- If bottom overlay: uses Drawer with drag handle
- If not bottom overlay: documented why Sheet is correct
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 3 — Migrate support chat widget overlay from Sheet to Drawer (if bottom)

**Files:**
- `app/[locale]/(main)/(support)/customer-service/_components/support-chat-widget-view.tsx`

**Steps:**
1. Read the file. Determine if this is a bottom overlay on mobile or a side/desktop sheet.
2. If bottom overlay on mobile: migrate Sheet → Drawer (same pattern as Task 1).
3. If side panel or desktop-only: leave as Sheet and note why.

**Done when:**
- Correct technology for the overlay type
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 4 — Rename confusingly-named "sheet" files that use Drawer

**Files:**
- `app/[locale]/(main)/_components/mobile/home-city-picker-sheet.tsx`
- `app/[locale]/(main)/_components/mobile/home-browse-options-sheet.tsx`

**Steps:**
1. Read each file. Confirm they import from `components/ui/drawer` (not sheet).
2. Rename `home-city-picker-sheet.tsx` → `home-city-picker-drawer.tsx`.
3. Rename `home-browse-options-sheet.tsx` → `home-browse-options-drawer.tsx`.
4. Grep for all imports of the old filenames and update them:
   ```bash
   grep -rn "home-city-picker-sheet" --include="*.ts" --include="*.tsx" .
   grep -rn "home-browse-options-sheet" --include="*.ts" --include="*.tsx" .
   ```
5. Update all import paths to use the new filenames.

**Done when:**
- No files named `*-sheet.tsx` that actually use Vaul Drawer
- All imports updated
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 5 — Standardize DrawerShell adoption for filter/sort drawers

**Files:**
- `components/shared/filters/sort-modal.tsx`
- `app/[locale]/(main)/search/_components/mobile-seller-filter-drawers.tsx`

**Steps:**
1. Read `components/shared/drawer-shell.tsx` to understand the DrawerShell API.
2. Read `sort-modal.tsx`. It currently uses raw `Drawer` + `DrawerContent` + `DrawerHeader` + `DrawerTitle`.
3. Refactor `sort-modal.tsx` to use `DrawerShell` as the wrapper. Map existing props:
   - `open`/`onOpenChange` → DrawerShell `open`/`onOpenChange`
   - Title text → DrawerShell `title`
   - Add `closeLabel`, `description` (sr-only)
4. Read `mobile-seller-filter-drawers.tsx`. Same pattern — refactor to DrawerShell.
5. Ensure the filter/sort content is placed as `children` of DrawerShell.

**Done when:**
- Both files use DrawerShell instead of raw Drawer primitives
- Visual behavior unchanged (drag handle, close button, consistent header)
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 6 — Flatten search page chrome (reduce sticky layers)

**Files:**
- `app/[locale]/(main)/search/_components/search-page-layout.tsx`
- `app/[locale]/(main)/search/_components/search-header.tsx`
- `app/[locale]/(main)/search/_components/mobile-browse-mode-switch.tsx`

**Steps:**
1. Read all three files completely.
2. **Search header**: Remove the breadcrumb section (the `<nav className="mb-5 w-full border-b...">` with Treido > Search Results). The global header already shows "treido." logo. Keep only the H1 and results count, but make the H1 smaller — use `text-lg font-semibold` instead of `text-2xl font-bold`.
3. **Mode switch + category rail**: In `search-page-layout.tsx`, merge the mode switch and category rail into a single sticky section:
   - Wrap both `MobileBrowseModeSwitch` and `CategoryPillRail` in one `<div>` that is sticky
   - The mode switch container should use `stickyTop="var(--offset-mobile-primary-rail)"` and the category rail should NOT be independently sticky — it scrolls inside the same sticky parent
   - Remove the `sticky` prop from `CategoryPillRail` when used inside this combined wrapper
4. **Results count bar**: The `mb-4 flex items-center justify-between rounded-lg bg-surface-subtle...` block should become inline text below the H1, not a separate visual container. Move the product count into `SearchHeader` as a subtitle.

**Done when:**
- Search page has at most 2 sticky layers below header (mode switch+pills combined, filter/sort bar)
- Breadcrumb removed
- Results count is inline text, not a separate container
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 7 — Unify home page category tabs to pill pattern

**Files:**
- `app/[locale]/(main)/_components/mobile-home/mobile-home-rails.tsx`
- `components/mobile/chrome/mobile-control-recipes.ts`

**Steps:**
1. Read both files completely.
2. In `mobile-home-rails.tsx`, the primary rail currently uses `getPrimaryTabClass` (local function referencing `getMobilePrimaryTabClass` from recipes) which renders full-width tabs with an underline active indicator.
3. Change the primary rail to use `getMobileQuickPillClass` instead — same pill pattern as the search page's `CategoryPillRail`.
4. Update the layout: change from `flex w-max min-w-full items-stretch` to `flex items-center gap-1.5 overflow-x-auto no-scrollbar px-inset py-1.5` (matching CategoryPillRail's layout).
5. Remove the underline indicator spans (`<span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground" ...>`).
6. Update the "Още" overflow button to use the same pill class.
7. Keep the icon + label inside each pill — just change the visual treatment from underline-tab to filled-pill.

**Done when:**
- Home primary categories render as pills (same visual as search page category rail)
- Underline indicators removed
- Touch targets remain ≥ 36px (pill compact) or ≥ 44px (if you use `--control-default`)
- `pnpm -s typecheck && pnpm -s lint`

---

## Task 8 — Final verification

**Steps:**
1. Run full verification:
   ```bash
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
   ```
2. Grep to confirm no bottom-overlay Sheet usage on mobile remains:
   ```bash
   grep -rn 'side="bottom"' --include="*.tsx" components/ app/
   ```
   Any remaining results should be desktop-only or legitimate side-panel Sheet usage.
3. Grep for naming consistency:
   ```bash
   grep -rn "sheet" --include="*.tsx" app/[locale]/(main)/_components/mobile/
   ```
   Should return 0 results (all renamed to drawer).

**Done when:**
- All gates pass
- No `side="bottom"` Sheet on mobile paths
- No "sheet" naming in files that use Drawer

---

## DON'T TOUCH

- `components/ui/drawer.tsx` — the Drawer primitive itself
- `components/ui/sheet.tsx` — the Sheet primitive itself (keep for desktop side panels)
- `components/shared/drawer-shell.tsx` — the wrapper (don't change its API)
- Auth logic, payment logic, database queries
- Desktop-only components
- Test assertions (fix broken imports only)
- `components/layout/sidebar/sidebar.tsx` — legitimate desktop Sheet usage

## Execution Order

Tasks 1-4 (overlay migration) are independent — can run in any order.
Task 5 (DrawerShell adoption) depends on nothing.
Task 6 (search page chrome) is independent.
Task 7 (home tabs → pills) is independent.
Task 8 (verification) runs last.

Recommended: Tasks 1-5 first (overlay consistency), then 6-7 (navigation/chrome), then 8 (verify).
