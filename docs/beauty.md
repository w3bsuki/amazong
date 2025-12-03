# 💄 Beauty & Personal Care | Красота и Лична грижа

**Category Slug:** `beauty`  
**Icon:** 💄  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Beauty → Makeup → Lipstick |
| **Attributes** | Filtering, Search, Campaigns | Brand, Skin Type, Shade, Ingredients |
| **Tags** | Dynamic Collections & SEO | "vegan", "organic", "cruelty-free" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
💄 Beauty & Personal Care (L0)
│
├── 💋 Makeup (L1)
│   ├── Face Makeup (L2)
│   ├── Eye Makeup (L2)
│   ├── Lip Makeup (L2)
│   ├── Nail Care (L2)
│   ├── Makeup Brushes & Tools (L2)
│   └── Makeup Sets (L2)
│
├── 🧴 Skincare (L1)
│   ├── Cleansers (L2)
│   ├── Moisturizers (L2)
│   ├── Serums & Treatments (L2)
│   ├── Masks (L2)
│   ├── Sun Care (L2)
│   ├── Eye Care (L2)
│   └── Lip Care (L2)
│
├── 💇 Hair Care (L1)
│   ├── Shampoo & Conditioner (L2)
│   ├── Hair Treatments (L2)
│   ├── Styling Products (L2)
│   ├── Hair Color (L2)
│   ├── Hair Tools (L2)
│   └── Hair Accessories (L2)
│
├── 🌸 Fragrance (L1)
│   ├── Women's Perfume (L2)
│   ├── Men's Cologne (L2)
│   ├── Unisex Fragrances (L2)
│   ├── Body Mists (L2)
│   └── Gift Sets (L2)
│
├── 🧼 Bath & Body (L1)
│   ├── Body Wash & Soap (L2)
│   ├── Body Lotions & Creams (L2)
│   ├── Body Scrubs & Exfoliators (L2)
│   ├── Deodorants (L2)
│   ├── Hand Care (L2)
│   └── Bath Accessories (L2)
│
├── 🪥 Oral Care (L1)
│   ├── Toothbrushes (L2)
│   ├── Toothpaste (L2)
│   ├── Mouthwash (L2)
│   ├── Dental Floss (L2)
│   └── Teeth Whitening (L2)
│
├── 🧔 Men's Grooming (L1)
│   ├── Shaving (L2)
│   ├── Beard Care (L2)
│   ├── Men's Skincare (L2)
│   └── Men's Hair Care (L2)
│
└── 💅 Salon & Spa (L1)
    ├── Salon Equipment (L2)
    ├── Professional Products (L2)
    └── Spa Accessories (L2)
```

**Total Categories: 1 (L0) + 8 (L1) + 39 (L2) = 48 categories**

---

## 📊 Complete Category Reference

### L1: 💋 MAKEUP

#### L2: Face Makeup | Грим за лице
**Slug:** `makeup/face`

| EN | BG | Description |
|----|----|----|
| Foundation | Фон дьо тен | Base coverage |
| Concealer | Коректор | Cover imperfections |
| Powder | Пудра | Setting/finishing |
| Blush | Руж | Cheek color |
| Bronzer | Бронзант | Warmth/contour |
| Highlighter | Хайлайтър | Glow/shimmer |
| Primer | Праймър | Prep base |
| Setting Spray | Фиксиращ спрей | Lock makeup |
| BB/CC Cream | BB/CC крем | Tinted moisturizer |

---

#### L2: Eye Makeup | Грим за очи
**Slug:** `makeup/eyes`

| EN | BG | Description |
|----|----|----|
| Eyeshadow | Сенки за очи | Eye color |
| Eyeshadow Palette | Палитра сенки | Multiple shades |
| Eyeliner | Очна линия | Define eyes |
| Mascara | Спирала | Lash enhancement |
| Eyebrow Products | Продукти за вежди | Brow definition |
| False Lashes | Изкуствени мигли | Lash extensions |
| Eye Primer | Праймър за очи | Prep eyelids |

---

#### L2: Lip Makeup | Грим за устни
**Slug:** `makeup/lips`

| EN | BG | Description |
|----|----|----|
| Lipstick | Червило | Classic lip color |
| Liquid Lipstick | Течно червило | Long-wearing |
| Lip Gloss | Гланц за устни | Shiny finish |
| Lip Liner | Молив за устни | Define lips |
| Lip Stain | Тинт за устни | Sheer color |
| Lip Balm | Балсам за устни | Moisturizing |

---

#### L2: Nail Care | Грижа за нокти
**Slug:** `makeup/nails`

- Nail Polish | Лак за нокти
- Gel Polish | Гел лак
- Nail Art | Декорации за нокти
- Nail Care | Грижа за нокти
- Nail Tools | Инструменти за нокти
- Nail Treatments | Лечебни продукти

---

#### L2: Makeup Brushes & Tools | Четки и инструменти
**Slug:** `makeup/brushes-tools`

- Face Brushes | Четки за лице
- Eye Brushes | Четки за очи
- Lip Brushes | Четки за устни
- Brush Sets | Комплекти четки
- Sponges | Гъбички
- Makeup Bags | Несесери
- Mirrors | Огледала

---

### L1: 🧴 SKINCARE

#### L2: Cleansers | Почистващи продукти
**Slug:** `skincare/cleansers`

| EN | BG | Description |
|----|----|----|
| Face Wash | Измиващ гел | Daily cleansing |
| Micellar Water | Мицеларна вода | Gentle removal |
| Cleansing Oil | Почистващо масло | Oil-based |
| Cleansing Balm | Почистващ балсам | Melting formula |
| Foam Cleanser | Почистваща пяна | Foaming |
| Makeup Remover | Демакиант | Makeup removal |
| Toner | Тоник | Balance skin |
| Exfoliator | Ексфолиант | Dead skin removal |

---

#### L2: Moisturizers | Хидратанти
**Slug:** `skincare/moisturizers`

| EN | BG | Description |
|----|----|----|
| Day Cream | Дневен крем | Daytime use |
| Night Cream | Нощен крем | Overnight repair |
| Face Lotion | Лосион за лице | Lightweight |
| Face Oil | Масло за лице | Nourishing |
| Gel Moisturizer | Гел хидратант | Oil-free |
| Anti-Aging Cream | Антиейдж крем | Wrinkle-fighting |

---

#### L2: Serums & Treatments | Серуми и Третмани
**Slug:** `skincare/serums-treatments`

- Vitamin C Serum | Серум с витамин С
- Hyaluronic Acid | Хиалуронова киселина
- Retinol | Ретинол
- Niacinamide | Ниацинамид
- Acne Treatment | Лечение на акне
- Dark Spot Treatment | Лечение на петна
- Anti-Aging Serum | Антиейдж серум

---

#### L2: Sun Care | Слънцезащита
**Slug:** `skincare/sun-care`

- Sunscreen | Слънцезащитен крем
- Facial Sunscreen | Слънцезащита за лице
- Body Sunscreen | Слънцезащита за тяло
- After Sun | След слънце
- Self Tanner | Автобронзант
- Tanning Oil | Масло за тен

---

### L1: 💇 HAIR CARE

#### L2: Shampoo & Conditioner | Шампоани и Балсами
**Slug:** `haircare/shampoo-conditioner`

| EN | BG | Description |
|----|----|----|
| Shampoo | Шампоан | Cleansing |
| Conditioner | Балсам | Softening |
| 2-in-1 | 2 в 1 | Combined |
| Dry Shampoo | Сух шампоан | Refresh without water |
| Anti-Dandruff | Против пърхот | Dandruff control |
| Color-Safe | За боядисана коса | Color protection |
| Volume | За обем | Volumizing |
| Repair | Възстановяващ | Damage repair |

---

#### L2: Hair Treatments | Третмани за коса
**Slug:** `haircare/treatments`

- Hair Masks | Маски за коса
- Hair Oils | Масла за коса
- Leave-In Conditioner | Балсам без изплакване
- Scalp Treatment | Третман за скалп
- Hair Serum | Серум за коса
- Protein Treatment | Протеинов третман

---

#### L2: Styling Products | Продукти за стайлинг
**Slug:** `haircare/styling`

- Hair Gel | Гел за коса
- Hair Mousse | Пяна за коса
- Hair Spray | Лак за коса
- Hair Wax | Восък за коса
- Hair Cream | Крем за коса
- Heat Protectant | Термозащита

---

#### L2: Hair Color | Боя за коса
**Slug:** `haircare/color`

- Permanent Color | Трайна боя
- Semi-Permanent | Полутрайна боя
- Root Touch-Up | Коректор за израстък
- Highlights | Кичури
- Color Depositing | Тониращ

---

#### L2: Hair Tools | Уреди за коса
**Slug:** `haircare/tools`

- Hair Dryers | Сешоари
- Flat Irons | Преси за коса
- Curling Irons | Маши
- Hot Brushes | Термо четки
- Hair Clippers | Машинки за подстригване
- Diffusers | Дифузери

---

### L1: 🌸 FRAGRANCE

#### L2: Women's Perfume | Дамски парфюми
**Slug:** `fragrance/womens`

| EN | BG | Description |
|----|----|----|
| Eau de Parfum | Парфюмна вода | Long-lasting |
| Eau de Toilette | Тоалетна вода | Lighter |
| Perfume | Парфюм | Concentrated |
| Body Mist | Спрей за тяло | Light fragrance |

**Scent Families (Attribute):**
- Floral | Цветни
- Oriental | Ориенталски
- Fresh | Свежи
- Woody | Дървесни
- Fruity | Плодови
- Gourmand | Гурме

---

#### L2: Men's Cologne | Мъжки парфюми
**Slug:** `fragrance/mens`

- Eau de Parfum | Парфюмна вода
- Eau de Toilette | Тоалетна вода
- Cologne | Одеколон
- Aftershave | Афтършейв

---

### L1: 🧔 MEN'S GROOMING

#### L2: Shaving | Бръснене
**Slug:** `mens-grooming/shaving`

- Razors | Самобръсначки
- Shaving Cream | Крем за бръснене
- Shaving Gel | Гел за бръснене
- Aftershave | Афтършейв
- Pre-Shave | Преди бръснене
- Electric Shavers | Електрически бръсначи

---

#### L2: Beard Care | Грижа за брада
**Slug:** `mens-grooming/beard`

- Beard Oil | Масло за брада
- Beard Balm | Балсам за брада
- Beard Wash | Шампоан за брада
- Beard Comb | Гребен за брада
- Beard Trimmer | Тример за брада

---

---

## 🏷️ Attribute System (The Power Layer)

### Beauty Product Attributes Schema

```typescript
interface BeautyProduct {
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
  product_line?: string;
  
  // === SKIN/HAIR TYPE ===
  skin_type?: SkinType[];
  hair_type?: HairType[];
  concern?: string[];
  
  // === SHADE/COLOR ===
  shade?: string;
  shade_family?: string;
  finish?: FinishType;
  
  // === FORMULATION ===
  formulation?: string;
  spf?: number;
  volume?: string;
  
  // === CERTIFICATIONS ===
  vegan: boolean;
  cruelty_free: boolean;
  organic: boolean;
  paraben_free: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  expiry_date?: string;
  sealed: boolean;
  
  seller_type: 'private' | 'dealer';
  location_city: string;
  
  images: string[];
}

type SkinType = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'mature';
type HairType = 'straight' | 'wavy' | 'curly' | 'coily' | 'fine' | 'thick' | 'color_treated';
type FinishType = 'matte' | 'dewy' | 'satin' | 'shimmer' | 'glitter' | 'natural';
type ProductCondition = 'new_sealed' | 'new_opened' | 'used' | 'sample';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('beauty', 'Beauty & Personal Care', 'Красота и лична грижа', 'beauty', 'beauty', NULL, 0, '💄', 9, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('makeup', 'Makeup', 'Грим', 'makeup', 'beauty/makeup', 'beauty', 1, '💋', 1, true),
('skincare', 'Skincare', 'Грижа за кожата', 'skincare', 'beauty/skincare', 'beauty', 1, '🧴', 2, true),
('haircare', 'Hair Care', 'Грижа за косата', 'haircare', 'beauty/haircare', 'beauty', 1, '💇', 3, true),
('fragrance', 'Fragrance', 'Парфюмерия', 'fragrance', 'beauty/fragrance', 'beauty', 1, '🌸', 4, true),
('bath-body', 'Bath & Body', 'Баня и тяло', 'bath-body', 'beauty/bath-body', 'beauty', 1, '🧼', 5, true),
('oral-care', 'Oral Care', 'Грижа за устата', 'oral-care', 'beauty/oral-care', 'beauty', 1, '🪥', 6, true),
('mens-grooming', 'Men''s Grooming', 'Мъжка грижа', 'mens-grooming', 'beauty/mens-grooming', 'beauty', 1, '🧔', 7, true),
('salon-spa', 'Salon & Spa', 'Салон и СПА', 'salon-spa', 'beauty/salon-spa', 'beauty', 1, '💅', 8, true);

-- L2: Makeup
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('makeup-face', 'Face Makeup', 'Грим за лице', 'face', 'makeup/face', 'makeup', 2, '👩', 1, true),
('makeup-eyes', 'Eye Makeup', 'Грим за очи', 'eyes', 'makeup/eyes', 'makeup', 2, '👁️', 2, true),
('makeup-lips', 'Lip Makeup', 'Грим за устни', 'lips', 'makeup/lips', 'makeup', 2, '💋', 3, true),
('makeup-nails', 'Nail Care', 'Грижа за нокти', 'nails', 'makeup/nails', 'makeup', 2, '💅', 4, true),
('makeup-brushes', 'Makeup Brushes & Tools', 'Четки и инструменти', 'brushes-tools', 'makeup/brushes-tools', 'makeup', 2, '🖌️', 5, true),
('makeup-sets', 'Makeup Sets', 'Комплекти грим', 'sets', 'makeup/sets', 'makeup', 2, '🎁', 6, true);

-- L2: Skincare
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('skincare-cleansers', 'Cleansers', 'Почистващи продукти', 'cleansers', 'skincare/cleansers', 'skincare', 2, '🧴', 1, true),
('skincare-moisturizers', 'Moisturizers', 'Хидратанти', 'moisturizers', 'skincare/moisturizers', 'skincare', 2, '💧', 2, true),
('skincare-serums', 'Serums & Treatments', 'Серуми и третмани', 'serums-treatments', 'skincare/serums-treatments', 'skincare', 2, '✨', 3, true),
('skincare-masks', 'Masks', 'Маски', 'masks', 'skincare/masks', 'skincare', 2, '🎭', 4, true),
('skincare-suncare', 'Sun Care', 'Слънцезащита', 'sun-care', 'skincare/sun-care', 'skincare', 2, '☀️', 5, true),
('skincare-eyecare', 'Eye Care', 'Грижа за очи', 'eye-care', 'skincare/eye-care', 'skincare', 2, '👁️', 6, true),
('skincare-lipcare', 'Lip Care', 'Грижа за устни', 'lip-care', 'skincare/lip-care', 'skincare', 2, '👄', 7, true);

-- L2: Hair Care
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('haircare-shampoo', 'Shampoo & Conditioner', 'Шампоани и балсами', 'shampoo-conditioner', 'haircare/shampoo-conditioner', 'haircare', 2, '🧴', 1, true),
('haircare-treatments', 'Hair Treatments', 'Третмани за коса', 'treatments', 'haircare/treatments', 'haircare', 2, '✨', 2, true),
('haircare-styling', 'Styling Products', 'Продукти за стайлинг', 'styling', 'haircare/styling', 'haircare', 2, '💇', 3, true),
('haircare-color', 'Hair Color', 'Боя за коса', 'color', 'haircare/color', 'haircare', 2, '🎨', 4, true),
('haircare-tools', 'Hair Tools', 'Уреди за коса', 'tools', 'haircare/tools', 'haircare', 2, '🔌', 5, true),
('haircare-accessories', 'Hair Accessories', 'Аксесоари за коса', 'accessories', 'haircare/accessories', 'haircare', 2, '🎀', 6, true);

-- L2: Fragrance
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fragrance-womens', 'Women''s Perfume', 'Дамски парфюми', 'womens', 'fragrance/womens', 'fragrance', 2, '🌸', 1, true),
('fragrance-mens', 'Men''s Cologne', 'Мъжки парфюми', 'mens', 'fragrance/mens', 'fragrance', 2, '🧔', 2, true),
('fragrance-unisex', 'Unisex Fragrances', 'Унисекс парфюми', 'unisex', 'fragrance/unisex', 'fragrance', 2, '🌿', 3, true),
('fragrance-mists', 'Body Mists', 'Спрейове за тяло', 'body-mists', 'fragrance/body-mists', 'fragrance', 2, '💨', 4, true),
('fragrance-sets', 'Gift Sets', 'Подаръчни комплекти', 'gift-sets', 'fragrance/gift-sets', 'fragrance', 2, '🎁', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Beauty & Personal Care | Красота и лична грижа |
| Makeup | Грим |
| Skincare | Грижа за кожата |
| Hair Care | Грижа за косата |
| Fragrance | Парфюмерия |
| Bath & Body | Баня и тяло |
| Men's Grooming | Мъжка грижа |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Skin Type | Тип кожа |
| Hair Type | Тип коса |
| Shade | Нюанс |
| Finish | Финиш |
| SPF | SPF |
| Vegan | Веган |
| Cruelty-Free | Не тестван върху животни |

### Skin Types

| EN | BG |
|----|----|
| Normal | Нормална |
| Dry | Суха |
| Oily | Мазна |
| Combination | Комбинирана |
| Sensitive | Чувствителна |
| Mature | Зряла |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add beauty brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/beauty (tree structure)
- [ ] GET /categories/beauty/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Shade picker component
- [ ] Skin/Hair type selector
- [ ] Certification badges display
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 48  
**Created:** December 3, 2025
