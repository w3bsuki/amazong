# TradeSphere Quick Fixes - Critical No-Ops

> **Priority**: P0 - These classes are doing NOTHING because they don't exist
> **Created**: 2026-02-02

---

## 🚨 CRITICAL: `tap-highlight-transparent` is UNDEFINED

Used in **30+ files** but the class doesn't exist. Elements using this have no iOS tap feedback suppression.

### Option A: Add Combined Utility (Recommended)

Add to `app/utilities.css`:

```css
/* Combined iOS native tap feedback */
.tap-native {
  -webkit-tap-highlight-color: transparent;
  transition: opacity 100ms ease;
}
.tap-native:active {
  opacity: 0.7;
}

/* Alternative: Also define tap-highlight-transparent for backwards compat */
.tap-highlight-transparent {
  -webkit-tap-highlight-color: transparent;
  transition: opacity 100ms ease;
}
.tap-highlight-transparent:active {
  opacity: 0.7;
}
```

### Option B: Use Existing Two Classes

Replace `tap-highlight-transparent` with `tap-transparent tap-highlight` everywhere.

### Files to Fix (Sample)

```
components/ui/button.tsx:9
components/ui/input.tsx:12
components/mobile/mobile-tab-bar.tsx:86, 112, 138, 156, 191
components/shared/filters/filter-chips.tsx:241, 274
components/mobile/category-nav/contextual-filter-bar.tsx:131
components/mobile/category-nav/inline-filter-bar.tsx:34
components/mobile/category-nav/quick-filter-row.tsx:188
components/mobile/category-nav/smart-anchor-nav.tsx:109, 119
components/mobile/category-nav/contextual-double-decker-nav.tsx:93
components/mobile/category-nav/category-nav-item.tsx:46
components/layout/header/mobile/contextual-header.tsx:40, 48, 62
app/[locale]/(main)/assistant/_components/assistant-playground.tsx:366
```

---

## 🚨 CRITICAL: `touch-action-manipulation` is WRONG

Tailwind's actual class is `touch-manipulation` (no "action").

### Quick Replace Command

```powershell
Get-ChildItem -Path components,app -Recurse -Include *.tsx,*.ts | ForEach-Object {
  (Get-Content $_.FullName) -replace 'touch-action-manipulation', 'touch-manipulation' | Set-Content $_.FullName
}
```

### Files to Fix (Sample)

```
components/mobile/mobile-menu-sheet.tsx:72
components/mobile/drawers/account-drawer.tsx:302
components/mobile/drawers/messages-drawer.tsx:166
components/shared/wishlist/mobile-wishlist-button.tsx:25, 38
components/shared/wishlist/wishlist-drawer.tsx:147, 158
components/shared/search/mobile-search-overlay.tsx:208, 352, 418, 444
components/shared/category/category-circle.tsx:97
components/layout/sidebar/sidebar-menu-v2.tsx:149, 173
components/layout/header/cart/mobile-cart-dropdown.tsx:62, 76
components/category/subcategory-circles.tsx:126, 167, 210
app/[locale]/(sell)/_components/ui/photo-thumbnail.tsx:59
```

---

## ⚠️ MINOR: `h-safe-bottom` / `h-safe-b` UNDEFINED

Used in 2 places. Add to `app/utilities.css`:

```css
/* Safe area height utilities */
.h-safe-bottom {
  height: env(safe-area-inset-bottom, 0px);
}

.h-safe-b {
  height: env(safe-area-inset-bottom, 0px);
}
```

### Files Using These

```
components/shared/search/mobile-search-overlay.tsx:463
app/[locale]/(sell)/_components/fields/condition-field.tsx:173
```

---

## ☑️ Already Fixed: `scrollbar-hide`

Both `scrollbar-hide` AND `hide-scrollbar` are defined in utilities.css:170-177 and 296-303. No action needed.

---

## Summary Table

| Issue | Severity | Files | Action |
|-------|----------|-------|--------|
| `tap-highlight-transparent` | 🔴 Critical | 30+ | Add utility OR search/replace |
| `touch-action-manipulation` | 🔴 Critical | 20+ | Search/replace with `touch-manipulation` |
| `h-safe-bottom` | 🟡 Medium | 2 | Add utility |
| `scrollbar-hide` | ✅ OK | - | Already defined |

---

## Immediate Actions

1. **Add `tap-highlight-transparent` utility** to `app/utilities.css` (simplest fix)
2. **Run search/replace** for `touch-action-manipulation` → `touch-manipulation`
3. **Add `h-safe-bottom` utility** to `app/utilities.css`
4. **Run typecheck** to verify no other issues

```powershell
pnpm -s typecheck
pnpm -s lint
```
