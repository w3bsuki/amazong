# 💊 Health & Wellness | Здраве и уелнес

**Category Slug:** `health-wellness`  
**Icon:** 💊  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Health → Vitamins → Multivitamins |
| **Attributes** | Filtering, Search, Campaigns | Brand, Form, Dosage, Organic |
| **Tags** | Dynamic Collections & SEO | "vegan", "gluten-free", "natural" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
💊 Health & Wellness (L0)
│
├── 💊 Vitamins & Supplements (L1)
│   ├── Multivitamins (L2)
│   ├── Vitamin D (L2)
│   ├── Vitamin C (L2)
│   ├── B Vitamins (L2)
│   ├── Omega-3 (L2)
│   ├── Probiotics (L2)
│   ├── Minerals (L2)
│   └── Herbal Supplements (L2)
│
├── 🏃 Sports Nutrition (L1)
│   ├── Protein Powder (L2)
│   ├── Pre-Workout (L2)
│   ├── Post-Workout (L2)
│   ├── Amino Acids (L2)
│   ├── Creatine (L2)
│   ├── Energy Bars (L2)
│   └── Sports Drinks (L2)
│
├── 🩺 Medical Devices (L1)
│   ├── Blood Pressure Monitors (L2)
│   ├── Glucose Monitors (L2)
│   ├── Thermometers (L2)
│   ├── Pulse Oximeters (L2)
│   ├── Nebulizers (L2)
│   ├── TENS Units (L2)
│   └── Hearing Aids (L2)
│
├── 🩹 First Aid (L1)
│   ├── Bandages (L2)
│   ├── Antiseptics (L2)
│   ├── First Aid Kits (L2)
│   ├── Pain Relief (L2)
│   ├── Cold & Flu (L2)
│   └── Allergy Relief (L2)
│
├── ♿ Mobility & Accessibility (L1)
│   ├── Wheelchairs (L2)
│   ├── Walkers (L2)
│   ├── Canes & Crutches (L2)
│   ├── Scooters (L2)
│   ├── Lift Chairs (L2)
│   └── Ramps (L2)
│
├── 🧘 Wellness & Relaxation (L1)
│   ├── Massage Devices (L2)
│   ├── Aromatherapy (L2)
│   ├── Meditation (L2)
│   ├── Acupressure (L2)
│   ├── Hot/Cold Therapy (L2)
│   └── Sleep Aids (L2)
│
├── 🦷 Dental Care (L1)
│   ├── Electric Toothbrushes (L2)
│   ├── Water Flossers (L2)
│   ├── Teeth Whitening (L2)
│   ├── Orthodontic Supplies (L2)
│   └── Denture Care (L2)
│
├── 👁️ Vision Care (L1)
│   ├── Reading Glasses (L2)
│   ├── Contact Lens Care (L2)
│   ├── Eye Drops (L2)
│   ├── Blue Light Glasses (L2)
│   └── Vision Aids (L2)
│
├── 🏥 Home Health Care (L1)
│   ├── Patient Care (L2)
│   ├── Incontinence (L2)
│   ├── Wound Care (L2)
│   ├── Respiratory Care (L2)
│   └── Diagnostic Tests (L2)
│
└── 🌿 Natural & Alternative (L1)
    ├── Homeopathy (L2)
    ├── Essential Oils (L2)
    ├── CBD Products (L2)
    ├── Ayurveda (L2)
    └── Traditional Medicine (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 56 (L2) = 67 categories**

---

## 📊 Complete Category Reference

### L1: 💊 VITAMINS & SUPPLEMENTS

#### L2: Multivitamins | Мултивитамини
**Slug:** `health-wellness/vitamins/multivitamins`

| EN | BG | Description |
|----|----|----|
| Men's Multivitamins | Мултивитамини за мъже | Male-specific |
| Women's Multivitamins | Мултивитамини за жени | Female-specific |
| Children's Vitamins | Детски витамини | For kids |
| Prenatal Vitamins | Пренатални витамини | Pregnancy |
| Senior Vitamins | Витамини за възрастни | 50+ |
| Gummy Vitamins | Гъми витамини | Chewable gummies |

---

#### L2: Herbal Supplements | Билкови добавки
**Slug:** `health-wellness/vitamins/herbal`

| EN | BG | Benefits |
|----|----|----|
| Echinacea | Ехинацея | Immune support |
| Ginkgo Biloba | Гинко Билоба | Memory |
| St. John's Wort | Жълт кантарион | Mood |
| Valerian | Валериана | Sleep |
| Milk Thistle | Бял трън | Liver |
| Ashwagandha | Ашваганда | Stress |
| Turmeric | Куркума | Inflammation |
| Ginseng | Женшен | Energy |

---

### L1: 🏃 SPORTS NUTRITION

#### L2: Protein Powder | Протеин на прах
**Slug:** `health-wellness/sports/protein`

| EN | BG | Description |
|----|----|----|
| Whey Protein | Суроватъчен протеин | Fast-absorbing |
| Casein Protein | Казеин протеин | Slow-release |
| Plant Protein | Растителен протеин | Vegan |
| Mass Gainer | Мас гейнър | Weight gain |
| Isolate Protein | Изолат | High purity |
| Concentrate | Концентрат | Standard |
| Hydrolyzed | Хидролизиран | Pre-digested |

---

#### L2: Amino Acids | Аминокиселини
**Slug:** `health-wellness/sports/amino-acids`

- BCAA | BCAA (разклонена верига)
- EAA | EAA (есенциални)
- Glutamine | Глутамин
- L-Carnitine | L-карнитин
- Beta-Alanine | Бета-аланин
- Arginine | Аргинин

---

### L1: 🩺 MEDICAL DEVICES

#### L2: Blood Pressure Monitors | Апарати за кръвно
**Slug:** `health-wellness/medical/blood-pressure`

| EN | BG | Description |
|----|----|----|
| Upper Arm Monitor | За горна ръка | Most accurate |
| Wrist Monitor | За китка | Portable |
| Automatic | Автоматичен | Easy-use |
| Manual | Ръчен | Professional |
| Bluetooth | С Bluetooth | Smart |

---

#### L2: Glucose Monitors | Глюкомери
**Slug:** `health-wellness/medical/glucose`

- Blood Glucose Meters | Глюкомери за кръв
- Continuous Glucose Monitors | Непрекъснат мониторинг
- Test Strips | Тест ленти
- Lancets | Ланцети
- Glucose Tablets | Глюкозни таблетки

---

### L1: ♿ MOBILITY & ACCESSIBILITY

#### L2: Wheelchairs | Инвалидни колички
**Slug:** `health-wellness/mobility/wheelchairs`

| EN | BG | Description |
|----|----|----|
| Manual Wheelchairs | Ръчни колички | Self-propelled |
| Electric Wheelchairs | Електрически колички | Motorized |
| Transport Chairs | Транспортни столове | Lightweight |
| Pediatric Wheelchairs | Детски колички | For children |
| Sports Wheelchairs | Спортни колички | Active use |
| Reclining Wheelchairs | Накланящи се | Comfort |

---

#### L2: Walkers | Проходилки
**Slug:** `health-wellness/mobility/walkers`

- Standard Walkers | Стандартни проходилки
- Rollators | Ролатори (с колела)
- Knee Walkers | Коленни проходилки
- Bariatric Walkers | Бариатрични
- Folding Walkers | Сгъваеми

---

### L1: 🧘 WELLNESS & RELAXATION

#### L2: Massage Devices | Масажни уреди
**Slug:** `health-wellness/wellness/massage`

| EN | BG | Description |
|----|----|----|
| Massage Chairs | Масажни столове | Full body |
| Massage Guns | Масажни пистолети | Percussive |
| Foot Massagers | Масажори за крака | Feet |
| Neck Massagers | Масажори за врат | Neck/shoulders |
| Back Massagers | Масажори за гръб | Back |
| Handheld Massagers | Ръчни масажори | Portable |

---

#### L2: Aromatherapy | Ароматерапия
**Slug:** `health-wellness/wellness/aromatherapy`

- Essential Oil Diffusers | Дифузери за ет. масла
- Essential Oils | Етерични масла
- Candles | Ароматни свещи
- Incense | Тамян
- Room Sprays | Спрейове за стая

---

---

## 🏷️ Attribute System (The Power Layer)

### Health Product Attributes Schema

```typescript
interface HealthProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === PRODUCT INFO ===
  brand: string;
  
  // === SUPPLEMENT SPECIFICS ===
  form?: SupplementForm;
  serving_size?: string;
  servings_per_container?: number;
  dosage?: string;
  
  // === DIETARY INFO ===
  dietary: DietaryInfo[];
  allergens?: string[];
  
  // === CERTIFICATIONS ===
  fda_approved?: boolean;
  gmp_certified?: boolean;
  organic?: boolean;
  
  // === DEVICE SPECIFICS ===
  warranty_months?: number;
  power_source?: PowerSource;
  
  // === CONDITION ===
  condition: ProductCondition;
  expiry_date?: string;
  
  seller_type: 'private' | 'pharmacy' | 'store';
  location_city: string;
  
  images: string[];
}

type SupplementForm = 'capsule' | 'tablet' | 'powder' | 'liquid' | 'gummy' | 'softgel' | 'spray';
type DietaryInfo = 'vegan' | 'vegetarian' | 'gluten_free' | 'dairy_free' | 'sugar_free' | 'non_gmo' | 'organic' | 'kosher' | 'halal';
type PowerSource = 'battery' | 'rechargeable' | 'ac_power' | 'manual';
type ProductCondition = 'new_sealed' | 'new_opened' | 'used' | 'refurbished';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('health-wellness', 'Health & Wellness', 'Здраве и уелнес', 'health-wellness', 'health-wellness', NULL, 0, '💊', 19, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('hw-vitamins', 'Vitamins & Supplements', 'Витамини и добавки', 'vitamins', 'health-wellness/vitamins', 'health-wellness', 1, '💊', 1, true),
('hw-sports', 'Sports Nutrition', 'Спортно хранене', 'sports', 'health-wellness/sports', 'health-wellness', 1, '🏃', 2, true),
('hw-medical', 'Medical Devices', 'Медицински уреди', 'medical', 'health-wellness/medical', 'health-wellness', 1, '🩺', 3, true),
('hw-firstaid', 'First Aid', 'Първа помощ', 'first-aid', 'health-wellness/first-aid', 'health-wellness', 1, '🩹', 4, true),
('hw-mobility', 'Mobility & Accessibility', 'Мобилност', 'mobility', 'health-wellness/mobility', 'health-wellness', 1, '♿', 5, true),
('hw-wellness', 'Wellness & Relaxation', 'Уелнес и релаксация', 'wellness', 'health-wellness/wellness', 'health-wellness', 1, '🧘', 6, true),
('hw-dental', 'Dental Care', 'Дентална грижа', 'dental', 'health-wellness/dental', 'health-wellness', 1, '🦷', 7, true),
('hw-vision', 'Vision Care', 'Грижа за очите', 'vision', 'health-wellness/vision', 'health-wellness', 1, '👁️', 8, true),
('hw-homecare', 'Home Health Care', 'Домашни грижи', 'home-care', 'health-wellness/home-care', 'health-wellness', 1, '🏥', 9, true),
('hw-natural', 'Natural & Alternative', 'Натурални и алтернативни', 'natural', 'health-wellness/natural', 'health-wellness', 1, '🌿', 10, true);

-- L2: Vitamins
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('vitamins-multi', 'Multivitamins', 'Мултивитамини', 'multivitamins', 'health-wellness/vitamins/multivitamins', 'hw-vitamins', 2, '💊', 1, true),
('vitamins-d', 'Vitamin D', 'Витамин D', 'vitamin-d', 'health-wellness/vitamins/vitamin-d', 'hw-vitamins', 2, '☀️', 2, true),
('vitamins-c', 'Vitamin C', 'Витамин C', 'vitamin-c', 'health-wellness/vitamins/vitamin-c', 'hw-vitamins', 2, '🍊', 3, true),
('vitamins-b', 'B Vitamins', 'Витамини от група B', 'b-vitamins', 'health-wellness/vitamins/b-vitamins', 'hw-vitamins', 2, '⚡', 4, true),
('vitamins-omega', 'Omega-3', 'Омега-3', 'omega-3', 'health-wellness/vitamins/omega-3', 'hw-vitamins', 2, '🐟', 5, true),
('vitamins-probiotics', 'Probiotics', 'Пробиотици', 'probiotics', 'health-wellness/vitamins/probiotics', 'hw-vitamins', 2, '🦠', 6, true),
('vitamins-herbal', 'Herbal Supplements', 'Билкови добавки', 'herbal', 'health-wellness/vitamins/herbal', 'hw-vitamins', 2, '🌿', 7, true);

-- L2: Sports Nutrition
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('sports-protein', 'Protein Powder', 'Протеин на прах', 'protein', 'health-wellness/sports/protein', 'hw-sports', 2, '💪', 1, true),
('sports-preworkout', 'Pre-Workout', 'Предтренировъчни', 'pre-workout', 'health-wellness/sports/pre-workout', 'hw-sports', 2, '🔥', 2, true),
('sports-amino', 'Amino Acids', 'Аминокиселини', 'amino-acids', 'health-wellness/sports/amino-acids', 'hw-sports', 2, '⚗️', 3, true),
('sports-creatine', 'Creatine', 'Креатин', 'creatine', 'health-wellness/sports/creatine', 'hw-sports', 2, '💪', 4, true),
('sports-bars', 'Energy Bars', 'Енергийни барове', 'energy-bars', 'health-wellness/sports/energy-bars', 'hw-sports', 2, '🍫', 5, true);

-- L2: Medical Devices
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('medical-bp', 'Blood Pressure Monitors', 'Апарати за кръвно', 'blood-pressure', 'health-wellness/medical/blood-pressure', 'hw-medical', 2, '❤️', 1, true),
('medical-glucose', 'Glucose Monitors', 'Глюкомери', 'glucose', 'health-wellness/medical/glucose', 'hw-medical', 2, '🩸', 2, true),
('medical-thermo', 'Thermometers', 'Термометри', 'thermometers', 'health-wellness/medical/thermometers', 'hw-medical', 2, '🌡️', 3, true),
('medical-pulse', 'Pulse Oximeters', 'Пулсоксиметри', 'pulse-oximeters', 'health-wellness/medical/pulse-oximeters', 'hw-medical', 2, '💓', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Health & Wellness | Здраве и уелнес |
| Vitamins & Supplements | Витамини и добавки |
| Sports Nutrition | Спортно хранене |
| Medical Devices | Медицински уреди |
| Mobility | Мобилност |
| Wellness | Уелнес |

### Attribute Labels

| EN | BG |
|----|----|
| Form | Форма |
| Dosage | Дозировка |
| Serving Size | Порция |
| Dietary | Диетично |
| Organic | Био |
| Vegan | Веган |
| Gluten-Free | Без глутен |

### Supplement Forms

| EN | BG |
|----|----|
| Capsule | Капсула |
| Tablet | Таблетка |
| Powder | Прах |
| Liquid | Течност |
| Gummy | Гъми |
| Softgel | Софтгел |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add health brands reference
- [ ] Add supplement types reference
- [ ] Test dietary filters

### API
- [ ] GET /categories/health-wellness (tree)
- [ ] GET /products with filters
- [ ] Expiry date validation
- [ ] Dietary filter support

### Frontend
- [ ] Category browser
- [ ] Form type filter
- [ ] Dietary restrictions filter
- [ ] Brand filter
- [ ] Price range

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 67  
**Created:** December 3, 2025
