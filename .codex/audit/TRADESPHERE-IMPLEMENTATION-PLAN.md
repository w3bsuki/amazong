# TradeSphere Patterns Implementation Plan

> **Source Audit**: [TRADESPHERE-PATTERNS-AUDIT.md](./TRADESPHERE-PATTERNS-AUDIT.md)
> **Codex MCP Iteration**: 2026-02-02
> **Status**: Ready for Implementation

---

## 🚨 Critical Finding: NO-OP Utility Drift

Codex identified that **several widely-used utility classes don't actually exist** in our CSS-first Tailwind v4 setup:

| Class Used | Status | Files Affected | Fix |
|------------|--------|----------------|-----|
| `tap-highlight-transparent` | ❌ **UNDEFINED** | 30+ files (button.tsx, input.tsx, mobile-tab-bar.tsx, filter-chips.tsx, etc.) | Replace with `tap-transparent tap-highlight` OR add combined `tap-native` |
| `touch-action-manipulation` | ❌ **Wrong name** | 20+ files (mobile-wishlist-button.tsx, category-circles.tsx, etc.) | Replace with `touch-manipulation` (Tailwind's actual class) |
| `scrollbar-hide` | ✅ **DEFINED** | utilities.css:170-177 | Both `scrollbar-hide` AND `hide-scrollbar` work ✅ |
| `h-safe-bottom` / `h-safe-b` | ❌ **UNDEFINED** | mobile-search-overlay.tsx, condition-field.tsx | Add utility to utilities.css |
| `supports-backdrop-filter:*` | ❌ **Variant not defined** | minimal-header.tsx | Use `supports-[backdrop-filter]:*` |

---

## Implementation Phases

### Phase 0: Fix No-Ops (P0 - Do First)

These are silent failures - classes that do nothing because they don't exist.

#### 0.1 Add Combined Tap Utility

**File**: `app/utilities.css`

```css
/* COMBINED: iOS native tap feedback (replaces tap-highlight-transparent) */
.tap-native {
  -webkit-tap-highlight-color: transparent;
  transition: opacity 100ms ease;
}
.tap-native:active {
  opacity: 0.7;
}
```

Then search/replace:
- `tap-highlight-transparent` → `tap-native`
- OR keep using `tap-transparent tap-highlight` (two classes)

#### 0.2 Fix Touch Action Class

```bash
# Find all occurrences
grep -r "touch-action-manipulation" --include="*.tsx" .
```

Replace with Tailwind's actual class: `touch-manipulation`

#### 0.3 Fix Scrollbar Hide Class

```bash
# Find all occurrences
grep -r "scrollbar-hide" --include="*.tsx" .
```

Replace with our defined class: `hide-scrollbar`

#### 0.4 Add Safe Area Height Utilities

**File**: `app/utilities.css`

```css
/* Safe area height utilities */
@utility h-safe-bottom {
  height: env(safe-area-inset-bottom, 0px);
}

@utility min-h-safe-bottom {
  min-height: env(safe-area-inset-bottom, 0px);
}
```

#### 0.5 Fix Backdrop Filter Variant

In `minimal-header.tsx:51`, change:
```tsx
// FROM:
"supports-backdrop-filter:bg-background/95"

// TO (Tailwind v4 syntax):
"supports-[backdrop-filter]:bg-background/95"
```

---

### Phase 1: Glass Effects (P1)

#### 1.1 Add Glass Utilities

**File**: `app/utilities.css`

```css
/* Glass morphism surfaces (TradeSphere pattern) */
.glass-surface {
  background: hsl(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-button {
  background: hsl(var(--background) / 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-overlay {
  background: hsl(var(--background) / 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

#### 1.2 Apply to Components

| Component | Current | Target |
|-----------|---------|--------|
| `mobile-bottom-bar-v2.tsx` | Has glass ✅ | Keep |
| `mobile-tab-bar.tsx` | Has glass ✅ | Keep |
| `minimal-header.tsx` | Complex variant | Simplify to `.glass-surface` |
| `mobile-gallery-v2.tsx` floating buttons | `bg-white/80` | `.glass-button` |
| `mobile-product-header.tsx` | Has glass ✅ | Keep |

---

### Phase 2: Touch Feedback Audit (P1)

Add `tap-native` (or `tap-transparent tap-highlight`) to ALL interactive elements.

#### Files to Audit

**High Priority (User-facing product surfaces)**:
- [ ] `components/shared/product/product-card.tsx` - Has `tap-transparent`, add `tap-highlight`
- [ ] `components/shared/product/product-card-actions.tsx` - Missing touch feedback
- [ ] `components/shared/product/product-card-wishlist-button.tsx` - Missing touch feedback
- [ ] `components/mobile/product/mobile-gallery-v2.tsx` - Floating buttons missing

**UI Components**:
- [ ] `components/ui/button.tsx:9` - Fix `tap-highlight-transparent`
- [ ] `components/ui/input.tsx:12` - Fix `tap-highlight-transparent`

**Navigation**:
- [ ] `components/mobile/mobile-tab-bar.tsx:86` - Fix `tap-highlight-transparent`
- [ ] `components/layout/header/mobile/contextual-header.tsx:40` - Fix `tap-highlight-transparent`

---

### Phase 3: Seller/Profile Page Patterns (P1)

#### Current Route Structure (Corrected from Audit)

**Actual Treido paths** (not what the audit doc said):
- Seller page: `app/[locale]/[username]/page.tsx`
- Profile client: `app/[locale]/[username]/profile-client.tsx`
- Layout: `app/[locale]/[username]/layout.tsx`

#### What's Already Good

✅ Cover image with avatar overlap (`profile-client.tsx:214-241`)
✅ Follow CTA button (`profile-client.tsx:290-296`)
✅ Stats grid pattern (`profile-client.tsx:311-341`)

#### What Needs Work

❌ **Header Strategy**: Always renders `AppHeader` in layout, blocking immersive cover experience
- **Fix**: Create mobile-specific header variant or conditional header rendering

❌ **Floating Glass Controls on Cover**: No overlay actions on banner
- **Fix**: Add floating back/share buttons on cover image (TradeSphere pattern)

---

### Phase 4: Product Detail Patterns (P1)

#### What's Already Good

✅ Inline seller card: `mobile-product-single-scroll.tsx:273-279`
✅ Safety tips section: `mobile-product-single-scroll.tsx:294-297`
✅ Fixed bottom actions: `mobile-bottom-bar-v2.tsx:203-205`

#### What Needs Work

❌ **Gallery Floating Buttons**: Missing glass + tap feedback
- Location: `mobile-gallery-v2.tsx:123, 141`

❌ **Inline Thumbnails in Gallery**: Thumbnails outside gallery
- Current: Thumbnail strip below gallery
- Target: Thumbnails overlaid bottom-left inside gallery

---

### Phase 5: Shadow System Alignment (P2)

#### Current Token vs Utility Mismatch

```css
/* Token in globals.css:547 */
--shadow-card: 0 2px 8px -2px hsl(var(--foreground) / 0.05);

/* Utility in utilities.css:287 */
.shadow-card {
  box-shadow: 0 4px 12px -2px hsl(var(--foreground) / 0.08);
}
```

The utility is more "elevated" than the token. Align them:

```css
/* Align utility to token */
.shadow-card {
  box-shadow: var(--shadow-card);
}

.shadow-elevated {
  box-shadow: 0 4px 12px -2px hsl(var(--foreground) / 0.08);
}
```

---

## Specific File Changes

### `app/utilities.css` - Complete Additions

```css
/* ===== TRADESPHERE PATTERN UTILITIES ===== */

/* Combined iOS native tap feedback */
.tap-native {
  -webkit-tap-highlight-color: transparent;
  transition: opacity 100ms ease;
}
.tap-native:active {
  opacity: 0.7;
}

/* Glass morphism surfaces */
.glass-surface {
  background: hsl(var(--background) / 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-button {
  background: hsl(var(--background) / 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Safe area height utilities */
@utility h-safe-bottom {
  height: env(safe-area-inset-bottom, 0px);
}

@utility min-h-safe-bottom {
  min-height: env(safe-area-inset-bottom, 0px);
}

/* Align shadow utility to token */
.shadow-card {
  box-shadow: var(--shadow-card);
}

.shadow-elevated {
  box-shadow: 0 4px 12px -2px hsl(var(--foreground) / 0.08);
}
```

### `app/globals.css` - Add Global Tap Highlight Disable

```css
/* In @layer base */
html {
  -webkit-tap-highlight-color: transparent;
}
```

---

## Search & Replace Commands

```powershell
# Find tap-highlight-transparent (undefined class)
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String "tap-highlight-transparent"

# Find touch-action-manipulation (wrong name)
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String "touch-action-manipulation"

# Find scrollbar-hide (wrong name)
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String "scrollbar-hide"

# Find h-safe-bottom (undefined)
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String "h-safe-bottom|h-safe-b"
```

---

## Verification Checklist

After implementation:

- [ ] `pnpm -s typecheck` - No errors
- [ ] `pnpm -s lint` - No errors
- [ ] `pnpm -s styles:gate` - No Tailwind violations
- [ ] Test on real iOS device - Touch feedback feels native
- [ ] Test sticky headers/footers - Glass blur visible
- [ ] Test product cards - Tap feedback works
- [ ] Test seller page - Cover image immersive

---

## Pattern Comparison Summary

| Pattern | TradeSphere | Treido Current | Treido Target |
|---------|-------------|----------------|---------------|
| Tap feedback | `tap-highlight` everywhere | Mixed/broken | `tap-native` everywhere |
| Glass surfaces | `bg-background/95 backdrop-blur` | Partial | `.glass-surface` utility |
| Safe areas | `safe-top`, `safe-bottom` | `pb-safe`, `pt-safe` | Keep ours, add heights |
| Hidden scrollbar | `hide-scrollbar` | `hide-scrollbar` defined, `scrollbar-hide` used | Unify to `hide-scrollbar` |
| Card shadows | `shadow-card`, `shadow-elevated` | Token/utility mismatch | Align utility to token |
| Seller page | Immersive cover | Header blocks cover | Conditional header |

---

## Decision: Keep vs Adopt

### ✅ KEEP (Ours is Equal or Better)

- **Landing page circles** - Our animated circles are more engaging
- **Token system** - Our Tailwind v4 tokens are comprehensive
- **Safe area utilities** - `pb-safe`, `pt-safe` work well
- **Product card structure** - Already well-designed

### ✅ ADOPT (TradeSphere is Better)

- **Touch feedback** - Unified `tap-native` class
- **Glass surfaces** - Standardized `.glass-*` utilities
- **Seller page header** - Immersive cover pattern
- **Gallery inline thumbnails** - Better mobile UX

### 🔄 MERGE (Combine Best of Both)

- **Card shadows** - Keep token, align utility
- **Hidden scrollbar** - Keep our class name, fix usages

---

*Next Action*: Run Phase 0 no-op fixes immediately, then proceed to Phase 1-2 in next sprint.
