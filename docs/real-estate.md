# 🏡 Real Estate | Недвижими имоти

**Category Slug:** `real-estate`  
**Icon:** 🏡  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Real Estate → Apartments → For Sale |
| **Attributes** | Filtering, Search, Campaigns | Size, Rooms, Location, Price |
| **Tags** | Dynamic Collections & SEO | "sea-view", "new-construction", "investment" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🏡 Real Estate (L0)
│
├── 🏢 Apartments (L1)
│   ├── Apartments for Sale (L2)
│   ├── Apartments for Rent (L2)
│   ├── Studio Apartments (L2)
│   ├── Penthouses (L2)
│   └── New Construction (L2)
│
├── 🏠 Houses (L1)
│   ├── Houses for Sale (L2)
│   ├── Houses for Rent (L2)
│   ├── Villas (L2)
│   ├── Townhouses (L2)
│   └── Country Houses (L2)
│
├── 🏗️ Commercial (L1)
│   ├── Offices (L2)
│   ├── Retail Spaces (L2)
│   ├── Warehouses (L2)
│   ├── Hotels (L2)
│   ├── Restaurants (L2)
│   └── Industrial (L2)
│
├── 🌍 Land (L1)
│   ├── Building Plots (L2)
│   ├── Agricultural Land (L2)
│   ├── Forest Land (L2)
│   └── Commercial Land (L2)
│
├── 🏖️ Vacation Properties (L1)
│   ├── Beach Properties (L2)
│   ├── Mountain Properties (L2)
│   ├── Spa Properties (L2)
│   └── Rural Properties (L2)
│
├── 🅿️ Garages & Parking (L1)
│   ├── Garages for Sale (L2)
│   ├── Garages for Rent (L2)
│   ├── Parking Spaces (L2)
│   └── Underground Parking (L2)
│
├── 🏭 Investment Properties (L1)
│   ├── Rental Properties (L2)
│   ├── Commercial Investments (L2)
│   ├── Development Projects (L2)
│   └── REITs (L2)
│
└── 🔑 Short-Term Rentals (L1)
    ├── Daily Rentals (L2)
    ├── Weekly Rentals (L2)
    ├── Monthly Rentals (L2)
    └── Vacation Rentals (L2)
```

**Total Categories: 1 (L0) + 8 (L1) + 37 (L2) = 46 categories**

---

## 📊 Complete Category Reference

### L1: 🏢 APARTMENTS

#### L2: Apartments for Sale | Апартаменти за продажба
**Slug:** `real-estate/apartments/sale`

| EN | BG | Description |
|----|----|----|
| 1-Bedroom | Едностаен | One room + kitchen |
| 2-Bedroom | Двустаен | Two rooms |
| 3-Bedroom | Тристаен | Three rooms |
| 4+ Bedroom | Многостаен | Four+ rooms |
| Studio | Студио | Open plan |
| Maisonette | Мезонет | Two-level |
| Penthouse | Пентхаус | Top floor |

---

#### L2: Apartments for Rent | Апартаменти под наем
**Slug:** `real-estate/apartments/rent`

- Furnished | Обзаведен
- Unfurnished | Необзаведен
- Partially Furnished | Частично обзаведен
- Pet-Friendly | Домашни любимци

---

### L1: 🏠 HOUSES

#### L2: Houses for Sale | Къщи за продажба
**Slug:** `real-estate/houses/sale`

| EN | BG | Description |
|----|----|----|
| Detached House | Самостоятелна къща | Standalone |
| Semi-Detached | Близнак | Shared wall |
| Terraced House | Редова къща | Row house |
| Bungalow | Бунгало | Single story |
| Villa | Вила | Luxury house |
| Mansion | Резиденция | Large estate |
| Farmhouse | Селска къща | Rural home |

---

#### L2: Country Houses | Селски къщи
**Slug:** `real-estate/houses/country`

- Traditional Houses | Традиционни къщи
- Renovated Houses | Ремонтирани къщи
- Houses with Land | Къщи с двор
- Houses for Renovation | За ремонт

---

### L1: 🏗️ COMMERCIAL

#### L2: Offices | Офиси
**Slug:** `real-estate/commercial/offices`

| EN | BG | Description |
|----|----|----|
| Office Space | Офис площ | General offices |
| Coworking Space | Коуъркинг | Shared offices |
| Business Center | Бизнес център | Professional |
| Home Office | Домашен офис | Residential + office |

---

#### L2: Retail Spaces | Търговски площи
**Slug:** `real-estate/commercial/retail`

- Shops | Магазини
- Shopping Centers | Търговски центрове
- Kiosks | Павилиони
- Showrooms | Изложбени зали

---

#### L2: Warehouses | Складове
**Slug:** `real-estate/commercial/warehouses`

- Storage Warehouses | Складови помещения
- Distribution Centers | Дистрибуционни центрове
- Cold Storage | Хладилни складове
- Industrial Warehouses | Индустриални складове

---

### L1: 🌍 LAND

#### L2: Building Plots | Парцели за строеж
**Slug:** `real-estate/land/building`

| EN | BG | Description |
|----|----|----|
| Regulated Plot | Регулиран парцел | With building permit |
| Unregulated Plot | Нерегулиран парцел | Needs regulation |
| Residential Plot | Жилищен парцел | For housing |
| Commercial Plot | Търговски парцел | For business |

---

#### L2: Agricultural Land | Земеделска земя
**Slug:** `real-estate/land/agricultural`

- Arable Land | Обработваема земя
- Orchards | Овощни градини
- Vineyards | Лозя
- Pastures | Пасища
- Irrigated Land | Поливна земя

---

### L1: 🏖️ VACATION PROPERTIES

#### L2: Beach Properties | Морски имоти
**Slug:** `real-estate/vacation/beach`

| EN | BG | Description |
|----|----|----|
| Beachfront | Първа линия | On the beach |
| Sea View | Морска панорама | View of sea |
| Near Beach | Близо до плаж | Walking distance |

**Bulgarian Black Sea Locations (Attribute):**
- Sunny Beach | Слънчев бряг
- Nessebar | Несебър
- Burgas | Бургас
- Varna | Варна
- Golden Sands | Златни пясъци
- Sozopol | Созопол
- Pomorie | Поморие

---

#### L2: Mountain Properties | Планински имоти
**Slug:** `real-estate/vacation/mountain`

| EN | BG | Description |
|----|----|----|
| Ski Properties | Ски имоти | Near ski lifts |
| Mountain Houses | Планински къщи | Retreat homes |
| Chalets | Шале | Alpine style |

**Bulgarian Mountain Locations (Attribute):**
- Bansko | Банско
- Pamporovo | Пампорово
- Borovets | Боровец
- Vitosha | Витоша
- Rhodopes | Родопи
- Pirin | Пирин
- Rila | Рила

---

---

## 🏷️ Attribute System (The Power Layer)

### Real Estate Attributes Schema

```typescript
interface RealEstateProperty {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  price_per_sqm?: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === TRANSACTION TYPE ===
  transaction_type: 'sale' | 'rent';
  rent_period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  // === PROPERTY DETAILS ===
  property_type: PropertyType;
  construction_type?: ConstructionType;
  year_built?: number;
  floor?: number;
  total_floors?: number;
  
  // === SIZE ===
  area_sqm: number;
  land_area_sqm?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  
  // === FEATURES ===
  furnished: FurnishedType;
  heating?: HeatingType;
  features: string[];
  
  // === LOCATION ===
  city: string;
  district?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  
  // === CONDITION ===
  condition: PropertyCondition;
  
  seller_type: 'owner' | 'agency' | 'developer';
  
  images: string[];
  virtual_tour?: string;
}

type PropertyType = 'apartment' | 'house' | 'villa' | 'office' | 'land' | 'warehouse' | 'garage';
type ConstructionType = 'brick' | 'panel' | 'concrete' | 'wood' | 'steel';
type FurnishedType = 'furnished' | 'unfurnished' | 'partially' | 'negotiable';
type HeatingType = 'central' | 'gas' | 'electric' | 'ac' | 'fireplace' | 'none';
type PropertyCondition = 'new' | 'excellent' | 'good' | 'needs_renovation' | 'for_demolition';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('real-estate', 'Real Estate', 'Недвижими имоти', 'real-estate', 'real-estate', NULL, 0, '🏡', 13, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('re-apartments', 'Apartments', 'Апартаменти', 'apartments', 'real-estate/apartments', 'real-estate', 1, '🏢', 1, true),
('re-houses', 'Houses', 'Къщи', 'houses', 'real-estate/houses', 'real-estate', 1, '🏠', 2, true),
('re-commercial', 'Commercial', 'Търговски имоти', 'commercial', 'real-estate/commercial', 'real-estate', 1, '🏗️', 3, true),
('re-land', 'Land', 'Парцели и земя', 'land', 'real-estate/land', 'real-estate', 1, '🌍', 4, true),
('re-vacation', 'Vacation Properties', 'Ваканционни имоти', 'vacation', 'real-estate/vacation', 'real-estate', 1, '🏖️', 5, true),
('re-garages', 'Garages & Parking', 'Гаражи и паркинг', 'garages', 'real-estate/garages', 'real-estate', 1, '🅿️', 6, true),
('re-investment', 'Investment Properties', 'Инвестиционни имоти', 'investment', 'real-estate/investment', 'real-estate', 1, '🏭', 7, true),
('re-shortterm', 'Short-Term Rentals', 'Краткосрочен наем', 'short-term', 'real-estate/short-term', 'real-estate', 1, '🔑', 8, true);

-- L2: Apartments
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('apt-sale', 'Apartments for Sale', 'Апартаменти за продажба', 'sale', 'real-estate/apartments/sale', 're-apartments', 2, '🏷️', 1, true),
('apt-rent', 'Apartments for Rent', 'Апартаменти под наем', 'rent', 'real-estate/apartments/rent', 're-apartments', 2, '🔑', 2, true),
('apt-studio', 'Studio Apartments', 'Студиа', 'studio', 'real-estate/apartments/studio', 're-apartments', 2, '🛏️', 3, true),
('apt-penthouse', 'Penthouses', 'Пентхауси', 'penthouse', 'real-estate/apartments/penthouse', 're-apartments', 2, '🌆', 4, true),
('apt-new', 'New Construction', 'Ново строителство', 'new-construction', 'real-estate/apartments/new-construction', 're-apartments', 2, '🏗️', 5, true);

-- L2: Houses
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('house-sale', 'Houses for Sale', 'Къщи за продажба', 'sale', 'real-estate/houses/sale', 're-houses', 2, '🏷️', 1, true),
('house-rent', 'Houses for Rent', 'Къщи под наем', 'rent', 'real-estate/houses/rent', 're-houses', 2, '🔑', 2, true),
('house-villa', 'Villas', 'Вили', 'villas', 'real-estate/houses/villas', 're-houses', 2, '🏰', 3, true),
('house-townhouse', 'Townhouses', 'Таунхауси', 'townhouses', 'real-estate/houses/townhouses', 're-houses', 2, '🏘️', 4, true),
('house-country', 'Country Houses', 'Селски къщи', 'country', 'real-estate/houses/country', 're-houses', 2, '🌾', 5, true);

-- L2: Commercial
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('comm-offices', 'Offices', 'Офиси', 'offices', 'real-estate/commercial/offices', 're-commercial', 2, '💼', 1, true),
('comm-retail', 'Retail Spaces', 'Търговски площи', 'retail', 'real-estate/commercial/retail', 're-commercial', 2, '🛍️', 2, true),
('comm-warehouse', 'Warehouses', 'Складове', 'warehouses', 'real-estate/commercial/warehouses', 're-commercial', 2, '📦', 3, true),
('comm-hotel', 'Hotels', 'Хотели', 'hotels', 'real-estate/commercial/hotels', 're-commercial', 2, '🏨', 4, true),
('comm-restaurant', 'Restaurants', 'Ресторанти', 'restaurants', 'real-estate/commercial/restaurants', 're-commercial', 2, '🍽️', 5, true);

-- L2: Land
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('land-building', 'Building Plots', 'Парцели за строеж', 'building', 'real-estate/land/building', 're-land', 2, '🏗️', 1, true),
('land-agricultural', 'Agricultural Land', 'Земеделска земя', 'agricultural', 'real-estate/land/agricultural', 're-land', 2, '🌾', 2, true),
('land-forest', 'Forest Land', 'Горски терени', 'forest', 'real-estate/land/forest', 're-land', 2, '🌲', 3, true),
('land-commercial', 'Commercial Land', 'Търговски терени', 'commercial', 'real-estate/land/commercial', 're-land', 2, '🏭', 4, true);

-- L2: Vacation
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('vacation-beach', 'Beach Properties', 'Морски имоти', 'beach', 'real-estate/vacation/beach', 're-vacation', 2, '🏖️', 1, true),
('vacation-mountain', 'Mountain Properties', 'Планински имоти', 'mountain', 'real-estate/vacation/mountain', 're-vacation', 2, '🏔️', 2, true),
('vacation-spa', 'Spa Properties', 'СПА имоти', 'spa', 'real-estate/vacation/spa', 're-vacation', 2, '♨️', 3, true),
('vacation-rural', 'Rural Properties', 'Селски имоти', 'rural', 'real-estate/vacation/rural', 're-vacation', 2, '🌻', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Real Estate | Недвижими имоти |
| Apartments | Апартаменти |
| Houses | Къщи |
| Commercial | Търговски имоти |
| Land | Парцели и земя |
| Vacation Properties | Ваканционни имоти |

### Attribute Labels

| EN | BG |
|----|----|
| For Sale | За продажба |
| For Rent | Под наем |
| Area | Площ |
| Rooms | Стаи |
| Floor | Етаж |
| Year Built | Година на строеж |
| Heating | Отопление |
| Furnished | Обзаведен |
| Price per sqm | Цена на кв.м |

### Major Bulgarian Cities

| EN | BG |
|----|----|
| Sofia | София |
| Plovdiv | Пловдив |
| Varna | Варна |
| Burgas | Бургас |
| Ruse | Русе |
| Stara Zagora | Стара Загора |
| Pleven | Плевен |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add Bulgarian cities reference data
- [ ] Add districts/neighborhoods data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/real-estate (tree structure)
- [ ] GET /categories/real-estate/.../properties
- [ ] POST /properties (with validation)
- [ ] GET /properties/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Map integration
- [ ] Price range filter
- [ ] Area range filter
- [ ] Room count filter
- [ ] Location autocomplete
- [ ] Results grid/map view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete
- [ ] City-specific landing pages

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 46  
**Created:** December 3, 2025
