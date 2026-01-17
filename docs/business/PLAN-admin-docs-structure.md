# PLAN: /admin/docs — Пълна бизнес документация за Treido.eu

**Създаден:** 2026-01-17  
**Статус:** 🚀 Активен план за изпълнение  
**Цел:** Превръщане на `/admin/docs` в централизирана система за бизнес документация

---

## 🎯 Визия

Treido.eu стартира като **OLX/Bazar.bg конкурент** в България. Преди да изградим пълноценен marketplace (V2), трябва да имаме перфектно организирана вътрешна документация, която покрива:

- **Roadmap** (V1 → V2 → V3)
- **Monetization model** (какво продаваме и как печелим)
- **Plans & Pricing** (абонаменти и boost пакети)
- **Policies** (Terms, Privacy, Seller Guidelines, etc.)
- **Operations** (moderation, support flows, compliance)

---

## 📊 Текущо състояние

### Какво имаме (`docs/` folder):
- ✅ `roadmap/v1.md` — V1 scope (classifieds + boosts)
- ✅ `roadmap/v2.md` — V2 scope (Stripe Connect + card payments)
- ✅ `business/model.md` — Monetization model (добър фундамент)
- ✅ `business/plans.md` — Plans & perks (Free/Premium/Pro/Business)

### Какво липсва:
- ❌ V3 roadmap (scale & expansion)
- ❌ Детайлен Bulgarian market research
- ❌ Boost pricing с BGN + конкурентен анализ
- ❌ Legal policies (Terms of Service, Privacy Policy, Seller Agreement)
- ❌ Moderation & Trust guidelines
- ❌ Support & Operations playbook
- ❌ Compliance checklist (GDPR, Bulgarian e-commerce law)

### `/admin/docs` route:
- ✅ UI готов (CRUD за документи в Supabase `admin_docs` table)
- ✅ Категории: policies, payments, plans, roadmap, guides, general
- ❌ Няма seed data — таблицата е празна

---

## 🔥 Фази на изпълнение

### Phase 1: Roadmap документация (V1 → V2 → V3)

**Цел:** Перфектна яснота за екипа и инвеститори какво правим и кога.

#### 1.1 Обогатяване на V1 roadmap
- [ ] Добавяне на конкретни milestones с дати
- [ ] Launch checklist (какво ТРЯБВА да работи преди публичен launch)
- [ ] Metrics за успех (listings created, messages sent, boost attach rate)

#### 1.2 Обогатяване на V2 roadmap  
- [ ] Prerequisites за Stripe Connect (LLC регистрация, банкова сметка)
- [ ] Timeline estimate за V2 (реалистичен, с buffer)
- [ ] V2 launch gates (какво трябва да е готово)

#### 1.3 Създаване на V3 roadmap (нов документ)
**V3 = Scale & Expansion**
- [ ] Multi-country expansion (Румъния, Сърбия, Гърция?)
- [ ] Mobile app (iOS/Android)
- [ ] Advanced seller tools (inventory sync, multi-channel)
- [ ] AI features (auto-pricing, fraud detection)
- [ ] Shipping integrations (Speedy, Econt API)

#### 1.4 Bulgarian Market Research (НОВА СЕКЦИЯ)
> 🤖 **SUBAGENT TASK:** Research + Web Fetch
> 
> Задача за subagent:
> - Fetch OLX.bg pricing page
> - Fetch Bazar.bg pricing/boosts page
> - Събери информация за пазарни цени на boosts в България
> - Потърси статистики за e-commerce в България (брой онлайн продавачи, GMV, etc.)
> - Проучи Bulgarian e-commerce regulations (Закон за електронната търговия)

**Output:** `docs/research/bulgarian-market-2026.md`

---

### Phase 2: Monetization Model (V1-focused)

**Цел:** Ясен и печеливш бизнес модел за classifieds-first V1.

#### 2.1 Boost Pricing Analysis
- [ ] Конкурентен анализ на OLX.bg boost цени
- [ ] Конкурентен анализ на Bazar.bg boost цени
- [ ] Определяне на Treido boost pricing (по-ниско от конкуренцията за market entry)

**Предложена boost структура за V1:**

| Продукт | Времетраене | Цена (BGN) | Цена (EUR) | Бележки |
|---------|-------------|------------|------------|---------|
| Boost (Standard) | 24ч | 1.49 BGN | ~€0.75 | Entry-level, test market |
| Boost (Week) | 7 дни | 7.99 BGN | ~€4.00 | Most popular (expected) |
| Boost (Month) | 30 дни | 24.99 BGN | ~€12.50 | Power sellers |
| Urgent Badge | 3 дни | 0.99 BGN | ~€0.50 | Cosmetic, high margin |
| Top in Category | 24ч | 2.99 BGN | ~€1.50 | Limited inventory |
| Homepage Featured | 24ч | 5.99 BGN | ~€3.00 | Premium placement |

> 🤖 **ULTRATHINK NOTE:** Цените трябва да са ~20-30% по-ниски от OLX.bg за привличане на потребители. След като изградим user base, можем да вдигаме постепенно.

#### 2.2 Free Account Limits (критично за V1)
- [ ] Определяне на max active listings за Free план
- [ ] Rate limits за listing creation (anti-spam)
- [ ] Photo limits per listing

**Предложение:**

| Тип акаунт | Active Listings | Photos/listing | Listing duration |
|------------|-----------------|----------------|------------------|
| Free | 20 | 8 | 30 дни (auto-expire) |
| Premium | 100 | 15 | 60 дни |
| Pro | 500 | 20 | 90 дни |
| Business | 2000+ | 30 | Unlimited |

#### 2.3 Update Plans Document
- [ ] Преразглеждане на `docs/business/plans.md` с новите цени
- [ ] Добавяне на feature comparison table
- [ ] Добавяне на FAQ секция

---

### Phase 3: Plans & Subscription Details

**Цел:** Finalize plan offerings и sync с Stripe Products.

#### 3.1 Plan Pricing Review (BGN-first)

**Personal Plans:**

| Plan | Месечна цена | Годишна цена | Savings |
|------|--------------|--------------|---------|
| Free | 0 BGN | 0 BGN | — |
| Premium | 9.99 BGN | 99.90 BGN | 17% |
| Pro | 19.99 BGN | 199.90 BGN | 17% |

**Business Plans:**

| Plan | Месечна цена | Годишна цена | Savings |
|------|--------------|--------------|---------|
| Business Starter | 49.99 BGN | 499.90 BGN | 17% |
| Business Pro | 99.99 BGN | 999.90 BGN | 17% |
| Business Enterprise | Custom | Custom | Negotiated |

#### 3.2 Feature Matrix (детайлен)
- [ ] Създаване на feature comparison matrix
- [ ] Mapping features към Stripe metadata
- [ ] Integration с `subscription_plans` table

#### 3.3 Stripe Sync
- [ ] Verify Stripe products match our plan catalog
- [ ] Update price IDs в environment variables
- [ ] Test subscription flow end-to-end

---

### Phase 4: Legal Policies (КРИТИЧНО за launch)

**Цел:** Пълен комплект legal документи на BG и EN.

#### 4.1 Terms of Service
- [ ] Общи условия за ползване (БГ)
- [ ] Terms of Service (EN)
- [ ] Acceptable Use Policy

#### 4.2 Privacy Policy
- [ ] Политика за поверителност (БГ) — GDPR compliant
- [ ] Privacy Policy (EN)
- [ ] Cookie Policy

#### 4.3 Seller Agreement
- [ ] Договор за продавачи (БГ)
- [ ] Seller Terms (EN)
- [ ] Prohibited Items List

#### 4.4 Buyer Protection (подготовка за V2)
- [ ] Draft на Buyer Protection policy
- [ ] Refund Policy outline
- [ ] Dispute Resolution process

> 🤖 **SUBAGENT TASK:** Legal Research
>
> Задача:
> - Fetch OLX.bg Terms of Service за reference
> - Fetch Bazar.bg Общи условия
> - Проучи изисквания на Закон за защита на потребителите
> - Проучи GDPR изисквания за Bulgarian e-commerce

---

### Phase 5: Operations & Moderation

**Цел:** Готовност за scale с ясни процеси.

#### 5.1 Moderation Guidelines
- [ ] Content moderation rules
- [ ] Prohibited listings criteria
- [ ] User reporting workflow
- [ ] Ban/suspension policy

#### 5.2 Support Playbook
- [ ] Tier 1 support scripts
- [ ] Escalation paths
- [ ] Response time SLAs

#### 5.3 Trust & Safety
- [ ] Fraud detection patterns
- [ ] Scam prevention guidelines
- [ ] User verification levels

---

### Phase 6: Compliance & Launch Checklist

**Цел:** Всичко необходимо за legal launch.

#### 6.1 Bulgarian E-commerce Compliance
- [ ] Регистрация на домейн (treido.eu ✅)
- [ ] GDPR compliance audit
- [ ] Закон за електронната търговия compliance
- [ ] Cookie consent implementation

#### 6.2 Technical Launch Gates
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Backup & recovery tested
- [ ] Monitoring & alerting setup

#### 6.3 Business Launch Gates
- [ ] Stripe account verified
- [ ] Support channels ready (email, chat?)
- [ ] Social media presence
- [ ] Initial marketing plan

---

## 📁 Предложена структура на `/admin/docs`

### Категории и документи:

```
📂 roadmap/
├── V1 Roadmap — Classifieds + Boosts (Launch)
├── V2 Roadmap — Card Payments + Stripe Connect
├── V3 Roadmap — Scale & Expansion
└── Bulgarian Market Research

📂 plans/
├── Plan Catalog — Personal & Business Plans
├── Boost Pricing — Visibility Products
├── Feature Matrix — What Each Plan Includes
└── Stripe Integration Guide

📂 policies/
├── Terms of Service (BG)
├── Terms of Service (EN)
├── Privacy Policy (BG)
├── Privacy Policy (EN)
├── Cookie Policy
├── Seller Agreement
├── Buyer Protection (V2 prep)
├── Prohibited Items List
└── Refund Policy

📂 payments/
├── Payment Methods (V1 — Boosts only)
├── V2 Checkout Flow (draft)
├── Payout Schedule (V2)
└── Fee Structure

📂 guides/
├── Seller Onboarding Guide
├── Buyer Guide
├── Boost Best Practices
├── Photo Tips for Listings
└── Pricing Your Items

📂 operations/
├── Moderation Guidelines
├── Support Playbook
├── Trust & Safety Rules
├── Escalation Matrix
└── User Verification Levels

📂 compliance/
├── GDPR Compliance Checklist
├── Bulgarian E-commerce Law
├── Cookie Consent Requirements
└── Data Retention Policy
```

---

## 🚀 Execution Order (Препоръчителен)

### Sprint 1 (Immediate — this week) ✅ COMPLETED
1. ✅ Създай този PLAN документ
2. ✅ Създай V3 roadmap (`docs/roadmap/v3.md`)
3. ✅ Bulgarian market research (`docs/research/bulgarian-market-2026.md`)
4. ✅ Finalize boost pricing

### Sprint 2 (Week 2) ✅ COMPLETED
5. ✅ Update `docs/business/plans.md` с final pricing (EUR, competitive)
6. ✅ Create feature matrix (in plans.md)
7. ✅ Draft Terms of Service (BG) (`docs/policies/terms-of-service-bg.md`)
8. ✅ Draft Privacy Policy (BG) (`docs/policies/privacy-policy-bg.md`)

### Sprint 3 (Week 3) ✅ COMPLETED
9. ✅ Complete all legal policies
   - Terms of Service (BG + EN)
   - Privacy Policy (BG + EN)
   - Cookie Policy
   - Seller Agreement
   - Prohibited Items List
10. ✅ Create Seller Agreement (`docs/policies/seller-agreement.md`)
11. ✅ Moderation guidelines (`docs/operations/moderation-guidelines.md`)
12. ✅ Support playbook basics (`docs/operations/support-playbook.md`)
13. ✅ GDPR Compliance Checklist (`docs/compliance/gdpr-checklist.md`)

### Sprint 4 (Pre-launch) — NEXT
14. [ ] Seed `/admin/docs` database with all content
15. [ ] Compliance audit (implement checklist items)
16. [ ] Launch checklist verification
17. [ ] Final review

---

## 🤖 Subagent Tasks (за референция)

### Task 1: Bulgarian Market Research
```
Проучи:
1. OLX.bg boost/promotion pricing (fetch website)
2. Bazar.bg boost pricing (fetch website)
3. Bulgarian e-commerce statistics (2024-2025)
4. Competitor analysis (market share, user base)
5. Bulgarian e-commerce regulations summary
Output: docs/research/bulgarian-market-2026.md
```

### Task 2: Legal Templates Research
```
Проучи:
1. OLX.bg Terms of Service structure
2. Bazar.bg Общи условия
3. GDPR requirements for Bulgarian websites
4. Standard marketplace Terms of Service patterns
Output: Analysis + template recommendations
```

### Task 3: Pricing Optimization
```
Анализирай:
1. Competitor pricing for each boost type
2. Recommended Treido pricing (market entry strategy)
3. Price elasticity considerations
4. Upsell/cross-sell opportunities
Output: Pricing recommendation document
```

---

## 📝 Notes за бъдещо изпълнение

1. **ULTRATHINK при pricing:** Цените трябва да привличат потребители от OLX/Bazar, но да осигуряват margin. Target: 20-30% по-ниски цени от конкуренцията.

2. **V2 timeline:** Реалистичен estimate е 3-6 месеца след V1 launch, зависи от:
   - LLC регистрация
   - Stripe Connect approval
   - User base growth

3. **Legal priority:** Terms of Service и Privacy Policy са БЛОКЕРИ за launch. Трябва да са готови преди public release.

4. **Iteration mindset:** Започни с MVP документация, итерирай базирано на feedback.

---

## ✅ Success Metrics

- [ ] All `/admin/docs` categories populated
- [ ] All legal policies approved (lawyer review if budget allows)
- [ ] Stripe products match plan catalog
- [ ] Team can find any operational doc in < 30 seconds
- [ ] V1 launch happens without legal blockers

---

**Next action:** Създай V3 roadmap и стартирай Bulgarian market research.
