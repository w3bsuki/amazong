# 🌿 CBD & Wellness | CBD и уелнес

**Category Slug:** `cbd-wellness`  
**Icon:** 🌿  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | CBD → Oils → Full Spectrum |
| **Attributes** | Filtering, Search, Campaigns | Brand, Strength, Extraction |
| **Tags** | Dynamic Collections & SEO | "organic", "lab-tested" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🌿 CBD & Wellness (L0)
│
├── 💧 CBD Oils (L1)
│   ├── Full Spectrum (L2)
│   ├── Broad Spectrum (L2)
│   ├── Isolate (L2)
│   ├── Pet CBD (L2)
│   └── Flavor Oils (L2)
│
├── 💊 CBD Capsules (L1)
│   ├── Softgels (L2)
│   ├── Tablets (L2)
│   ├── Sleep Formula (L2)
│   └── Focus Formula (L2)
│
├── 🍬 CBD Edibles (L1)
│   ├── Gummies (L2)
│   ├── Chocolates (L2)
│   ├── Honey (L2)
│   ├── Drinks (L2)
│   └── Snacks (L2)
│
├── 🧴 CBD Topicals (L1)
│   ├── Creams (L2)
│   ├── Balms (L2)
│   ├── Lotions (L2)
│   ├── Roll-Ons (L2)
│   ├── Patches (L2)
│   └── Bath Products (L2)
│
├── 💨 CBD Vape (L1)
│   ├── Vape Oils (L2)
│   ├── Cartridges (L2)
│   ├── Disposables (L2)
│   └── Vape Pens (L2)
│
├── 🌸 CBD Flowers (L1)
│   ├── Indoor Grown (L2)
│   ├── Outdoor Grown (L2)
│   ├── Pre-Rolls (L2)
│   └── Trim (L2)
│
├── 🐕 Pet CBD (L1)
│   ├── Dog CBD (L2)
│   ├── Cat CBD (L2)
│   ├── Pet Treats (L2)
│   └── Pet Topicals (L2)
│
├── 💄 CBD Beauty (L1)
│   ├── Serums (L2)
│   ├── Moisturizers (L2)
│   ├── Lip Balms (L2)
│   ├── Eye Creams (L2)
│   └── Face Masks (L2)
│
├── 🧪 CBD Concentrates (L1)
│   ├── Wax (L2)
│   ├── Shatter (L2)
│   ├── Crumble (L2)
│   └── Crystals (L2)
│
└── 📦 CBD Accessories (L1)
    ├── Droppers (L2)
    ├── Storage (L2)
    ├── Testing Kits (L2)
    └── Starter Kits (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 44 (L2) = 55 categories**

---

## 📊 Complete Category Reference

### L1: 💧 CBD OILS | CBD МАСЛА

#### L2: Full Spectrum | Пълен спектър
**Slug:** `cbd-wellness/oils/full-spectrum`

| EN | BG | Description |
|----|----|----|
| 5% CBD | 5% CBD | 500mg |
| 10% CBD | 10% CBD | 1000mg |
| 15% CBD | 15% CBD | 1500mg |
| 20% CBD | 20% CBD | 2000mg |
| 30% CBD | 30% CBD | High strength |

**Quality Markers:**
- Lab Tested | Лабораторно тествано
- Organic | Органично
- CO2 Extracted | CO2 екстракция
- EU Hemp | ЕС коноп

---

#### L2: Broad Spectrum | Широк спектър
**Slug:** `cbd-wellness/oils/broad-spectrum`

| EN | BG | Description |
|----|----|----|
| THC-Free | Без THC | Zero THC |
| MCT Oil | MCT масло | Carrier |
| Olive Oil | Зехтин | Carrier |
| Hemp Seed | Конопено семе | Carrier |

---

### L1: 🍬 CBD EDIBLES | CBD ХРАНИТЕЛНИ ДОБАВКИ

#### L2: Gummies | Желирани бонбони
**Slug:** `cbd-wellness/edibles/gummies`

| EN | BG | Description |
|----|----|----|
| CBD Gummies | CBD бонбони | Standard |
| Sleep Gummies | За сън | With melatonin |
| Vitamin Gummies | Витамин | With vitamins |
| Vegan Gummies | Веган | Plant-based |
| Sugar-Free | Без захар | Diabetic-friendly |

---

### L1: 🧴 CBD TOPICALS | CBD ЗА ЛОКАЛНО ПРИЛОЖЕНИЕ

#### L2: Creams | Кремове
**Slug:** `cbd-wellness/topicals/creams`

| EN | BG | Description |
|----|----|----|
| Pain Relief | Облекчаване на болка | For muscles |
| Anti-Aging | Анти-ейдж | Skincare |
| Moisturizing | Хидратиращ | Daily use |
| Sports Recovery | Спортно възстановяване | Athletes |
| Cooling | Охлаждащ | With menthol |
| Warming | Затоплящ | Heat therapy |

---

### L1: 🐕 PET CBD | CBD ЗА ДОМАШНИ ЛЮБИМЦИ

#### L2: Dog CBD | CBD за кучета
**Slug:** `cbd-wellness/pets/dogs`

| EN | BG | Description |
|----|----|----|
| Calming Oil | Успокояващо масло | Anxiety |
| Joint Support | За стави | Senior dogs |
| Skin & Coat | Кожа и козина | Health |
| Treats | Лакомства | Edible |

---

---

## 🏷️ Attribute System (The Power Layer)

### CBD Product Attributes Schema

```typescript
interface CBDProduct {
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
  
  // === CBD SPECIFICS ===
  cbd_mg: number;
  cbd_percentage?: number;
  thc_percentage: number;
  spectrum_type: SpectrumType;
  
  // === EXTRACTION ===
  extraction_method?: ExtractionMethod;
  carrier_oil?: CarrierOil;
  
  // === QUALITY ===
  is_organic: boolean;
  is_lab_tested: boolean;
  lab_report_url?: string;
  hemp_origin?: string;
  
  // === USAGE ===
  servings_per_container?: number;
  serving_size_mg?: number;
  
  // === FLAVOR ===
  flavor?: string;
  
  // === LEGAL ===
  is_eu_compliant: boolean;
  
  seller_type: 'store' | 'distributor' | 'producer';
  location_city: string;
  
  images: string[];
}

type SpectrumType = 'full_spectrum' | 'broad_spectrum' | 'isolate';
type ExtractionMethod = 'co2' | 'ethanol' | 'olive_oil' | 'solvent';
type CarrierOil = 'mct' | 'hemp_seed' | 'olive' | 'coconut';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cbd-wellness', 'CBD & Wellness', 'CBD и уелнес', 'cbd-wellness', 'cbd-wellness', NULL, 0, '🌿', 26, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cbd-oils', 'CBD Oils', 'CBD масла', 'oils', 'cbd-wellness/oils', 'cbd-wellness', 1, '💧', 1, true),
('cbd-capsules', 'CBD Capsules', 'CBD капсули', 'capsules', 'cbd-wellness/capsules', 'cbd-wellness', 1, '💊', 2, true),
('cbd-edibles', 'CBD Edibles', 'CBD храни', 'edibles', 'cbd-wellness/edibles', 'cbd-wellness', 1, '🍬', 3, true),
('cbd-topicals', 'CBD Topicals', 'CBD локални', 'topicals', 'cbd-wellness/topicals', 'cbd-wellness', 1, '🧴', 4, true),
('cbd-vape', 'CBD Vape', 'CBD вейп', 'vape', 'cbd-wellness/vape', 'cbd-wellness', 1, '💨', 5, true),
('cbd-flowers', 'CBD Flowers', 'CBD цветя', 'flowers', 'cbd-wellness/flowers', 'cbd-wellness', 1, '🌸', 6, true),
('cbd-pets', 'Pet CBD', 'CBD за домашни любимци', 'pets', 'cbd-wellness/pets', 'cbd-wellness', 1, '🐕', 7, true),
('cbd-beauty', 'CBD Beauty', 'CBD козметика', 'beauty', 'cbd-wellness/beauty', 'cbd-wellness', 1, '💄', 8, true),
('cbd-concentrates', 'CBD Concentrates', 'CBD концентрати', 'concentrates', 'cbd-wellness/concentrates', 'cbd-wellness', 1, '🧪', 9, true),
('cbd-accessories', 'CBD Accessories', 'CBD аксесоари', 'accessories', 'cbd-wellness/accessories', 'cbd-wellness', 1, '📦', 10, true);

-- L2: Oils
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('oils-full', 'Full Spectrum', 'Пълен спектър', 'full-spectrum', 'cbd-wellness/oils/full-spectrum', 'cbd-oils', 2, '🌈', 1, true),
('oils-broad', 'Broad Spectrum', 'Широк спектър', 'broad-spectrum', 'cbd-wellness/oils/broad-spectrum', 'cbd-oils', 2, '🔵', 2, true),
('oils-isolate', 'Isolate', 'Изолат', 'isolate', 'cbd-wellness/oils/isolate', 'cbd-oils', 2, '⚪', 3, true),
('oils-pet', 'Pet CBD', 'За животни', 'pet', 'cbd-wellness/oils/pet', 'cbd-oils', 2, '🐾', 4, true),
('oils-flavor', 'Flavored Oils', 'Ароматизирани', 'flavored', 'cbd-wellness/oils/flavored', 'cbd-oils', 2, '🍊', 5, true);

-- L2: Edibles
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('edibles-gummies', 'Gummies', 'Желирани бонбони', 'gummies', 'cbd-wellness/edibles/gummies', 'cbd-edibles', 2, '🍬', 1, true),
('edibles-chocolate', 'Chocolates', 'Шоколад', 'chocolate', 'cbd-wellness/edibles/chocolate', 'cbd-edibles', 2, '🍫', 2, true),
('edibles-honey', 'Honey', 'Мед', 'honey', 'cbd-wellness/edibles/honey', 'cbd-edibles', 2, '🍯', 3, true),
('edibles-drinks', 'Drinks', 'Напитки', 'drinks', 'cbd-wellness/edibles/drinks', 'cbd-edibles', 2, '🥤', 4, true);

-- L2: Topicals
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('topicals-creams', 'Creams', 'Кремове', 'creams', 'cbd-wellness/topicals/creams', 'cbd-topicals', 2, '🧴', 1, true),
('topicals-balms', 'Balms', 'Балсами', 'balms', 'cbd-wellness/topicals/balms', 'cbd-topicals', 2, '🫙', 2, true),
('topicals-lotions', 'Lotions', 'Лосиони', 'lotions', 'cbd-wellness/topicals/lotions', 'cbd-topicals', 2, '🧴', 3, true),
('topicals-rollons', 'Roll-Ons', 'Рол-он', 'roll-ons', 'cbd-wellness/topicals/roll-ons', 'cbd-topicals', 2, '🔵', 4, true),
('topicals-patches', 'Patches', 'Пластири', 'patches', 'cbd-wellness/topicals/patches', 'cbd-topicals', 2, '🩹', 5, true);

-- L2: Pets
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('pets-dogs', 'Dog CBD', 'За кучета', 'dogs', 'cbd-wellness/pets/dogs', 'cbd-pets', 2, '🐕', 1, true),
('pets-cats', 'Cat CBD', 'За котки', 'cats', 'cbd-wellness/pets/cats', 'cbd-pets', 2, '🐱', 2, true),
('pets-treats', 'Pet Treats', 'Лакомства', 'treats', 'cbd-wellness/pets/treats', 'cbd-pets', 2, '🦴', 3, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| CBD & Wellness | CBD и уелнес |
| CBD Oils | CBD масла |
| CBD Edibles | CBD храни |
| CBD Topicals | CBD за локално приложение |
| Pet CBD | CBD за домашни любимци |

### Attribute Labels

| EN | BG |
|----|----|
| CBD Content | Съдържание на CBD |
| Spectrum Type | Тип спектър |
| Lab Tested | Лабораторно тествано |
| THC Free | Без THC |
| Organic | Органичен |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add CBD brands reference
- [ ] Add spectrum types reference

### Frontend
- [ ] Category browser
- [ ] Strength filter
- [ ] Spectrum filter
- [ ] Lab tested filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 55  
**Created:** December 3, 2025
