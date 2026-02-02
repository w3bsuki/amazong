# UI/UX Refactor Documentation

**Status:** Planning Phase  
**Created:** February 2026  
**Goal:** Production-ready mobile-first social commerce platform

---

## ⚠️ Important: Target vs Current State

These docs describe **TARGET state** (what we're building), not always current behavior.

**Features that require code changes to match docs:**
| Feature | Current Behavior | Target Behavior |
|---------|-----------------|-----------------|
| Username changes | 14-day cooldown | 1 free change, premium unlimited |
| Business → Personal | Self-serve downgrade | Requires support |
| Dashboard access | Premium only | Freemium (basic free, advanced premium) |
| Views tracking | Approximated | Real daily aggregates |

---

## 📁 Document Index

| Document | Description |
|----------|-------------|
| [00-ORIGINAL-PROMPT.md](./00-ORIGINAL-PROMPT.md) | Original requirements and user's vision |
| [01-MASTER-PLAN.md](./01-MASTER-PLAN.md) | High-level plan, phases, and decision matrix |
| [02-ONBOARDING-FLOW.md](./02-ONBOARDING-FLOW.md) | Post-signup onboarding screens |
| [03-LANDING-PAGE.md](./03-LANDING-PAGE.md) | Social feed transformation |
| [04-NAVIGATION.md](./04-NAVIGATION.md) | Bottom nav and drawer patterns |
| [05-BUSINESS-FEATURES.md](./05-BUSINESS-FEATURES.md) | Shopify-like business dashboard |
| [06-COMPONENTS.md](./06-COMPONENTS.md) | Component inventory and architecture |
| [07-CODEX-REVIEW.md](./07-CODEX-REVIEW.md) | Codex MCP feedback (iteration #1) |
| [08-DECISIONS.md](./08-DECISIONS.md) | **🔒 Locked UI/UX decisions** |
| [09-FEATURES.md](./09-FEATURES.md) | Current features inventory |
| [10-ARCHITECTURE.md](./10-ARCHITECTURE.md) | Technical architecture reference |
| [11-PLANS.md](./11-PLANS.md) | **📅 Week-by-week implementation plan** |
| [12-CODEX-REVIEW-2.md](./12-CODEX-REVIEW-2.md) | **⚠️ Iteration #2 issues** |

---

## 🎯 Quick Summary

### What We're Building
- **Product-first grid** (default view, seller feed optional)
- **AI-first search** (integrated in main search bar)
- **Drawer-centric navigation** (category circles open drawers)
- **Post-signup onboarding** (account type selection moved)
- **Business dashboard** (freemium - basic free, advanced premium)

### Key Decisions Made
1. **Grid view** is default (product-first e-commerce)
2. **Circle → Drawer** pattern for categories
3. **Bottom nav:** Home / Search / Sell / Chat / Profile
4. **Onboarding** modal after signup (not separate routes)
5. **Business is free**, dashboard premium features locked
6. **AI search** integrated in main search bar
7. **URL-driven drawers** for shareability

### Timeline
- Week 1-2: Onboarding flow
- Week 2-3: Navigation overhaul  
- Week 3-4: Business dashboard start
- Week 4-5: Dashboard features
- Week 5-6: Polish & desktop parity
- Week 7: Buffer/QA

---

## 🔄 How to Use This Folder

1. **Planning:** Review and update these docs before implementing
2. **Implementation:** Reference specs while building
3. **Review:** Check against specs during PR review
4. **Iteration:** Update docs if plans change

---

## ✅ Next Steps

1. [ ] Review all documents with team
2. [ ] Validate with Codex MCP for technical feasibility
3. [ ] Create Figma mockups for key screens
4. [ ] Begin Phase 1 implementation
5. [ ] Set up A/B testing for feed vs grid

---

## 📝 Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-01 | Initial planning docs created | Claude |
