# 🔧 Tools & Home Improvement | Инструменти и подобрения за дома

**Category Slug:** `tools-home`  
**Icon:** 🔧  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Tools → Power Tools → Drills |
| **Attributes** | Filtering, Search, Campaigns | Brand, Power Type, Voltage |
| **Tags** | Dynamic Collections & SEO | "professional", "diy" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🔧 Tools & Home Improvement (L0)
│
├── 🔌 Power Tools (L1)
│   ├── Drills (L2)
│   ├── Saws (L2)
│   ├── Sanders (L2)
│   ├── Grinders (L2)
│   ├── Routers (L2)
│   └── Power Tool Sets (L2)
│
├── 🔨 Hand Tools (L1)
│   ├── Hammers (L2)
│   ├── Screwdrivers (L2)
│   ├── Wrenches (L2)
│   ├── Pliers (L2)
│   ├── Hand Saws (L2)
│   └── Hand Tool Sets (L2)
│
├── 📏 Measuring & Layout (L1)
│   ├── Tape Measures (L2)
│   ├── Levels (L2)
│   ├── Laser Measures (L2)
│   ├── Squares (L2)
│   └── Stud Finders (L2)
│
├── 🔩 Fasteners & Hardware (L1)
│   ├── Screws (L2)
│   ├── Nails (L2)
│   ├── Bolts & Nuts (L2)
│   ├── Anchors (L2)
│   ├── Hinges (L2)
│   └── Brackets (L2)
│
├── 🎨 Paint & Supplies (L1)
│   ├── Interior Paint (L2)
│   ├── Exterior Paint (L2)
│   ├── Paint Brushes (L2)
│   ├── Rollers (L2)
│   ├── Spray Paint (L2)
│   └── Paint Sprayers (L2)
│
├── 💡 Electrical (L1)
│   ├── Wiring (L2)
│   ├── Outlets & Switches (L2)
│   ├── Circuit Breakers (L2)
│   ├── Lighting Fixtures (L2)
│   ├── Electrical Tools (L2)
│   └── Solar Equipment (L2)
│
├── 🚿 Plumbing (L1)
│   ├── Pipes & Fittings (L2)
│   ├── Faucets (L2)
│   ├── Toilets (L2)
│   ├── Sinks (L2)
│   ├── Water Heaters (L2)
│   └── Plumbing Tools (L2)
│
├── 🏠 Building Materials (L1)
│   ├── Lumber (L2)
│   ├── Drywall (L2)
│   ├── Insulation (L2)
│   ├── Roofing (L2)
│   ├── Flooring (L2)
│   └── Cement & Concrete (L2)
│
├── 🚪 Doors & Windows (L1)
│   ├── Interior Doors (L2)
│   ├── Exterior Doors (L2)
│   ├── Windows (L2)
│   ├── Garage Doors (L2)
│   └── Door Hardware (L2)
│
├── 🔒 Security & Safety (L1)
│   ├── Locks (L2)
│   ├── Safes (L2)
│   ├── Security Cameras (L2)
│   ├── Smoke Detectors (L2)
│   └── Safety Equipment (L2)
│
└── 🧰 Storage & Organization (L1)
    ├── Tool Boxes (L2)
    ├── Workbenches (L2)
    ├── Shelving (L2)
    ├── Cabinets (L2)
    └── Garage Organization (L2)
```

**Total Categories: 1 (L0) + 11 (L1) + 58 (L2) = 70 categories**

---

## 📊 Complete Category Reference

### L1: 🔌 POWER TOOLS | ЕЛЕКТРИЧЕСКИ ИНСТРУМЕНТИ

#### L2: Drills | Бормашини
**Slug:** `tools-home/power/drills`

| EN | BG | Description |
|----|----|----|
| Cordless Drills | Акумулаторни бормашини | Battery powered |
| Corded Drills | Кабелни бормашини | Plug-in |
| Hammer Drills | Ударни бормашини | For masonry |
| Impact Drivers | Ударни отвертки | High torque |
| Drill Presses | Настолни бормашини | Stationary |

**Top Brands:**
- Bosch | Бош
- Makita | Макита
- DeWalt | ДиУолт
- Milwaukee | Милуоки
- Metabo | Метабо
- Hilti | Хилти

---

#### L2: Saws | Триони
**Slug:** `tools-home/power/saws`

| EN | BG | Description |
|----|----|----|
| Circular Saws | Циркуляри | Round blade |
| Jigsaws | Прободни триони | Curves |
| Reciprocating Saws | Саблени триони | Demo work |
| Miter Saws | Герунзи | Angle cuts |
| Table Saws | Настолни циркуляри | Large projects |
| Band Saws | Лентови триони | Metal/wood |

---

### L1: 🔨 HAND TOOLS | РЪЧНИ ИНСТРУМЕНТИ

#### L2: Screwdrivers | Отвертки
**Slug:** `tools-home/hand/screwdrivers`

| EN | BG | Description |
|----|----|----|
| Phillips | Кръстати | Cross tip |
| Flathead | Плоски | Flat tip |
| Torx | Торкс | Star pattern |
| Precision | Прецизни | Small work |
| Insulated | Изолирани | Electrical |
| Ratcheting | С тресчотка | Quick drive |

---

#### L2: Wrenches | Гаечни ключове
**Slug:** `tools-home/hand/wrenches`

| EN | BG | Description |
|----|----|----|
| Adjustable | Регулируеми | Multi-size |
| Combination | Комбинирани | Open & box |
| Socket Sets | Вложки | With ratchet |
| Torque Wrenches | Динамометрични | Precise |
| Pipe Wrenches | Водопроводни | Plumbing |
| Allen Keys | Шестограми | Hex |

---

### L1: 💡 ELECTRICAL | ЕЛЕКТРИКА

#### L2: Lighting Fixtures | Осветителни тела
**Slug:** `tools-home/electrical/lighting`

| EN | BG | Description |
|----|----|----|
| Ceiling Lights | Плафони | Overhead |
| Pendant Lights | Пендели | Hanging |
| Wall Sconces | Аплици | Wall-mounted |
| Track Lighting | Шинно осветление | Adjustable |
| Recessed Lights | Вградени лампи | Built-in |
| Outdoor Lights | Външно осветление | Weatherproof |

---

### L1: 🚿 PLUMBING | ВОДОПРОВОД

#### L2: Faucets | Смесители
**Slug:** `tools-home/plumbing/faucets`

| EN | BG | Description |
|----|----|----|
| Kitchen Faucets | Кухненски смесители | Sink |
| Bathroom Faucets | Смесители за баня | Basin |
| Shower Heads | Душове | Bathing |
| Bathtub Faucets | Смесители за вана | Bath |
| Outdoor Faucets | Външни кранове | Garden |

**Popular Brands:**
- Grohe | Грое
- Hansgrohe | Хансгрое
- TECE | ТЕСЕ
- Roca | Рока
- Ideal Standard | Идеал Стандарт

---

### L1: 🏠 BUILDING MATERIALS | СТРОИТЕЛНИ МАТЕРИАЛИ

#### L2: Flooring | Подови настилки
**Slug:** `tools-home/building/flooring`

| EN | BG | Description |
|----|----|----|
| Laminate | Ламинат | Affordable |
| Hardwood | Дървен паркет | Premium |
| Vinyl | Винил | Waterproof |
| Tile | Плочки | Ceramic/Porcelain |
| Carpet | Мокет | Soft |
| Engineered Wood | Инженерен паркет | Stable |

---

---

## 🏷️ Attribute System (The Power Layer)

### Tool Product Attributes Schema

```typescript
interface ToolProduct {
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
  
  // === POWER TOOL SPECIFICS ===
  power_type?: PowerType;
  voltage?: number;
  wattage?: number;
  battery_ah?: number;
  rpm?: number;
  
  // === PHYSICAL ===
  weight_kg?: number;
  dimensions_cm?: string;
  
  // === CONDITION ===
  condition: ProductCondition;
  warranty_months?: number;
  
  // === FEATURES ===
  is_professional: boolean;
  includes_case: boolean;
  includes_accessories: boolean;
  
  seller_type: 'private' | 'store' | 'business';
  location_city: string;
  
  images: string[];
}

type PowerType = 'cordless' | 'corded' | 'pneumatic' | 'manual';
type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'used';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tools-home', 'Tools & Home Improvement', 'Инструменти и дом', 'tools-home', 'tools-home', NULL, 0, '🔧', 23, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('th-power', 'Power Tools', 'Електрически инструменти', 'power', 'tools-home/power', 'tools-home', 1, '🔌', 1, true),
('th-hand', 'Hand Tools', 'Ръчни инструменти', 'hand', 'tools-home/hand', 'tools-home', 1, '🔨', 2, true),
('th-measuring', 'Measuring & Layout', 'Измерване', 'measuring', 'tools-home/measuring', 'tools-home', 1, '📏', 3, true),
('th-fasteners', 'Fasteners & Hardware', 'Крепежни елементи', 'fasteners', 'tools-home/fasteners', 'tools-home', 1, '🔩', 4, true),
('th-paint', 'Paint & Supplies', 'Бои и материали', 'paint', 'tools-home/paint', 'tools-home', 1, '🎨', 5, true),
('th-electrical', 'Electrical', 'Електрика', 'electrical', 'tools-home/electrical', 'tools-home', 1, '💡', 6, true),
('th-plumbing', 'Plumbing', 'Водопровод', 'plumbing', 'tools-home/plumbing', 'tools-home', 1, '🚿', 7, true),
('th-building', 'Building Materials', 'Строителни материали', 'building', 'tools-home/building', 'tools-home', 1, '🏠', 8, true),
('th-doors', 'Doors & Windows', 'Врати и прозорци', 'doors', 'tools-home/doors', 'tools-home', 1, '🚪', 9, true),
('th-security', 'Security & Safety', 'Сигурност', 'security', 'tools-home/security', 'tools-home', 1, '🔒', 10, true),
('th-storage', 'Storage & Organization', 'Съхранение', 'storage', 'tools-home/storage', 'tools-home', 1, '🧰', 11, true);

-- L2: Power Tools
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('power-drills', 'Drills', 'Бормашини', 'drills', 'tools-home/power/drills', 'th-power', 2, '🔧', 1, true),
('power-saws', 'Saws', 'Триони', 'saws', 'tools-home/power/saws', 'th-power', 2, '🪚', 2, true),
('power-sanders', 'Sanders', 'Шлифовъчни машини', 'sanders', 'tools-home/power/sanders', 'th-power', 2, '📐', 3, true),
('power-grinders', 'Grinders', 'Ъглошлайфи', 'grinders', 'tools-home/power/grinders', 'th-power', 2, '⚙️', 4, true),
('power-routers', 'Routers', 'Оберфрези', 'routers', 'tools-home/power/routers', 'th-power', 2, '🛠️', 5, true),
('power-sets', 'Power Tool Sets', 'Комплекти', 'sets', 'tools-home/power/sets', 'th-power', 2, '🧰', 6, true);

-- L2: Hand Tools
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('hand-hammers', 'Hammers', 'Чукове', 'hammers', 'tools-home/hand/hammers', 'th-hand', 2, '🔨', 1, true),
('hand-screwdrivers', 'Screwdrivers', 'Отвертки', 'screwdrivers', 'tools-home/hand/screwdrivers', 'th-hand', 2, '🪛', 2, true),
('hand-wrenches', 'Wrenches', 'Гаечни ключове', 'wrenches', 'tools-home/hand/wrenches', 'th-hand', 2, '🔧', 3, true),
('hand-pliers', 'Pliers', 'Клещи', 'pliers', 'tools-home/hand/pliers', 'th-hand', 2, '🛠️', 4, true),
('hand-saws', 'Hand Saws', 'Ръчни триони', 'hand-saws', 'tools-home/hand/hand-saws', 'th-hand', 2, '🪚', 5, true),
('hand-sets', 'Hand Tool Sets', 'Комплекти', 'sets', 'tools-home/hand/sets', 'th-hand', 2, '🧰', 6, true);

-- L2: Electrical
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('elec-wiring', 'Wiring', 'Окабеляване', 'wiring', 'tools-home/electrical/wiring', 'th-electrical', 2, '🔌', 1, true),
('elec-outlets', 'Outlets & Switches', 'Контакти и ключове', 'outlets', 'tools-home/electrical/outlets', 'th-electrical', 2, '🔲', 2, true),
('elec-breakers', 'Circuit Breakers', 'Предпазители', 'breakers', 'tools-home/electrical/breakers', 'th-electrical', 2, '⚡', 3, true),
('elec-lighting', 'Lighting Fixtures', 'Осветление', 'lighting', 'tools-home/electrical/lighting', 'th-electrical', 2, '💡', 4, true),
('elec-tools', 'Electrical Tools', 'Електро инструменти', 'tools', 'tools-home/electrical/tools', 'th-electrical', 2, '🔧', 5, true),
('elec-solar', 'Solar Equipment', 'Соларно оборудване', 'solar', 'tools-home/electrical/solar', 'th-electrical', 2, '☀️', 6, true);

-- L2: Plumbing
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('plumb-pipes', 'Pipes & Fittings', 'Тръби и фитинги', 'pipes', 'tools-home/plumbing/pipes', 'th-plumbing', 2, '🔧', 1, true),
('plumb-faucets', 'Faucets', 'Смесители', 'faucets', 'tools-home/plumbing/faucets', 'th-plumbing', 2, '🚿', 2, true),
('plumb-toilets', 'Toilets', 'Тоалетни', 'toilets', 'tools-home/plumbing/toilets', 'th-plumbing', 2, '🚽', 3, true),
('plumb-sinks', 'Sinks', 'Мивки', 'sinks', 'tools-home/plumbing/sinks', 'th-plumbing', 2, '🚰', 4, true),
('plumb-heaters', 'Water Heaters', 'Бойлери', 'heaters', 'tools-home/plumbing/heaters', 'th-plumbing', 2, '♨️', 5, true),
('plumb-tools', 'Plumbing Tools', 'ВиК инструменти', 'tools', 'tools-home/plumbing/tools', 'th-plumbing', 2, '🔧', 6, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Tools & Home Improvement | Инструменти и подобрения за дома |
| Power Tools | Електрически инструменти |
| Hand Tools | Ръчни инструменти |
| Plumbing | Водопровод |
| Electrical | Електрика |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Power Type | Тип захранване |
| Voltage | Волтаж |
| Condition | Състояние |
| Warranty | Гаранция |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add tool brands reference
- [ ] Add power types reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Power type filter
- [ ] Condition filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 70  
**Created:** December 3, 2025
