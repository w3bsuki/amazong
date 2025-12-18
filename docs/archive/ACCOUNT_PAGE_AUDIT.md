# Account Page UX/UI Audit & Improvement Plan

## ✅ IMPLEMENTED - Modern App-Style Design

### Mobile Design (< 1024px)

**New Design Features:**
- **Trust-blue gradient profile card** - Uses `--color-cta-trust-blue` tokens
- **4-column app-style grid** - Similar to iOS/Android settings
- **Colorful category icons** - Each section has its own color
- **Touch-friendly 44px+ tap targets** - WCAG compliant
- **Active state feedback** - `active:scale-95` for tactile response
- **Clean centered header** - Title + back button
- **No animations** - Instant, responsive interactions

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│  ← Account                          │  ← Clean header
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔵 Trust-Blue Gradient Card     │ │
│ │    [Avatar] email@example.com   │ │
│ │             Personal Account    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │  📦  │ │  ❤️  │ │  💬  │ │  📍  ││  ← 4-col grid
│ │Orders│ │Wish  │ │Msgs  │ │Addr  ││
│ └──────┘ └──────┘ └──────┘ └──────┘│
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │  💳  │ │  🔒  │ │  🏪  │ │  👑  ││
│ │Pay   │ │Secure│ │Sell  │ │Plans ││
│ └──────┘ └──────┘ └──────┘ └──────┘│
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ⚙️  Help & Support           > │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│        [ Sign Out ]                 │
└─────────────────────────────────────┘
```

### Desktop Design (≥ 1024px)

- Sidebar navigation with active states
- Compact 2-4 column card grid
- Colorful icons matching mobile
- Clean header with user info

### Color System (per category)
- Orders: `bg-blue-500/10 text-blue-600`
- Wishlist: `bg-pink-500/10 text-pink-600`
- Messages: `bg-green-500/10 text-green-600`
- Addresses: `bg-orange-500/10 text-orange-600`
- Payments: `bg-purple-500/10 text-purple-600`
- Security: `bg-slate-500/10 text-slate-600`
- Selling: `bg-teal-500/10 text-teal-600`
- Plans: `bg-amber-500/10 text-amber-600`

### Tailwind v4 Tokens Used
- `from-cta-trust-blue` / `to-cta-trust-blue-hover` for gradient
- `bg-card`, `border-border` for cards
- `text-foreground`, `text-muted-foreground` for text
- `rounded-xl` for modern rounded corners
- `active:scale-95` for touch feedback
