# Navigation Patterns Specification

**Phase 3 Priority**  
**Goal:** App-like navigation that feels native and intuitive

---

## Bottom Navigation Bar

### Current State
```
┌─────────────────────────────────────┐
│ 🏠      📝       ➕      💬      👤 │
│Начало  Обяви   [Add]   Чат   Профил│
└─────────────────────────────────────┘
```

**Issues:**
- "Обяви" is unclear (Listings? Browse? Search?)
- Inconsistent mental model
- Missing clear "buy" vs "sell" separation

### New Design
```
┌─────────────────────────────────────┐
│ 🏠      🔍       ➕      💬      👤 │
│Home   Search   Sell    Chat  Profile│
└─────────────────────────────────────┘
```

**Or Alternative (with Sellers focus):**
```
┌─────────────────────────────────────┐
│ 🏠      🔍       ➕      🏪      👤 │
│Home   Search   Sell   Sellers Profile│
└─────────────────────────────────────┘
```

---

## Navigation Item Specifications

### 1. Home (🏠)
- **Action:** Navigate to landing page
- **State:** Filled icon when active
- **Badge:** Number of new items since last visit (optional)

### 2. Search (🔍)
- **Action:** Opens unified search drawer
- **State:** Active indicator when AI is processing
- **This replaces "Обяви"

### 3. Sell (➕)
- **Action:** Opens listing creation flow
- **State:** Always prominent (brand color background)
- **Position:** Center, slightly elevated
- **Style:** Circular, stands out

### 4. Chat (💬)
- **Action:** Navigate to messages
- **State:** Badge with unread count
- **Alternative:** Could be under Profile

### 5. Profile (👤)
- **Action:** Navigate to user profile/settings
- **State:** Shows user avatar when logged in
- **Alternative:** Includes sellers if no dedicated tab

---

## Search Drawer Deep Dive

When user taps Search in bottom nav:

```
┌─────────────────────────────────────┐
│ ═══════════ (drag handle)           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔍 🤖 Search anything...        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🤖 Ask AI                       │ │
│ │ "Find me a vintage leather..."  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Categories                          │
│ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │ 👗   │ │ 📱   │ │ 🏠   │         │
│ │Fashion│ │ Tech │ │ Home │         │
│ └──────┘ └──────┘ └──────┘         │
│ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │ 💄   │ │ 🎮   │ │ 🚗   │         │
│ │Beauty│ │Gaming│ │ Auto │         │
│ └──────┘ └──────┘ └──────┘         │
│                                     │
│ Recent Searches                     │
│ 🕐 iPhone 15 Pro                    │
│ 🕐 vintage dress                    │
│ 🕐 gaming chair                     │
│                                     │
│ Trending Now 🔥                     │
│ • Air Jordan 1                      │
│ • PS5 Slim                          │
│ • Winter jacket                     │
│                                     │
└─────────────────────────────────────┘
```

### AI Search Mode

When user taps "Ask AI":

```
┌─────────────────────────────────────┐
│ ✕ Cancel                            │
│                                     │
│ 🤖 AI Shopping Assistant            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌───────────────────────────┐   │ │
│ │ │ User: Find me a birthday  │   │ │
│ │ │ gift for my mom under €50 │   │ │
│ │ └───────────────────────────┘   │ │
│ │                                 │ │
│ │ ┌───────────────────────────┐   │ │
│ │ │ 🤖 AI: I found some great │   │ │
│ │ │ options! Here's what I    │   │ │
│ │ │ recommend:                │   │ │
│ │ └───────────────────────────┘   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌────┐ ┌────┐ ┌────┐               │
│ │PROD│ │PROD│ │PROD│ AI-picked     │
│ └────┘ └────┘ └────┘               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Type a message...          Send │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Drawer Pattern Standards

### Drawer Sizes
- **Small:** 40% screen height (quick actions)
- **Medium:** 60% screen height (search, filters)
- **Large:** 90% screen height (AI chat, full forms)

### Drawer Behavior
```typescript
interface DrawerConfig {
  size: 'sm' | 'md' | 'lg';
  dismissible: boolean;      // Can swipe down to close
  hasBackdrop: boolean;      // Darkens background
  snapPoints?: number[];     // Optional snap heights
  initialSnap?: number;      // Starting height
}
```

### Animation Specs
- **Open:** 300ms ease-out, slide from bottom
- **Close:** 250ms ease-in, slide to bottom
- **Backdrop:** 200ms fade
- **Snap:** 150ms spring

---

## Category Circles → Drawer Flow

```
User Flow:
1. User sees category circles (Fashion, Tech, etc.)
2. User taps "Fashion"
3. Drawer opens (medium size)
4. Drawer shows:
   - Search within Fashion
   - Subcategories (Clothes, Shoes, Bags...)
   - Trending in Fashion
   - Top Fashion sellers
```

### Why Drawer > Inline Pills

| Aspect | Inline Pills | Drawer |
|--------|--------------|--------|
| Layout shift | Yes, pushes content | None |
| Available space | Limited | Unlimited |
| Can include | Just pills | Search, sellers, trending |
| Feels like | Web circa 2018 | Native app 2026 |
| Tap count | 1 tap to subcategory | 2 taps to subcategory |

**Note:** Drawer adds one tap for subcategories, but trade-off is worth it for cleaner UI and more functionality per drawer.

---

## Deep Link Support

### Routes → Drawer Mapping
```
/search → Opens search drawer
/search?q=iphone → Opens drawer with query
/category/fashion → Opens fashion drawer
/sell → Opens listing drawer
```

---

## Gesture Support

### Bottom Nav
- Swipe up on Search → Opens search drawer
- Swipe up on Home → Scroll to top
- Long press Sell → Quick listing options

### Drawers
- Swipe down → Close/minimize
- Swipe up → Expand to full
- Tap backdrop → Close

### Feed
- Pull down → Refresh
- Swipe left on seller card → Quick hide
- Swipe right → Quick save

---

## Navigation State Management

```typescript
// Use existing drawer API from components/providers/drawer-context.tsx
// Drawers have specific open methods:
// - openProductQuickView(productId)
// - openCart()
// - openCategoryBrowse(category?)
// - openSearch()
// etc.

interface NavigationState {
  activeTab: 'home' | 'search' | 'sell' | 'chat' | 'profile';
  previousRoute: string;
  scrollPosition: Record<string, number>;
}
```

### Persistence
- Active tab → URL + localStorage
- Drawer state → In-memory (closes on navigate)
- Scroll → In-memory per session

---

## Desktop Adaptation

On desktop (>1024px), bottom nav becomes:

```
┌──────────────────────────────────────────────────────────┐
│ treido.  [🔍 Search...]  [Categories▼]  [Sell]  👤 John  │
└──────────────────────────────────────────────────────────┘
```

- Search moves to header
- Categories become dropdown
- Sell button in header
- Profile in header
- Bottom nav hidden

---

## Edge Cases

### 1. Deep drawer navigation
User opens: Category → Subcategory → Filter
- Drawer shows breadcrumb
- Back button returns to previous drawer state
- Close (X) dismisses entire stack

### 2. Interrupted flows
- User opens sell drawer
- User gets notification
- Sell drawer preserves state
- User can return

### 3. Offline
- Show cached categories
- "You're offline" banner in drawer
- Disable AI features
- Allow browsing saved items

---

## Accessibility

### Bottom Nav
- Proper roles: navigation, link
- aria-current for active tab
- Focus visible states
- Minimum 44px touch targets

### Drawers
- Focus trap when open
- Escape to close
- aria-modal="true"
- Announce content on open

---

## Migration Plan

### Phase 3a: Bottom Nav Relabel
- Change "Обяви" → "Search" 
- Keep same functionality temporarily
- Measure user behavior

### Phase 3b: Search Drawer
- Implement unified search drawer
- Connect to Search tab
- Add AI chat option

### Phase 3c: Category Drawer
- Migrate category circles to open drawer
- Remove inline contextual pills
- Add subcategories + trending

### Phase 3d: Full Integration
- Connect all navigation
- Test deep links
- Polish animations
