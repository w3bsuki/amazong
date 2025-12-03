# 🚜 Agriculture & Farming | Земеделие

**Category Slug:** `agriculture`  
**Icon:** 🚜  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Agriculture → Tractors → Compact Tractors |
| **Attributes** | Filtering, Search, Campaigns | Brand, Horsepower, Year, Condition |
| **Tags** | Dynamic Collections & SEO | "organic", "used", "irrigation" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🚜 Agriculture & Farming (L0)
│
├── 🚜 Tractors & Machinery (L1)
│   ├── Tractors (L2)
│   ├── Harvesters (L2)
│   ├── Tillers & Plows (L2)
│   ├── Seeders & Planters (L2)
│   ├── Sprayers (L2)
│   ├── Mowers (L2)
│   └── Trailers (L2)
│
├── 🔧 Tractor Parts (L1)
│   ├── Engine Parts (L2)
│   ├── Hydraulics (L2)
│   ├── Tires & Wheels (L2)
│   ├── Electrical Parts (L2)
│   ├── Filters (L2)
│   └── Attachments (L2)
│
├── 💧 Irrigation (L1)
│   ├── Drip Irrigation (L2)
│   ├── Sprinkler Systems (L2)
│   ├── Pumps (L2)
│   ├── Pipes & Fittings (L2)
│   └── Controllers (L2)
│
├── 🌱 Seeds & Plants (L1)
│   ├── Vegetable Seeds (L2)
│   ├── Fruit Seeds (L2)
│   ├── Grain Seeds (L2)
│   ├── Herb Seeds (L2)
│   ├── Seedlings (L2)
│   └── Trees (L2)
│
├── 🧪 Fertilizers & Chemicals (L1)
│   ├── Fertilizers (L2)
│   ├── Herbicides (L2)
│   ├── Pesticides (L2)
│   ├── Fungicides (L2)
│   └── Organic Products (L2)
│
├── 🐄 Livestock (L1)
│   ├── Cattle (L2)
│   ├── Sheep & Goats (L2)
│   ├── Pigs (L2)
│   ├── Poultry (L2)
│   ├── Horses (L2)
│   └── Other Animals (L2)
│
├── 🏚️ Livestock Equipment (L1)
│   ├── Feeding Equipment (L2)
│   ├── Watering Systems (L2)
│   ├── Fencing (L2)
│   ├── Shelters (L2)
│   ├── Milking Equipment (L2)
│   └── Veterinary Supplies (L2)
│
├── 🍇 Produce & Harvest (L1)
│   ├── Vegetables (L2)
│   ├── Fruits (L2)
│   ├── Grains (L2)
│   ├── Herbs (L2)
│   ├── Honey (L2)
│   └── Dairy Products (L2)
│
├── 🏗️ Farm Buildings (L1)
│   ├── Greenhouses (L2)
│   ├── Barns (L2)
│   ├── Storage Silos (L2)
│   ├── Sheds (L2)
│   └── Prefab Buildings (L2)
│
└── 🛠️ Farm Tools (L1)
    ├── Hand Tools (L2)
    ├── Power Tools (L2)
    ├── Measuring Tools (L2)
    └── Safety Equipment (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 52 (L2) = 63 categories**

---

## 📊 Complete Category Reference

### L1: 🚜 TRACTORS & MACHINERY

#### L2: Tractors | Трактори
**Slug:** `agriculture/machinery/tractors`

| EN | BG | Description |
|----|----|----|
| Compact Tractors | Компактни трактори | Under 50 HP |
| Utility Tractors | Универсални трактори | 50-100 HP |
| Row Crop Tractors | Редови трактори | For crops |
| Orchard Tractors | Овощарски трактори | Narrow, low |
| Track Tractors | Верижни трактори | Caterpillar |
| 4WD Tractors | 4x4 трактори | All-wheel drive |

**Popular Brands (Attribute):**
- John Deere | Джон Диър
- New Holland | Ню Холанд
- Case IH | Кейс
- Massey Ferguson | Маси Фъргюсън
- Kubota | Кубота
- Fendt | Фендт
- Zetor | Зетор
- Belarus | Беларус

---

#### L2: Harvesters | Комбайни
**Slug:** `agriculture/machinery/harvesters`

| EN | BG | Description |
|----|----|----|
| Combine Harvesters | Зърнокомбайни | Grain |
| Forage Harvesters | Силажни комбайни | Silage |
| Grape Harvesters | Гроздокомбайни | Grapes |
| Cotton Pickers | Памукоберачи | Cotton |
| Sugar Beet Harvesters | Комбайни за цвекло | Beets |

---

#### L2: Seeders & Planters | Сеялки
**Slug:** `agriculture/machinery/seeders`

- Grain Drills | Зърнени сеялки
- Precision Planters | Прецизни сеялки
- Broadcast Seeders | Разпръсквачи
- No-Till Drills | Директни сеялки
- Potato Planters | Картофосадачки

---

### L1: 💧 IRRIGATION

#### L2: Drip Irrigation | Капково напояване
**Slug:** `agriculture/irrigation/drip`

| EN | BG | Description |
|----|----|----|
| Drip Tape | Капкова лента | Thin-wall |
| Drip Lines | Капкови линии | Thick-wall |
| Emitters | Капкообразуватели | Drippers |
| Filters | Филтри | Water filtration |
| Connectors | Съединители | Fittings |
| Controllers | Контролери | Automation |

---

#### L2: Sprinkler Systems | Дъждовални системи
**Slug:** `agriculture/irrigation/sprinklers`

- Center Pivots | Центрофугални системи
- Traveling Guns | Подвижни дъждовалки
- Fixed Sprinklers | Стационарни дъждовалки
- Micro-Sprinklers | Микродъждовалки

---

### L1: 🌱 SEEDS & PLANTS

#### L2: Vegetable Seeds | Зеленчукови семена
**Slug:** `agriculture/seeds/vegetables`

| EN | BG | Description |
|----|----|----|
| Tomato Seeds | Домати | Most popular |
| Pepper Seeds | Пиперки | Sweet/hot |
| Cucumber Seeds | Краставици | Field/greenhouse |
| Cabbage Seeds | Зеле | Head cabbage |
| Carrot Seeds | Моркови | Root vegetable |
| Onion Seeds | Лук | Bulb onion |
| Bean Seeds | Фасул | Green/dry |
| Corn Seeds | Царевица | Sweet/feed |

---

#### L2: Fruit Seeds | Плодови семена и присадки
**Slug:** `agriculture/seeds/fruits`

- Grape Vines | Лозови пръчки
- Apple Trees | Ябълкови дръвчета
- Cherry Trees | Черешови дръвчета
- Peach Trees | Прасковени дръвчета
- Plum Trees | Сливови дръвчета
- Walnut Trees | Орехови дръвчета

---

### L1: 🐄 LIVESTOCK

#### L2: Cattle | Едър рогат добитък
**Slug:** `agriculture/livestock/cattle`

| EN | BG | Description |
|----|----|----|
| Dairy Cows | Млечни крави | Milk production |
| Beef Cattle | Месодайни | Meat production |
| Bulls | Бикове | Breeding |
| Calves | Телета | Young cattle |
| Heifers | Юници | Young females |

**Breeds (Attribute):**
- Holstein | Холщайн
- Simmental | Симентал
- Angus | Ангус
- Hereford | Херефорд
- Bulgarian Grey | Българско сиво говедо

---

#### L2: Sheep & Goats | Овце и кози
**Slug:** `agriculture/livestock/sheep-goats`

- Sheep | Овце
- Lambs | Агнета
- Goats | Кози
- Kids | Ярета
- Rams | Кочове
- Bucks | Пръчове

---

### L1: 🍇 PRODUCE & HARVEST

#### L2: Vegetables | Зеленчуци
**Slug:** `agriculture/produce/vegetables`

- Fresh Vegetables | Пресни зеленчуци
- Organic Vegetables | Био зеленчуци
- Greenhouse Vegetables | Оранжерийни зеленчуци
- Wholesale Vegetables | Зеленчуци на едро

---

#### L2: Honey | Мед
**Slug:** `agriculture/produce/honey`

| EN | BG | Description |
|----|----|----|
| Acacia Honey | Акациев мед | Light, sweet |
| Wildflower Honey | Полифлорен мед | Mixed flowers |
| Linden Honey | Липов мед | Aromatic |
| Forest Honey | Горски мед | Dark, rich |
| Manuka Honey | Манука мед | Medicinal |
| Raw Honey | Суров мед | Unprocessed |

---

---

## 🏷️ Attribute System (The Power Layer)

### Agriculture Product Attributes Schema

```typescript
interface AgricultureProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === MACHINERY SPECIFICS ===
  brand?: string;
  model?: string;
  year?: number;
  hours?: number;
  horsepower?: number;
  
  // === LIVESTOCK SPECIFICS ===
  breed?: string;
  age_months?: number;
  weight_kg?: number;
  gender?: 'male' | 'female';
  quantity?: number;
  
  // === SEEDS/PLANTS SPECIFICS ===
  variety?: string;
  germination_rate?: number;
  organic: boolean;
  certified: boolean;
  
  // === PRODUCE SPECIFICS ===
  harvest_date?: string;
  expiry_date?: string;
  quantity_kg?: number;
  
  // === CONDITION ===
  condition: ProductCondition;
  
  seller_type: 'farmer' | 'dealer' | 'cooperative';
  location_city: string;
  
  images: string[];
}

type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'for_parts';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('agriculture', 'Agriculture & Farming', 'Земеделие', 'agriculture', 'agriculture', NULL, 0, '🚜', 15, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('agri-machinery', 'Tractors & Machinery', 'Трактори и машини', 'machinery', 'agriculture/machinery', 'agriculture', 1, '🚜', 1, true),
('agri-parts', 'Tractor Parts', 'Части за трактори', 'parts', 'agriculture/parts', 'agriculture', 1, '🔧', 2, true),
('agri-irrigation', 'Irrigation', 'Напояване', 'irrigation', 'agriculture/irrigation', 'agriculture', 1, '💧', 3, true),
('agri-seeds', 'Seeds & Plants', 'Семена и растения', 'seeds', 'agriculture/seeds', 'agriculture', 1, '🌱', 4, true),
('agri-chemicals', 'Fertilizers & Chemicals', 'Торове и препарати', 'chemicals', 'agriculture/chemicals', 'agriculture', 1, '🧪', 5, true),
('agri-livestock', 'Livestock', 'Животни', 'livestock', 'agriculture/livestock', 'agriculture', 1, '🐄', 6, true),
('agri-livestock-eq', 'Livestock Equipment', 'Оборудване за животни', 'livestock-equipment', 'agriculture/livestock-equipment', 'agriculture', 1, '🏚️', 7, true),
('agri-produce', 'Produce & Harvest', 'Продукция', 'produce', 'agriculture/produce', 'agriculture', 1, '🍇', 8, true),
('agri-buildings', 'Farm Buildings', 'Земеделски сгради', 'buildings', 'agriculture/buildings', 'agriculture', 1, '🏗️', 9, true),
('agri-tools', 'Farm Tools', 'Земеделски инструменти', 'tools', 'agriculture/tools', 'agriculture', 1, '🛠️', 10, true);

-- L2: Machinery
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('machinery-tractors', 'Tractors', 'Трактори', 'tractors', 'agriculture/machinery/tractors', 'agri-machinery', 2, '🚜', 1, true),
('machinery-harvesters', 'Harvesters', 'Комбайни', 'harvesters', 'agriculture/machinery/harvesters', 'agri-machinery', 2, '🌾', 2, true),
('machinery-tillers', 'Tillers & Plows', 'Плугове и култиватори', 'tillers', 'agriculture/machinery/tillers', 'agri-machinery', 2, '🔱', 3, true),
('machinery-seeders', 'Seeders & Planters', 'Сеялки', 'seeders', 'agriculture/machinery/seeders', 'agri-machinery', 2, '🌱', 4, true),
('machinery-sprayers', 'Sprayers', 'Пръскачки', 'sprayers', 'agriculture/machinery/sprayers', 'agri-machinery', 2, '💨', 5, true),
('machinery-mowers', 'Mowers', 'Косачки', 'mowers', 'agriculture/machinery/mowers', 'agri-machinery', 2, '🌿', 6, true),
('machinery-trailers', 'Trailers', 'Ремаркета', 'trailers', 'agriculture/machinery/trailers', 'agri-machinery', 2, '🚛', 7, true);

-- L2: Livestock
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('livestock-cattle', 'Cattle', 'Едър рогат добитък', 'cattle', 'agriculture/livestock/cattle', 'agri-livestock', 2, '🐄', 1, true),
('livestock-sheep', 'Sheep & Goats', 'Овце и кози', 'sheep-goats', 'agriculture/livestock/sheep-goats', 'agri-livestock', 2, '🐑', 2, true),
('livestock-pigs', 'Pigs', 'Свине', 'pigs', 'agriculture/livestock/pigs', 'agri-livestock', 2, '🐷', 3, true),
('livestock-poultry', 'Poultry', 'Птици', 'poultry', 'agriculture/livestock/poultry', 'agri-livestock', 2, '🐔', 4, true),
('livestock-horses', 'Horses', 'Коне', 'horses', 'agriculture/livestock/horses', 'agri-livestock', 2, '🐴', 5, true);

-- L2: Seeds
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('seeds-vegetables', 'Vegetable Seeds', 'Зеленчукови семена', 'vegetables', 'agriculture/seeds/vegetables', 'agri-seeds', 2, '🥬', 1, true),
('seeds-fruits', 'Fruit Seeds', 'Плодови семена', 'fruits', 'agriculture/seeds/fruits', 'agri-seeds', 2, '🍎', 2, true),
('seeds-grains', 'Grain Seeds', 'Зърнени семена', 'grains', 'agriculture/seeds/grains', 'agri-seeds', 2, '🌾', 3, true),
('seeds-herbs', 'Herb Seeds', 'Билкови семена', 'herbs', 'agriculture/seeds/herbs', 'agri-seeds', 2, '🌿', 4, true),
('seeds-seedlings', 'Seedlings', 'Разсад', 'seedlings', 'agriculture/seeds/seedlings', 'agri-seeds', 2, '🌱', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Agriculture & Farming | Земеделие |
| Tractors & Machinery | Трактори и машини |
| Irrigation | Напояване |
| Seeds & Plants | Семена и растения |
| Livestock | Животни |
| Produce | Продукция |

### Attribute Labels

| EN | BG |
|----|----|
| Horsepower | Конски сили |
| Hours | Моточасове |
| Year | Година |
| Brand | Марка |
| Breed | Порода |
| Organic | Био |
| Certified | Сертифицирано |
| Quantity | Количество |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add machinery brands reference
- [ ] Add livestock breeds reference
- [ ] Test JSONB queries

### API
- [ ] GET /categories/agriculture (tree structure)
- [ ] GET /products with filters
- [ ] POST /products (with validation)
- [ ] Search with location

### Frontend
- [ ] Category browser
- [ ] Horsepower filter
- [ ] Year filter
- [ ] Brand filter
- [ ] Map view for livestock

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 63  
**Created:** December 3, 2025
