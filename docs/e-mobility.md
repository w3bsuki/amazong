# ⚡ E-Mobility | Електрическа мобилност

**Category Slug:** `e-mobility`  
**Icon:** ⚡  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | E-Mobility → E-Scooters → Commuter |
| **Attributes** | Filtering, Search, Campaigns | Brand, Range, Motor Power |
| **Tags** | Dynamic Collections & SEO | "foldable", "off-road" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
⚡ E-Mobility (L0)
│
├── 🛴 E-Scooters (L1)
│   ├── Commuter Scooters (L2)
│   ├── Performance Scooters (L2)
│   ├── Off-Road Scooters (L2)
│   ├── Foldable Scooters (L2)
│   ├── Kids Scooters (L2)
│   └── Budget Scooters (L2)
│
├── 🚲 E-Bikes (L1)
│   ├── City E-Bikes (L2)
│   ├── Mountain E-Bikes (L2)
│   ├── Road E-Bikes (L2)
│   ├── Folding E-Bikes (L2)
│   ├── Cargo E-Bikes (L2)
│   └── Fat Tire E-Bikes (L2)
│
├── 🛹 E-Skateboards (L1)
│   ├── Longboards (L2)
│   ├── Short Boards (L2)
│   ├── All-Terrain (L2)
│   └── Budget Boards (L2)
│
├── ⚖️ Hoverboards (L1)
│   ├── Standard (L2)
│   ├── Off-Road (L2)
│   ├── Kids (L2)
│   └── Premium (L2)
│
├── 🔄 E-Unicycles (L1)
│   ├── Beginner (L2)
│   ├── Intermediate (L2)
│   ├── Advanced (L2)
│   └── Performance (L2)
│
├── 🏍️ E-Motorcycles (L1)
│   ├── Commuter (L2)
│   ├── Sport (L2)
│   ├── Off-Road (L2)
│   └── Mopeds (L2)
│
├── 🚗 E-Vehicles (L1)
│   ├── Electric Cars (L2)
│   ├── Golf Carts (L2)
│   ├── Neighborhood Vehicles (L2)
│   └── ATVs (L2)
│
├── 🔋 Batteries & Charging (L1)
│   ├── E-Scooter Batteries (L2)
│   ├── E-Bike Batteries (L2)
│   ├── Chargers (L2)
│   ├── Fast Chargers (L2)
│   └── Battery Repair (L2)
│
├── 🔧 Parts & Accessories (L1)
│   ├── Tires & Tubes (L2)
│   ├── Motors (L2)
│   ├── Controllers (L2)
│   ├── Displays (L2)
│   ├── Brakes (L2)
│   └── Lights (L2)
│
└── 🦺 Safety Gear (L1)
    ├── Helmets (L2)
    ├── Knee Pads (L2)
    ├── Elbow Pads (L2)
    ├── Gloves (L2)
    └── Reflective Gear (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 50 (L2) = 61 categories**

---

## 📊 Complete Category Reference

### L1: 🛴 E-SCOOTERS | ЕЛЕКТРИЧЕСКИ ТРОТИНЕТКИ

#### L2: Commuter Scooters | За ежедневно пътуване
**Slug:** `e-mobility/scooters/commuter`

| EN | BG | Description |
|----|----|----|
| Standard | Стандартни | Daily use |
| Lightweight | Леки | Easy carry |
| Long Range | Дълъг обсег | 40+ km |
| Waterproof | Водоустойчиви | IP54+ |

**Top Brands:**
- Xiaomi | Сяоми
- Segway-Ninebot | Сегуей-Найнбот
- Kaabo | Каабо
- Dualtron | Дуалтрон
- VSETT | VSETT
- Apollo | Аполо

---

#### L2: Performance Scooters | Мощни тротинетки
**Slug:** `e-mobility/scooters/performance`

| EN | BG | Description |
|----|----|----|
| Dual Motor | Два мотора | High power |
| 60V+ Systems | 60V+ системи | Advanced |
| 2000W+ | 2000W+ | High performance |
| Racing | Състезателни | Speed |

---

### L1: 🚲 E-BIKES | ЕЛЕКТРИЧЕСКИ ВЕЛОСИПЕДИ

#### L2: City E-Bikes | Градски електровелосипеди
**Slug:** `e-mobility/ebikes/city`

| EN | BG | Description |
|----|----|----|
| Step-Through | Нисък рам | Easy mount |
| Classic Frame | Класическа рама | Traditional |
| Dutch Style | Холандски стил | Comfort |
| Vintage | Ретро | Classic look |

**Popular Brands:**
- Bosch | Бош (motors)
- Shimano | Шимано (motors)
- Giant | Джайънт
- Trek | Трек
- Specialized | Спешълайзд
- Cube | Куб

---

#### L2: Mountain E-Bikes | Планински електровелосипеди
**Slug:** `e-mobility/ebikes/mountain`

| EN | BG | Description |
|----|----|----|
| Hardtail | Хардтейл | Front suspension |
| Full Suspension | Пълно окачване | All suspension |
| Enduro | Ендуро | All-mountain |
| Downhill | Даунхил | Descending |

---

### L1: 🔋 BATTERIES & CHARGING | БАТЕРИИ И ЗАРЕЖДАНЕ

#### L2: E-Scooter Batteries | Батерии за тротинетки
**Slug:** `e-mobility/batteries/scooter`

| EN | BG | Description |
|----|----|----|
| 36V Batteries | 36V батерии | Standard |
| 48V Batteries | 48V батерии | Mid-range |
| 52V Batteries | 52V батерии | Performance |
| 60V+ Batteries | 60V+ батерии | High power |
| Custom | По поръчка | Custom builds |

**Battery Specs:**
- Capacity (Ah) | Капацитет (Ah)
- Cell Type | Тип клетки
- BMS | BMS система

---

---

## 🏷️ Attribute System (The Power Layer)

### E-Mobility Product Attributes Schema

```typescript
interface EMobilityProduct {
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
  model: string;
  year?: number;
  
  // === MOTOR SPECS ===
  motor_power_w: number;
  motor_type?: MotorType;
  dual_motor: boolean;
  
  // === BATTERY ===
  battery_voltage: number;
  battery_ah: number;
  battery_wh?: number;
  range_km: number;
  
  // === PERFORMANCE ===
  top_speed_kmh: number;
  weight_kg: number;
  max_load_kg: number;
  
  // === FEATURES ===
  is_foldable: boolean;
  ip_rating?: string;
  suspension_type?: SuspensionType;
  brake_type: BrakeType;
  
  // === CONDITION ===
  condition: ProductCondition;
  mileage_km?: number;
  battery_health_percent?: number;
  
  // === WARRANTY ===
  warranty_months?: number;
  
  seller_type: 'private' | 'store' | 'distributor';
  location_city: string;
  
  images: string[];
}

type MotorType = 'hub' | 'mid_drive' | 'belt' | 'gear';
type SuspensionType = 'none' | 'front' | 'rear' | 'dual';
type BrakeType = 'mechanical_disc' | 'hydraulic_disc' | 'drum' | 'regenerative';
type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'for_parts';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('e-mobility', 'E-Mobility', 'Електрическа мобилност', 'e-mobility', 'e-mobility', NULL, 0, '⚡', 30, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('em-scooters', 'E-Scooters', 'Електротротинетки', 'scooters', 'e-mobility/scooters', 'e-mobility', 1, '🛴', 1, true),
('em-ebikes', 'E-Bikes', 'Електровелосипеди', 'ebikes', 'e-mobility/ebikes', 'e-mobility', 1, '🚲', 2, true),
('em-skateboards', 'E-Skateboards', 'Електроскейтборди', 'skateboards', 'e-mobility/skateboards', 'e-mobility', 1, '🛹', 3, true),
('em-hoverboards', 'Hoverboards', 'Ховърборди', 'hoverboards', 'e-mobility/hoverboards', 'e-mobility', 1, '⚖️', 4, true),
('em-unicycles', 'E-Unicycles', 'Електроуницикли', 'unicycles', 'e-mobility/unicycles', 'e-mobility', 1, '🔄', 5, true),
('em-motorcycles', 'E-Motorcycles', 'Електромотори', 'motorcycles', 'e-mobility/motorcycles', 'e-mobility', 1, '🏍️', 6, true),
('em-vehicles', 'E-Vehicles', 'Електромобили', 'vehicles', 'e-mobility/vehicles', 'e-mobility', 1, '🚗', 7, true),
('em-batteries', 'Batteries & Charging', 'Батерии и зареждане', 'batteries', 'e-mobility/batteries', 'e-mobility', 1, '🔋', 8, true),
('em-parts', 'Parts & Accessories', 'Части и аксесоари', 'parts', 'e-mobility/parts', 'e-mobility', 1, '🔧', 9, true),
('em-safety', 'Safety Gear', 'Защитно оборудване', 'safety', 'e-mobility/safety', 'e-mobility', 1, '🦺', 10, true);

-- L2: E-Scooters
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('scoot-commuter', 'Commuter Scooters', 'За пътуване', 'commuter', 'e-mobility/scooters/commuter', 'em-scooters', 2, '🚶', 1, true),
('scoot-perf', 'Performance Scooters', 'Мощни', 'performance', 'e-mobility/scooters/performance', 'em-scooters', 2, '🏎️', 2, true),
('scoot-offroad', 'Off-Road Scooters', 'Офроуд', 'offroad', 'e-mobility/scooters/offroad', 'em-scooters', 2, '🏔️', 3, true),
('scoot-fold', 'Foldable Scooters', 'Сгъваеми', 'foldable', 'e-mobility/scooters/foldable', 'em-scooters', 2, '📦', 4, true),
('scoot-kids', 'Kids Scooters', 'За деца', 'kids', 'e-mobility/scooters/kids', 'em-scooters', 2, '👶', 5, true),
('scoot-budget', 'Budget Scooters', 'Бюджетни', 'budget', 'e-mobility/scooters/budget', 'em-scooters', 2, '💰', 6, true);

-- L2: E-Bikes
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('ebike-city', 'City E-Bikes', 'Градски', 'city', 'e-mobility/ebikes/city', 'em-ebikes', 2, '🏙️', 1, true),
('ebike-mtb', 'Mountain E-Bikes', 'Планински', 'mountain', 'e-mobility/ebikes/mountain', 'em-ebikes', 2, '🏔️', 2, true),
('ebike-road', 'Road E-Bikes', 'Шосейни', 'road', 'e-mobility/ebikes/road', 'em-ebikes', 2, '🛣️', 3, true),
('ebike-fold', 'Folding E-Bikes', 'Сгъваеми', 'folding', 'e-mobility/ebikes/folding', 'em-ebikes', 2, '📦', 4, true),
('ebike-cargo', 'Cargo E-Bikes', 'Товарни', 'cargo', 'e-mobility/ebikes/cargo', 'em-ebikes', 2, '📦', 5, true),
('ebike-fat', 'Fat Tire E-Bikes', 'Дебели гуми', 'fat', 'e-mobility/ebikes/fat', 'em-ebikes', 2, '⚫', 6, true);

-- L2: Batteries
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bat-scooter', 'E-Scooter Batteries', 'За тротинетки', 'scooter', 'e-mobility/batteries/scooter', 'em-batteries', 2, '🛴', 1, true),
('bat-ebike', 'E-Bike Batteries', 'За велосипеди', 'ebike', 'e-mobility/batteries/ebike', 'em-batteries', 2, '🚲', 2, true),
('bat-chargers', 'Chargers', 'Зарядни', 'chargers', 'e-mobility/batteries/chargers', 'em-batteries', 2, '🔌', 3, true),
('bat-fast', 'Fast Chargers', 'Бързи зарядни', 'fast', 'e-mobility/batteries/fast', 'em-batteries', 2, '⚡', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| E-Mobility | Електрическа мобилност |
| E-Scooters | Електротротинетки |
| E-Bikes | Електровелосипеди |
| Batteries | Батерии |
| Safety Gear | Защитно оборудване |

### Attribute Labels

| EN | BG |
|----|----|
| Motor Power | Мощност на мотора |
| Range | Обсег |
| Top Speed | Макс. скорост |
| Battery | Батерия |
| Foldable | Сгъваем |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add e-mobility brands reference
- [ ] Add motor specs reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Range filter
- [ ] Power filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 61  
**Created:** December 3, 2025
