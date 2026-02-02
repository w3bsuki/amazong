# Profile UX Plan — Phase 5/6

> **Status**: ✅ COMPLETE  
> **Last Updated**: 2025-02-02  
> **Context**: Profile-first mobile UX overhaul

---

## 🎯 Design Reference: Tradesphere Profile

**Source**: `temp-tradesphere-audit/src/pages/Profile.tsx`

### Key Pattern: shadcn Tabs as Segmented Control

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
  <TabsList className="w-full grid grid-cols-4 bg-muted">
    <TabsTrigger value="listings" className="text-xs">
      <Package className="w-4 h-4 mr-1" />
      Listings
    </TabsTrigger>
    <TabsTrigger value="reviews" className="text-xs">
      <Star className="w-4 h-4 mr-1" />
      Reviews
    </TabsTrigger>
    <TabsTrigger value="followers" className="text-xs">
      <Users className="w-4 h-4 mr-1" />
      Followers
    </TabsTrigger>
    <TabsTrigger value="settings" className="text-xs">
      <Settings className="w-4 h-4 mr-1" />
      Settings
    </TabsTrigger>
  </TabsList>
  ...
</Tabs>
```

### Visual Structure (Tradesphere):
```
┌─────────────────────────────────────────────────┐
│ ← Profile                           [Share][⚙️] │ ← Header
├─────────────────────────────────────────────────┤
│ [Avatar 80x80]  Name ✓                          │
│                 @username                       │
│                 ⭐ 4.9 (156 reviews)            │
│                                                 │
│ Bio text here...                                │
│ 📍 Location   📅 Joined March 2019             │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │   24    │   187   │  1,243  │    89    │    │ │ ← Stats row
│ │ Listings│  Sold   │Followers│Following │    │ │    bg-muted rounded-xl
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ [  Edit Profile  ] [  Share Profile  ]          │ ← Action buttons
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ 📦Listings │ ⭐Reviews │ 👥Followers │ ⚙️Set │ │ ← TabsList (segmented)
│ └─────────────────────────────────────────────┘ │    grid grid-cols-4 bg-muted
├─────────────────────────────────────────────────┤
│                                                 │
│  [Tab Content - listings/reviews/followers/etc] │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Critical CSS Classes:
- `TabsList`: `w-full grid grid-cols-4 bg-muted` (creates segmented pill)
- `TabsTrigger`: `text-xs` with icon + label
- Stats: `grid grid-cols-4 gap-4 p-4 bg-muted rounded-xl`
- Action buttons: `flex gap-3 mt-4` with `rounded-xl` buttons

### Our Current Tabs vs Tradesphere:

**Tradesphere** (to match):
```tsx
// TabsList: bg-muted, rounded-md, p-1
// TabsTrigger: data-[state=active]:bg-background data-[state=active]:shadow-sm
```

**Ours** (current):
```tsx
// TabsList: bg-surface-subtle, rounded-full, p-1, border
// TabsTrigger: data-[state=active]:bg-primary (too bold for profile)
```

**Action**: May want to use different tab styling for profile page, or add variant prop.

---

## Core Architecture

```
/account     → Settings/Management hub (private)
/{username}  → Public profile view (viewing mode)
```

**Key Principle**: Profile = viewing, Account = managing

---

## Current State (Completed)

### Phase 1-4 Done:
- ✅ Bottom nav: "Account" → "Profile" with dynamic `/{username}` href
- ✅ New components: `components/shared/profile/`
  - `ProfileShell` - mobile-first layout
  - `ProfileStats` - horizontal stats row
  - `ProfileTabs` - sticky tab navigation
  - `ProfileSettingsPanel` - settings quick links
- ✅ Profile page refactored to use ProfileShell
- ✅ i18n translations (EN + BG)
- ✅ All semantic tokens (styles:gate passes)

### Files Modified:
- `components/mobile/mobile-tab-bar.tsx`
- `app/[locale]/[username]/profile-client.tsx`
- `messages/en.json` + `messages/bg.json`

### Files Created:
- `hooks/use-current-username.ts`
- `components/shared/profile/profile-shell.tsx`
- `components/shared/profile/profile-stats.tsx`
- `components/shared/profile/profile-tabs.tsx`
- `components/shared/profile/profile-settings-panel.tsx`
- `components/shared/profile/index.ts`

---

## Problem with Current Approach

The current implementation puts Settings tab inside Profile page, but:
1. Users need easy access to `/account` (the management hub)
2. Profile should be clean viewing experience
3. Current bottom nav takes user to profile but they can't easily get to account settings

---

## New Direction (Phase 5-6)

### Follow Tradesphere Pattern Exactly

**4-Tab Profile Structure** (Tradesphere-style):
1. **Listings** - User's active listings (Package icon)
2. **Reviews** - Reviews received (Star icon)
3. **Followers** - User's followers (Users icon)
4. **Settings** - Account settings (Settings/Gear icon)

### Key Differences from Current Implementation:

| Current (Wrong) | Tradesphere (Right) |
|-----------------|---------------------|
| Settings as separate tab content | Settings tab links to account features |
| Custom ProfileSettingsPanel | Standard settings list items |
| 3 tabs max | Always 4 tabs |
| Own components | shadcn Tabs with grid layout |

### Implementation:

1. **Profile Header** - Keep avatar, name, @username, verified badge, rating
2. **Stats Row** - `bg-muted rounded-xl` with 4 stats: Listings, Sold, Followers, Following
3. **Action Buttons** - Row: "Edit Profile" (primary) + "Share Profile" (muted)
4. **Segmented Tabs** - Full-width grid-cols-4 with icons

### Settings Tab Content (from Tradesphere):

```tsx
const settingsItems = [
  { icon: Bell, label: "Notifications", hasToggle: true },
  { icon: Shield, label: "Privacy & Security" },
  { icon: CreditCard, label: "Payment Methods" },
  { icon: Globe, label: "Language & Region" },
  { icon: Moon, label: "Dark Mode", hasToggle: true },
  { icon: HelpCircle, label: "Help & Support" },
  { icon: LogOut, label: "Log Out", danger: true },
];
```

Each item: Card with icon, label, description, and either ChevronRight or Switch.

---

## Implementation Tasks

### Phase 5: Profile Page Refactor (Match Tradesphere) ✅ COMPLETE
- [x] Replace ProfileSettingsPanel with Tradesphere-style settings list
- [x] Change to 4-tab layout: Listings | Reviews | Followers | Settings
- [x] Use `grid grid-cols-4 bg-muted` for TabsList
- [x] Add icons to each TabsTrigger
- [x] Action buttons: "Edit Profile" + "Share Profile" row with rounded-xl
- [x] ProfileStats: bg-muted rounded-xl pill style

### Phase 6: Account Integration ✅ COMPLETE
- [x] Settings tab items link to /account sub-pages
- [x] Logout works from Settings tab (via onSignOut prop)

---

## Component Structure

```
components/shared/profile/
├── profile-shell.tsx       ← Keep: Layout wrapper
├── profile-stats.tsx       ← Keep: Stats row (adjust to 4 stats)
├── profile-tabs.tsx        ← REFACTOR: Use shadcn Tabs directly with grid
├── profile-settings-panel.tsx ← REPLACE: Use Tradesphere settings list style
└── index.ts
```

### Tradesphere Settings Item Pattern:

```tsx
<button className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
    <Icon className="w-5 h-5 text-foreground" />
  </div>
  <div className="flex-1 text-left">
    <p className="font-medium text-foreground">{label}</p>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
  {hasToggle ? <Switch /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
</button>
```

---

## Verification Commands

```powershell
# After changes
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

# Test profile page
# Navigate to /{your-username} and verify:
# 1. 4-tab layout with icons
# 2. Settings tab shows Tradesphere-style list
# 3. Stats row has 4 items
```

---

## Notes for Next Chat

1. **Start by reading**: `.codex/PROFILE-UX-PLAN.md`
2. **Reference file**: `temp-tradesphere-audit/src/pages/Profile.tsx`
3. **Current components**: `components/shared/profile/`
4. **Translations**: `messages/en.json` + `messages/bg.json`
5. **Pre-existing test failures** (unrelated):
   - `proxy-middleware.test.ts` - 3 failures
   - `validations-auth.test.ts` - 1 failure
