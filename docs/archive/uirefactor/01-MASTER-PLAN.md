# UI/UX Refactor Master Plan

**Project:** Treido Platform  
**Target:** Production-Ready Mobile-First UI/UX  
**Date:** February 2026

---

## 🎯 Vision Statement

Transform Treido into a **social commerce platform** that feels like Instagram meets eBay—where browsing products feels like scrolling a social feed, listing items is as simple as posting a story, and AI assists every interaction.

---

## 🏗️ Architecture Principles

### 1. Mobile-First, Desktop Parity
- Design everything for 375px viewport first
- Scale up to tablet/desktop with consistent patterns
- Touch-first interactions translate to click on desktop

### 2. Drawer-Centric Navigation
- Drawers for complex interactions (categories, filters, AI search)
- Reduces visual clutter on mobile
- Creates app-like modal experience
- Allows deep functionality without page navigation

### 3. AI-First Interactions
- AI search as primary discovery mechanism
- Contextual AI suggestions throughout UX
- Conversational product discovery
- Smart auto-complete and recommendations

### 4. Social Commerce DNA
- Seller profiles are "stores" with personality
- Product discovery through seller feeds
- Social proof integrated everywhere
- Share-first design for virality

---

## 📱 Navigation Pattern Decision Matrix

| Pattern | Pros | Cons | Recommendation |
|---------|------|------|----------------|
| **Quick Pills (inline)** | Visible, quick tap | Takes space, shifts layout | Keep for subcategories only |
| **Category Circles** | Instagram-familiar, compact | Limited info | Primary nav for main categories |
| **Drawer Navigation** | Deep content, no layout shift | Extra tap required | Use for expansion/details |
| **Contextual Pills** | Context-aware | Adds visual noise | Remove in favor of drawer |

### ✅ Final Recommendation: Circle + Drawer Hybrid

**Pattern:**
1. Circles for main categories (top, Instagram-style)
2. Tap circle → Opens category drawer with subcategories
3. Drawer contains: AI search, subcategory pills, trending in category
4. No more contextual pills shifting layout

**Why this works:**
- Familiar pattern (Instagram stories)
- Clean landing page (no pill explosion)
- Deep functionality (drawer has room)
- Reduces cognitive load

---

## 📋 Phase Breakdown

### Phase 1: Foundation & Onboarding (Week 1-2)
- [ ] Remove account type from signup form
- [ ] Create post-signup onboarding flow
- [ ] Personal profile onboarding screens
- [ ] Business profile onboarding screens
- [ ] Username selection with change limitations

### Phase 2: Landing Page Transformation (Week 2-3)
- [ ] Replace horizontal product sections with seller sections
- [ ] Implement "Social Feed" view option
- [ ] Category circles with drawer expansion
- [ ] Remove inline contextual pills
- [ ] AI search prominence in header

### Phase 3: Navigation Overhaul (Week 3-4)
- [ ] Bottom navbar redesign: Home / Search / Sell / Chat / Profile
- [ ] Search tab opens unified search drawer
- [ ] Category drawer with AI integration
- [ ] Seller discovery drawer

### Phase 4: Business Features (Week 4-5)
- [ ] Shopify-like seller dashboard
- [ ] CSV product export
- [ ] Bulk product management
- [ ] Analytics dashboard
- [ ] Advanced profile settings

### Phase 5: AI Integration (Week 5-6)
- [ ] AI search in all drawers
- [ ] Conversational product discovery
- [ ] Smart listing assistant
- [ ] Price suggestion AI
- [ ] Description generator

### Phase 6: Polish & Desktop Parity (Week 6-7)
- [ ] Animation refinements (Framer Motion)
- [ ] Desktop layout optimization
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Final QA

---

## 🎨 Design Tokens to Establish

### Bottom Navbar Icons
```
Home     = house-chimney-fill (warmth)
Search   = magnifying-glass-sparkle (AI hint)
Sell     = plus-circle (action)
Chat     = message-bubble
Profile  = user-circle
```

### Key Interactions
- All drawers: use existing Vaul drawer animations
- Category circles: use existing button/tap states
- AI suggestions: use existing loading patterns
- Loading states: skeleton (use existing patterns)

---

## 🔍 Current State Assessment

### What Works Well ✅
- Quick pills for quick filtering
- Product card design
- Mobile product page tabs
- Drawer patterns exist
- Search functionality

### What Needs Improvement ❌
- Onboarding in wrong place
- Horizontal sections feel dated
- Bottom navbar labels unclear
- AI search hidden
- Category navigation cluttered
- No social feed feel

---

## 📊 Success Metrics

1. **Time to first product view:** < 3 seconds
2. **Signup to first listing:** < 5 minutes
3. **Category drill-down taps:** ≤ 2 taps
4. **AI search usage:** > 30% of searches
5. **Mobile bounce rate:** < 40%

---

## 📁 Related Documents

- [00-ORIGINAL-PROMPT.md](./00-ORIGINAL-PROMPT.md) - Original requirements
- [02-ONBOARDING-FLOW.md](./02-ONBOARDING-FLOW.md) - Detailed onboarding
- [03-LANDING-PAGE.md](./03-LANDING-PAGE.md) - Landing page specs
- [04-NAVIGATION.md](./04-NAVIGATION.md) - Navigation patterns
- [05-BUSINESS-FEATURES.md](./05-BUSINESS-FEATURES.md) - Business tier features
- [06-COMPONENTS.md](./06-COMPONENTS.md) - Component inventory
