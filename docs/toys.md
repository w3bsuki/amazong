# 🧸 Toys & Hobbies | Играчки и хобита

**Category Slug:** `toys`  
**Icon:** 🧸  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Toys → Action Figures → Superhero Figures |
| **Attributes** | Filtering, Search, Campaigns | Age Range, Brand, Condition, Material |
| **Tags** | Dynamic Collections & SEO | "educational", "stem", "vintage" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🧸 Toys & Hobbies (L0)
│
├── 🦸 Action Figures (L1)
│   ├── Superhero Figures (L2)
│   ├── Movie & TV Figures (L2)
│   ├── Anime Figures (L2)
│   ├── Military Figures (L2)
│   ├── Wrestling Figures (L2)
│   └── Vintage Figures (L2)
│
├── 🧱 Building Toys (L1)
│   ├── LEGO (L2)
│   ├── LEGO Alternatives (L2)
│   ├── Magnetic Building (L2)
│   ├── Wooden Blocks (L2)
│   └── Model Kits (L2)
│
├── 🚗 Diecast & Vehicles (L1)
│   ├── Diecast Cars (L2)
│   ├── Model Trains (L2)
│   ├── RC Vehicles (L2)
│   ├── Slot Cars (L2)
│   └── Model Planes (L2)
│
├── 🎀 Dolls & Accessories (L1)
│   ├── Fashion Dolls (L2)
│   ├── Baby Dolls (L2)
│   ├── Collectible Dolls (L2)
│   ├── Dollhouses (L2)
│   ├── Doll Clothing (L2)
│   └── Doll Accessories (L2)
│
├── 🧩 Puzzles & Games (L1)
│   ├── Jigsaw Puzzles (L2)
│   ├── 3D Puzzles (L2)
│   ├── Brain Teasers (L2)
│   ├── Classic Games (L2)
│   └── Party Games (L2)
│
├── 🎨 Arts & Crafts (L1)
│   ├── Drawing & Painting (L2)
│   ├── Craft Kits (L2)
│   ├── Jewelry Making (L2)
│   ├── Sewing & Knitting (L2)
│   ├── Pottery & Clay (L2)
│   └── Paper Crafts (L2)
│
├── 🎓 Educational Toys (L1)
│   ├── STEM Toys (L2)
│   ├── Learning Games (L2)
│   ├── Science Kits (L2)
│   ├── Coding Toys (L2)
│   ├── Math Toys (L2)
│   └── Language Learning (L2)
│
├── 🪁 Outdoor Toys (L1)
│   ├── Ride-On Toys (L2)
│   ├── Sports Toys (L2)
│   ├── Water Toys (L2)
│   ├── Sand Toys (L2)
│   ├── Kites (L2)
│   └── Playhouses (L2)
│
├── 🧸 Stuffed Animals (L1)
│   ├── Teddy Bears (L2)
│   ├── Character Plush (L2)
│   ├── Wild Animals (L2)
│   ├── Fantasy Creatures (L2)
│   └── Giant Plush (L2)
│
├── 🚁 Radio Control (L1)
│   ├── RC Cars (L2)
│   ├── RC Drones (L2)
│   ├── RC Helicopters (L2)
│   ├── RC Boats (L2)
│   ├── RC Planes (L2)
│   └── RC Parts (L2)
│
└── 🏺 Collectible Toys (L1)
    ├── Vintage Toys (L2)
    ├── Limited Editions (L2)
    ├── Funko Pop (L2)
    ├── Hot Wheels Collectible (L2)
    └── Figurine Collections (L2)
```

**Total Categories: 1 (L0) + 11 (L1) + 57 (L2) = 69 categories**

---

## 📊 Complete Category Reference

### L1: 🧱 BUILDING TOYS

#### L2: LEGO | LEGO
**Slug:** `toys/building/lego`

| EN | BG | Description |
|----|----|----|
| LEGO City | LEGO City | City life |
| LEGO Technic | LEGO Technic | Mechanical |
| LEGO Star Wars | LEGO Star Wars | Franchise |
| LEGO Harry Potter | LEGO Хари Потър | Franchise |
| LEGO Creator | LEGO Creator | 3-in-1 sets |
| LEGO Architecture | LEGO Architecture | Landmarks |
| LEGO Ideas | LEGO Ideas | Fan designs |
| LEGO Ninjago | LEGO Ninjago | Action theme |
| LEGO Friends | LEGO Friends | Girls theme |
| LEGO Duplo | LEGO Duplo | Toddler |

---

#### L2: LEGO Alternatives | Алтернативи на LEGO
**Slug:** `toys/building/lego-alternatives`

- Mega Construx | Mega Construx
- COBI | COBI
- Playmobil | Playmobil
- K'NEX | K'NEX
- Mould King | Mould King

---

### L1: 🚗 DIECAST & VEHICLES

#### L2: Diecast Cars | Метални колички
**Slug:** `toys/vehicles/diecast`

| EN | BG | Scale |
|----|----|----|
| Hot Wheels | Хот Уилс | 1:64 |
| Matchbox | Матчбокс | 1:64 |
| Majorette | Мажорет | 1:64 |
| Bburago | Бураго | 1:18, 1:24 |
| Maisto | Маисто | 1:18, 1:24 |
| Welly | Уели | Various |
| Siku | Сику | Various |

---

#### L2: Model Trains | Модели влакове
**Slug:** `toys/vehicles/trains`

| EN | BG | Scale |
|----|----|----|
| HO Scale | HO Мащаб | 1:87 |
| N Scale | N Мащаб | 1:160 |
| O Scale | O Мащаб | 1:48 |
| G Scale | G Мащаб | 1:22.5 |

**Popular Brands:**
- Märklin | Марклин
- Roco | Роко
- Piko | Пико
- Hornby | Хорнби

---

### L1: 🎀 DOLLS

#### L2: Fashion Dolls | Модни кукли
**Slug:** `toys/dolls/fashion`

| EN | BG | Description |
|----|----|----|
| Barbie | Барби | Mattel classic |
| Bratz | Братц | Fashion dolls |
| Monster High | Монстър Хай | Monster theme |
| L.O.L. Surprise | ЛОЛ Сърпрайз | Surprise dolls |
| Rainbow High | Рейнбоу Хай | Fashion dolls |
| American Girl | Американско момиче | Premium dolls |

---

#### L2: Collectible Dolls | Колекционерски кукли
**Slug:** `toys/dolls/collectible`

- Porcelain Dolls | Порцеланови кукли
- Artist Dolls | Авторски кукли
- Reborn Dolls | Реборн кукли
- BJD Dolls | BJD кукли
- Vintage Dolls | Винтидж кукли

---

### L1: 🎓 EDUCATIONAL TOYS

#### L2: STEM Toys | STEM играчки
**Slug:** `toys/educational/stem`

| EN | BG | Description |
|----|----|----|
| Robotics Kits | Роботика комплекти | Build robots |
| Electronics Kits | Електроника комплекти | Circuits |
| Engineering Sets | Инженерни комплекти | Building |
| Chemistry Sets | Химия комплекти | Experiments |
| Physics Toys | Физика играчки | Science |
| Biology Kits | Биология комплекти | Nature |

---

#### L2: Coding Toys | Програмиращи играчки
**Slug:** `toys/educational/coding`

- Coding Robots | Програмиращи роботи
- Scratch Kits | Скреч комплекти
- Arduino for Kids | Ардуино за деца
- micro:bit | micro:bit
- Sphero | Сферо

---

### L1: 🚁 RADIO CONTROL

#### L2: RC Cars | RC автомобили
**Slug:** `toys/rc/cars`

| EN | BG | Description |
|----|----|----|
| On-Road RC | Шосейни RC | Street racing |
| Off-Road RC | Офроуд RC | Terrain |
| Buggy | Бъги | Dune |
| Monster Truck | Монстър трак | Big wheels |
| Drift RC | Дрифт RC | Drifting |
| Crawler | Кроулър | Rock climbing |

---

#### L2: RC Drones | Дронове
**Slug:** `toys/rc/drones`

- Camera Drones | Дронове с камера
- Racing Drones | Състезателни дронове
- Mini Drones | Мини дронове
- FPV Drones | FPV дронове
- Toy Drones | Играчка дронове

---

---

## 🏷️ Attribute System (The Power Layer)

### Toy Product Attributes Schema

```typescript
interface ToyProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === TOY SPECIFICS ===
  brand: string;
  product_line?: string;
  
  // === AGE RANGE ===
  age_min: number;
  age_max?: number;
  
  // === CHARACTERISTICS ===
  material?: Material[];
  piece_count?: number;
  dimensions?: string;
  batteries_required: boolean;
  batteries_included: boolean;
  
  // === COLLECTIBLE ===
  vintage: boolean;
  limited_edition: boolean;
  year?: number;
  series?: string;
  
  // === SAFETY ===
  safety_certified: boolean;
  small_parts_warning: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  original_packaging: boolean;
  complete_set: boolean;
  
  seller_type: 'private' | 'store' | 'collector';
  location_city: string;
  
  images: string[];
}

type Material = 'plastic' | 'wood' | 'metal' | 'fabric' | 'rubber' | 'electronic';
type ProductCondition = 'new_sealed' | 'new_opened' | 'like_new' | 'used' | 'for_parts';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('toys', 'Toys & Hobbies', 'Играчки и хобита', 'toys', 'toys', NULL, 0, '🧸', 18, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('toys-action', 'Action Figures', 'Екшън фигури', 'action-figures', 'toys/action-figures', 'toys', 1, '🦸', 1, true),
('toys-building', 'Building Toys', 'Конструктори', 'building', 'toys/building', 'toys', 1, '🧱', 2, true),
('toys-vehicles', 'Diecast & Vehicles', 'Колички и превозни средства', 'vehicles', 'toys/vehicles', 'toys', 1, '🚗', 3, true),
('toys-dolls', 'Dolls & Accessories', 'Кукли и аксесоари', 'dolls', 'toys/dolls', 'toys', 1, '🎀', 4, true),
('toys-puzzles', 'Puzzles & Games', 'Пъзели и игри', 'puzzles', 'toys/puzzles', 'toys', 1, '🧩', 5, true),
('toys-arts', 'Arts & Crafts', 'Изкуство и занаяти', 'arts-crafts', 'toys/arts-crafts', 'toys', 1, '🎨', 6, true),
('toys-educational', 'Educational Toys', 'Образователни играчки', 'educational', 'toys/educational', 'toys', 1, '🎓', 7, true),
('toys-outdoor', 'Outdoor Toys', 'Играчки за навън', 'outdoor', 'toys/outdoor', 'toys', 1, '🪁', 8, true),
('toys-stuffed', 'Stuffed Animals', 'Плюшени играчки', 'stuffed', 'toys/stuffed', 'toys', 1, '🧸', 9, true),
('toys-rc', 'Radio Control', 'Радиоуправляеми', 'rc', 'toys/rc', 'toys', 1, '🚁', 10, true),
('toys-collectible', 'Collectible Toys', 'Колекционерски', 'collectible', 'toys/collectible', 'toys', 1, '🏺', 11, true);

-- L2: Building
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('building-lego', 'LEGO', 'LEGO', 'lego', 'toys/building/lego', 'toys-building', 2, '🧱', 1, true),
('building-alt', 'LEGO Alternatives', 'Алтернативи на LEGO', 'lego-alternatives', 'toys/building/lego-alternatives', 'toys-building', 2, '🏗️', 2, true),
('building-magnetic', 'Magnetic Building', 'Магнитни конструктори', 'magnetic', 'toys/building/magnetic', 'toys-building', 2, '🧲', 3, true),
('building-wooden', 'Wooden Blocks', 'Дървени кубчета', 'wooden', 'toys/building/wooden', 'toys-building', 2, '🪵', 4, true),
('building-models', 'Model Kits', 'Модели за сглобяване', 'model-kits', 'toys/building/model-kits', 'toys-building', 2, '🛠️', 5, true);

-- L2: Vehicles
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('vehicles-diecast', 'Diecast Cars', 'Метални колички', 'diecast', 'toys/vehicles/diecast', 'toys-vehicles', 2, '🚗', 1, true),
('vehicles-trains', 'Model Trains', 'Модели влакове', 'trains', 'toys/vehicles/trains', 'toys-vehicles', 2, '🚂', 2, true),
('vehicles-rc', 'RC Vehicles', 'RC превозни средства', 'rc', 'toys/vehicles/rc', 'toys-vehicles', 2, '🎮', 3, true),
('vehicles-slot', 'Slot Cars', 'Слот колички', 'slot-cars', 'toys/vehicles/slot-cars', 'toys-vehicles', 2, '🏎️', 4, true),
('vehicles-planes', 'Model Planes', 'Модели самолети', 'planes', 'toys/vehicles/planes', 'toys-vehicles', 2, '✈️', 5, true);

-- L2: Dolls
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('dolls-fashion', 'Fashion Dolls', 'Модни кукли', 'fashion', 'toys/dolls/fashion', 'toys-dolls', 2, '👗', 1, true),
('dolls-baby', 'Baby Dolls', 'Бебешки кукли', 'baby', 'toys/dolls/baby', 'toys-dolls', 2, '👶', 2, true),
('dolls-collectible', 'Collectible Dolls', 'Колекционерски кукли', 'collectible', 'toys/dolls/collectible', 'toys-dolls', 2, '💎', 3, true),
('dolls-houses', 'Dollhouses', 'Куклени къщи', 'dollhouses', 'toys/dolls/dollhouses', 'toys-dolls', 2, '🏠', 4, true);

-- L2: RC
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('rc-cars', 'RC Cars', 'RC автомобили', 'cars', 'toys/rc/cars', 'toys-rc', 2, '🚗', 1, true),
('rc-drones', 'RC Drones', 'Дронове', 'drones', 'toys/rc/drones', 'toys-rc', 2, '🚁', 2, true),
('rc-helicopters', 'RC Helicopters', 'RC хеликоптери', 'helicopters', 'toys/rc/helicopters', 'toys-rc', 2, '🚁', 3, true),
('rc-boats', 'RC Boats', 'RC лодки', 'boats', 'toys/rc/boats', 'toys-rc', 2, '🚤', 4, true),
('rc-planes', 'RC Planes', 'RC самолети', 'planes', 'toys/rc/planes', 'toys-rc', 2, '✈️', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Toys & Hobbies | Играчки и хобита |
| Action Figures | Екшън фигури |
| Building Toys | Конструктори |
| Dolls | Кукли |
| Puzzles & Games | Пъзели и игри |
| Educational Toys | Образователни играчки |
| Radio Control | Радиоуправляеми |

### Attribute Labels

| EN | BG |
|----|----|
| Age Range | Възраст |
| Brand | Марка |
| Material | Материал |
| Piece Count | Брой части |
| Condition | Състояние |
| Batteries Required | Изисква батерии |
| Original Packaging | Оригинална опаковка |

### Age Ranges

| EN | BG |
|----|----|
| 0-2 years | 0-2 години |
| 3-5 years | 3-5 години |
| 6-8 years | 6-8 години |
| 9-12 years | 9-12 години |
| 12+ years | 12+ години |
| Adults | Възрастни |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add toy brands reference
- [ ] Add LEGO themes reference
- [ ] Test age range filters

### API
- [ ] GET /categories/toys (tree structure)
- [ ] GET /products with filters
- [ ] Age-appropriate filtering
- [ ] Brand search

### Frontend
- [ ] Category browser
- [ ] Age range filter
- [ ] Brand filter
- [ ] Condition filter
- [ ] Collectible badges

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 69  
**Created:** December 3, 2025
