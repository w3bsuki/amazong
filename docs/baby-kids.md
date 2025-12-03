# 👶 Baby & Kids | Бебешки и Детски стоки

**Category Slug:** `baby-kids`  
**Icon:** 👶  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Baby & Kids → Gear → Strollers |
| **Attributes** | Filtering, Search, Campaigns | Age Range, Brand, Condition, Size |
| **Tags** | Dynamic Collections & SEO | "newborn", "toddler", "organic" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
👶 Baby & Kids (L0)
│
├── 🍼 Baby Gear (L1)
│   ├── Strollers (L2)
│   ├── Car Seats (L2)
│   ├── Baby Carriers (L2)
│   ├── High Chairs (L2)
│   ├── Playpens & Bouncers (L2)
│   ├── Baby Monitors (L2)
│   └── Baby Walkers (L2)
│
├── 🛒 Nursery (L1)
│   ├── Cribs & Cots (L2)
│   ├── Nursery Furniture (L2)
│   ├── Bedding & Blankets (L2)
│   ├── Mobiles & Decor (L2)
│   └── Storage & Organization (L2)
│
├── 👕 Baby Clothing (L1)
│   ├── Bodysuits & Onesies (L2)
│   ├── Sleepwear (L2)
│   ├── Outerwear (L2)
│   ├── Sets & Outfits (L2)
│   └── Accessories (L2)
│
├── 🧸 Toys & Play (L1)
│   ├── Baby Toys (L2)
│   ├── Educational Toys (L2)
│   ├── Outdoor Play (L2)
│   ├── Dolls & Plush (L2)
│   ├── Building Toys (L2)
│   ├── Games & Puzzles (L2)
│   └── Arts & Crafts (L2)
│
├── 🍽️ Feeding (L1)
│   ├── Bottles & Accessories (L2)
│   ├── Breastfeeding (L2)
│   ├── Baby Food & Formula (L2)
│   ├── Bibs & Burp Cloths (L2)
│   └── Feeding Utensils (L2)
│
├── 🛁 Baby Care (L1)
│   ├── Diapers & Wipes (L2)
│   ├── Bathing (L2)
│   ├── Skin Care (L2)
│   ├── Health & Safety (L2)
│   └── Potty Training (L2)
│
└── 📚 Kids' Learning (L1)
    ├── Books (L2)
    ├── School Supplies (L2)
    ├── Electronics (L2)
    └── Musical Instruments (L2)
```

**Total Categories: 1 (L0) + 7 (L1) + 36 (L2) = 44 categories**

---

## 📊 Complete Category Reference

### L1: 🍼 BABY GEAR

#### L2: Strollers | Колички
**Slug:** `baby-gear/strollers`

| EN | BG | Description |
|----|----|----|
| Standard Stroller | Стандартна количка | Everyday use |
| Lightweight Stroller | Лека количка | Travel-friendly |
| Jogging Stroller | Количка за джогинг | For running |
| Double Stroller | Двойна количка | For twins/siblings |
| Travel System | Система за пътуване | Stroller + car seat |
| Umbrella Stroller | Чадър количка | Compact fold |

---

#### L2: Car Seats | Столчета за кола
**Slug:** `baby-gear/car-seats`

| EN | BG | Description |
|----|----|----|
| Infant Car Seat | Столче за новородено | 0-13 kg |
| Convertible Car Seat | Конвертируемо столче | Multiple stages |
| Toddler Car Seat | Столче за малко дете | 9-18 kg |
| Booster Seat | Повдигащо столче | 15-36 kg |
| All-in-One | Всичко в едно | Birth to booster |

---

#### L2: Baby Carriers | Носилки за бебета
**Slug:** `baby-gear/carriers`

- Soft Carriers | Меки носилки
- Structured Carriers | Ергономични носилки
- Wraps | Слингове
- Ring Slings | Пръстенови слингове
- Hip Carriers | Носилки за хълбок

---

#### L2: High Chairs | Столчета за хранене
**Slug:** `baby-gear/high-chairs`

- Standard High Chair | Стандартно столче
- Portable High Chair | Преносимо столче
- Booster Seat | Повдигащо столче
- Hook-On Chair | Закачащо се столче
- Convertible High Chair | Трансформиращо се столче

---

#### L2: Playpens & Bouncers | Кошари и Люлки
**Slug:** `baby-gear/playpens-bouncers`

- Playpens | Кошари
- Baby Bouncers | Шезлонги
- Baby Swings | Люлки
- Activity Centers | Центрове за игра
- Travel Beds | Преносими легла

---

### L1: 🛒 NURSERY

#### L2: Cribs & Cots | Креватчета
**Slug:** `nursery/cribs-cots`

| EN | BG | Description |
|----|----|----|
| Standard Crib | Стандартно креватче | Full-size |
| Mini Crib | Мини креватче | Compact |
| Convertible Crib | Трансформиращо се | Grows with child |
| Portable Crib | Преносимо креватче | Travel |
| Bassinet | Кошче | Newborn |
| Co-Sleeper | Ко-слийпър | Bedside |

---

#### L2: Nursery Furniture | Мебели за детска стая
**Slug:** `nursery/furniture`

- Changing Tables | Маси за повиване
- Dressers | Скринове
- Rocking Chairs | Люлеещи се столове
- Gliders | Плавни столове
- Toy Storage | Кутии за играчки

---

#### L2: Bedding & Blankets | Спално бельо
**Slug:** `nursery/bedding`

- Crib Sheets | Чаршафи за креватче
- Mattresses | Матраци
- Blankets | Одеялца
- Sleep Sacks | Спални чувалчета
- Crib Bumpers | Обиколници

---

### L1: 🧸 TOYS & PLAY

#### L2: Baby Toys | Бебешки играчки
**Slug:** `toys/baby-toys`

- Rattles | Дрънкалки
- Teethers | Гризалки
- Soft Toys | Меки играчки
- Activity Mats | Постелки за игра
- Stacking Toys | Кули за редене

---

#### L2: Educational Toys | Образователни играчки
**Slug:** `toys/educational`

- STEM Toys | СТЕМ играчки
- Learning Tablets | Образователни таблети
- Letter & Number Toys | Букви и цифри
- Science Kits | Научни комплекти
- Coding Toys | Играчки за програмиране

---

#### L2: Outdoor Play | Външни игри
**Slug:** `toys/outdoor`

- Playhouses | Къщички за игра
- Slides | Пързалки
- Swings | Люлки
- Trampolines | Батути
- Sandboxes | Пясъчници
- Ride-On Toys | Коли за бутане

---

#### L2: Dolls & Plush | Кукли и Плюшени играчки
**Slug:** `toys/dolls-plush`

- Dolls | Кукли
- Plush Toys | Плюшени играчки
- Doll Houses | Къщи за кукли
- Doll Accessories | Аксесоари за кукли
- Action Figures | Екшън фигурки

---

#### L2: Building Toys | Конструктори
**Slug:** `toys/building`

- LEGO | LEGO
- Building Blocks | Строителни блокове
- Magnetic Tiles | Магнитни плочки
- Construction Sets | Конструктори
- Marble Runs | Топчета за пускане

---

### L1: 🍽️ FEEDING

#### L2: Bottles & Accessories | Шишета и аксесоари
**Slug:** `feeding/bottles`

- Baby Bottles | Бебешки шишета
- Nipples | Биберони
- Bottle Warmers | Нагреватели
- Sterilizers | Стерилизатори
- Bottle Brushes | Четки за шишета

---

#### L2: Breastfeeding | Кърмене
**Slug:** `feeding/breastfeeding`

- Breast Pumps | Помпи за кърма
- Nursing Pillows | Възглавници за кърмене
- Nursing Covers | Покривала за кърмене
- Breast Milk Storage | Съхранение на кърма
- Nursing Bras | Сутиени за кърмене

---

### L1: 🛁 BABY CARE

#### L2: Diapers & Wipes | Пелени и Кърпички
**Slug:** `baby-care/diapers`

- Disposable Diapers | Еднократни пелени
- Cloth Diapers | Многократни пелени
- Baby Wipes | Бебешки кърпички
- Diaper Bags | Чанти за пелени
- Changing Pads | Подложки за повиване

---

#### L2: Bathing | Къпане
**Slug:** `baby-care/bathing`

- Baby Tubs | Бебешки вани
- Bath Seats | Седалки за баня
- Towels | Хавлии
- Washcloths | Кърпички за миене
- Bath Toys | Играчки за баня

---

---

## 🏷️ Attribute System (The Power Layer)

### Baby Product Attributes Schema

```typescript
interface BabyProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === PRODUCT IDENTIFICATION ===
  brand: string;
  model: string;
  
  // === AGE/SIZE ===
  age_range: AgeRange;
  size?: string;
  weight_range?: string;
  
  // === SAFETY ===
  safety_certified: boolean;
  certifications: string[];
  
  // === CONDITION ===
  condition: ProductCondition;
  original_packaging: boolean;
  
  // === FEATURES ===
  features: string[];
  color: string;
  material: string;
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  images: string[];
}

type AgeRange = '0-3m' | '3-6m' | '6-12m' | '1-2y' | '2-3y' | '3-5y' | '5-7y' | '7-12y';
type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('baby-kids', 'Baby & Kids', 'Бебешки и детски стоки', 'baby-kids', 'baby-kids', NULL, 0, '👶', 8, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('baby-gear', 'Baby Gear', 'Бебешко оборудване', 'baby-gear', 'baby-kids/baby-gear', 'baby-kids', 1, '🍼', 1, true),
('nursery', 'Nursery', 'Детска стая', 'nursery', 'baby-kids/nursery', 'baby-kids', 1, '🛒', 2, true),
('baby-clothing', 'Baby Clothing', 'Бебешки дрехи', 'baby-clothing', 'baby-kids/baby-clothing', 'baby-kids', 1, '👕', 3, true),
('toys', 'Toys & Play', 'Играчки', 'toys', 'baby-kids/toys', 'baby-kids', 1, '🧸', 4, true),
('feeding', 'Feeding', 'Хранене', 'feeding', 'baby-kids/feeding', 'baby-kids', 1, '🍽️', 5, true),
('baby-care', 'Baby Care', 'Грижа за бебето', 'baby-care', 'baby-kids/baby-care', 'baby-kids', 1, '🛁', 6, true),
('kids-learning', 'Kids Learning', 'Детско образование', 'kids-learning', 'baby-kids/kids-learning', 'baby-kids', 1, '📚', 7, true);

-- L2: Baby Gear
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gear-strollers', 'Strollers', 'Колички', 'strollers', 'baby-gear/strollers', 'baby-gear', 2, '🛒', 1, true),
('gear-carseats', 'Car Seats', 'Столчета за кола', 'car-seats', 'baby-gear/car-seats', 'baby-gear', 2, '🚗', 2, true),
('gear-carriers', 'Baby Carriers', 'Носилки', 'carriers', 'baby-gear/carriers', 'baby-gear', 2, '👶', 3, true),
('gear-highchairs', 'High Chairs', 'Столчета за хранене', 'high-chairs', 'baby-gear/high-chairs', 'baby-gear', 2, '🪑', 4, true),
('gear-playpens', 'Playpens & Bouncers', 'Кошари и люлки', 'playpens-bouncers', 'baby-gear/playpens-bouncers', 'baby-gear', 2, '🛏️', 5, true),
('gear-monitors', 'Baby Monitors', 'Бебефони', 'monitors', 'baby-gear/monitors', 'baby-gear', 2, '📱', 6, true),
('gear-walkers', 'Baby Walkers', 'Проходилки', 'walkers', 'baby-gear/walkers', 'baby-gear', 2, '🚶', 7, true);

-- L2: Toys
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('toys-baby', 'Baby Toys', 'Бебешки играчки', 'baby-toys', 'toys/baby-toys', 'toys', 2, '🍼', 1, true),
('toys-educational', 'Educational Toys', 'Образователни играчки', 'educational', 'toys/educational', 'toys', 2, '🎓', 2, true),
('toys-outdoor', 'Outdoor Play', 'Външни игри', 'outdoor', 'toys/outdoor', 'toys', 2, '🏕️', 3, true),
('toys-dolls', 'Dolls & Plush', 'Кукли и плюшени', 'dolls-plush', 'toys/dolls-plush', 'toys', 2, '🧸', 4, true),
('toys-building', 'Building Toys', 'Конструктори', 'building', 'toys/building', 'toys', 2, '🧱', 5, true),
('toys-games', 'Games & Puzzles', 'Игри и пъзели', 'games-puzzles', 'toys/games-puzzles', 'toys', 2, '🧩', 6, true),
('toys-arts', 'Arts & Crafts', 'Изкуство и занаяти', 'arts-crafts', 'toys/arts-crafts', 'toys', 2, '🎨', 7, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Baby & Kids | Бебешки и детски стоки |
| Baby Gear | Бебешко оборудване |
| Strollers | Колички |
| Car Seats | Столчета за кола |
| Nursery | Детска стая |
| Cribs | Креватчета |
| Toys & Play | Играчки |
| Feeding | Хранене |
| Baby Care | Грижа за бебето |

### Age Ranges

| EN | BG |
|----|----|
| 0-3 months | 0-3 месеца |
| 3-6 months | 3-6 месеца |
| 6-12 months | 6-12 месеца |
| 1-2 years | 1-2 години |
| 2-3 years | 2-3 години |
| 3-5 years | 3-5 години |
| 5-7 years | 5-7 години |
| 7-12 years | 7-12 години |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add baby brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/baby-kids (tree structure)
- [ ] GET /categories/baby-kids/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Product listing form (multi-step)
- [ ] Age range selector component
- [ ] Safety certification display
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 44  
**Created:** December 3, 2025
