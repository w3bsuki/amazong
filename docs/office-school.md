# 📋 Office & School | Офис и училище

**Category Slug:** `office-school`  
**Icon:** 📋  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Office → Writing → Pens |
| **Attributes** | Filtering, Search, Campaigns | Brand, Color, Material |
| **Tags** | Dynamic Collections & SEO | "eco-friendly", "back-to-school" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
📋 Office & School (L0)
│
├── ✏️ Writing Instruments (L1)
│   ├── Pens (L2)
│   ├── Pencils (L2)
│   ├── Markers (L2)
│   ├── Highlighters (L2)
│   ├── Fountain Pens (L2)
│   └── Refills & Ink (L2)
│
├── 📓 Paper Products (L1)
│   ├── Notebooks (L2)
│   ├── Notepads (L2)
│   ├── Printer Paper (L2)
│   ├── Specialty Paper (L2)
│   ├── Sticky Notes (L2)
│   └── Index Cards (L2)
│
├── 📁 Filing & Organization (L1)
│   ├── Folders (L2)
│   ├── Binders (L2)
│   ├── File Cabinets (L2)
│   ├── Desk Organizers (L2)
│   ├── Labels (L2)
│   └── Storage Boxes (L2)
│
├── 🖇️ Desk Accessories (L1)
│   ├── Staplers (L2)
│   ├── Scissors (L2)
│   ├── Tape & Adhesives (L2)
│   ├── Paper Clips (L2)
│   ├── Hole Punches (L2)
│   └── Desk Sets (L2)
│
├── 🎒 School Supplies (L1)
│   ├── Backpacks (L2)
│   ├── Lunch Boxes (L2)
│   ├── Pencil Cases (L2)
│   ├── School Sets (L2)
│   ├── Art Supplies (L2)
│   └── Calculators (L2)
│
├── 🖨️ Printing & Copying (L1)
│   ├── Printers (L2)
│   ├── Ink Cartridges (L2)
│   ├── Toner (L2)
│   ├── Scanners (L2)
│   └── Laminators (L2)
│
├── 🪑 Office Furniture (L1)
│   ├── Office Chairs (L2)
│   ├── Desks (L2)
│   ├── Bookcases (L2)
│   ├── Conference Tables (L2)
│   └── Standing Desks (L2)
│
├── 📅 Planners & Calendars (L1)
│   ├── Daily Planners (L2)
│   ├── Weekly Planners (L2)
│   ├── Wall Calendars (L2)
│   ├── Desk Calendars (L2)
│   └── Agenda Books (L2)
│
├── 💼 Presentation (L1)
│   ├── Whiteboards (L2)
│   ├── Flipcharts (L2)
│   ├── Projectors (L2)
│   ├── Presentation Supplies (L2)
│   └── Display Boards (L2)
│
└── 📧 Mailing & Shipping (L1)
    ├── Envelopes (L2)
    ├── Shipping Boxes (L2)
    ├── Packing Materials (L2)
    ├── Mailing Labels (L2)
    └── Postage Supplies (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 52 (L2) = 63 categories**

---

## 📊 Complete Category Reference

### L1: ✏️ WRITING INSTRUMENTS

#### L2: Pens | Химикалки
**Slug:** `office-school/writing/pens`

| EN | BG | Description |
|----|----|----|
| Ballpoint Pens | Химикалки | Standard |
| Gel Pens | Гел химикалки | Smooth ink |
| Rollerball Pens | Ролер химикалки | Liquid ink |
| Felt Tip Pens | Флумастери | Fiber tip |
| Multicolor Pens | Многоцветни | Multiple colors |

**Brands (Attribute):**
- Pilot | Пайлот
- Stabilo | Стабило
- BIC | БИК
- Parker | Паркър
- Schneider | Шнайдер
- Faber-Castell | Фабер Кастел

---

#### L2: Fountain Pens | Писалки
**Slug:** `office-school/writing/fountain-pens`

| EN | BG | Description |
|----|----|----|
| Beginner Pens | За начинаещи | Entry-level |
| Fine Nib | Фин писец | Thin line |
| Medium Nib | Среден писец | Standard |
| Broad Nib | Широк писец | Bold line |
| Calligraphy | Калиграфски | Artistic |

**Premium Brands:**
- Montblanc | Монблан
- Parker | Паркър
- Waterman | Уотърман
- Lamy | Лами
- Cross | Крос

---

### L1: 📓 PAPER PRODUCTS

#### L2: Notebooks | Тетрадки
**Slug:** `office-school/paper/notebooks`

| EN | BG | Description |
|----|----|----|
| Spiral Notebooks | Спирални тетрадки | Ring-bound |
| Composition Books | Твърди тетрадки | Bound |
| Legal Pads | Блокове | Lined pads |
| Graph Paper | Милиметрова хартия | Grid |
| Dot Grid | Точкова мрежа | Bullet journaling |

---

### L1: 🎒 SCHOOL SUPPLIES

#### L2: Backpacks | Раници
**Slug:** `office-school/school/backpacks`

| EN | BG | Description |
|----|----|----|
| School Backpacks | Ученически раници | Standard |
| Rolling Backpacks | Раници с колела | Wheeled |
| Laptop Backpacks | Раници за лаптоп | Tech-ready |
| Mini Backpacks | Мини раници | Small |
| Sports Backpacks | Спортни раници | Athletic |

**Popular Brands:**
- Samsonite | Самсонайт
- Dakine | Дакайн
- Nike | Найк
- Adidas | Адидас

---

#### L2: Art Supplies | Арт материали
**Slug:** `office-school/school/art`

| EN | BG | Description |
|----|----|----|
| Colored Pencils | Цветни моливи | Drawing |
| Crayons | Пастели | Wax |
| Watercolors | Водни бои | Paint |
| Acrylics | Акрилни бои | Paint |
| Sketch Pads | Скицници | Drawing paper |
| Brushes | Четки | Paint brushes |

---

### L1: 🪑 OFFICE FURNITURE

#### L2: Office Chairs | Офис столове
**Slug:** `office-school/furniture/chairs`

| EN | BG | Description |
|----|----|----|
| Ergonomic Chairs | Ергономични столове | Health-focused |
| Executive Chairs | Директорски столове | Premium |
| Task Chairs | Работни столове | Standard |
| Gaming Chairs | Гейминг столове | Gaming style |
| Mesh Chairs | Мрежести столове | Breathable |
| Kneeling Chairs | Коленни столове | Posture |

---

#### L2: Desks | Бюра
**Slug:** `office-school/furniture/desks`

- Computer Desks | Компютърни бюра
- Writing Desks | Писмени бюра
- L-Shaped Desks | Ъглови бюра
- Standing Desks | Бюра за права стойка
- Adjustable Desks | Регулируеми бюра

---

---

## 🏷️ Attribute System (The Power Layer)

### Office Product Attributes Schema

```typescript
interface OfficeProduct {
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
  
  // === PHYSICAL ATTRIBUTES ===
  color?: string[];
  material?: Material;
  size?: string;
  
  // === PAPER SPECIFICS ===
  paper_size?: PaperSize;
  sheet_count?: number;
  ruling?: Ruling;
  
  // === FURNITURE SPECIFICS ===
  dimensions_cm?: string;
  weight_capacity_kg?: number;
  adjustable: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  
  seller_type: 'private' | 'store' | 'business';
  location_city: string;
  
  images: string[];
}

type Material = 'plastic' | 'metal' | 'wood' | 'leather' | 'fabric' | 'mesh';
type PaperSize = 'A4' | 'A5' | 'A6' | 'Letter' | 'Legal';
type Ruling = 'lined' | 'blank' | 'grid' | 'dot_grid';
type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'used';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('office-school', 'Office & School', 'Офис и училище', 'office-school', 'office-school', NULL, 0, '📋', 21, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('os-writing', 'Writing Instruments', 'Пишещи средства', 'writing', 'office-school/writing', 'office-school', 1, '✏️', 1, true),
('os-paper', 'Paper Products', 'Хартиени продукти', 'paper', 'office-school/paper', 'office-school', 1, '📓', 2, true),
('os-filing', 'Filing & Organization', 'Организация', 'filing', 'office-school/filing', 'office-school', 1, '📁', 3, true),
('os-desk', 'Desk Accessories', 'Офис аксесоари', 'desk', 'office-school/desk', 'office-school', 1, '🖇️', 4, true),
('os-school', 'School Supplies', 'Училищни принадлежности', 'school', 'office-school/school', 'office-school', 1, '🎒', 5, true),
('os-printing', 'Printing & Copying', 'Печат и копиране', 'printing', 'office-school/printing', 'office-school', 1, '🖨️', 6, true),
('os-furniture', 'Office Furniture', 'Офис мебели', 'furniture', 'office-school/furniture', 'office-school', 1, '🪑', 7, true),
('os-planners', 'Planners & Calendars', 'Планери и календари', 'planners', 'office-school/planners', 'office-school', 1, '📅', 8, true),
('os-presentation', 'Presentation', 'Презентации', 'presentation', 'office-school/presentation', 'office-school', 1, '💼', 9, true),
('os-mailing', 'Mailing & Shipping', 'Пощенски материали', 'mailing', 'office-school/mailing', 'office-school', 1, '📧', 10, true);

-- L2: Writing
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('writing-pens', 'Pens', 'Химикалки', 'pens', 'office-school/writing/pens', 'os-writing', 2, '🖊️', 1, true),
('writing-pencils', 'Pencils', 'Моливи', 'pencils', 'office-school/writing/pencils', 'os-writing', 2, '✏️', 2, true),
('writing-markers', 'Markers', 'Маркери', 'markers', 'office-school/writing/markers', 'os-writing', 2, '🖍️', 3, true),
('writing-highlighters', 'Highlighters', 'Текст маркери', 'highlighters', 'office-school/writing/highlighters', 'os-writing', 2, '💛', 4, true),
('writing-fountain', 'Fountain Pens', 'Писалки', 'fountain-pens', 'office-school/writing/fountain-pens', 'os-writing', 2, '🖋️', 5, true);

-- L2: Paper
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('paper-notebooks', 'Notebooks', 'Тетрадки', 'notebooks', 'office-school/paper/notebooks', 'os-paper', 2, '📓', 1, true),
('paper-notepads', 'Notepads', 'Бележници', 'notepads', 'office-school/paper/notepads', 'os-paper', 2, '📝', 2, true),
('paper-printer', 'Printer Paper', 'Хартия за принтер', 'printer', 'office-school/paper/printer', 'os-paper', 2, '📄', 3, true),
('paper-sticky', 'Sticky Notes', 'Лепящи бележки', 'sticky-notes', 'office-school/paper/sticky-notes', 'os-paper', 2, '📌', 4, true);

-- L2: School
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('school-backpacks', 'Backpacks', 'Раници', 'backpacks', 'office-school/school/backpacks', 'os-school', 2, '🎒', 1, true),
('school-lunch', 'Lunch Boxes', 'Кутии за храна', 'lunch', 'office-school/school/lunch', 'os-school', 2, '🍱', 2, true),
('school-pencilcases', 'Pencil Cases', 'Ученически несесери', 'pencil-cases', 'office-school/school/pencil-cases', 'os-school', 2, '📦', 3, true),
('school-art', 'Art Supplies', 'Арт материали', 'art', 'office-school/school/art', 'os-school', 2, '🎨', 4, true),
('school-calculators', 'Calculators', 'Калкулатори', 'calculators', 'office-school/school/calculators', 'os-school', 2, '🔢', 5, true);

-- L2: Furniture
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('furniture-chairs', 'Office Chairs', 'Офис столове', 'chairs', 'office-school/furniture/chairs', 'os-furniture', 2, '🪑', 1, true),
('furniture-desks', 'Desks', 'Бюра', 'desks', 'office-school/furniture/desks', 'os-furniture', 2, '🖥️', 2, true),
('furniture-bookcases', 'Bookcases', 'Етажерки', 'bookcases', 'office-school/furniture/bookcases', 'os-furniture', 2, '📚', 3, true),
('furniture-standing', 'Standing Desks', 'Стоящи бюра', 'standing', 'office-school/furniture/standing', 'os-furniture', 2, '🧍', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Office & School | Офис и училище |
| Writing Instruments | Пишещи средства |
| Paper Products | Хартиени продукти |
| School Supplies | Училищни принадлежности |
| Office Furniture | Офис мебели |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Color | Цвят |
| Size | Размер |
| Material | Материал |
| Paper Size | Размер хартия |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add office brands reference
- [ ] Add paper sizes reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Color filter
- [ ] Size filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 63  
**Created:** December 3, 2025
