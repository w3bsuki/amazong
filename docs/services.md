# 🔨 Services | Услуги

**Category Slug:** `services`  
**Icon:** 🔨  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Services → Home Services → Plumbing |
| **Attributes** | Filtering, Search, Campaigns | Location, Experience, Rating, Price Range |
| **Tags** | Dynamic Collections & SEO | "24-hour", "licensed", "free-estimate" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🔨 Services (L0)
│
├── 🏠 Home Services (L1)
│   ├── Plumbing (L2)
│   ├── Electrical (L2)
│   ├── HVAC (L2)
│   ├── Painting (L2)
│   ├── Cleaning (L2)
│   ├── Landscaping (L2)
│   ├── Roofing (L2)
│   ├── Flooring (L2)
│   └── General Handyman (L2)
│
├── 🚗 Automotive Services (L1)
│   ├── Auto Repair (L2)
│   ├── Body Work (L2)
│   ├── Towing (L2)
│   ├── Detailing (L2)
│   ├── Tire Services (L2)
│   └── Mobile Mechanics (L2)
│
├── 💼 Professional Services (L1)
│   ├── Legal Services (L2)
│   ├── Accounting (L2)
│   ├── Consulting (L2)
│   ├── Translation (L2)
│   ├── Notary (L2)
│   └── Insurance (L2)
│
├── 💻 IT & Tech Services (L1)
│   ├── Computer Repair (L2)
│   ├── Phone Repair (L2)
│   ├── Web Development (L2)
│   ├── Software Development (L2)
│   ├── IT Support (L2)
│   └── Data Recovery (L2)
│
├── 📚 Education & Tutoring (L1)
│   ├── Language Tutoring (L2)
│   ├── Academic Tutoring (L2)
│   ├── Music Lessons (L2)
│   ├── Sports Coaching (L2)
│   ├── Driving Lessons (L2)
│   └── Online Courses (L2)
│
├── 💇 Beauty & Wellness (L1)
│   ├── Hair Salons (L2)
│   ├── Nail Salons (L2)
│   ├── Spa Services (L2)
│   ├── Massage (L2)
│   ├── Personal Training (L2)
│   └── Makeup Artists (L2)
│
├── 📸 Events & Entertainment (L1)
│   ├── Photography (L2)
│   ├── Videography (L2)
│   ├── DJ Services (L2)
│   ├── Catering (L2)
│   ├── Event Planning (L2)
│   └── Entertainment (L2)
│
├── 🚚 Moving & Logistics (L1)
│   ├── Moving Services (L2)
│   ├── Courier Services (L2)
│   ├── Storage (L2)
│   └── Packing Services (L2)
│
├── 🐕 Pet Services (L1)
│   ├── Pet Grooming (L2)
│   ├── Pet Sitting (L2)
│   ├── Dog Walking (L2)
│   ├── Pet Training (L2)
│   └── Veterinary (L2)
│
└── 🧒 Childcare & Eldercare (L1)
    ├── Babysitting (L2)
    ├── Daycare (L2)
    ├── Nannies (L2)
    ├── Eldercare (L2)
    └── Special Needs Care (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 55 (L2) = 66 categories**

---

## 📊 Complete Category Reference

### L1: 🏠 HOME SERVICES

#### L2: Plumbing | Водопроводчик
**Slug:** `services/home/plumbing`

| EN | BG | Description |
|----|----|----|
| Drain Cleaning | Почистване на канали | Unclogging |
| Pipe Repair | Ремонт на тръби | Fixing pipes |
| Leak Detection | Откриване на течове | Finding leaks |
| Water Heater | Бойлери | Installation/repair |
| Toilet Repair | Ремонт на тоалетни | Toilet services |
| Faucet Installation | Монтаж на смесители | Taps |
| Emergency Plumbing | Авариен водопроводчик | 24/7 service |

---

#### L2: Electrical | Електроуслуги
**Slug:** `services/home/electrical`

| EN | BG | Description |
|----|----|----|
| Wiring | Окабеляване | New/repair |
| Outlet Installation | Монтаж на контакти | Power outlets |
| Lighting | Осветление | Light fixtures |
| Panel Upgrade | Табло подмяна | Electrical panel |
| Smart Home | Умен дом | Automation |
| Emergency Electrical | Авариен електротехник | 24/7 |

---

#### L2: Cleaning | Почистване
**Slug:** `services/home/cleaning`

- House Cleaning | Почистване на дом
- Deep Cleaning | Основно почистване
- Move-In/Out Cleaning | Почистване при нанасяне/изнасяне
- Office Cleaning | Почистване на офиси
- Window Cleaning | Почистване на прозорци
- Carpet Cleaning | Пране на килими
- Upholstery Cleaning | Пране на мебели

---

#### L2: Landscaping | Градинарство
**Slug:** `services/home/landscaping`

- Lawn Care | Поддръжка на тревни площи
- Garden Design | Ландшафтен дизайн
- Tree Services | Услуги за дървета
- Irrigation | Напояване
- Snow Removal | Почистване на сняг

---

### L1: 🚗 AUTOMOTIVE SERVICES

#### L2: Auto Repair | Автосервиз
**Slug:** `services/automotive/repair`

| EN | BG | Description |
|----|----|----|
| Oil Change | Смяна на масло | Regular maintenance |
| Brake Service | Спирачки | Brake repair |
| Engine Repair | Ремонт на двигател | Engine work |
| Transmission | Скоростна кутия | Gearbox |
| Suspension | Окачване | Shocks/struts |
| Diagnostics | Диагностика | Computer scan |
| AC Service | Климатик | A/C repair |

---

#### L2: Body Work | Автотенекеджийски услуги
**Slug:** `services/automotive/bodywork`

- Dent Repair | Изправяне на вдлъбнатини
- Paint Touch-Up | Ретуш на боя
- Collision Repair | Ремонт след удар
- Rust Removal | Почистване на ръжда
- Full Respray | Цялостно боядисване

---

### L1: 💼 PROFESSIONAL SERVICES

#### L2: Legal Services | Правни услуги
**Slug:** `services/professional/legal`

| EN | BG | Description |
|----|----|----|
| Family Law | Семейно право | Divorce, custody |
| Real Estate Law | Имотно право | Property |
| Business Law | Търговско право | Corporate |
| Criminal Law | Наказателно право | Defense |
| Immigration Law | Имиграционно право | Visas |
| Labor Law | Трудово право | Employment |

---

#### L2: Accounting | Счетоводни услуги
**Slug:** `services/professional/accounting`

- Bookkeeping | Счетоводство
- Tax Preparation | Данъчни декларации
- Payroll | Заплати
- Auditing | Одит
- Financial Consulting | Финансови консултации

---

### L1: 💻 IT & TECH SERVICES

#### L2: Computer Repair | Ремонт на компютри
**Slug:** `services/tech/computer-repair`

| EN | BG | Description |
|----|----|----|
| Hardware Repair | Хардуерен ремонт | Physical repairs |
| Software Issues | Софтуерни проблеми | OS, apps |
| Virus Removal | Премахване на вируси | Malware |
| Data Backup | Архивиране | Backup |
| Upgrades | Ъпгрейди | Components |
| Network Setup | Настройка на мрежа | WiFi, LAN |

---

#### L2: Web Development | Уеб разработка
**Slug:** `services/tech/web-development`

- Website Design | Уеб дизайн
- E-commerce | Онлайн магазин
- WordPress | WordPress
- SEO Services | SEO оптимизация
- Website Maintenance | Поддръжка на сайт

---

### L1: 📚 EDUCATION & TUTORING

#### L2: Language Tutoring | Езикови уроци
**Slug:** `services/education/languages`

| EN | BG | Description |
|----|----|----|
| English | Английски | Most popular |
| German | Немски | Common |
| French | Френски | Popular |
| Spanish | Испански | Growing |
| Bulgarian | Български | For foreigners |
| Russian | Руски | Regional |

---

#### L2: Driving Lessons | Шофьорски курсове
**Slug:** `services/education/driving`

- Category B | Категория B (лек автомобил)
- Category A | Категория A (мотоциклет)
- Category C | Категория C (товарен)
- Category D | Категория D (автобус)
- Refresher Course | Опреснителен курс

---

---

## 🏷️ Attribute System (The Power Layer)

### Service Provider Attributes Schema

```typescript
interface ServiceListing {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  
  // === PRICING ===
  price_type: PriceType;
  price_min?: number;
  price_max?: number;
  price_unit?: PriceUnit;
  currency: 'BGN' | 'EUR';
  
  // === PROVIDER INFO ===
  provider_type: ProviderType;
  company_name?: string;
  years_experience?: number;
  
  // === QUALIFICATIONS ===
  licensed: boolean;
  insured: boolean;
  certifications?: string[];
  
  // === AVAILABILITY ===
  availability: Availability;
  emergency_service: boolean;
  response_time?: ResponseTime;
  
  // === SERVICE AREA ===
  service_areas: string[];
  mobile_service: boolean;
  remote_service: boolean;
  
  // === RATINGS ===
  rating?: number;
  review_count?: number;
  
  seller_type: 'individual' | 'business';
  location_city: string;
  
  images: string[];
  portfolio?: string[];
}

type PriceType = 'fixed' | 'hourly' | 'project' | 'quote' | 'free';
type PriceUnit = 'per_hour' | 'per_day' | 'per_project' | 'per_sqm';
type ProviderType = 'individual' | 'company' | 'freelancer';
type Availability = 'weekdays' | 'weekends' | 'evenings' | 'anytime' | '24_7';
type ResponseTime = 'same_day' | 'next_day' | 'within_week' | 'custom';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('services', 'Services', 'Услуги', 'services', 'services', NULL, 0, '🔨', 14, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('svc-home', 'Home Services', 'Домашни услуги', 'home', 'services/home', 'services', 1, '🏠', 1, true),
('svc-auto', 'Automotive Services', 'Автоуслуги', 'automotive', 'services/automotive', 'services', 1, '🚗', 2, true),
('svc-professional', 'Professional Services', 'Професионални услуги', 'professional', 'services/professional', 'services', 1, '💼', 3, true),
('svc-tech', 'IT & Tech Services', 'IT и технически услуги', 'tech', 'services/tech', 'services', 1, '💻', 4, true),
('svc-education', 'Education & Tutoring', 'Образование и уроци', 'education', 'services/education', 'services', 1, '📚', 5, true),
('svc-beauty', 'Beauty & Wellness', 'Красота и уелнес', 'beauty', 'services/beauty', 'services', 1, '💇', 6, true),
('svc-events', 'Events & Entertainment', 'Събития и развлечения', 'events', 'services/events', 'services', 1, '📸', 7, true),
('svc-moving', 'Moving & Logistics', 'Преместване и логистика', 'moving', 'services/moving', 'services', 1, '🚚', 8, true),
('svc-pets', 'Pet Services', 'Услуги за домашни любимци', 'pets', 'services/pets', 'services', 1, '🐕', 9, true),
('svc-care', 'Childcare & Eldercare', 'Грижа за деца и възрастни', 'care', 'services/care', 'services', 1, '🧒', 10, true);

-- L2: Home Services
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('home-plumbing', 'Plumbing', 'Водопроводчик', 'plumbing', 'services/home/plumbing', 'svc-home', 2, '🔧', 1, true),
('home-electrical', 'Electrical', 'Електроуслуги', 'electrical', 'services/home/electrical', 'svc-home', 2, '⚡', 2, true),
('home-hvac', 'HVAC', 'Климатици и отопление', 'hvac', 'services/home/hvac', 'svc-home', 2, '❄️', 3, true),
('home-painting', 'Painting', 'Боядисване', 'painting', 'services/home/painting', 'svc-home', 2, '🎨', 4, true),
('home-cleaning', 'Cleaning', 'Почистване', 'cleaning', 'services/home/cleaning', 'svc-home', 2, '🧹', 5, true),
('home-landscaping', 'Landscaping', 'Градинарство', 'landscaping', 'services/home/landscaping', 'svc-home', 2, '🌿', 6, true),
('home-roofing', 'Roofing', 'Покриви', 'roofing', 'services/home/roofing', 'svc-home', 2, '🏠', 7, true),
('home-flooring', 'Flooring', 'Подови настилки', 'flooring', 'services/home/flooring', 'svc-home', 2, '🪵', 8, true),
('home-handyman', 'General Handyman', 'Майстор на всичко', 'handyman', 'services/home/handyman', 'svc-home', 2, '🔨', 9, true);

-- L2: Automotive
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('auto-repair', 'Auto Repair', 'Автосервиз', 'repair', 'services/automotive/repair', 'svc-auto', 2, '🔧', 1, true),
('auto-bodywork', 'Body Work', 'Автотенекеджийски', 'bodywork', 'services/automotive/bodywork', 'svc-auto', 2, '🚗', 2, true),
('auto-towing', 'Towing', 'Пътна помощ', 'towing', 'services/automotive/towing', 'svc-auto', 2, '🚨', 3, true),
('auto-detailing', 'Detailing', 'Детайлинг', 'detailing', 'services/automotive/detailing', 'svc-auto', 2, '✨', 4, true),
('auto-tires', 'Tire Services', 'Гуми', 'tires', 'services/automotive/tires', 'svc-auto', 2, '🛞', 5, true);

-- L2: Professional
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('prof-legal', 'Legal Services', 'Правни услуги', 'legal', 'services/professional/legal', 'svc-professional', 2, '⚖️', 1, true),
('prof-accounting', 'Accounting', 'Счетоводство', 'accounting', 'services/professional/accounting', 'svc-professional', 2, '📊', 2, true),
('prof-consulting', 'Consulting', 'Консултации', 'consulting', 'services/professional/consulting', 'svc-professional', 2, '💡', 3, true),
('prof-translation', 'Translation', 'Преводи', 'translation', 'services/professional/translation', 'svc-professional', 2, '🌐', 4, true),
('prof-notary', 'Notary', 'Нотариус', 'notary', 'services/professional/notary', 'svc-professional', 2, '📝', 5, true);

-- L2: IT & Tech
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tech-computer', 'Computer Repair', 'Ремонт на компютри', 'computer-repair', 'services/tech/computer-repair', 'svc-tech', 2, '🖥️', 1, true),
('tech-phone', 'Phone Repair', 'Ремонт на телефони', 'phone-repair', 'services/tech/phone-repair', 'svc-tech', 2, '📱', 2, true),
('tech-web', 'Web Development', 'Уеб разработка', 'web-development', 'services/tech/web-development', 'svc-tech', 2, '🌐', 3, true),
('tech-software', 'Software Development', 'Софтуерна разработка', 'software-development', 'services/tech/software-development', 'svc-tech', 2, '💻', 4, true),
('tech-support', 'IT Support', 'IT поддръжка', 'it-support', 'services/tech/it-support', 'svc-tech', 2, '🛠️', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Services | Услуги |
| Home Services | Домашни услуги |
| Automotive Services | Автоуслуги |
| Professional Services | Професионални услуги |
| IT & Tech Services | IT и технически услуги |
| Education & Tutoring | Образование и уроци |

### Attribute Labels

| EN | BG |
|----|----|
| Price Type | Вид цена |
| Hourly Rate | Почасова ставка |
| Fixed Price | Фиксирана цена |
| Free Quote | Безплатна оферта |
| Experience | Опит |
| Licensed | С лиценз |
| Insured | Застрахован |
| Available 24/7 | На разположение 24/7 |
| Mobile Service | Мобилна услуга |
| Rating | Рейтинг |

### Availability

| EN | BG |
|----|----|
| Weekdays | Делнични дни |
| Weekends | Уикенди |
| Evenings | Вечери |
| Anytime | По всяко време |
| Same Day | Същия ден |
| Emergency | Спешно |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add service provider profiles
- [ ] Set up ratings/reviews
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/services (tree structure)
- [ ] GET /categories/services/.../providers
- [ ] POST /services (with validation)
- [ ] GET /services/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Service area filter
- [ ] Availability filter
- [ ] Price type filter
- [ ] Rating filter
- [ ] Provider profiles
- [ ] Review system

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete
- [ ] City-specific pages

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 66  
**Created:** December 3, 2025
