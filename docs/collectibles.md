# 🎨 Collectibles & Art | Колекционерски предмети и изкуство

**Category Slug:** `collectibles`  
**Icon:** 🎨  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Collectibles → Coins → Ancient |
| **Attributes** | Filtering, Search, Campaigns | Era, Material, Condition |
| **Tags** | Dynamic Collections & SEO | "rare", "authenticated" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🎨 Collectibles & Art (L0)
│
├── 🪙 Coins & Currency (L1)
│   ├── Ancient Coins (L2)
│   ├── World Coins (L2)
│   ├── Bulgarian Coins (L2)
│   ├── Banknotes (L2)
│   ├── Bullion Coins (L2)
│   └── Commemorative (L2)
│
├── 📮 Stamps (L1)
│   ├── Bulgarian Stamps (L2)
│   ├── World Stamps (L2)
│   ├── First Day Covers (L2)
│   ├── Stamp Collections (L2)
│   └── Philatelic Supplies (L2)
│
├── 🖼️ Fine Art (L1)
│   ├── Paintings (L2)
│   ├── Prints (L2)
│   ├── Sculptures (L2)
│   ├── Photography (L2)
│   ├── Digital Art (L2)
│   └── Bulgarian Art (L2)
│
├── 🏺 Antiques (L1)
│   ├── Furniture (L2)
│   ├── Porcelain (L2)
│   ├── Silverware (L2)
│   ├── Glassware (L2)
│   ├── Clocks (L2)
│   └── Textiles (L2)
│
├── 🎖️ Militaria (L1)
│   ├── Medals (L2)
│   ├── Uniforms (L2)
│   ├── Weapons (L2)
│   ├── Documents (L2)
│   └── Bulgarian Military (L2)
│
├── ⚽ Sports Memorabilia (L1)
│   ├── Autographs (L2)
│   ├── Trading Cards (L2)
│   ├── Jerseys (L2)
│   ├── Equipment (L2)
│   └── Bulgarian Sports (L2)
│
├── 🎬 Entertainment (L1)
│   ├── Movie Props (L2)
│   ├── Celebrity Items (L2)
│   ├── Music Memorabilia (L2)
│   ├── Posters (L2)
│   └── Vinyl Records (L2)
│
├── 🧸 Vintage Toys (L1)
│   ├── Action Figures (L2)
│   ├── Dolls (L2)
│   ├── Model Cars (L2)
│   ├── Board Games (L2)
│   └── Bulgarian Toys (L2)
│
├── 📚 Books & Manuscripts (L1)
│   ├── Rare Books (L2)
│   ├── First Editions (L2)
│   ├── Manuscripts (L2)
│   ├── Maps (L2)
│   └── Bulgarian Books (L2)
│
└── 🔮 Oddities & Curiosities (L1)
    ├── Natural Specimens (L2)
    ├── Scientific Items (L2)
    ├── Occult Items (L2)
    └── Unique Objects (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 52 (L2) = 63 categories**

---

## 📊 Complete Category Reference

### L1: 🪙 COINS & CURRENCY | МОНЕТИ И ВАЛУТА

#### L2: Bulgarian Coins | Български монети
**Slug:** `collectibles/coins/bulgarian`

| EN | BG | Description |
|----|----|----|
| Kingdom Era | Царство | 1879-1946 |
| Socialist Era | Социализъм | 1944-1989 |
| Modern Era | Модерни | 1990-present |
| Medieval | Средновековни | Pre-1878 |
| Commemorative | Юбилейни | Special issues |

---

#### L2: Ancient Coins | Антични монети
**Slug:** `collectibles/coins/ancient`

| EN | BG | Description |
|----|----|----|
| Greek | Гръцки | Ancient Greece |
| Roman | Римски | Roman Empire |
| Byzantine | Византийски | Byzantine |
| Thracian | Тракийски | Local ancient |
| Celtic | Келтски | Celtic tribes |

---

### L1: 🖼️ FINE ART | ИЗЯЩНО ИЗКУСТВО

#### L2: Paintings | Картини
**Slug:** `collectibles/art/paintings`

| EN | BG | Description |
|----|----|----|
| Oil Paintings | Маслени картини | Traditional |
| Watercolors | Акварели | Water-based |
| Acrylic | Акрилни | Modern |
| Mixed Media | Смесена техника | Combined |
| Original Works | Оригинали | One-of-a-kind |

**Bulgarian Artists:**
- Vladimir Dimitrov-Maistora | Владимир Димитров-Майстора
- Zlatyu Boyadzhiev | Златю Бояджиев
- Ivan Milev | Иван Милев

---

### L1: 🏺 ANTIQUES | АНТИКИ

#### L2: Porcelain | Порцелан
**Slug:** `collectibles/antiques/porcelain`

| EN | BG | Description |
|----|----|----|
| Meissen | Майсен | German |
| Royal Copenhagen | Роял Копенхаген | Danish |
| Bulgarian Porcelain | Български порцелан | Local |
| Chinese | Китайски | Oriental |
| Figurines | Фигурки | Decorative |

---

### L1: 🎖️ MILITARIA | ВОЕННИ ПРЕДМЕТИ

#### L2: Bulgarian Military | Българска военна история
**Slug:** `collectibles/militaria/bulgarian`

| EN | BG | Description |
|----|----|----|
| Balkan Wars | Балкански войни | 1912-1913 |
| WWI | Първа световна | 1914-1918 |
| WWII | Втора световна | 1939-1945 |
| Socialist Era | Социализъм | 1944-1989 |
| Modern | Модерни | Post-1989 |

---

---

## 🏷️ Attribute System (The Power Layer)

### Collectible Product Attributes Schema

```typescript
interface CollectibleProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === ITEM INFO ===
  era?: string;
  year?: number;
  origin_country: string;
  
  // === CONDITION ===
  condition: CollectibleCondition;
  condition_notes?: string;
  
  // === AUTHENTICATION ===
  is_authenticated: boolean;
  certificate?: string;
  provenance?: string;
  
  // === PHYSICAL ===
  dimensions_cm?: string;
  weight_g?: number;
  material?: string;
  
  // === COIN SPECIFIC ===
  denomination?: string;
  mint_mark?: string;
  grading?: CoinGrade;
  
  // === ART SPECIFIC ===
  artist?: string;
  medium?: string;
  signed: boolean;
  framed: boolean;
  
  seller_type: 'private' | 'dealer' | 'auction_house';
  location_city: string;
  
  images: string[];
}

type CollectibleCondition = 'mint' | 'near_mint' | 'excellent' | 'very_good' | 'good' | 'fair' | 'poor';
type CoinGrade = 'MS70' | 'MS69' | 'MS68' | 'MS67' | 'MS66' | 'MS65' | 'AU' | 'XF' | 'VF' | 'F' | 'VG' | 'G';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('collectibles', 'Collectibles & Art', 'Колекции и изкуство', 'collectibles', 'collectibles', NULL, 0, '🎨', 28, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('col-coins', 'Coins & Currency', 'Монети и валута', 'coins', 'collectibles/coins', 'collectibles', 1, '🪙', 1, true),
('col-stamps', 'Stamps', 'Марки', 'stamps', 'collectibles/stamps', 'collectibles', 1, '📮', 2, true),
('col-art', 'Fine Art', 'Изящно изкуство', 'art', 'collectibles/art', 'collectibles', 1, '🖼️', 3, true),
('col-antiques', 'Antiques', 'Антики', 'antiques', 'collectibles/antiques', 'collectibles', 1, '🏺', 4, true),
('col-militaria', 'Militaria', 'Военни предмети', 'militaria', 'collectibles/militaria', 'collectibles', 1, '🎖️', 5, true),
('col-sports', 'Sports Memorabilia', 'Спортни колекции', 'sports', 'collectibles/sports', 'collectibles', 1, '⚽', 6, true),
('col-entertainment', 'Entertainment', 'Развлечения', 'entertainment', 'collectibles/entertainment', 'collectibles', 1, '🎬', 7, true),
('col-toys', 'Vintage Toys', 'Ретро играчки', 'toys', 'collectibles/toys', 'collectibles', 1, '🧸', 8, true),
('col-books', 'Books & Manuscripts', 'Книги и ръкописи', 'books', 'collectibles/books', 'collectibles', 1, '📚', 9, true),
('col-oddities', 'Oddities & Curiosities', 'Куриози', 'oddities', 'collectibles/oddities', 'collectibles', 1, '🔮', 10, true);

-- L2: Coins
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('coins-ancient', 'Ancient Coins', 'Антични монети', 'ancient', 'collectibles/coins/ancient', 'col-coins', 2, '🏛️', 1, true),
('coins-world', 'World Coins', 'Световни монети', 'world', 'collectibles/coins/world', 'col-coins', 2, '🌍', 2, true),
('coins-bulgarian', 'Bulgarian Coins', 'Български монети', 'bulgarian', 'collectibles/coins/bulgarian', 'col-coins', 2, '🇧🇬', 3, true),
('coins-banknotes', 'Banknotes', 'Банкноти', 'banknotes', 'collectibles/coins/banknotes', 'col-coins', 2, '💵', 4, true),
('coins-bullion', 'Bullion Coins', 'Инвестиционни', 'bullion', 'collectibles/coins/bullion', 'col-coins', 2, '🥇', 5, true);

-- L2: Art
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('art-paintings', 'Paintings', 'Картини', 'paintings', 'collectibles/art/paintings', 'col-art', 2, '🎨', 1, true),
('art-prints', 'Prints', 'Графики', 'prints', 'collectibles/art/prints', 'col-art', 2, '🖼️', 2, true),
('art-sculpture', 'Sculptures', 'Скулптури', 'sculptures', 'collectibles/art/sculptures', 'col-art', 2, '🗿', 3, true),
('art-photo', 'Photography', 'Фотография', 'photography', 'collectibles/art/photography', 'col-art', 2, '📷', 4, true),
('art-digital', 'Digital Art', 'Дигитално изкуство', 'digital', 'collectibles/art/digital', 'col-art', 2, '💻', 5, true),
('art-bulgarian', 'Bulgarian Art', 'Българско изкуство', 'bulgarian', 'collectibles/art/bulgarian', 'col-art', 2, '🇧🇬', 6, true);

-- L2: Antiques
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('antiq-furniture', 'Furniture', 'Мебели', 'furniture', 'collectibles/antiques/furniture', 'col-antiques', 2, '🪑', 1, true),
('antiq-porcelain', 'Porcelain', 'Порцелан', 'porcelain', 'collectibles/antiques/porcelain', 'col-antiques', 2, '🏺', 2, true),
('antiq-silver', 'Silverware', 'Сребърни изделия', 'silverware', 'collectibles/antiques/silverware', 'col-antiques', 2, '🥄', 3, true),
('antiq-glass', 'Glassware', 'Стъклени изделия', 'glassware', 'collectibles/antiques/glassware', 'col-antiques', 2, '🍷', 4, true),
('antiq-clocks', 'Clocks', 'Часовници', 'clocks', 'collectibles/antiques/clocks', 'col-antiques', 2, '🕰️', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Collectibles & Art | Колекционерски предмети и изкуство |
| Coins & Currency | Монети и валута |
| Fine Art | Изящно изкуство |
| Antiques | Антики |
| Militaria | Военни предмети |

### Attribute Labels

| EN | BG |
|----|----|
| Condition | Състояние |
| Era | Ера |
| Authenticated | Автентифицирано |
| Artist | Художник |
| Origin | Произход |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add condition grades reference
- [ ] Add era periods reference

### Frontend
- [ ] Category browser
- [ ] Condition filter
- [ ] Era filter
- [ ] Authentication badge

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 63  
**Created:** December 3, 2025
