# 🏭 Industrial & Scientific | Индустриални и научни

**Category Slug:** `industrial`  
**Icon:** 🏭  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Industrial → Machinery → CNC |
| **Attributes** | Filtering, Search, Campaigns | Brand, Capacity, Voltage |
| **Tags** | Dynamic Collections & SEO | "heavy-duty", "automation" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🏭 Industrial & Scientific (L0)
│
├── ⚙️ Industrial Machinery (L1)
│   ├── CNC Machines (L2)
│   ├── Lathes (L2)
│   ├── Milling Machines (L2)
│   ├── Presses (L2)
│   ├── Cutting Machines (L2)
│   └── Welding Equipment (L2)
│
├── 🔧 Material Handling (L1)
│   ├── Forklifts (L2)
│   ├── Pallet Jacks (L2)
│   ├── Conveyors (L2)
│   ├── Hoists & Cranes (L2)
│   ├── Carts & Trolleys (L2)
│   └── Lift Tables (L2)
│
├── 🔬 Lab Equipment (L1)
│   ├── Microscopes (L2)
│   ├── Centrifuges (L2)
│   ├── Lab Balances (L2)
│   ├── Spectrophotometers (L2)
│   ├── Incubators (L2)
│   └── Lab Supplies (L2)
│
├── 📏 Test & Measurement (L1)
│   ├── Multimeters (L2)
│   ├── Oscilloscopes (L2)
│   ├── Calipers (L2)
│   ├── Pressure Gauges (L2)
│   ├── Temperature Meters (L2)
│   └── Flow Meters (L2)
│
├── 🦺 Safety & PPE (L1)
│   ├── Hard Hats (L2)
│   ├── Safety Glasses (L2)
│   ├── Gloves (L2)
│   ├── Respirators (L2)
│   ├── Safety Vests (L2)
│   └── Safety Shoes (L2)
│
├── ⚡ Electrical Components (L1)
│   ├── Motors (L2)
│   ├── Contactors (L2)
│   ├── Relays (L2)
│   ├── PLCs (L2)
│   ├── Sensors (L2)
│   └── Power Supplies (L2)
│
├── 🔩 Fasteners & Hardware (L1)
│   ├── Industrial Bolts (L2)
│   ├── Nuts & Washers (L2)
│   ├── Rivets (L2)
│   ├── Anchors (L2)
│   ├── Chains (L2)
│   └── Springs (L2)
│
├── 🏗️ Construction Equipment (L1)
│   ├── Concrete Mixers (L2)
│   ├── Scaffolding (L2)
│   ├── Generators (L2)
│   ├── Compressors (L2)
│   ├── Pumps (L2)
│   └── Excavators (L2)
│
├── 📦 Packaging (L1)
│   ├── Packaging Machines (L2)
│   ├── Strapping (L2)
│   ├── Shrink Wrap (L2)
│   ├── Industrial Boxes (L2)
│   └── Labels & Printers (L2)
│
└── 🧪 Raw Materials (L1)
    ├── Metals (L2)
    ├── Plastics (L2)
    ├── Chemicals (L2)
    ├── Adhesives (L2)
    └── Lubricants (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 55 (L2) = 66 categories**

---

## 📊 Complete Category Reference

### L1: ⚙️ INDUSTRIAL MACHINERY | ИНДУСТРИАЛНИ МАШИНИ

#### L2: CNC Machines | ЦПУ машини
**Slug:** `industrial/machinery/cnc`

| EN | BG | Description |
|----|----|----|
| CNC Router | ЦПУ рутер | Wood/Plastic |
| CNC Lathe | ЦПУ струг | Turning |
| CNC Mill | ЦПУ фреза | Milling |
| Laser Cutter | Лазерен резак | Precision |
| Plasma Cutter | Плазма резак | Metal |
| 3D Printer | 3D принтер | Additive |

**Brands:**
- Haas | Хаас
- Mazak | Мазак
- DMG Mori | ДМГ Мори
- Fanuc | Фанук

---

### L1: 🔬 LAB EQUIPMENT | ЛАБОРАТОРНО ОБОРУДВАНЕ

#### L2: Microscopes | Микроскопи
**Slug:** `industrial/lab/microscopes`

| EN | BG | Description |
|----|----|----|
| Optical | Оптични | Light |
| Stereo | Стерео | 3D viewing |
| Digital | Дигитални | USB output |
| Electron | Електронни | High magnification |
| Fluorescence | Флуоресцентни | Special |

**Brands:**
- Zeiss | Цайс
- Olympus | Олимпус
- Nikon | Никон
- Leica | Лайка

---

### L1: ⚡ ELECTRICAL COMPONENTS | ЕЛЕКТРИЧЕСКИ КОМПОНЕНТИ

#### L2: PLCs | ПЛК контролери
**Slug:** `industrial/electrical/plc`

| EN | BG | Description |
|----|----|----|
| Siemens PLC | Сименс ПЛК | German |
| Allen-Bradley | Алън-Брадли | American |
| Mitsubishi | Мицубиши | Japanese |
| Omron | Омрон | Japanese |
| Schneider | Шнайдер | French |

---

### L1: 🦺 SAFETY & PPE | БЕЗОПАСНОСТ И ЛПС

#### L2: Safety Glasses | Предпазни очила
**Slug:** `industrial/safety/glasses`

| EN | BG | Description |
|----|----|----|
| Clear | Прозрачни | General |
| Tinted | Тонирани | Sun protection |
| Anti-Fog | Против запотяване | Humid |
| Prescription | С диоптър | Vision |
| Welding | За заваряване | Arc |

---

---

## 🏷️ Attribute System (The Power Layer)

### Industrial Product Attributes Schema

```typescript
interface IndustrialProduct {
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
  
  // === SPECIFICATIONS ===
  power_kw?: number;
  voltage?: Voltage;
  phase?: Phase;
  capacity?: string;
  
  // === DIMENSIONS ===
  weight_kg?: number;
  dimensions_cm?: string;
  
  // === CONDITION ===
  condition: ProductCondition;
  operating_hours?: number;
  
  // === CERTIFICATIONS ===
  certifications?: string[];
  ce_marked: boolean;
  
  // === WARRANTY ===
  warranty_months?: number;
  
  seller_type: 'business' | 'distributor' | 'manufacturer';
  location_city: string;
  
  images: string[];
}

type Voltage = '220V' | '380V' | '400V' | '480V';
type Phase = 'single' | 'three';
type ProductCondition = 'new' | 'refurbished' | 'used' | 'for_parts';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('industrial', 'Industrial & Scientific', 'Индустриални и научни', 'industrial', 'industrial', NULL, 0, '🏭', 33, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('ind-machinery', 'Industrial Machinery', 'Индустриални машини', 'machinery', 'industrial/machinery', 'industrial', 1, '⚙️', 1, true),
('ind-handling', 'Material Handling', 'Работа с материали', 'handling', 'industrial/handling', 'industrial', 1, '🔧', 2, true),
('ind-lab', 'Lab Equipment', 'Лабораторно оборудване', 'lab', 'industrial/lab', 'industrial', 1, '🔬', 3, true),
('ind-test', 'Test & Measurement', 'Тестване и измерване', 'test', 'industrial/test', 'industrial', 1, '📏', 4, true),
('ind-safety', 'Safety & PPE', 'Безопасност', 'safety', 'industrial/safety', 'industrial', 1, '🦺', 5, true),
('ind-electrical', 'Electrical Components', 'Електрически', 'electrical', 'industrial/electrical', 'industrial', 1, '⚡', 6, true),
('ind-fasteners', 'Fasteners & Hardware', 'Крепежни елементи', 'fasteners', 'industrial/fasteners', 'industrial', 1, '🔩', 7, true),
('ind-construction', 'Construction Equipment', 'Строително оборудване', 'construction', 'industrial/construction', 'industrial', 1, '🏗️', 8, true),
('ind-packaging', 'Packaging', 'Опаковане', 'packaging', 'industrial/packaging', 'industrial', 1, '📦', 9, true),
('ind-materials', 'Raw Materials', 'Суровини', 'materials', 'industrial/materials', 'industrial', 1, '🧪', 10, true);

-- L2: Machinery
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('mach-cnc', 'CNC Machines', 'ЦПУ машини', 'cnc', 'industrial/machinery/cnc', 'ind-machinery', 2, '🖥️', 1, true),
('mach-lathe', 'Lathes', 'Стругове', 'lathes', 'industrial/machinery/lathes', 'ind-machinery', 2, '⚙️', 2, true),
('mach-mill', 'Milling Machines', 'Фрези', 'milling', 'industrial/machinery/milling', 'ind-machinery', 2, '🔧', 3, true),
('mach-press', 'Presses', 'Преси', 'presses', 'industrial/machinery/presses', 'ind-machinery', 2, '🔨', 4, true),
('mach-cut', 'Cutting Machines', 'Режещи машини', 'cutting', 'industrial/machinery/cutting', 'ind-machinery', 2, '✂️', 5, true),
('mach-weld', 'Welding Equipment', 'Заваръчно оборудване', 'welding', 'industrial/machinery/welding', 'ind-machinery', 2, '🔥', 6, true);

-- L2: Lab
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('lab-micro', 'Microscopes', 'Микроскопи', 'microscopes', 'industrial/lab/microscopes', 'ind-lab', 2, '🔬', 1, true),
('lab-centri', 'Centrifuges', 'Центрофуги', 'centrifuges', 'industrial/lab/centrifuges', 'ind-lab', 2, '🔄', 2, true),
('lab-balance', 'Lab Balances', 'Везни', 'balances', 'industrial/lab/balances', 'ind-lab', 2, '⚖️', 3, true),
('lab-spectro', 'Spectrophotometers', 'Спектрофотометри', 'spectro', 'industrial/lab/spectro', 'ind-lab', 2, '🌈', 4, true),
('lab-incub', 'Incubators', 'Инкубатори', 'incubators', 'industrial/lab/incubators', 'ind-lab', 2, '🌡️', 5, true);

-- L2: Electrical
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('elec-motors', 'Motors', 'Мотори', 'motors', 'industrial/electrical/motors', 'ind-electrical', 2, '⚙️', 1, true),
('elec-contact', 'Contactors', 'Контактори', 'contactors', 'industrial/electrical/contactors', 'ind-electrical', 2, '🔌', 2, true),
('elec-relay', 'Relays', 'Релета', 'relays', 'industrial/electrical/relays', 'ind-electrical', 2, '🔲', 3, true),
('elec-plc', 'PLCs', 'ПЛК', 'plc', 'industrial/electrical/plc', 'ind-electrical', 2, '🖥️', 4, true),
('elec-sensor', 'Sensors', 'Сензори', 'sensors', 'industrial/electrical/sensors', 'ind-electrical', 2, '📡', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Industrial & Scientific | Индустриални и научни |
| Industrial Machinery | Индустриални машини |
| Lab Equipment | Лабораторно оборудване |
| Safety & PPE | Безопасност и ЛПС |
| Electrical Components | Електрически компоненти |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Power | Мощност |
| Voltage | Напрежение |
| Condition | Състояние |
| Certification | Сертификат |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add industrial brands reference
- [ ] Add certifications reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Power filter
- [ ] Certification filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 66  
**Created:** December 3, 2025
