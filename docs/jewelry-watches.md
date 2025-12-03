# 💎 Jewelry & Watches | Бижута и часовници

**Category Slug:** `jewelry-watches`  
**Icon:** 💎  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Jewelry → Rings → Engagement Rings |
| **Attributes** | Filtering, Search, Campaigns | Metal, Stone, Size, Brand |
| **Tags** | Dynamic Collections & SEO | "vintage", "handmade", "luxury" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
💎 Jewelry & Watches (L0)
│
├── 💍 Rings (L1)
│   ├── Engagement Rings (L2)
│   ├── Wedding Bands (L2)
│   ├── Fashion Rings (L2)
│   ├── Cocktail Rings (L2)
│   ├── Signet Rings (L2)
│   └── Men's Rings (L2)
│
├── 📿 Necklaces (L1)
│   ├── Pendants (L2)
│   ├── Chains (L2)
│   ├── Chokers (L2)
│   ├── Statement Necklaces (L2)
│   ├── Pearl Necklaces (L2)
│   └── Men's Necklaces (L2)
│
├── ✨ Earrings (L1)
│   ├── Stud Earrings (L2)
│   ├── Hoop Earrings (L2)
│   ├── Drop Earrings (L2)
│   ├── Chandelier Earrings (L2)
│   ├── Clip-On Earrings (L2)
│   └── Men's Earrings (L2)
│
├── 💫 Bracelets (L1)
│   ├── Tennis Bracelets (L2)
│   ├── Bangles (L2)
│   ├── Charm Bracelets (L2)
│   ├── Cuff Bracelets (L2)
│   ├── Leather Bracelets (L2)
│   └── Men's Bracelets (L2)
│
├── ⌚ Watches (L1)
│   ├── Luxury Watches (L2)
│   ├── Fashion Watches (L2)
│   ├── Sports Watches (L2)
│   ├── Smart Watches (L2)
│   ├── Vintage Watches (L2)
│   └── Watch Accessories (L2)
│
├── 👑 Fine Jewelry (L1)
│   ├── Diamond Jewelry (L2)
│   ├── Gold Jewelry (L2)
│   ├── Platinum Jewelry (L2)
│   ├── Gemstone Jewelry (L2)
│   └── Pearl Jewelry (L2)
│
├── 🎭 Fashion Jewelry (L1)
│   ├── Costume Jewelry (L2)
│   ├── Silver Jewelry (L2)
│   ├── Stainless Steel (L2)
│   ├── Bohemian Jewelry (L2)
│   └── Minimalist Jewelry (L2)
│
├── 🏺 Vintage & Antique (L1)
│   ├── Victorian Jewelry (L2)
│   ├── Art Deco Jewelry (L2)
│   ├── Retro Jewelry (L2)
│   ├── Estate Jewelry (L2)
│   └── Antique Watches (L2)
│
└── 🛠️ Jewelry Supplies (L1)
    ├── Beads & Findings (L2)
    ├── Jewelry Making Tools (L2)
    ├── Display & Packaging (L2)
    └── Repair Supplies (L2)
```

**Total Categories: 1 (L0) + 9 (L1) + 48 (L2) = 58 categories**

---

## 📊 Complete Category Reference

### L1: 💍 RINGS

#### L2: Engagement Rings | Годежни пръстени
**Slug:** `jewelry-watches/rings/engagement`

| EN | BG | Description |
|----|----|----|
| Solitaire | Солитер | Single stone |
| Halo | Хало | Center with halo |
| Three-Stone | Три камъка | Past, present, future |
| Vintage Style | Винтидж стил | Antique-inspired |
| Princess Cut | Принцеса | Square shape |
| Cushion Cut | Кушон | Pillow shape |
| Oval Cut | Овал | Oval shape |
| Emerald Cut | Изумруд | Rectangular step |

---

#### L2: Wedding Bands | Сватбени халки
**Slug:** `jewelry-watches/rings/wedding`

- Classic Bands | Класически халки
- Diamond Bands | Халки с диаманти
- Eternity Bands | Вечни халки
- Matching Sets | Чифт халки
- Men's Wedding Bands | Мъжки халки

---

### L1: ⌚ WATCHES

#### L2: Luxury Watches | Луксозни часовници
**Slug:** `jewelry-watches/watches/luxury`

**Luxury Brands (Attribute):**
| Brand | BG | Price Range |
|-------|----|----|
| Rolex | Ролекс | €€€€ |
| Patek Philippe | Патек Филип | €€€€€ |
| Audemars Piguet | Одемар Пиге | €€€€€ |
| Omega | Омега | €€€ |
| Cartier | Картие | €€€€ |
| TAG Heuer | ТАГ Хойер | €€€ |
| Breitling | Брайтлинг | €€€ |
| IWC | ИВЦ | €€€€ |

---

#### L2: Vintage Watches | Винтидж часовници
**Slug:** `jewelry-watches/watches/vintage`

| EN | BG | Description |
|----|----|----|
| Vintage Rolex | Винтидж Ролекс | Collectible |
| Vintage Omega | Винтидж Омега | Classic pieces |
| Soviet Watches | Съветски часовници | Pobeda, Raketa, Vostok |
| Pocket Watches | Джобни часовници | Antique |
| Military Watches | Военни часовници | Field watches |

---

### L1: 👑 FINE JEWELRY

#### L2: Diamond Jewelry | Диамантени бижута
**Slug:** `jewelry-watches/fine/diamonds`

| EN | BG | Description |
|----|----|----|
| Diamond Rings | Диамантени пръстени | Rings |
| Diamond Necklaces | Диамантени колиета | Necklaces |
| Diamond Earrings | Диамантени обеци | Earrings |
| Diamond Bracelets | Диамантени гривни | Bracelets |

**4 C's (Attributes):**
- Cut | Шлифовка (Excellent, Very Good, Good, Fair)
- Color | Цвят (D-Z scale)
- Clarity | Чистота (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2)
- Carat | Карати (weight)

---

#### L2: Gold Jewelry | Златни бижута
**Slug:** `jewelry-watches/fine/gold`

| EN | BG | Purity |
|----|----|----|
| 24K Gold | 24-каратово злато | 999.9 |
| 22K Gold | 22-каратово злато | 916 |
| 18K Gold | 18-каратово злато | 750 |
| 14K Gold | 14-каратово злато | 585 |
| 9K Gold | 9-каратово злато | 375 |

**Gold Types:**
- Yellow Gold | Жълто злато
- White Gold | Бяло злато
- Rose Gold | Розово злато

---

#### L2: Gemstone Jewelry | Бижута със скъпоценни камъни
**Slug:** `jewelry-watches/fine/gemstones`

| EN | BG | Significance |
|----|----|----|
| Ruby | Рубин | Love, passion |
| Sapphire | Сапфир | Wisdom, royalty |
| Emerald | Изумруд | Rebirth, love |
| Amethyst | Аметист | Protection |
| Topaz | Топаз | Strength |
| Opal | Опал | Hope |
| Turquoise | Тюркоаз | Healing |
| Garnet | Гранат | Protection |

---

---

## 🏷️ Attribute System (The Power Layer)

### Jewelry Product Attributes Schema

```typescript
interface JewelryProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === JEWELRY SPECIFICS ===
  metal: Metal;
  metal_purity?: string;
  metal_weight_grams?: number;
  
  // === STONE SPECIFICS ===
  main_stone?: Stone;
  stone_carat?: number;
  stone_cut?: Cut;
  stone_color?: string;
  stone_clarity?: Clarity;
  certified: boolean;
  certification?: string;
  
  // === SIZING ===
  ring_size?: number;
  length_cm?: number;
  
  // === WATCH SPECIFICS ===
  watch_brand?: string;
  watch_model?: string;
  movement?: Movement;
  case_material?: string;
  case_diameter_mm?: number;
  water_resistance?: string;
  year?: number;
  
  // === CONDITION ===
  condition: ProductCondition;
  includes_box: boolean;
  includes_papers: boolean;
  
  // === PROVENANCE ===
  vintage: boolean;
  handmade: boolean;
  
  seller_type: 'private' | 'jeweler' | 'dealer';
  location_city: string;
  
  images: string[];
}

type Metal = 'gold' | 'silver' | 'platinum' | 'palladium' | 'stainless_steel' | 'titanium' | 'tungsten';
type Stone = 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'opal' | 'pearl' | 'amethyst' | 'topaz' | 'other';
type Cut = 'round' | 'princess' | 'cushion' | 'oval' | 'emerald' | 'pear' | 'marquise' | 'asscher' | 'radiant';
type Clarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
type Movement = 'automatic' | 'manual' | 'quartz' | 'solar' | 'kinetic';
type ProductCondition = 'new' | 'like_new' | 'excellent' | 'very_good' | 'good' | 'fair';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('jewelry-watches', 'Jewelry & Watches', 'Бижута и часовници', 'jewelry-watches', 'jewelry-watches', NULL, 0, '💎', 17, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('jw-rings', 'Rings', 'Пръстени', 'rings', 'jewelry-watches/rings', 'jewelry-watches', 1, '💍', 1, true),
('jw-necklaces', 'Necklaces', 'Колиета', 'necklaces', 'jewelry-watches/necklaces', 'jewelry-watches', 1, '📿', 2, true),
('jw-earrings', 'Earrings', 'Обеци', 'earrings', 'jewelry-watches/earrings', 'jewelry-watches', 1, '✨', 3, true),
('jw-bracelets', 'Bracelets', 'Гривни', 'bracelets', 'jewelry-watches/bracelets', 'jewelry-watches', 1, '💫', 4, true),
('jw-watches', 'Watches', 'Часовници', 'watches', 'jewelry-watches/watches', 'jewelry-watches', 1, '⌚', 5, true),
('jw-fine', 'Fine Jewelry', 'Скъпоценни бижута', 'fine', 'jewelry-watches/fine', 'jewelry-watches', 1, '👑', 6, true),
('jw-fashion', 'Fashion Jewelry', 'Модни бижута', 'fashion', 'jewelry-watches/fashion', 'jewelry-watches', 1, '🎭', 7, true),
('jw-vintage', 'Vintage & Antique', 'Винтидж и антики', 'vintage', 'jewelry-watches/vintage', 'jewelry-watches', 1, '🏺', 8, true),
('jw-supplies', 'Jewelry Supplies', 'Материали за бижута', 'supplies', 'jewelry-watches/supplies', 'jewelry-watches', 1, '🛠️', 9, true);

-- L2: Rings
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('rings-engagement', 'Engagement Rings', 'Годежни пръстени', 'engagement', 'jewelry-watches/rings/engagement', 'jw-rings', 2, '💍', 1, true),
('rings-wedding', 'Wedding Bands', 'Сватбени халки', 'wedding', 'jewelry-watches/rings/wedding', 'jw-rings', 2, '💒', 2, true),
('rings-fashion', 'Fashion Rings', 'Модни пръстени', 'fashion', 'jewelry-watches/rings/fashion', 'jw-rings', 2, '✨', 3, true),
('rings-cocktail', 'Cocktail Rings', 'Коктейлни пръстени', 'cocktail', 'jewelry-watches/rings/cocktail', 'jw-rings', 2, '🍸', 4, true),
('rings-signet', 'Signet Rings', 'Печатни пръстени', 'signet', 'jewelry-watches/rings/signet', 'jw-rings', 2, '👤', 5, true),
('rings-mens', 'Men''s Rings', 'Мъжки пръстени', 'mens', 'jewelry-watches/rings/mens', 'jw-rings', 2, '🧔', 6, true);

-- L2: Watches
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('watches-luxury', 'Luxury Watches', 'Луксозни часовници', 'luxury', 'jewelry-watches/watches/luxury', 'jw-watches', 2, '👑', 1, true),
('watches-fashion', 'Fashion Watches', 'Модни часовници', 'fashion', 'jewelry-watches/watches/fashion', 'jw-watches', 2, '👗', 2, true),
('watches-sports', 'Sports Watches', 'Спортни часовници', 'sports', 'jewelry-watches/watches/sports', 'jw-watches', 2, '🏃', 3, true),
('watches-smart', 'Smart Watches', 'Смарт часовници', 'smart', 'jewelry-watches/watches/smart', 'jw-watches', 2, '📱', 4, true),
('watches-vintage', 'Vintage Watches', 'Винтидж часовници', 'vintage', 'jewelry-watches/watches/vintage', 'jw-watches', 2, '🕰️', 5, true),
('watches-accessories', 'Watch Accessories', 'Аксесоари за часовници', 'accessories', 'jewelry-watches/watches/accessories', 'jw-watches', 2, '🔧', 6, true);

-- L2: Fine Jewelry
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fine-diamonds', 'Diamond Jewelry', 'Диамантени бижута', 'diamonds', 'jewelry-watches/fine/diamonds', 'jw-fine', 2, '💎', 1, true),
('fine-gold', 'Gold Jewelry', 'Златни бижута', 'gold', 'jewelry-watches/fine/gold', 'jw-fine', 2, '🥇', 2, true),
('fine-platinum', 'Platinum Jewelry', 'Платинени бижута', 'platinum', 'jewelry-watches/fine/platinum', 'jw-fine', 2, '⬜', 3, true),
('fine-gemstones', 'Gemstone Jewelry', 'Бижута с камъни', 'gemstones', 'jewelry-watches/fine/gemstones', 'jw-fine', 2, '💠', 4, true),
('fine-pearls', 'Pearl Jewelry', 'Перлени бижута', 'pearls', 'jewelry-watches/fine/pearls', 'jw-fine', 2, '🔮', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Jewelry & Watches | Бижута и часовници |
| Rings | Пръстени |
| Necklaces | Колиета |
| Earrings | Обеци |
| Bracelets | Гривни |
| Watches | Часовници |
| Fine Jewelry | Скъпоценни бижута |
| Fashion Jewelry | Модни бижута |

### Attribute Labels

| EN | BG |
|----|----|
| Metal | Метал |
| Gold | Злато |
| Silver | Сребро |
| Platinum | Платина |
| Carat | Карат |
| Ring Size | Размер пръстен |
| Brand | Марка |
| Movement | Механизъм |
| Water Resistance | Водоустойчивост |

### Metal Types

| EN | BG |
|----|----|
| Yellow Gold | Жълто злато |
| White Gold | Бяло злато |
| Rose Gold | Розово злато |
| Sterling Silver | Сребро 925 |
| Platinum | Платина |
| Stainless Steel | Неръждаема стомана |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add luxury watch brands reference
- [ ] Add gemstone types reference
- [ ] Test metal purity validation

### API
- [ ] GET /categories/jewelry-watches (tree structure)
- [ ] GET /products with filters
- [ ] Ring size converter
- [ ] Price tracking for luxury items

### Frontend
- [ ] Category browser
- [ ] Metal type filter
- [ ] Stone type filter
- [ ] Price range (luxury segments)
- [ ] Ring size selector
- [ ] Watch brand filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 58  
**Created:** December 3, 2025
