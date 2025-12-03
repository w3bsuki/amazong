# 🌳 Garden & Outdoor | Градина и двор

**Category Slug:** `garden-outdoor`  
**Icon:** 🌳  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Garden → Power Tools → Lawn Mowers |
| **Attributes** | Filtering, Search, Campaigns | Brand, Power Source, Size |
| **Tags** | Dynamic Collections & SEO | "cordless", "professional", "eco-friendly" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🌳 Garden & Outdoor (L0)
│
├── 🔌 Power Equipment (L1)
│   ├── Lawn Mowers (L2)
│   ├── Chainsaws (L2)
│   ├── Trimmers & Edgers (L2)
│   ├── Leaf Blowers (L2)
│   ├── Pressure Washers (L2)
│   ├── Tillers & Cultivators (L2)
│   └── Wood Chippers (L2)
│
├── 🛠️ Hand Tools (L1)
│   ├── Shovels & Spades (L2)
│   ├── Rakes (L2)
│   ├── Pruners & Loppers (L2)
│   ├── Hoes & Cultivators (L2)
│   ├── Garden Forks (L2)
│   └── Wheelbarrows (L2)
│
├── 💧 Watering & Irrigation (L1)
│   ├── Garden Hoses (L2)
│   ├── Sprinklers (L2)
│   ├── Drip Irrigation (L2)
│   ├── Watering Cans (L2)
│   ├── Timers & Controllers (L2)
│   └── Pumps (L2)
│
├── 🌱 Plants & Seeds (L1)
│   ├── Flower Seeds (L2)
│   ├── Vegetable Seeds (L2)
│   ├── Herb Seeds (L2)
│   ├── Bulbs (L2)
│   ├── Live Plants (L2)
│   └── Trees & Shrubs (L2)
│
├── 🧪 Soil & Fertilizers (L1)
│   ├── Potting Soil (L2)
│   ├── Fertilizers (L2)
│   ├── Mulch (L2)
│   ├── Compost (L2)
│   └── Plant Food (L2)
│
├── 🏡 Patio & Outdoor Living (L1)
│   ├── Patio Furniture (L2)
│   ├── Outdoor Dining (L2)
│   ├── Hammocks (L2)
│   ├── Umbrellas & Shades (L2)
│   ├── Outdoor Heating (L2)
│   └── Outdoor Lighting (L2)
│
├── 🔥 Grills & Outdoor Cooking (L1)
│   ├── Gas Grills (L2)
│   ├── Charcoal Grills (L2)
│   ├── Electric Grills (L2)
│   ├── Smokers (L2)
│   ├── Pizza Ovens (L2)
│   └── Grill Accessories (L2)
│
├── 🏊 Pools & Spas (L1)
│   ├── Swimming Pools (L2)
│   ├── Hot Tubs (L2)
│   ├── Pool Accessories (L2)
│   ├── Pool Chemicals (L2)
│   └── Pool Maintenance (L2)
│
├── 🏠 Sheds & Storage (L1)
│   ├── Garden Sheds (L2)
│   ├── Greenhouses (L2)
│   ├── Storage Boxes (L2)
│   └── Tool Storage (L2)
│
└── 🎍 Décor & Landscaping (L1)
    ├── Garden Statues (L2)
    ├── Planters & Pots (L2)
    ├── Fencing (L2)
    ├── Garden Edging (L2)
    ├── Water Features (L2)
    └── Outdoor Rugs (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 55 (L2) = 66 categories**

---

## 📊 Complete Category Reference

### L1: 🔌 POWER EQUIPMENT

#### L2: Lawn Mowers | Косачки за трева
**Slug:** `garden-outdoor/power/mowers`

| EN | BG | Description |
|----|----|----|
| Push Mowers | Ръчни косачки | Manual push |
| Self-Propelled | Самоходни | Powered wheels |
| Riding Mowers | Тракторни косачки | Ride-on |
| Robotic Mowers | Роботизирани | Automatic |
| Electric Mowers | Електрически | Corded/battery |
| Petrol Mowers | Бензинови | Gas-powered |
| Reel Mowers | Цилиндрични | Manual cylinder |

**Brands (Attribute):**
- Husqvarna | Хускварна
- Stihl | Щил
- Bosch | Бош
- Makita | Макита
- Honda | Хонда
- Black+Decker | Блек енд Декър

---

#### L2: Chainsaws | Верижни триони
**Slug:** `garden-outdoor/power/chainsaws`

| EN | BG | Description |
|----|----|----|
| Petrol Chainsaw | Бензинов трион | Most powerful |
| Electric Chainsaw | Електрически трион | Corded |
| Battery Chainsaw | Акумулаторен трион | Cordless |
| Pole Saw | Прътова резачка | Extended reach |
| Mini Chainsaw | Мини трион | One-handed |

---

### L1: 🛠️ HAND TOOLS

#### L2: Pruners & Loppers | Ножици и секатори
**Slug:** `garden-outdoor/hand-tools/pruners`

- Bypass Pruners | Секатори с байпас
- Anvil Pruners | Секатори с наковалня
- Loppers | Клонорезачки
- Hedge Shears | Ножици за жив плет
- Pruning Saws | Резачки

---

### L1: 💧 WATERING & IRRIGATION

#### L2: Garden Hoses | Градински маркучи
**Slug:** `garden-outdoor/watering/hoses`

| EN | BG | Description |
|----|----|----|
| Standard Hose | Стандартен маркуч | General use |
| Expandable Hose | Разтегателен маркуч | Expands when used |
| Soaker Hose | Капков маркуч | Slow watering |
| Flat Hose | Плосък маркуч | Easy storage |
| Hose Reels | Макари за маркучи | Storage |

---

### L1: 🏡 PATIO & OUTDOOR LIVING

#### L2: Patio Furniture | Градински мебели
**Slug:** `garden-outdoor/patio/furniture`

| EN | BG | Description |
|----|----|----|
| Outdoor Sofas | Градински дивани | Seating |
| Garden Chairs | Градински столове | Chairs |
| Dining Sets | Трапезни комплекти | Table + chairs |
| Loungers | Шезлонги | Sun beds |
| Benches | Пейки | Garden benches |
| Swing Seats | Люлки | Porch swings |

**Materials (Attribute):**
- Rattan | Ратан
- Wicker | Плетена мебел
- Metal | Метал
- Wood | Дърво
- Plastic | Пластмаса

---

### L1: 🔥 GRILLS & OUTDOOR COOKING

#### L2: Gas Grills | Газови барбекюта
**Slug:** `garden-outdoor/grills/gas`

| EN | BG | Description |
|----|----|----|
| 2-Burner | 2 горелки | Small |
| 3-Burner | 3 горелки | Medium |
| 4+ Burner | 4+ горелки | Large |
| Portable Gas | Преносими газови | Mobile |
| Built-In | Вградени | Outdoor kitchen |

---

---

## 🏷️ Attribute System (The Power Layer)

### Garden Product Attributes Schema

```typescript
interface GardenProduct {
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
  model?: string;
  
  // === POWER SPECIFICS ===
  power_source?: PowerSource;
  power_watts?: number;
  engine_cc?: number;
  battery_voltage?: number;
  
  // === SIZE & CAPACITY ===
  cutting_width_cm?: number;
  tank_capacity_l?: number;
  weight_kg?: number;
  dimensions?: string;
  
  // === MATERIAL ===
  material?: Material[];
  
  // === CONDITION ===
  condition: ProductCondition;
  warranty_months?: number;
  
  seller_type: 'private' | 'store' | 'dealer';
  location_city: string;
  
  images: string[];
}

type PowerSource = 'petrol' | 'electric' | 'battery' | 'manual';
type Material = 'metal' | 'wood' | 'plastic' | 'rattan' | 'wicker' | 'aluminum';
type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'for_parts';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('garden-outdoor', 'Garden & Outdoor', 'Градина и двор', 'garden-outdoor', 'garden-outdoor', NULL, 0, '🌳', 20, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('go-power', 'Power Equipment', 'Моторни инструменти', 'power', 'garden-outdoor/power', 'garden-outdoor', 1, '🔌', 1, true),
('go-hand', 'Hand Tools', 'Ръчни инструменти', 'hand-tools', 'garden-outdoor/hand-tools', 'garden-outdoor', 1, '🛠️', 2, true),
('go-watering', 'Watering & Irrigation', 'Напояване', 'watering', 'garden-outdoor/watering', 'garden-outdoor', 1, '💧', 3, true),
('go-plants', 'Plants & Seeds', 'Растения и семена', 'plants', 'garden-outdoor/plants', 'garden-outdoor', 1, '🌱', 4, true),
('go-soil', 'Soil & Fertilizers', 'Почви и торове', 'soil', 'garden-outdoor/soil', 'garden-outdoor', 1, '🧪', 5, true),
('go-patio', 'Patio & Outdoor Living', 'Двор и градина', 'patio', 'garden-outdoor/patio', 'garden-outdoor', 1, '🏡', 6, true),
('go-grills', 'Grills & Outdoor Cooking', 'Барбекюта и готвене', 'grills', 'garden-outdoor/grills', 'garden-outdoor', 1, '🔥', 7, true),
('go-pools', 'Pools & Spas', 'Басейни и СПА', 'pools', 'garden-outdoor/pools', 'garden-outdoor', 1, '🏊', 8, true),
('go-sheds', 'Sheds & Storage', 'Сараи и съхранение', 'sheds', 'garden-outdoor/sheds', 'garden-outdoor', 1, '🏠', 9, true),
('go-decor', 'Décor & Landscaping', 'Декор и ландшафт', 'decor', 'garden-outdoor/decor', 'garden-outdoor', 1, '🎍', 10, true);

-- L2: Power Equipment
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('power-mowers', 'Lawn Mowers', 'Косачки за трева', 'mowers', 'garden-outdoor/power/mowers', 'go-power', 2, '🌿', 1, true),
('power-chainsaws', 'Chainsaws', 'Верижни триони', 'chainsaws', 'garden-outdoor/power/chainsaws', 'go-power', 2, '🪓', 2, true),
('power-trimmers', 'Trimmers & Edgers', 'Тримери и косачки', 'trimmers', 'garden-outdoor/power/trimmers', 'go-power', 2, '✂️', 3, true),
('power-blowers', 'Leaf Blowers', 'Духалки за листа', 'blowers', 'garden-outdoor/power/blowers', 'go-power', 2, '💨', 4, true),
('power-pressure', 'Pressure Washers', 'Водоструйки', 'pressure-washers', 'garden-outdoor/power/pressure-washers', 'go-power', 2, '💦', 5, true);

-- L2: Patio
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('patio-furniture', 'Patio Furniture', 'Градински мебели', 'furniture', 'garden-outdoor/patio/furniture', 'go-patio', 2, '🪑', 1, true),
('patio-dining', 'Outdoor Dining', 'Трапезария на открито', 'dining', 'garden-outdoor/patio/dining', 'go-patio', 2, '🍽️', 2, true),
('patio-hammocks', 'Hammocks', 'Хамаци', 'hammocks', 'garden-outdoor/patio/hammocks', 'go-patio', 2, '🏖️', 3, true),
('patio-umbrellas', 'Umbrellas & Shades', 'Чадъри и сенници', 'umbrellas', 'garden-outdoor/patio/umbrellas', 'go-patio', 2, '☂️', 4, true),
('patio-heating', 'Outdoor Heating', 'Отопление навън', 'heating', 'garden-outdoor/patio/heating', 'go-patio', 2, '🔥', 5, true);

-- L2: Grills
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('grills-gas', 'Gas Grills', 'Газови барбекюта', 'gas', 'garden-outdoor/grills/gas', 'go-grills', 2, '🔥', 1, true),
('grills-charcoal', 'Charcoal Grills', 'Барбекюта на дървени въглища', 'charcoal', 'garden-outdoor/grills/charcoal', 'go-grills', 2, '🪵', 2, true),
('grills-electric', 'Electric Grills', 'Електрически грилове', 'electric', 'garden-outdoor/grills/electric', 'go-grills', 2, '⚡', 3, true),
('grills-smokers', 'Smokers', 'Пушачи', 'smokers', 'garden-outdoor/grills/smokers', 'go-grills', 2, '💨', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Garden & Outdoor | Градина и двор |
| Power Equipment | Моторни инструменти |
| Hand Tools | Ръчни инструменти |
| Watering | Напояване |
| Patio Furniture | Градински мебели |
| Grills | Барбекюта |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Power Source | Захранване |
| Power | Мощност |
| Cutting Width | Ширина на рязане |
| Weight | Тегло |
| Material | Материал |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add tool brands reference
- [ ] Add power source options
- [ ] Test filters

### Frontend
- [ ] Category browser
- [ ] Power source filter
- [ ] Brand filter
- [ ] Material filter
- [ ] Price range

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 66  
**Created:** December 3, 2025
