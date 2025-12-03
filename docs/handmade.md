# 🧶 Handmade & Crafts | Ръчна изработка и занаяти

**Category Slug:** `handmade`  
**Icon:** 🧶  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Handmade → Jewelry → Necklaces |
| **Attributes** | Filtering, Search, Campaigns | Material, Artisan, Custom |
| **Tags** | Dynamic Collections & SEO | "unique", "personalized" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🧶 Handmade & Crafts (L0)
│
├── 💍 Handmade Jewelry (L1)
│   ├── Necklaces (L2)
│   ├── Earrings (L2)
│   ├── Bracelets (L2)
│   ├── Rings (L2)
│   ├── Brooches (L2)
│   └── Jewelry Sets (L2)
│
├── 👗 Handmade Clothing (L1)
│   ├── Dresses (L2)
│   ├── Knitwear (L2)
│   ├── Embroidered Items (L2)
│   ├── Baby Clothing (L2)
│   ├── Accessories (L2)
│   └── Bags (L2)
│
├── 🏠 Home Decor (L1)
│   ├── Wall Art (L2)
│   ├── Candles (L2)
│   ├── Vases (L2)
│   ├── Pillows & Textiles (L2)
│   ├── Dream Catchers (L2)
│   └── Macrame (L2)
│
├── 🎨 Art & Paintings (L1)
│   ├── Oil Paintings (L2)
│   ├── Watercolors (L2)
│   ├── Digital Prints (L2)
│   ├── Custom Portraits (L2)
│   ├── Illustrations (L2)
│   └── Pet Portraits (L2)
│
├── 🧸 Toys & Dolls (L1)
│   ├── Crochet Toys (L2)
│   ├── Cloth Dolls (L2)
│   ├── Wooden Toys (L2)
│   ├── Puzzle Toys (L2)
│   └── Plush Animals (L2)
│
├── 📿 Beads & Accessories (L1)
│   ├── Beaded Jewelry (L2)
│   ├── Hair Accessories (L2)
│   ├── Key Chains (L2)
│   ├── Phone Charms (L2)
│   └── Bookmarks (L2)
│
├── 🧴 Natural Cosmetics (L1)
│   ├── Handmade Soaps (L2)
│   ├── Bath Bombs (L2)
│   ├── Lip Balms (L2)
│   ├── Natural Creams (L2)
│   └── Essential Oils (L2)
│
├── 🍯 Food & Treats (L1)
│   ├── Homemade Jams (L2)
│   ├── Honey Products (L2)
│   ├── Baked Goods (L2)
│   ├── Chocolate (L2)
│   └── Herbal Products (L2)
│
├── 📔 Paper & Stationery (L1)
│   ├── Handmade Cards (L2)
│   ├── Journals (L2)
│   ├── Invitations (L2)
│   ├── Gift Wrap (L2)
│   └── Calligraphy (L2)
│
└── 🎄 Seasonal & Holiday (L1)
    ├── Christmas Crafts (L2)
    ├── Easter Crafts (L2)
    ├── Wedding Items (L2)
    ├── Baby Shower (L2)
    └── Birthday Items (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 51 (L2) = 62 categories**

---

## 📊 Complete Category Reference

### L1: 💍 HANDMADE JEWELRY | РЪЧНО ИЗРАБОТЕНИ БИЖУТА

#### L2: Necklaces | Колиета
**Slug:** `handmade/jewelry/necklaces`

| EN | BG | Description |
|----|----|----|
| Pendant Necklaces | Колиета с медальон | Charm style |
| Beaded Necklaces | Мъниста колиета | Beads |
| Wire Wrapped | Усукан тел | Art wire |
| Statement | Масивни | Bold |
| Minimalist | Минималистични | Simple |
| Personalized | Персонализирани | Custom name |

---

### L1: 👗 HANDMADE CLOTHING | РЪЧНО ИЗРАБОТЕНИ ДРЕХИ

#### L2: Knitwear | Плетени изделия
**Slug:** `handmade/clothing/knitwear`

| EN | BG | Description |
|----|----|----|
| Sweaters | Пуловери | Knit |
| Scarves | Шалове | Winter |
| Hats | Шапки | Beanies |
| Baby Clothes | Бебешки дрехи | Infant |
| Blankets | Одеяла | Home |
| Cardigans | Жилетки | Open front |

---

### L1: 🏠 HOME DECOR | ДОМАШЕН ДЕКОР

#### L2: Candles | Свещи
**Slug:** `handmade/home/candles`

| EN | BG | Description |
|----|----|----|
| Scented Candles | Ароматни свещи | Fragrant |
| Soy Candles | Соеви свещи | Natural |
| Beeswax | Восъчни | Natural |
| Decorative | Декоративни | Display |
| Candle Sets | Комплекти | Gift sets |

---

### L1: 🧴 NATURAL COSMETICS | НАТУРАЛНА КОЗМЕТИКА

#### L2: Handmade Soaps | Ръчно направени сапуни
**Slug:** `handmade/cosmetics/soaps`

| EN | BG | Description |
|----|----|----|
| Olive Oil Soap | Сапун с зехтин | Traditional |
| Herbal Soap | Билкови сапуни | Herbs |
| Goat Milk | С козе мляко | Moisturizing |
| Charcoal | С активен въглен | Cleansing |
| Floral | Цветни | Fragrant |

---

### L1: 🇧🇬 BULGARIAN CRAFTS | БЪЛГАРСКИ ЗАНАЯТИ

**Integrated throughout categories with Bulgarian artisan focus:**

- Rose Products | Розови продукти
- Traditional Embroidery | Традиционна бродерия
- Martenitsi | Мартеници
- Troyan Pottery | Троянска керамика
- Chiprovtsi Carpets | Чипровски килими

---

---

## 🏷️ Attribute System (The Power Layer)

### Handmade Product Attributes Schema

```typescript
interface HandmadeProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === ARTISAN INFO ===
  artisan_name?: string;
  shop_name?: string;
  
  // === PRODUCT INFO ===
  materials: string[];
  colors?: string[];
  
  // === HANDMADE SPECIFICS ===
  production_time_days: number;
  is_custom_order: boolean;
  is_personalized: boolean;
  
  // === DIMENSIONS ===
  dimensions?: string;
  weight_g?: number;
  
  // === CARE ===
  care_instructions?: string;
  
  // === ORIGIN ===
  made_in: string;
  is_organic?: boolean;
  
  seller_type: 'artisan' | 'small_business' | 'store';
  location_city: string;
  
  images: string[];
}
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('handmade', 'Handmade & Crafts', 'Ръчна изработка', 'handmade', 'handmade', NULL, 0, '🧶', 32, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('hm-jewelry', 'Handmade Jewelry', 'Ръчни бижута', 'jewelry', 'handmade/jewelry', 'handmade', 1, '💍', 1, true),
('hm-clothing', 'Handmade Clothing', 'Ръчни дрехи', 'clothing', 'handmade/clothing', 'handmade', 1, '👗', 2, true),
('hm-home', 'Home Decor', 'Домашен декор', 'home', 'handmade/home', 'handmade', 1, '🏠', 3, true),
('hm-art', 'Art & Paintings', 'Изкуство', 'art', 'handmade/art', 'handmade', 1, '🎨', 4, true),
('hm-toys', 'Toys & Dolls', 'Играчки и кукли', 'toys', 'handmade/toys', 'handmade', 1, '🧸', 5, true),
('hm-beads', 'Beads & Accessories', 'Мъниста', 'beads', 'handmade/beads', 'handmade', 1, '📿', 6, true),
('hm-cosmetics', 'Natural Cosmetics', 'Натурална козметика', 'cosmetics', 'handmade/cosmetics', 'handmade', 1, '🧴', 7, true),
('hm-food', 'Food & Treats', 'Храни', 'food', 'handmade/food', 'handmade', 1, '🍯', 8, true),
('hm-paper', 'Paper & Stationery', 'Хартия', 'paper', 'handmade/paper', 'handmade', 1, '📔', 9, true),
('hm-seasonal', 'Seasonal & Holiday', 'Сезонни', 'seasonal', 'handmade/seasonal', 'handmade', 1, '🎄', 10, true);

-- L2: Jewelry
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('jew-necklaces', 'Necklaces', 'Колиета', 'necklaces', 'handmade/jewelry/necklaces', 'hm-jewelry', 2, '📿', 1, true),
('jew-earrings', 'Earrings', 'Обеци', 'earrings', 'handmade/jewelry/earrings', 'hm-jewelry', 2, '💎', 2, true),
('jew-bracelets', 'Bracelets', 'Гривни', 'bracelets', 'handmade/jewelry/bracelets', 'hm-jewelry', 2, '⭕', 3, true),
('jew-rings', 'Rings', 'Пръстени', 'rings', 'handmade/jewelry/rings', 'hm-jewelry', 2, '💍', 4, true),
('jew-brooches', 'Brooches', 'Брошки', 'brooches', 'handmade/jewelry/brooches', 'hm-jewelry', 2, '🌸', 5, true);

-- L2: Home
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('home-wall', 'Wall Art', 'Стенно изкуство', 'wall-art', 'handmade/home/wall-art', 'hm-home', 2, '🖼️', 1, true),
('home-candles', 'Candles', 'Свещи', 'candles', 'handmade/home/candles', 'hm-home', 2, '🕯️', 2, true),
('home-vases', 'Vases', 'Вази', 'vases', 'handmade/home/vases', 'hm-home', 2, '🏺', 3, true),
('home-pillows', 'Pillows & Textiles', 'Възглавници', 'pillows', 'handmade/home/pillows', 'hm-home', 2, '🛋️', 4, true),
('home-macrame', 'Macrame', 'Макраме', 'macrame', 'handmade/home/macrame', 'hm-home', 2, '🧵', 5, true);

-- L2: Cosmetics
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cosm-soaps', 'Handmade Soaps', 'Ръчни сапуни', 'soaps', 'handmade/cosmetics/soaps', 'hm-cosmetics', 2, '🧼', 1, true),
('cosm-bath', 'Bath Bombs', 'Бомбички за вана', 'bath-bombs', 'handmade/cosmetics/bath-bombs', 'hm-cosmetics', 2, '🛁', 2, true),
('cosm-lip', 'Lip Balms', 'Балсами за устни', 'lip-balms', 'handmade/cosmetics/lip-balms', 'hm-cosmetics', 2, '💋', 3, true),
('cosm-cream', 'Natural Creams', 'Натурални кремове', 'creams', 'handmade/cosmetics/creams', 'hm-cosmetics', 2, '🧴', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Handmade & Crafts | Ръчна изработка и занаяти |
| Handmade Jewelry | Ръчно изработени бижута |
| Home Decor | Домашен декор |
| Natural Cosmetics | Натурална козметика |
| Art & Paintings | Изкуство и картини |

### Attribute Labels

| EN | BG |
|----|----|
| Material | Материал |
| Artisan | Майстор |
| Custom Order | По поръчка |
| Personalized | Персонализирано |
| Production Time | Време за изработка |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add materials reference
- [ ] Add artisan profiles

### Frontend
- [ ] Category browser
- [ ] Material filter
- [ ] Custom order filter
- [ ] Artisan profiles

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 62  
**Created:** December 3, 2025
