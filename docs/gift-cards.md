# 🎁 Gift Cards & Coupons | Ваучери и карти за подарък

**Category Slug:** `gift-cards`  
**Icon:** 🎁  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Gift Cards → Retail → Fashion |
| **Attributes** | Filtering, Search, Campaigns | Value, Brand, Expiry |
| **Tags** | Dynamic Collections & SEO | "birthday", "christmas" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🎁 Gift Cards & Coupons (L0)
│
├── 🛒 Retail Gift Cards (L1)
│   ├── Fashion & Clothing (L2)
│   ├── Electronics (L2)
│   ├── Home & Garden (L2)
│   ├── Sports (L2)
│   └── General Retail (L2)
│
├── 🍽️ Restaurant Gift Cards (L1)
│   ├── Fast Food (L2)
│   ├── Casual Dining (L2)
│   ├── Fine Dining (L2)
│   ├── Coffee Shops (L2)
│   └── Delivery Services (L2)
│
├── 🎮 Gaming Gift Cards (L1)
│   ├── Steam (L2)
│   ├── PlayStation (L2)
│   ├── Xbox (L2)
│   ├── Nintendo (L2)
│   ├── In-Game Currency (L2)
│   └── PC Gaming (L2)
│
├── 🎬 Entertainment (L1)
│   ├── Streaming Services (L2)
│   ├── Cinema (L2)
│   ├── Music Services (L2)
│   ├── E-Books (L2)
│   └── Subscriptions (L2)
│
├── 📱 Mobile & Telecom (L1)
│   ├── Mobile Top-Up (L2)
│   ├── Data Plans (L2)
│   ├── App Stores (L2)
│   └── Software (L2)
│
├── ✈️ Travel & Experiences (L1)
│   ├── Airlines (L2)
│   ├── Hotels (L2)
│   ├── Experiences (L2)
│   ├── Car Rental (L2)
│   └── Vacation Packages (L2)
│
├── 💆 Wellness & Beauty (L1)
│   ├── Spa & Massage (L2)
│   ├── Beauty Stores (L2)
│   ├── Fitness (L2)
│   └── Health Stores (L2)
│
├── 🇧🇬 Bulgarian Stores (L1)
│   ├── Supermarkets (L2)
│   ├── Department Stores (L2)
│   ├── Pharmacies (L2)
│   ├── Gas Stations (L2)
│   └── Local Chains (L2)
│
├── 💳 Prepaid Cards (L1)
│   ├── Visa Prepaid (L2)
│   ├── Mastercard Prepaid (L2)
│   └── Virtual Cards (L2)
│
└── 🏷️ Discount Coupons (L1)
    ├── Percentage Off (L2)
    ├── Fixed Amount (L2)
    ├── Buy One Get One (L2)
    └── Free Shipping (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 44 (L2) = 55 categories**

---

## 📊 Complete Category Reference

### L1: 🛒 RETAIL GIFT CARDS | КАРТИ ЗА МАГАЗИНИ

#### L2: Fashion & Clothing | Мода и дрехи
**Slug:** `gift-cards/retail/fashion`

| EN | BG | Description |
|----|----|----|
| H&M | H&M | Fast fashion |
| Zara | Зара | Fashion |
| Nike | Найк | Sportswear |
| Adidas | Адидас | Sportswear |
| Reserved | Резервд | Eastern European |
| LC Waikiki | ЛС Уайкики | Budget |

---

### L1: 🎮 GAMING GIFT CARDS | ГЕЙМИНГ КАРТИ

#### L2: Steam | Стийм
**Slug:** `gift-cards/gaming/steam`

| EN | BG | Description |
|----|----|----|
| €10 Steam | €10 Стийм | Entry |
| €20 Steam | €20 Стийм | Standard |
| €50 Steam | €50 Стийм | Full game |
| €100 Steam | €100 Стийм | Bundle |

---

#### L2: PlayStation | Плейстейшън
**Slug:** `gift-cards/gaming/playstation`

| EN | BG | Description |
|----|----|----|
| PSN €10 | PSN €10 | Small |
| PSN €25 | PSN €25 | Standard |
| PSN €50 | PSN €50 | Large |
| PS Plus | PS Plus | Subscription |

---

### L1: 🎬 ENTERTAINMENT | РАЗВЛЕЧЕНИЯ

#### L2: Streaming Services | Стрийминг услуги
**Slug:** `gift-cards/entertainment/streaming`

| EN | BG | Description |
|----|----|----|
| Netflix | Нетфликс | Movies/Series |
| Spotify | Спотифай | Music |
| Disney+ | Дисни+ | Family |
| HBO Max | ХБО Макс | Premium |
| YouTube Premium | Ютюб Премиум | Video |

---

### L1: 📱 MOBILE & TELECOM | МОБИЛНИ И ТЕЛЕКОМ

#### L2: Mobile Top-Up | Зареждане на предплатени
**Slug:** `gift-cards/mobile/topup`

**Bulgarian Carriers:**
- A1 | А1
- Yettel | Йеттел
- Vivacom | Виваком

| EN | BG | Description |
|----|----|----|
| 5 BGN | 5 лв | Basic |
| 10 BGN | 10 лв | Standard |
| 20 BGN | 20 лв | Extended |
| 50 BGN | 50 лв | Large |

---

### L1: 🇧🇬 BULGARIAN STORES | БЪЛГАРСКИ МАГАЗИНИ

#### L2: Supermarkets | Супермаркети
**Slug:** `gift-cards/bulgarian/supermarkets`

| EN | BG | Description |
|----|----|----|
| Lidl | Лидл | Discount |
| Kaufland | Кауфланд | Large |
| Billa | Билла | Premium |
| Fantastico | Фантастико | Local |
| T Market | Т Маркет | Budget |

---

---

## 🏷️ Attribute System (The Power Layer)

### Gift Card Product Attributes Schema

```typescript
interface GiftCardProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  
  // === CARD INFO ===
  card_brand: string;
  card_value: number;
  value_currency: 'BGN' | 'EUR' | 'USD';
  
  // === TYPE ===
  card_type: CardType;
  delivery_type: DeliveryType;
  
  // === VALIDITY ===
  expiry_date?: string;
  has_expiry: boolean;
  
  // === RESTRICTIONS ===
  region_restricted: boolean;
  allowed_regions?: string[];
  
  // === CONDITION ===
  is_used: boolean;
  remaining_value?: number;
  
  // === VERIFICATION ===
  is_verified: boolean;
  
  seller_type: 'private' | 'store' | 'reseller';
  location_city: string;
  
  images: string[];
}

type CardType = 'physical' | 'digital' | 'email_delivery';
type DeliveryType = 'instant' | 'same_day' | 'standard';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gift-cards', 'Gift Cards & Coupons', 'Ваучери и подаръчни карти', 'gift-cards', 'gift-cards', NULL, 0, '🎁', 31, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gc-retail', 'Retail Gift Cards', 'Карти за магазини', 'retail', 'gift-cards/retail', 'gift-cards', 1, '🛒', 1, true),
('gc-restaurant', 'Restaurant Gift Cards', 'Ресторантски карти', 'restaurant', 'gift-cards/restaurant', 'gift-cards', 1, '🍽️', 2, true),
('gc-gaming', 'Gaming Gift Cards', 'Гейминг карти', 'gaming', 'gift-cards/gaming', 'gift-cards', 1, '🎮', 3, true),
('gc-entertainment', 'Entertainment', 'Развлечения', 'entertainment', 'gift-cards/entertainment', 'gift-cards', 1, '🎬', 4, true),
('gc-mobile', 'Mobile & Telecom', 'Мобилни', 'mobile', 'gift-cards/mobile', 'gift-cards', 1, '📱', 5, true),
('gc-travel', 'Travel & Experiences', 'Пътуване', 'travel', 'gift-cards/travel', 'gift-cards', 1, '✈️', 6, true),
('gc-wellness', 'Wellness & Beauty', 'Уелнес', 'wellness', 'gift-cards/wellness', 'gift-cards', 1, '💆', 7, true),
('gc-bulgarian', 'Bulgarian Stores', 'Български магазини', 'bulgarian', 'gift-cards/bulgarian', 'gift-cards', 1, '🇧🇬', 8, true),
('gc-prepaid', 'Prepaid Cards', 'Предплатени карти', 'prepaid', 'gift-cards/prepaid', 'gift-cards', 1, '💳', 9, true),
('gc-coupons', 'Discount Coupons', 'Купони за отстъпка', 'coupons', 'gift-cards/coupons', 'gift-cards', 1, '🏷️', 10, true);

-- L2: Gaming
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gaming-steam', 'Steam', 'Стийм', 'steam', 'gift-cards/gaming/steam', 'gc-gaming', 2, '🎮', 1, true),
('gaming-ps', 'PlayStation', 'Плейстейшън', 'playstation', 'gift-cards/gaming/playstation', 'gc-gaming', 2, '🎮', 2, true),
('gaming-xbox', 'Xbox', 'Иксбокс', 'xbox', 'gift-cards/gaming/xbox', 'gc-gaming', 2, '🎮', 3, true),
('gaming-nintendo', 'Nintendo', 'Нинтендо', 'nintendo', 'gift-cards/gaming/nintendo', 'gc-gaming', 2, '🎮', 4, true),
('gaming-ingame', 'In-Game Currency', 'Вътрешна валута', 'ingame', 'gift-cards/gaming/ingame', 'gc-gaming', 2, '💎', 5, true);

-- L2: Entertainment
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('ent-streaming', 'Streaming Services', 'Стрийминг', 'streaming', 'gift-cards/entertainment/streaming', 'gc-entertainment', 2, '📺', 1, true),
('ent-cinema', 'Cinema', 'Кино', 'cinema', 'gift-cards/entertainment/cinema', 'gc-entertainment', 2, '🎬', 2, true),
('ent-music', 'Music Services', 'Музика', 'music', 'gift-cards/entertainment/music', 'gc-entertainment', 2, '🎵', 3, true),
('ent-books', 'E-Books', 'Е-книги', 'ebooks', 'gift-cards/entertainment/ebooks', 'gc-entertainment', 2, '📚', 4, true);

-- L2: Bulgarian
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bg-super', 'Supermarkets', 'Супермаркети', 'supermarkets', 'gift-cards/bulgarian/supermarkets', 'gc-bulgarian', 2, '🛒', 1, true),
('bg-dept', 'Department Stores', 'Универсални магазини', 'department', 'gift-cards/bulgarian/department', 'gc-bulgarian', 2, '🏬', 2, true),
('bg-pharm', 'Pharmacies', 'Аптеки', 'pharmacies', 'gift-cards/bulgarian/pharmacies', 'gc-bulgarian', 2, '💊', 3, true),
('bg-gas', 'Gas Stations', 'Бензиностанции', 'gas', 'gift-cards/bulgarian/gas', 'gc-bulgarian', 2, '⛽', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Gift Cards & Coupons | Ваучери и карти за подарък |
| Gaming Gift Cards | Гейминг карти |
| Entertainment | Развлечения |
| Bulgarian Stores | Български магазини |
| Prepaid Cards | Предплатени карти |

### Attribute Labels

| EN | BG |
|----|----|
| Value | Стойност |
| Expiry Date | Дата на валидност |
| Delivery Type | Тип доставка |
| Brand | Марка |
| Region | Регион |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add card brands reference
- [ ] Add value denominations reference

### Frontend
- [ ] Category browser
- [ ] Value filter
- [ ] Brand filter
- [ ] Delivery type filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 55  
**Created:** December 3, 2025
