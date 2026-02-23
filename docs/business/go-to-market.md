# Go-to-Market Strategy — Treido

> How Treido launches, grows, and acquires users.
> This doc owns launch strategy, phasing, channels, and expansion.

---

## Launch Market

**Primary:** Bulgaria (BG)
**Why:** Home market, local knowledge, lower competition quality (OLX/Bazar are outdated), Bulgarian + English support built in.

**Expansion path:** Bulgaria → Romania → Greece → broader EU (V2+)

---

## Launch Phases

### Phase 0: Pre-Launch (Current)

**Goal:** Product ready, no public users yet.

- [ ] All V1 launch criteria met (see PRD.md)
- [ ] 4 launch blockers resolved (Stripe idempotency, refund flow, env separation, password protection)
- [ ] Broken areas fixed (search, sell flow, account settings)
- [ ] Test listings seeded with real-looking data
- [ ] Landing page / coming soon at treido.eu
- [ ] Legal: Terms of Service, Privacy Policy published

### Phase 1: Closed Beta

**Goal:** Validate core flows with real users. Fix what breaks.

- **Size:** 20-50 users (friends, family, local community)
- **Duration:** **[DECISION NEEDED]** (suggestion: 2-4 weeks)
- **Focus:** Does the buy/sell flow work end-to-end? What confuses people?
- **Channels:** Direct invite, personal networks
- **Success criteria:**
  - [ ] 10+ real transactions completed
  - [ ] Seller can list → buyer can buy → payout works
  - [ ] No critical bugs (payments, auth, data loss)
  - [ ] NPS or verbal feedback collected

### Phase 2: Open Beta

**Goal:** Grow user base organically. Test acquisition channels.

- **Size:** 200-1000 users
- **Duration:** **[DECISION NEEDED]** (suggestion: 1-3 months)
- **Focus:** Retention, listing quality, transaction volume
- **Channels:**
  - Social media (Instagram, Facebook groups — BG marketplace communities)
  - Word of mouth from beta users
  - Local SEO (treido.eu ranking for "продавам онлайн", "купи онлайн")
  - **[DECISION NEEDED]** Paid ads budget?
- **Success criteria:**
  - [ ] 100+ active listings
  - [ ] 50+ transactions
  - [ ] Repeat buyers/sellers
  - [ ] First paying subscribers (Pro tier)

### Phase 3: Public Launch

**Goal:** Treido is live for Bulgaria. Growth mode.

- Full marketing push
- PR / press coverage (Bulgarian tech media)
- Influencer partnerships (Bulgarian Instagram/TikTok sellers)
- SEO optimization for Bulgarian marketplace keywords
- Referral program (if built)

### Phase 4: Expansion (V2+)

- Romania market (add RON currency, Romanian language)
- Greece market (add Greek language)
- Multi-country Stripe Connect
- Localized marketing per market

---

## User Acquisition Channels

| Channel | Cost | Effort | Expected Impact | Phase |
|---------|------|--------|----------------|-------|
| Personal network | Free | Low | 20-50 users | Beta |
| BG Facebook groups | Free | Medium | 100-500 users | Open Beta |
| Instagram content | Free | High | Brand awareness | Open Beta+ |
| Google Ads (BG) | **[DECISION NEEDED]** | Medium | Direct acquisition | Public Launch |
| Facebook/Insta Ads | **[DECISION NEEDED]** | Medium | Direct acquisition | Public Launch |
| SEO | Free | High (time) | Long-term organic | All phases |
| Referral program | Cost per referral | Medium (dev) | Viral growth | Public Launch |
| Press / tech blogs | Free | Medium | Awareness spike | Public Launch |

---

## Messaging & Positioning

### Headline

**"Sell anything. Get paid securely."**
(Alternative: "The marketplace that actually pays you." / "Buy and sell with real payments.")

### Key Messages

| Audience | Message |
|----------|---------|
| Casual sellers | "List it in 2 minutes. Get paid to your card. No cash, no flakes." |
| Small businesses | "Your online store, without the Shopify price tag." |
| Buyers | "Shop from real sellers. Pay with your card. Protected." |

### What We're NOT

- Not another OLX (no payments, no trust)
- Not another Vinted (clothing-only, peer-to-peer only)
- Not Shopify (we're a marketplace, not a standalone store builder)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Empty marketplace (no listings) | Buyers leave | Seed listings, incentivize first sellers, personal outreach |
| No buyers (low traffic) | Sellers leave | SEO, social, ads. Focus on BG local first. |
| OLX/Bazar copy our model | Competition | Move fast, UX quality moat, card payments are hard to retrofit |
| Payment trust issues | Low conversion | Stripe branding, buyer protection messaging, reviews |

---

*Last updated: 2026-02-23*
*Status: Skeleton — needs launch timeline decisions*
