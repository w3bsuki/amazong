# 🛒 Grocery & Gourmet Food | Храни и деликатеси

**Category Slug:** `grocery`  
**Icon:** 🛒  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Grocery → Beverages → Coffee |
| **Attributes** | Filtering, Search, Campaigns | Brand, Origin, Organic |
| **Tags** | Dynamic Collections & SEO | "local-produce", "vegan" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🛒 Grocery & Gourmet (L0)
│
├── 🥤 Beverages (L1)
│   ├── Coffee (L2)
│   ├── Tea (L2)
│   ├── Soft Drinks (L2)
│   ├── Juices (L2)
│   ├── Energy Drinks (L2)
│   └── Water (L2)
│
├── 🍞 Bakery & Bread (L1)
│   ├── Fresh Bread (L2)
│   ├── Pastries (L2)
│   ├── Cakes (L2)
│   ├── Cookies (L2)
│   └── Baking Mixes (L2)
│
├── 🥫 Pantry Staples (L1)
│   ├── Canned Goods (L2)
│   ├── Pasta & Rice (L2)
│   ├── Cooking Oils (L2)
│   ├── Sauces & Condiments (L2)
│   ├── Spices & Herbs (L2)
│   └── Flour & Sugar (L2)
│
├── 🥩 Meat & Seafood (L1)
│   ├── Fresh Meat (L2)
│   ├── Poultry (L2)
│   ├── Seafood (L2)
│   ├── Deli Meats (L2)
│   └── Sausages (L2)
│
├── 🧀 Dairy & Eggs (L1)
│   ├── Milk (L2)
│   ├── Cheese (L2)
│   ├── Yogurt (L2)
│   ├── Butter & Cream (L2)
│   └── Eggs (L2)
│
├── 🥬 Fresh Produce (L1)
│   ├── Fruits (L2)
│   ├── Vegetables (L2)
│   ├── Organic Produce (L2)
│   ├── Fresh Herbs (L2)
│   └── Salads (L2)
│
├── 🍬 Snacks & Sweets (L1)
│   ├── Chips & Crackers (L2)
│   ├── Chocolate (L2)
│   ├── Candy (L2)
│   ├── Nuts & Seeds (L2)
│   └── Dried Fruits (L2)
│
├── 🧊 Frozen Foods (L1)
│   ├── Frozen Meals (L2)
│   ├── Ice Cream (L2)
│   ├── Frozen Vegetables (L2)
│   ├── Frozen Pizza (L2)
│   └── Frozen Desserts (L2)
│
├── 🌱 Organic & Health (L1)
│   ├── Organic Foods (L2)
│   ├── Gluten-Free (L2)
│   ├── Vegan Products (L2)
│   ├── Superfoods (L2)
│   └── Diet Foods (L2)
│
├── 🍷 Gourmet & Specialty (L1)
│   ├── Fine Wines (L2)
│   ├── Artisan Cheese (L2)
│   ├── Specialty Meats (L2)
│   ├── Imported Foods (L2)
│   └── Gift Baskets (L2)
│
└── 🇧🇬 Bulgarian Products (L1)
    ├── Bulgarian Cheese (L2)
    ├── Lukanka & Sausages (L2)
    ├── Rose Products (L2)
    ├── Honey (L2)
    └── Traditional Foods (L2)
```

**Total Categories: 1 (L0) + 11 (L1) + 55 (L2) = 67 categories**

---

## 📊 Complete Category Reference

### L1: 🥤 BEVERAGES | НАПИТКИ

#### L2: Coffee | Кафе
**Slug:** `grocery/beverages/coffee`

| EN | BG | Description |
|----|----|----|
| Ground Coffee | Мляно кафе | Ready to brew |
| Whole Bean | На зърна | Fresh grind |
| Instant Coffee | Инстантно кафе | Quick |
| Espresso | Еспресо | Strong |
| Decaf | Без кофеин | Decaffeinated |
| Coffee Pods | Кафе капсули | Single serve |

**Popular Brands:**
- Lavazza | Лаваца
- Jacobs | Якобс
- Nova Brasilia | Нова Бразилия
- Nescafé | Нескафе

---

#### L2: Tea | Чай
**Slug:** `grocery/beverages/tea`

| EN | BG | Description |
|----|----|----|
| Black Tea | Черен чай | Classic |
| Green Tea | Зелен чай | Healthy |
| Herbal Tea | Билков чай | Caffeine-free |
| Fruit Tea | Плодов чай | Flavored |
| Bulgarian Herbs | Български билки | Local |

---

### L1: 🥫 PANTRY STAPLES | ОСНОВНИ ПРОДУКТИ

#### L2: Pasta & Rice | Паста и ориз
**Slug:** `grocery/pantry/pasta-rice`

| EN | BG | Description |
|----|----|----|
| Spaghetti | Спагети | Classic |
| Penne | Пене | Tube pasta |
| Rice | Ориз | White/Brown |
| Risotto Rice | Ориз за ризото | Arborio |
| Bulgur | Булгур | Traditional |
| Couscous | Кускус | Quick cooking |

---

#### L2: Spices & Herbs | Подправки и билки
**Slug:** `grocery/pantry/spices`

| EN | BG | Description |
|----|----|----|
| Paprika | Червен пипер | Bulgarian staple |
| Savory | Чубрица | Bulgarian herb |
| Cumin | Кимион | Aromatic |
| Black Pepper | Черен пипер | Essential |
| Bay Leaves | Дафинов лист | For stews |
| Oregano | Риган | Mediterranean |

---

### L1: 🧀 DAIRY & EGGS | МЛЕЧНИ ПРОДУКТИ И ЯЙЦА

#### L2: Cheese | Сирене
**Slug:** `grocery/dairy/cheese`

| EN | BG | Description |
|----|----|----|
| White Cheese | Бяло сирене | Bulgarian feta |
| Yellow Cheese | Кашкавал | Bulgarian kashkaval |
| Cottage Cheese | Извара | Fresh |
| Mozzarella | Моцарела | Italian |
| Cheddar | Чедър | Sharp |
| Brie | Бри | French |

---

### L1: 🇧🇬 BULGARIAN PRODUCTS | БЪЛГАРСКИ ПРОДУКТИ

#### L2: Bulgarian Cheese | Българско сирене
**Slug:** `grocery/bulgarian/cheese`

| EN | BG | Description |
|----|----|----|
| Bulgarian Feta | Българско бяло сирене | PDO protected |
| Kashkaval | Кашкавал | Yellow cheese |
| Fresh Cheese | Пресен кашкавал | Mild |
| Aged Cheese | Стар кашкавал | Strong flavor |

---

#### L2: Lukanka & Sausages | Луканка и колбаси
**Slug:** `grocery/bulgarian/sausages`

| EN | BG | Description |
|----|----|----|
| Lukanka | Луканка | Flat sausage |
| Sudzhuk | Суджук | Spiced sausage |
| Pastarma | Пастърма | Dried meat |
| Salam | Салам | Salami |

---

#### L2: Honey | Мед
**Slug:** `grocery/bulgarian/honey`

| EN | BG | Description |
|----|----|----|
| Acacia Honey | Акациев мед | Light |
| Sunflower Honey | Слънчогледов мед | Common |
| Mountain Honey | Планински мед | Premium |
| Honeycomb | Пчелна пита | With wax |

---

---

## 🏷️ Attribute System (The Power Layer)

### Grocery Product Attributes Schema

```typescript
interface GroceryProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  
  // === PRODUCT INFO ===
  brand: string;
  origin_country: string;
  
  // === FOOD SPECIFICS ===
  weight_g?: number;
  volume_ml?: number;
  expiry_date?: string;
  
  // === DIETARY ===
  is_organic: boolean;
  is_vegan: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_lactose_free: boolean;
  
  // === ALLERGENS ===
  allergens?: Allergen[];
  
  // === STORAGE ===
  storage_type: StorageType;
  shelf_life_days?: number;
  
  seller_type: 'producer' | 'store' | 'distributor';
  location_city: string;
  
  images: string[];
}

type Allergen = 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'soy' | 'fish' | 'shellfish';
type StorageType = 'ambient' | 'refrigerated' | 'frozen';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('grocery', 'Grocery & Gourmet', 'Храни и деликатеси', 'grocery', 'grocery', NULL, 0, '🛒', 22, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gr-beverages', 'Beverages', 'Напитки', 'beverages', 'grocery/beverages', 'grocery', 1, '🥤', 1, true),
('gr-bakery', 'Bakery & Bread', 'Хляб и печива', 'bakery', 'grocery/bakery', 'grocery', 1, '🍞', 2, true),
('gr-pantry', 'Pantry Staples', 'Основни продукти', 'pantry', 'grocery/pantry', 'grocery', 1, '🥫', 3, true),
('gr-meat', 'Meat & Seafood', 'Месо и морски дарове', 'meat', 'grocery/meat', 'grocery', 1, '🥩', 4, true),
('gr-dairy', 'Dairy & Eggs', 'Млечни и яйца', 'dairy', 'grocery/dairy', 'grocery', 1, '🧀', 5, true),
('gr-produce', 'Fresh Produce', 'Пресни плодове и зеленчуци', 'produce', 'grocery/produce', 'grocery', 1, '🥬', 6, true),
('gr-snacks', 'Snacks & Sweets', 'Закуски и сладкиши', 'snacks', 'grocery/snacks', 'grocery', 1, '🍬', 7, true),
('gr-frozen', 'Frozen Foods', 'Замразени храни', 'frozen', 'grocery/frozen', 'grocery', 1, '🧊', 8, true),
('gr-organic', 'Organic & Health', 'Био и здравословни', 'organic', 'grocery/organic', 'grocery', 1, '🌱', 9, true),
('gr-gourmet', 'Gourmet & Specialty', 'Деликатеси', 'gourmet', 'grocery/gourmet', 'grocery', 1, '🍷', 10, true),
('gr-bulgarian', 'Bulgarian Products', 'Български продукти', 'bulgarian', 'grocery/bulgarian', 'grocery', 1, '🇧🇬', 11, true);

-- L2: Beverages
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bev-coffee', 'Coffee', 'Кафе', 'coffee', 'grocery/beverages/coffee', 'gr-beverages', 2, '☕', 1, true),
('bev-tea', 'Tea', 'Чай', 'tea', 'grocery/beverages/tea', 'gr-beverages', 2, '🍵', 2, true),
('bev-soft', 'Soft Drinks', 'Безалкохолни', 'soft-drinks', 'grocery/beverages/soft-drinks', 'gr-beverages', 2, '🥤', 3, true),
('bev-juice', 'Juices', 'Сокове', 'juices', 'grocery/beverages/juices', 'gr-beverages', 2, '🧃', 4, true),
('bev-water', 'Water', 'Вода', 'water', 'grocery/beverages/water', 'gr-beverages', 2, '💧', 5, true);

-- L2: Dairy
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('dairy-milk', 'Milk', 'Мляко', 'milk', 'grocery/dairy/milk', 'gr-dairy', 2, '🥛', 1, true),
('dairy-cheese', 'Cheese', 'Сирене', 'cheese', 'grocery/dairy/cheese', 'gr-dairy', 2, '🧀', 2, true),
('dairy-yogurt', 'Yogurt', 'Кисело мляко', 'yogurt', 'grocery/dairy/yogurt', 'gr-dairy', 2, '🥄', 3, true),
('dairy-butter', 'Butter & Cream', 'Масло и сметана', 'butter', 'grocery/dairy/butter', 'gr-dairy', 2, '🧈', 4, true),
('dairy-eggs', 'Eggs', 'Яйца', 'eggs', 'grocery/dairy/eggs', 'gr-dairy', 2, '🥚', 5, true);

-- L2: Bulgarian
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bg-cheese', 'Bulgarian Cheese', 'Българско сирене', 'cheese', 'grocery/bulgarian/cheese', 'gr-bulgarian', 2, '🧀', 1, true),
('bg-sausages', 'Lukanka & Sausages', 'Луканка и колбаси', 'sausages', 'grocery/bulgarian/sausages', 'gr-bulgarian', 2, '🥓', 2, true),
('bg-rose', 'Rose Products', 'Розови продукти', 'rose', 'grocery/bulgarian/rose', 'gr-bulgarian', 2, '🌹', 3, true),
('bg-honey', 'Honey', 'Мед', 'honey', 'grocery/bulgarian/honey', 'gr-bulgarian', 2, '🍯', 4, true),
('bg-traditional', 'Traditional Foods', 'Традиционни храни', 'traditional', 'grocery/bulgarian/traditional', 'gr-bulgarian', 2, '🍲', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Grocery & Gourmet | Храни и деликатеси |
| Beverages | Напитки |
| Dairy & Eggs | Млечни продукти и яйца |
| Fresh Produce | Пресни продукти |
| Bulgarian Products | Български продукти |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Origin | Произход |
| Organic | Био |
| Expiry Date | Срок на годност |
| Storage | Съхранение |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add food brands reference
- [ ] Add allergens reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Organic filter
- [ ] Dietary filters

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 67  
**Created:** December 3, 2025
