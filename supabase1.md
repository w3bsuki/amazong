# Supabase Setup for Amazong

## 1. Project Connection
Your project is connected to the Supabase project:
- **Project URL:** `https://dhtzybnkvpimmomzwrce.supabase.co`
- **Project ID:** `dhtzybnkvpimmomzwrce`

## 2. Database Schema & Migrations
The project contains two migration files:
1. `scripts/migrations.sql`: A basic schema (likely the current one).
2. `supabase/schema.sql`: A **comprehensive, production-ready schema**.

**Recommendation:** Use `supabase/schema.sql`. It includes:
- **Full-Text Search:** Uses `tsvector` and `pg_trgm` for Amazon-like search capabilities.
- **Triggers:** Automatically updates the search index when a product is added.
- **Security:** Row Level Security (RLS) policies for buyers and sellers.
- **Advanced Tables:** Support for `reviews`, `categories`, and `sellers`.

### How to Apply the Schema
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/dhtzybnkvpimmomzwrce/editor).
2. Open the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql`.
4. Paste and run the SQL.

## 3. Search Indexing (How it works)
Just like Amazon, we need an index to make products searchable.
- **Amazon's Approach:** Uses a distributed search fleet (like OpenSearch). When a seller lists an item, it's added to a queue and indexed asynchronously (eventual consistency).
- **Our Approach:** We use Postgres Full-Text Search.
    - **Trigger:** `on_product_created` fires immediately when a product is inserted.
    - **Action:** It populates the `search_vector` column with the product title and description.
    - **Result:** The product is **instantly** searchable.

## 4. Codebase Updates Required
If you switch to the robust `supabase/schema.sql`, you need to update a few lines in your code to match the new table structure:

**`app/sell/page.tsx`**
- Change `image_url` to `images` (array).
- Ensure `category_id` is handled or optional.

**`app/search/page.tsx`**
- Change `image_url` to `images[0]`.
- Upgrade search from `.ilike()` to `.textSearch('search_vector', query)` for better results.

---

# 🗂️ CATEGORY REFACTORING MASTER GUIDE

> **Last Updated:** January 2025 (Phase 3 Complete)  
> **Goal:** Clean, consistent L0→L4 hierarchy with proper L3 subcategories AND attributes for filtering

---

## 🚨 THE PROBLEM WE'RE SOLVING

**Current State:** Categories like "Gaming Desktops" have NO children, while "iPhone" has proper L3 children (iPhone 15 Series, iPhone 14 Series, etc.). This inconsistency breaks:
- Filtering/navigation
- SEO (no product pages)
- User experience (dead-end categories)

**Target State:** EVERY browsable L2 category should have:
1. ✅ L3 product subtypes (like iPhone → iPhone 15 Series)
2. ✅ Filterable attributes (Storage, Color, Condition, etc.)

---

## ✅ COMPLETED STEPS

### ✅ Step 1: Analysis - COMPLETE
- Analyzed all 24 L0 categories
- Identified 6,226 total categories
- Found inconsistent L3 coverage

### ✅ Step 2: Delete L5 Violations - COMPLETE  
- Deleted 4 L5 categories (Cotton Yarn, Wool Yarn, Acrylic Yarn, Blend Yarn)
- Added "Yarn Material" attribute to L4 "Yarn" category

### ✅ Step 3: Initial Electronics L3 Fix - COMPLETE
- Added 70+ L3 categories to Electronics (Gaming Desktops, MacBooks, Samsung phones, etc.)
- Added 61+ attributes to Electronics subcategories

---

## 📊 CURRENT STATE (After Initial Fixes)

| Level | Count | With Attributes | Coverage | Status |
|-------|-------|-----------------|----------|--------|
| **L0** | 24 | 24 | ✅ 100% | ✅ Good |
| **L1** | 291 | 61 | ⚠️ 21% | **NEEDS ATTRIBUTES** |
| **L2** | 3,048 | 101 | 🔴 3% | Inherits from L1 |
| **L3** | 2,677 | 711 | 🔴 27% | **NEEDS MORE** |
| **L4** | 256 | 1 | ⚠️ 0.4% | Valid depth |
| **L5** | 0 | 0 | ✅ | ✅ **CLEANED** |
| **TOTAL** | 6,296 | ~900 | - | - |

### L3 Consistency by L0 Category

| L0 Category | L2 Total | L2 with L3 | Consistency | Priority |
|-------------|----------|------------|-------------|----------|
| Home & Kitchen | 105 | 105 | ✅ 100% | ✅ DONE |
| Electronics | 147 | 147 | ✅ 100% | ✅ **PHASE 1 DONE** |
| Fashion | 56 | ~48 | ✅ 85%+ | ✅ **PHASE 2 DONE** |
| Gaming | 96 | ~86 | ✅ 90%+ | ✅ **PHASE 2 DONE** |
| Beauty | 80 | ~68 | ✅ 85%+ | ✅ **PHASE 2 DONE** |
| Automotive | 98 | 98 | ✅ 100% | ✅ **PHASE 3 DONE** |
| Sports | 127 | 127 | ✅ 100% | ✅ **PHASE 3 DONE** |
| Pets | 137 | 137 | ✅ 100% | ✅ **PHASE 3 DONE** |
| Kids | 90 | 90 | ✅ 100% | ✅ **PHASE 3 DONE** |
| Tools & Industrial | 269 | 21 | 🔴 8% | **PHASE 4** |
| Hobbies | 74 | 19 | 🔴 26% | **PHASE 4** |
| Health & Wellness | 57 | 12 | 🔴 21% | **PHASE 4** |
| Grocery & Food | 117 | 8 | 🔴 7% | **PHASE 4** |
| Jewelry & Watches | 120 | 0 | 🔴 0% | **PHASE 4** |
| Books | 113 | 0 | 🔴 0% | **PHASE 5** |
| E-Mobility | 62 | 0 | 🔴 0% | **PHASE 5** |
| Collectibles | 187 | 4 | 🔴 2% | **PHASE 5** |
| Bulgarian Traditional | 70 | 1 | 🔴 1% | **PHASE 5** |
| Movies & Music | 145 | 2 | 🔴 1% | **PHASE 5** |
| Software | 223 | 91 | 🟡 41% | **PHASE 5** |
| Services | 289 | 45 | 🔴 16% | **PHASE 5** |
| Real Estate | 147 | 0 | 🔴 0% | **PHASE 5** |
| Jobs | 21 | 0 | 🔴 0% | **PHASE 5** |
| Wholesale | 211 | 81 | 🟡 38% | **PHASE 5** |

---

# 🎯 COMPREHENSIVE 5-PHASE STANDARDIZATION PLAN

## ✅ PHASE 1: ELECTRONICS (Highest Traffic) - COMPLETED
**Target:** 100% L3 consistency | **Completed:** December 8, 2025 | **Priority:** 🔴 CRITICAL

### 📊 Phase 1 Results
| Metric | Before | After |
|--------|--------|-------|
| **L3 Consistency** | 63.3% | **100.0%** |
| **L2 without L3 children** | 54 | **0** |
| **Total Electronics Categories** | ~1,200 | **1,526** |
| **Total Electronics Attributes** | ~200 | **1,128** |

### Phase 1 Tasks:

- [x] **1.1 Complete Smartphones L3 Categories** ✅
  - [x] Add Google Pixel Series (Pixel 9, Pixel 8, Pixel 7, Pixel Fold)
  - [x] Add Xiaomi Series (Xiaomi 14, Redmi Note 13, POCO)
  - [x] Add OnePlus Series (OnePlus 12, OnePlus Nord)
  - [x] Add Huawei Series (Mate 60, P60, Nova)
  - [x] Add Motorola Series (Edge, Razr, G Series)
  - [x] Add Honor, Realme, Oppo, Vivo, Nokia, Sony, Nothing series

- [x] **1.2 Complete Tablets L3 Categories** ✅
  - [x] Add iPad Models (iPad Pro 13" M4, iPad Air M2, iPad 10th Gen, iPad Mini)
  - [x] Add Samsung Tab Models (Tab S9 Ultra, Tab S9+, Tab S9, Tab A9)
  - [x] Add Android Tablets (Xiaomi Pad, Lenovo Tab, Amazon Fire)
  - [x] Add E-Readers (Kindle Paperwhite, Kindle Oasis, Kobo)
  - [x] Add Windows tablets, Kids tablets

- [x] **1.3 Complete PC & Laptops L3 Categories** ✅
  - [x] Complete Gaming Laptops (Alienware, ASUS ROG, MSI, Razer)
  - [x] Complete Business Laptops (ThinkPad, Dell Latitude, HP EliteBook)
  - [x] Complete Ultrabooks (Dell XPS, HP Spectre, ASUS ZenBook)
  - [x] Add Mini PCs (Intel NUC, Mac Mini, ASUS PN)
  - [x] Add Workstations (Dell Precision, HP Z, Lenovo ThinkStation)
  - [x] Add Chromebooks, Convertible Laptops, MacBook models, RTX Laptops
  - [x] Add Laptop Accessories (Bags, Chargers, Cooling, Stands, Screen Protectors)

- [x] **1.4 Complete PC Components L3 Categories** ✅
  - [x] Add GPU Brands (NVIDIA RTX 40 Series, AMD RX 7000, Intel Arc)
  - [x] Add CPU Brands (Intel Core 14th Gen, AMD Ryzen 7000, AMD Threadripper)
  - [x] Add RAM Types (DDR5, DDR4, SODIMM for Laptops)
  - [x] Add Storage Types (NVMe Gen 5, NVMe Gen 4, SATA SSD, HDD)
  - [x] Add Motherboard Chipsets (Intel Z790, AMD X670, B650)
  - [x] Add PSU Tiers (80+ Titanium, Platinum, Gold, Bronze)
  - [x] Add PC Cases (Full Tower, Mid Tower, Mini ITX, etc.)
  - [x] Add Cooling (Air Coolers, AIO, Custom Loop)

- [x] **1.5 Complete Audio L3 Categories** ✅
  - [x] Add Headphone Brands (Sony WH, Bose, Sennheiser, AirPods Max)
  - [x] Add TWS Brands (AirPods Pro, Galaxy Buds, Sony WF, Jabra)
  - [x] Add Speaker Types (Portable Bluetooth, Smart Speakers, Soundbars)
  - [x] Add Microphone Types (USB Condenser, XLR, Lavalier)
  - [x] Add Home Theater, Audio Accessories, MP3 Players

- [x] **1.6 Complete Cameras L3 Categories** ✅
  - [x] Add Camera Brands (Canon EOS, Sony Alpha, Nikon Z, Fujifilm X)
  - [x] Add Drone Brands (DJI Mini, DJI Air, DJI Mavic, Autel)
  - [x] Add Action Camera Brands (GoPro Hero, DJI Osmo, Insta360)
  - [x] Add Lens Types by Mount (Canon RF, Sony E, Nikon Z, Fuji X)
  - [x] Add Digital Cameras, Film Photography, Instant Cameras, Studio Equipment

- [x] **1.7 Complete Smart Devices L3 Categories** ✅
  - [x] Add Smartwatch Models (Apple Watch Series 10, Galaxy Watch 7, Garmin)
  - [x] Add Smart Home by Platform (Apple HomeKit, Google Home, Amazon Alexa)
  - [x] Add Robot Vacuums (Roomba, Roborock, Ecovacs, Dreame)
  - [x] Add Security Systems (Ring, Nest, Eufy, Arlo)
  - [x] Add Smart Lighting, Smart Locks, Smart Thermostats, Fitness Trackers

- [x] **1.8 Add Electronics Attributes to ALL L1/L2 Categories** ✅
  - [x] Smartphones: Storage, RAM, Network, Screen Size, Carrier Lock, Condition, Color, SIM Type, Camera MP, Battery, Fast Charging (11 attrs)
  - [x] Tablets: Model, Storage, Connectivity, Screen Size, Stylus Support, Condition (9 attrs)
  - [x] Laptops: Processor Brand, CPU Model, RAM, Storage Type, Storage Capacity, Screen Size, GPU, Battery Life, OS, Form Factor, Weight, USB Ports, Condition (13 attrs)
  - [x] Desktop PCs: Form Factor, Processor Brand, CPU Model, RAM, Storage, GPU, Use Case, OS, Condition, Upgradeable (10 attrs)
  - [x] Monitors: Screen Size, Resolution, Panel Type, Refresh Rate, Aspect Ratio, HDR, Adaptive Sync, Curved, Ports, Condition, Mounting (11 attrs)
  - [x] Audio: Connection Type, Type, ANC, Driver Size, Battery Life, Water Resistance, Microphone, Condition, Color (9 attrs)
  - [x] Cameras: Camera Type, Sensor Size, Megapixels, Video Resolution, Lens Mount, Image Stabilization, Viewfinder, Condition, Shutter Count, Includes (10 attrs)
  - [x] Smart Devices: Ecosystem, Connectivity, Power Source, App Control, Voice Control, Condition, Color (7 attrs)
  - [x] TVs: Screen Size, Display Technology, Resolution, Smart TV Platform, Refresh Rate, HDR Format, HDMI Ports, Gaming Features, Condition, Wall Mount (10 attrs)
  - [x] Networking: Device Type, WiFi Standard, Speed Class, Band, Coverage, Ports, Use Case, Condition (8 attrs)
  - [x] Accessories: Accessory Type, Compatibility, Material, Brand, Condition, Color (6 attrs)
  - [x] Gaming: Platform, Product Type, Console Edition, Storage, Game Format, Genre, Region, Condition, Color (9 attrs)
  - [x] Wearables: Device Type, Compatibility, Display Type, Case Size, Battery Life, Water Resistance, Health Features, GPS, Condition, Band Material (10 attrs)

### Applied Migrations (14 total):
1. `phase1_smartphones_l3_categories` - 70+ smartphone series
2. `phase1_tablets_l3_categories` - iPad, Samsung Tab, Android tablets, E-readers
3. `phase1_laptops_pcs_l3_categories` - MacBooks, Business, Gaming, Ultrabooks
4. `phase1_pc_components_l3_categories` - GPUs, CPUs, RAM, Storage, Motherboards, PSUs, Cases, Cooling
5. `phase1_audio_l3_categories` - Headphones, TWS, Speakers, Microphones, Home Audio
6. `phase1_cameras_l3_categories` - Digital, Film, Instant, Studio Equipment
7. `phase1_smart_devices_l3_categories` - Smartwatches, Robot Vacuums, Smart Home
8. `phase1_electronics_attributes_smartphones` - Smartphones (11) + Tablets (9) attributes
9. `phase1_electronics_attributes_laptops_pcs` - Laptops (13), Desktops (10), Monitors (11) attributes
10. `phase1_electronics_attributes_audio_cameras` - Audio (9), Cameras (10), Smart Devices (7), TVs (10), Networking (8) attributes
11. `phase1_electronics_attributes_accessories_gaming` - Accessories (6), Gaming (9), Wearables (10) attributes
12. `phase1_remaining_l3_categories_batch1` - Memory Cards, Mounts, Power Banks, Audio Accessories, Home Speakers, etc.
13. `phase1_remaining_l3_categories_batch2` - Desktop PCs, Laptops accessories, MacBooks, Monitors
14. `phase1_remaining_l3_categories_batch3-4` - Audio, Monitors, Networking, TVs remaining L2s

### Phase 1 SQL Template:
```sql
-- Add iPhone L3 subcategories under Smartphones
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Pixel 9 Series', 'Pixel 8 Series', 'Pixel 7 Series', 'Pixel Fold']),
  unnest(ARRAY['pixel-9-series', 'pixel-8-series', 'pixel-7-series', 'pixel-fold']),
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  unnest(ARRAY['Pixel 9 Серия', 'Pixel 8 Серия', 'Pixel 7 Серия', 'Pixel Fold']),
  '📱'
ON CONFLICT (slug) DO NOTHING;

-- Add attributes to Smartphones L2
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  a.name, a.name_bg, a.type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Storage', 'Памет', 'select', true, '["32GB","64GB","128GB","256GB","512GB","1TB"]', '["32GB","64GB","128GB","256GB","512GB","1TB"]', 1),
  ('RAM', 'RAM', 'select', false, '["4GB","6GB","8GB","12GB","16GB","18GB"]', '["4GB","6GB","8GB","12GB","16GB","18GB"]', 2),
  ('Network', 'Мрежа', 'select', true, '["5G","4G LTE","3G Only"]', '["5G","4G LTE","Само 3G"]', 3),
  ('Screen Size', 'Размер екран', 'select', false, '["Under 5.5\"","5.5-6.0\"","6.0-6.5\"","6.5-7.0\"","7.0\"+"]', '["Под 5.5\"","5.5-6.0\"","6.0-6.5\"","6.5-7.0\"","7.0\"+"]', 4),
  ('Condition', 'Състояние', 'select', true, '["New","Like New","Very Good","Good","Acceptable"]', '["Ново","Като ново","Много добро","Добро","Приемливо"]', 5)
) AS a(name, name_bg, type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
```

---

## ✅ PHASE 2: FASHION, GAMING, BEAUTY (High Traffic) - COMPLETED
**Target:** 80%+ L3 consistency | **Completed:** December 9, 2025 | **Priority:** 🟠 HIGH

### 📊 Phase 2 Results
| Metric | Before | After |
|--------|--------|-------|
| **Fashion L3 Consistency** | ~50% | **85%+** |
| **Gaming L3 Consistency** | ~10% | **90%+** |
| **Beauty L3 Consistency** | ~28% | **85%+** |
| **Total New L3 Categories** | - | **400+** |
| **Total New Attributes** | - | **50+** |

### Phase 2.1: Fashion Tasks

- [x] **2.1.1 Women's Clothing L3 Categories** ✅ ✅
  - [x] Dresses: Maxi, Midi, Mini, Bodycon, A-Line, Wrap, Shirt, Cocktail
  - [x] Tops: T-Shirts, Blouses, Crop Tops, Tank Tops, Bodysuits, Tunics
  - [x] Pants: Jeans, Trousers, Leggings, Joggers, Wide Leg, Cargo
  - [x] Outerwear: Jackets, Coats, Blazers, Cardigans, Vests, Parkas

- [x] **2.1.2 Men's Clothing L3 Categories** ✅
  - [x] Shirts: Dress Shirts, Casual Shirts, Polo Shirts, Oxford, Flannel
  - [x] Pants: Jeans, Chinos, Dress Pants, Joggers, Cargo
  - [x] Outerwear: Jackets, Coats, Blazers, Hoodies, Vests

- [x] **2.1.3 Shoes L3 Categories** ✅
  - [x] Women's: Heels, Flats, Sneakers, Boots, Sandals, Loafers
  - [x] Men's: Dress Shoes, Sneakers, Boots, Loafers, Sandals
  - [x] Sports: Running, Training, Basketball, Football, Tennis

- [x] **2.1.4 Fashion Attributes** ✅
  - [x] Size (XS-XXXL, EU sizes, US sizes)
  - [x] Color (30+ options)
  - [x] Material (Cotton, Polyester, Wool, Silk, Leather, etc.)
  - [x] Style (Casual, Formal, Sport, Vintage, Bohemian)
  - [x] Fit (Slim, Regular, Relaxed, Oversized)
  - [x] Season (Spring/Summer, Fall/Winter, All Season)
  - [x] **Additional:** Bags (Capacity, Closure, Strap), Watches (Movement, Case Material, Band)

### Phase 2.2: Gaming Tasks

- [x] **2.2.1 PC Gaming L3 Categories** ✅
  - [x] Keyboards: Mechanical by Switch (Cherry MX, Gateron), Size (60%, TKL, Full)
  - [x] Mice: By Type (FPS, MMO, Ergonomic), Brand (Logitech, Razer, SteelSeries)
  - [x] Headsets: By Connection (Wired, Wireless, Bluetooth), Features (7.1, ANC)
  - [x] Monitors: By Refresh (144Hz, 240Hz, 360Hz), Panel (IPS, VA, OLED)
  - [x] **Additional:** Mousepads (Size, Surface), Controllers, Webcams, Capture Cards

- [x] **2.2.2 Console Gaming L3 Categories** ✅
  - [x] PlayStation: PS5 Standard, PS5 Digital, PS5 Pro, PS4 Pro, PS4 Slim
  - [x] Xbox: Series X, Series S, One X, One S
  - [x] Nintendo: Switch OLED, Switch, Switch Lite
  - [x] Games by Genre: Action, RPG, Sports, Racing, Shooter
  - [x] **Additional:** VR Headsets (Meta Quest, PSVR, Valve Index), Retro Gaming

- [x] **2.2.3 Gaming Furniture L3 Categories** ✅
  - [x] Chairs: Racing Style, Ergonomic, Rocker, Premium (Secretlab, Herman Miller)
  - [x] Desks: Standard, L-Shaped, Standing, RGB
  - [x] **Additional:** Board Games, Card Games (TCG), Streaming Equipment

- [x] **2.2.4 Gaming Attributes** ✅
  - [x] Platform (PC, PS5, Xbox, Nintendo Switch, Multi-Platform)
  - [x] Connection Type (Wired, Wireless 2.4GHz, Bluetooth, Triple Mode)
  - [x] Switch Type (Cherry MX Red/Blue/Brown, Gateron, Razer)
  - [x] Refresh Rate (60Hz, 144Hz, 240Hz, 360Hz)
  - [x] Resolution (1080p, 1440p, 4K)
  - [x] **Additional:** Genre, Player Count, VR Support

### Phase 2.3: Beauty Tasks

- [x] **2.3.1 Makeup L3 Categories** ✅
  - [x] Face: Foundation Types, Concealer, Powder, Primer, Blush, Bronzer, Highlighter
  - [x] Eyes: Eyeshadow Palettes (6 types), Mascara (7 types), Eyeliner (7 types), Brow Products (7 types)
  - [x] Lips: Lipstick Types (Matte, Satin, Cream, Sheer, Liquid, Long-Wear), Lip Liner, Lip Gloss (6 types)
  - [x] **Additional:** Makeup Brushes (7 types), Sponges (6 types), Palettes (6 types), Sets (7 types)

- [x] **2.3.2 Skincare L3 Categories** ✅
  - [x] Cleansers: Gel, Foam, Cream, Oil, Micellar, Balm, Exfoliating (7 types)
  - [x] Serums: Vitamin C, Retinol, Hyaluronic Acid, Niacinamide, Anti-Aging, Brightening, Acne (7 types)
  - [x] Moisturizers: Day Cream, Night Cream, Gel, Lightweight, Rich, Oil-Free, Tinted (7 types)
  - [x] **Additional:** Masks (7 types), Toners (6 types), Eye Care (6 types), Lip Care (6 types), Sunscreen (7 types), Exfoliators (6 types), Acne Treatments (6 types), Anti-Aging (6 types)

- [x] **2.3.3 Haircare L3 Categories** ✅
  - [x] Shampoo: Volumizing, Moisturizing, Clarifying, Color-Safe, Dandruff, Dry, Sulfate-Free (7 types)
  - [x] Conditioner: Daily, Deep, Leave-In, Color-Safe, Volumizing, Repairing (6 types)
  - [x] Styling: Spray, Gel, Mousse, Wax, Cream, Texture, Curl Products (7 types)
  - [x] **Additional:** Treatments (7 types), Hair Color (7 types), Hair Loss (5 types)

- [x] **2.3.4 Beauty Attributes** ✅
  - [x] Skin Type (Normal, Dry, Oily, Combination, Sensitive, All Skin Types)
  - [x] Skin Concern (Acne, Aging, Dark Spots, Dryness, Dullness, Fine Lines, Pores, Redness, Uneven Texture, Wrinkles)
  - [x] Key Ingredients (Hyaluronic Acid, Retinol, Vitamin C, Niacinamide, Salicylic Acid, Glycolic Acid, Ceramides, Peptides, Collagen, Squalane, Tea Tree, Aloe Vera)
  - [x] Coverage (Sheer, Light, Medium, Full, Buildable)
  - [x] Finish (Matte, Satin, Dewy, Natural, Radiant, Shimmer, Glitter)
  - [x] Shade Range (Fair, Light, Light-Medium, Medium, Medium-Tan, Tan, Deep, Universal)
  - [x] Formula (Liquid, Cream, Powder, Stick, Gel, Mousse, Pencil)
  - [x] Hair Type (Straight, Wavy, Curly, Coily, Fine, Thick, Normal, All Hair Types)
  - [x] Hair Concern (Damage Repair, Color Protection, Volume, Frizz Control, Hydration, Dandruff, Hair Loss, Split Ends)
  - [x] Hold Strength (Flexible, Light, Medium, Strong, Extra Strong)
  - [x] Fragrance Family (Floral, Oriental, Woody, Fresh, Citrus, Fruity, Gourmand, Aquatic, Spicy, Musky)
  - [x] Concentration (Parfum, Eau de Parfum, Eau de Toilette, Eau de Cologne, Eau Fraiche, Body Mist)
  - [x] Longevity (2-4 hours, 4-6 hours, 6-8 hours, 8-12 hours, 12+ hours)
  - [x] Cruelty-Free (Yes/No)
  - [x] Vegan (Yes/No)
  - [x] Clean Beauty (Yes/No)
  - [x] Brand Tier (Budget, Drugstore, Mid-Range, Prestige, Luxury, Indie)

- [x] **2.3.5 Men's Grooming L3 Categories** ✅ (NEW)
  - [x] Beard Care: Beard Oil, Balm, Wash, Brush, Comb, Trimmer, Wax, Kits
  - [x] Shaving: Razors, Cream, Gel, Aftershave, Pre-Shave, Brushes, Blades, Electric Shavers
  - [x] Men's Skincare: Face Wash, Moisturizer, Eye Cream, Serum, Sunscreen, Anti-Aging, Acne Care
  - [x] Men's Hair Care: Shampoo, Conditioner, Styling, Hair Loss, Pomade, Gel, Wax
  - [x] Men's Body Care: Body Wash, Lotion, Deodorant, Spray, Shower Gel
  - [x] Grooming Kits: Shaving Kits, Beard Kits, Travel Kits, Manicure Kits, Gift Sets

- [x] **2.3.6 Fragrance L3 Categories** ✅ (NEW)
  - [x] Unisex Fragrances: Woody, Fresh, Oriental, Citrus, Niche, Designer
  - [x] Gift Sets: Women's, Men's, Unisex, Discovery, Mini, Luxury
  - [x] Samples: Women's, Men's, Niche, Designer, Discovery Boxes
  - [x] Travel Size: Mini Perfumes, Rollerball, Sprays, Atomizers, Purse Sprays
  - [x] Luxury Niche: Tom Ford, Creed, Maison Francis Kurkdjian, Le Labo, Byredo, Diptyque, Jo Malone

- [x] **2.3.7 Beauty Tools L3 Categories** ✅ (NEW)
  - [x] Facial Tools: Face Rollers, Gua Sha, Cleansing Devices, LED Masks, Microcurrent, Dermaplaning, Extractors, Steamers
  - [x] Hair Tools: Hair Dryers, Flat Irons, Curling Irons, Hot Brushes, Hot Rollers, Crimpers, Dryer Brushes
  - [x] Nail Tools: Files, Clippers, Cuticle Tools, Buffers, UV/LED Lamps, Brushes, Drills, Manicure Sets
  - [x] Eyelash Curlers: Standard, Heated, Mini, Refills, Sets
  - [x] Mirrors: Vanity, Compact, Magnifying, Lighted, Travel, Wall
  - [x] Beauty Devices: Facial Cleansing, Anti-Aging, Hair Removal, Acne, Massage, LED Therapy
  - [x] Accessories: Makeup Bags, Brush Holders, Organizers, Cases, Towels, Headbands

### Applied Migrations (11 total):
1. `phase2_fashion_l3_categories_batch1` - Women's clothing (dresses, tops, pants, outerwear)
2. `phase2_fashion_l3_categories_batch2` - Men's clothing, shoes, accessories
3. `phase2_fashion_l3_categories_batch3` - Bags, watches, jewelry, plus size, vintage
4. `phase2_fashion_attributes_batch1` - Size, Color, Material, Style, Fit, Season
5. `phase2_fashion_attributes_batch2` - Bags (Capacity, Closure), Watches (Movement, Case Material)
6. `phase2_gaming_l3_categories_batch1` - PC peripherals (keyboards, mice, headsets)
7. `phase2_gaming_l3_categories_batch2` - Consoles, controllers, VR headsets
8. `phase2_gaming_l3_categories_batch3` - Gaming furniture, streaming equipment
9. `phase2_gaming_l3_categories_batch4` - Board games, TCG, tabletop
10. `phase2_gaming_attributes` - Platform, Connection Type, Switch Type, Refresh Rate, Resolution, Genre
11. `phase2_beauty_l3_categories_batch1` - Skincare (beard care, body care, deodorants), bath & body, oral care
12. `phase2_beauty_l3_categories_batch2` - Makeup tools, nail care, fragrance, men's grooming
13. `phase2_beauty_l3_categories_batch3` - Skincare L3s, hair care L3s, makeup L3s (eye, lip, face)
14. `phase2_beauty_attributes` - Skin Type, Coverage, Hair Type, Fragrance Family, Cruelty-Free, Vegan, Clean Beauty, Brand Tier

---

## 📋 PHASE 3: AUTOMOTIVE, SPORTS, PETS, KIDS ✅ COMPLETED (June 2025)
**Target:** 70%+ L3 consistency | **Est. Time:** 6 hours | **Priority:** 🟡 MEDIUM

### ✅ Phase 3 Results Summary

| Category | Before | After | L2 Count | L3 Added | Attributes |
|----------|--------|-------|----------|----------|------------|
| **Automotive** | 12.2% | **100%** | 98 | ~200+ | 64 (7.1/L1) |
| **Sports** | ~30% | **100%** | 127 | ~250+ | 105 (7.0/L1) |
| **Pets** | 20.4% | **100%** | 137 | ~300+ | 93 (7.8/L1) |
| **Baby-Kids** | ~28% | **100%** | 90 | ~180+ | 83 (11.9/L1) |

### Phase 3.1: Automotive Tasks ✅

- [x] **3.1.1 Car Parts L3 Categories** ✅
  - [x] Engine Parts: Filters (Air, Oil, Fuel, Cabin, Transmission), Spark Plugs (Copper, Iridium, Platinum, Double Platinum), Belts (Timing, Serpentine, V-Belt, Drive, Alternator), Gaskets (Head, Intake, Exhaust, Valve Cover), Oil (Conventional, Synthetic, High Mileage, Diesel)
  - [x] Brake Parts: Pads (Ceramic, Semi-Metallic, Organic), Rotors (Drilled, Slotted, Vented, Solid), Calipers (Single Piston, Dual Piston, Floating, Fixed), Fluid (DOT 3, DOT 4, DOT 5, Synthetic)
  - [x] Suspension: Shocks (Twin-Tube, Mono-Tube, Gas, Adjustable), Struts (Complete, Cartridge, MacPherson, Sport), Springs (Coil, Leaf, Lowering, Air), Control Arms (Upper, Lower, Front, Rear, Adjustable)
  - [x] Electrical: Batteries (Lead Acid, AGM, Lithium, Deep Cycle), Alternators (OEM, High Output, Remanufactured), Starters (Direct Drive, Gear Reduction, Remanufactured), Lights (LED, HID, Halogen, Fog, DRL, Tail, Headlight, Turn Signal)

- [x] **3.1.2 Tires & Wheels L3 Categories** ✅
  - [x] Tires: All-Season, Summer, Winter, Performance, Off-Road, Run-Flat, Touring, Sport
  - [x] Wheels: Alloy, Steel, Chrome, Forged, Custom, Beadlock, Spare

- [x] **3.1.3 Car Electronics L3 Categories** ✅
  - [x] Audio: Head Units (Single DIN, Double DIN, Apple CarPlay, Android Auto, Touchscreen), Speakers (6.5", Component, Coaxial, Tweeters, Subwoofers), Amplifiers (2-Channel, 4-Channel, Mono, Class D, Class AB), Subwoofers (8", 10", 12", 15", Enclosed, Shallow Mount)
  - [x] Navigation: GPS Units (Portable, Built-In, Fleet), Dash Cams (Single, Dual, 4K, Night Vision, Parking Mode), Parking Sensors (Front, Rear, Electromagnetic, Ultrasonic)
  - [x] **Additional:** Interior (Floor Mats, Seat Covers, Sun Shades, Organizers), Exterior (Spoilers, Body Kits, Mirrors, Trim), Care Products (Wash, Wax, Polish, Interior Cleaner)

- [x] **3.1.4 Automotive Attributes** ✅
  - [x] Make (50+ brands)
  - [x] Model (searchable text)
  - [x] Year Range (1990-2025)
  - [x] Compatibility (OEM, Aftermarket, Universal)
  - [x] Part Type (Original, Refurbished, New Aftermarket)
  - [x] Additional: Fuel Type, Engine Size, Transmission Type, Drive Type

- [x] **3.1.5 Vehicles & E-Mobility L3 Categories** ✅ (NEW)
  - [x] Vehicles: Sedans, SUVs, Trucks, Vans, Sports Cars, Classic Cars, Motorcycles
  - [x] EV/Hybrid: Charging (Level 1, Level 2, DC Fast, Portable), Accessories (Cables, Adapters, Wall Connectors)
  - [x] E-Bikes: City, Mountain, Folding, Cargo, Fat Tire
  - [x] E-Scooters: Commuter, Off-Road, Seated, Standing
  - [x] Services: Repair, Maintenance, Detailing, Inspection

### Phase 3.2: Sports Tasks ✅

- [x] **3.2.1 Team Sports L3 Categories** ✅
  - [x] Football: Balls (Match, Training, Futsal, Beach), Goals (Full Size, Mini, Portable), Shin Guards (Slip-In, Ankle, Compression), Boots (Firm Ground, Soft Ground, Indoor, Turf)
  - [x] Basketball: Balls (Indoor, Outdoor, Composite, Leather), Hoops (In-Ground, Portable, Wall Mount, Mini), Shoes (High Top, Mid, Low), Apparel (Jerseys, Shorts, Compression)
  - [x] Tennis: Rackets (Power, Control, Tweener, Junior), Balls (Professional, Training, Pressureless), Bags (Single, Triple, Tour), Shoes (Clay, Hard Court, All Court), Strings (Polyester, Multifilament, Natural Gut, Hybrid)

- [x] **3.2.2 Fitness Equipment L3 Categories** ✅
  - [x] Cardio: Treadmills (Folding, Commercial, Manual, Under Desk), Exercise Bikes (Upright, Recumbent, Spin, Air), Ellipticals (Front Drive, Rear Drive, Center Drive, Compact), Rowing Machines (Air, Magnetic, Water, Hydraulic)
  - [x] Strength: Dumbbells (Adjustable, Fixed, Hex, Neoprene), Barbells (Olympic, Standard, EZ Curl, Trap), Kettlebells (Cast Iron, Competition, Adjustable, Vinyl), Weight Plates (Bumper, Iron, Rubber Coated, Fractional), Benches (Flat, Adjustable, Olympic, Decline)
  - [x] Accessories: Resistance Bands (Loop, Tube, Mini, Fabric), Yoga Mats (PVC, TPE, Cork, Natural Rubber), Foam Rollers (Smooth, Textured, Vibrating, Travel)
  - [x] **Additional:** Combat Sports (Boxing Gloves, MMA Gloves, Punching Bags, Headgear, Pads)

- [x] **3.2.3 Outdoor Sports L3 Categories** ✅
  - [x] Cycling: Road Bikes (Race, Endurance, Aero, Gravel), Mountain Bikes (Hardtail, Full Suspension, Cross Country, Downhill), E-Bikes (City, Mountain, Folding, Cargo), Accessories (Helmets, Lights, Locks, Pumps, Tools)
  - [x] Camping: Tents (Dome, Cabin, Backpacking, Pop-Up, Roof Top), Sleeping Bags (Mummy, Rectangular, Double, Kids), Backpacks (Day Pack, Overnight, Multi-Day, Ultralight), Stoves (Canister, Liquid Fuel, Wood Burning, Multi-Fuel)
  - [x] Hiking: Boots (Day Hiking, Backpacking, Trail Running, Approach), Poles (Trekking, Nordic, Adjustable, Fixed), Hydration (Bladders, Bottles, Filters, Purifiers), Navigation (GPS, Compass, Maps, Altimeters)
  - [x] **Additional:** Water Sports (Kayaks, Paddleboards, Surfboards, Wetsuits), Winter Sports (Skis, Snowboards, Ice Skates, Sleds)

- [x] **3.2.4 Sports Attributes** ✅
  - [x] Sport Type (20+ sports)
  - [x] Skill Level (Beginner, Intermediate, Advanced, Professional)
  - [x] Gender (Men, Women, Unisex, Youth)
  - [x] Size (S-XXL, Shoe sizes, Equipment sizes)
  - [x] Additional: Activity Type, Terrain Type, Weather Resistance, Weight Capacity, Material

- [x] **3.2.5 Additional Sports L3 Categories** ✅ (NEW)
  - [x] Golf: Clubs (Drivers, Irons, Wedges, Putters), Bags (Cart, Stand, Travel, Sunday), Balls (Distance, Tour, Practice), Accessories (Gloves, Tees, Rangefinders, GPS)
  - [x] Yoga: Mats (Beginner, Premium, Travel), Props (Blocks, Straps, Bolsters, Wheels), Accessories (Towels, Bags, Eye Pillows)
  - [x] Swimming: Goggles (Racing, Training, Open Water), Swimwear (Racing, Training, Recreational), Equipment (Kickboards, Pull Buoys, Fins, Paddles)
  - [x] Supplements: Protein (Whey, Casein, Plant), Pre-Workout, BCAAs, Creatine, Recovery

### Phase 3.3: Pets Tasks ✅

- [x] **3.3.1 Dog Products L3 Categories** ✅
  - [x] Food: By Life Stage (Puppy, Adult, Senior), By Size (Small Breed, Medium Breed, Large Breed), By Type (Dry, Wet, Raw, Freeze-Dried, Dehydrated)
  - [x] Treats: Training (Soft, Crunchy, High Value), Dental (Chews, Sticks, Bones), Chew (Rawhide, Bully Sticks, Antlers), Freeze-Dried (Single Ingredient, Meal Toppers)
  - [x] Toys: Chew (Rubber, Rope, Nylabone), Fetch (Balls, Frisbees, Launchers), Interactive (Puzzle, Treat Dispensing, Snuffle Mat), Plush (Squeaky, Crinkle, Stuffing-Free)
  - [x] Beds: Orthopedic (Memory Foam, Bolster), Standard (Donut, Flat, Elevated, Crate Mat), Heated/Cooling (Self-Warming, Cooling Gel)

- [x] **3.3.2 Cat Products L3 Categories** ✅
  - [x] Food: By Life Stage (Kitten, Adult, Senior), By Health (Urinary, Hairball, Indoor, Weight Management), By Type (Dry, Wet, Raw, Freeze-Dried)
  - [x] Litter: Clumping (Clay, Natural), Non-Clumping (Clay, Crystal, Pine), Specialty (Biodegradable, Flushable, Low Dust)
  - [x] Furniture: Cat Trees (Small, Large, Wall Mounted, Modular), Scratching (Posts, Pads, Loungers, Cardboard), Perches (Window, Hammock, Shelf)
  - [x] **Additional:** Toys (Wand, Ball, Mouse, Interactive, Catnip)

- [x] **3.3.3 Pet Health L3 Categories** ✅
  - [x] Supplements: Joint (Glucosamine, Chondroitin, MSM), Skin & Coat (Omega, Biotin), Digestive (Probiotics, Enzymes, Fiber), Calming (CBD, Melatonin, Pheromone)
  - [x] Flea & Tick: Topical (Spot-On, Shampoo, Spray), Oral (Chewables, Tablets), Collars (Long-Lasting, Waterproof), Environment (Sprays, Foggers, Yard Treatment)
  - [x] **Additional:** Dental (Toothpaste, Brushes, Water Additives, Dental Treats), Grooming (Shampoo, Conditioner, Brushes, Nail Care), First Aid (Wound Care, Bandages, Eye/Ear Care)

- [x] **3.3.4 Pets Attributes** ✅
  - [x] Pet Type (Dog, Cat, Bird, Fish, Small Animal, Reptile, Horse)
  - [x] Pet Size (Extra Small, Small, Medium, Large, Extra Large, Giant)
  - [x] Life Stage (Puppy/Kitten, Adult, Senior, All Life Stages)
  - [x] Breed Size (Toy, Small, Medium, Large, Giant, All Breeds)
  - [x] Special Diet (Grain-Free, Limited Ingredient, Weight Management, High Protein, Sensitive Stomach)
  - [x] Additional: Primary Ingredient, Health Focus, Flavor, Activity Level

- [x] **3.3.5 Additional Pet L3 Categories** ✅ (NEW)
  - [x] Birds: Food (Seed, Pellet, Fruit/Veggie), Cages (Small, Medium, Large, Flight), Toys (Foraging, Climbing, Swings), Accessories (Perches, Feeders, Baths)
  - [x] Fish & Aquatic: Tanks (Freshwater, Saltwater, Nano), Equipment (Filters, Heaters, Lights, Pumps), Decor (Plants, Rocks, Driftwood, Ornaments), Food (Flakes, Pellets, Frozen, Live)
  - [x] Small Animals: Food (Hay, Pellets, Treats), Habitats (Cages, Hutches, Playpens), Bedding (Paper, Wood, Fleece), Toys (Chews, Tunnels, Exercise)
  - [x] Reptiles: Habitats (Terrariums, Vivariums), Heating (Heat Lamps, Mats, Ceramic), Lighting (UVB, Basking, LED), Substrate (Bark, Sand, Carpet)
  - [x] Horses: Tack (Saddles, Bridles, Halters), Feed (Grain, Hay, Supplements), Grooming (Brushes, Hoof Care, Clippers), Blankets (Turnout, Stable, Fly Sheets)
  - [x] Pet Tech: Cameras, GPS Trackers, Auto Feeders, Water Fountains, Smart Toys
  - [x] Travel: Carriers (Soft, Hard, Backpack), Car (Seat Covers, Barriers, Harnesses), Outdoor (Strollers, Bike Trailers)

### Phase 3.4: Kids Tasks ✅

- [x] **3.4.1 Baby Gear L3 Categories** ✅
  - [x] Strollers: Standard (Full Size, Compact, Lightweight), Jogging (Single, Double, All-Terrain), Travel System (Infant, Convertible), Double (Tandem, Side-by-Side, Convertible)
  - [x] Car Seats: Infant (Rear-Facing, Base Included, Lightweight), Convertible (Rear to Forward, Extended Rear, Compact), Booster (Highback, Backless, Combination), All-in-One (4-in-1, 3-in-1)
  - [x] Carriers: Wrap (Stretchy, Woven, Hybrid), Structured (Soft, Frame, Ergonomic), Hip (Hip Seat, Sling), Backpack (Hiking, Urban, Frame)
  - [x] **Additional:** Safety (Gates, Locks, Monitors, Corner Guards), High Chairs (Full Size, Portable, Hook-On, Booster)

- [x] **3.4.2 Toys L3 Categories** ✅
  - [x] Building: LEGO (Classic, Technic, Architecture, Star Wars, Marvel), Duplo (Basic, Themed), Mega Bloks (First Builders, Barbie, Hot Wheels), Magnetic Tiles (Standard, Deluxe, Themed)
  - [x] Educational: STEM (Coding, Robotics, Engineering, Science), Learning Tablets (Toddler, Preschool, School Age), Science Kits (Chemistry, Physics, Biology, Astronomy)
  - [x] Outdoor: Swing Sets (Wooden, Metal, Toddler), Trampolines (Round, Rectangle, Mini), Ride-Ons (Cars, Bikes, Scooters, Balance Bikes)
  - [x] **Additional:** Action Figures, Dolls, Puzzles, Art Supplies, Board Games, Pretend Play, Stuffed Animals

- [x] **3.4.3 Clothing L3 Categories** ✅
  - [x] By Age: Newborn (0-3 Months, 3-6 Months), Infant (6-12 Months, 12-18 Months), Toddler (18-24 Months, 2T, 3T, 4T), Kids (4-5, 6-7, 8-10, 10-12)
  - [x] By Type: Bodysuits (Short Sleeve, Long Sleeve, Sleeveless), Sleepwear (Pajamas, Sleep Sacks, Footie, Robes), Outerwear (Jackets, Coats, Snow Suits, Rain Gear), Sets (Outfits, Layette, Gift Sets)

- [x] **3.4.4 Kids Attributes** ✅
  - [x] Age Range (0-3m, 3-6m, 6-12m, 1-2y, 2-3y, 3-5y, 5-8y, 8-12y)
  - [x] Gender (Boys, Girls, Unisex, Neutral)
  - [x] Safety Standard (ASTM, JPMA, EN, CPSC)
  - [x] Educational Focus (STEM, Motor Skills, Creativity, Language, Social)
  - [x] Additional: Size, Theme/Character, Material, Battery Required

- [x] **3.4.5 Additional Kids L3 Categories** ✅ (NEW)
  - [x] Feeding: Bottles (Standard, Anti-Colic, Glass, Silicone), Breastfeeding (Pumps, Storage, Nursing Pillows), Solid Feeding (High Chairs, Plates, Utensils, Bibs), Formula (Infant, Toddler, Specialty)
  - [x] Diapering: Diapers (Disposable, Cloth, Training Pants, Swim), Wipes (Sensitive, Fragrance-Free, Thick, Water), Rash Care (Creams, Ointments, Powders), Accessories (Diaper Bags, Changing Pads, Pails)
  - [x] Nursery: Cribs (Standard, Convertible, Mini, Portable), Bedding (Sheets, Blankets, Mattresses, Pads), Furniture (Dressers, Gliders, Changing Tables), Decor (Wall Art, Mobiles, Lighting, Rugs)
  - [x] Bath: Tubs (Infant, Toddler, Inflatable), Accessories (Toys, Towels, Robes, Thermometers), Care (Shampoo, Lotion, Sunscreen, Oral Care)

### Applied Migrations (30 total for Phase 3):

**Automotive (9 migrations):**
1. `phase3_automotive_l3_engine_parts` - Engine filters, spark plugs, belts, gaskets, oil
2. `phase3_automotive_l3_brake_suspension` - Brake pads, rotors, calipers, fluid; suspension shocks, struts, springs, control arms
3. `phase3_automotive_l3_wheels_tires_electrical` - Tires, wheels, batteries, alternators, starters, lights
4. `phase3_automotive_l3_body_exterior_interior` - Interior & exterior accessories
5. `phase3_automotive_l3_audio_electronics_care` - Audio systems, navigation, dash cams, care products
6. `phase3_automotive_l3_vehicles_ev` - Vehicles, EV/Hybrid charging, accessories
7. `phase3_automotive_l3_ebikes_escooters_services` - E-bikes, e-scooters, automotive services
8. `phase3_automotive_l3_remaining` - Remaining L2 categories with L3 coverage
9. `phase3_automotive_attributes` - 64 attributes across 9 L1 categories

**Sports (7 migrations):**
1. `phase3_sports_l3_team_racket` - Football, basketball, tennis, racket sports
2. `phase3_sports_l3_combat_fitness` - Combat sports, fitness equipment (cardio, strength, accessories)
3. `phase3_sports_l3_cycling_outdoor` - Cycling, camping, hiking, outdoor gear
4. `phase3_sports_l3_water_winter_supplements` - Water sports, winter sports, supplements
5. `phase3_sports_l3_remaining` - Additional coverage for remaining L2 categories
6. `phase3_sports_l3_golf_yoga_swimming` - Golf, yoga, swimming specialized L3s
7. `phase3_sports_attributes_v2` - 105 attributes across 15 L1 categories

**Pets (8 migrations):**
1. `phase3_pets_l3_birds` - Bird food, cages, toys, accessories
2. `phase3_pets_l3_cats_dogs` - Dog and cat food, treats, toys, beds, litter, furniture
3. `phase3_pets_l3_fish_aquatic` - Fish tanks, equipment, decor, food
4. `phase3_pets_l3_horses_gifts` - Horse tack, feed, grooming; pet gifts
5. `phase3_pets_l3_health_tech_travel` - Pet health supplements, flea & tick, tech, travel
6. `phase3_pets_l3_travel_reptiles` - Pet travel carriers, reptile habitats, heating, lighting
7. `phase3_pets_l3_small_animals` - Small animal food, habitats, bedding, toys
8. `phase3_pets_attributes` - 93 attributes across 12 L1 categories

**Kids (6 migrations):**
1. `phase3_kids_l3_feeding` - Bottles, breastfeeding, solid feeding, formula
2. `phase3_kids_l3_gear_safety` - Strollers, car seats, carriers, safety equipment
3. `phase3_kids_l3_diapering` - Diapers, wipes, rash care, diaper accessories
4. `phase3_kids_l3_clothing_nursery` - Kids clothing by age and type, nursery furniture
5. `phase3_kids_l3_nursery_toys` - Nursery decor, toys by category (building, educational, outdoor)
6. `phase3_kids_attributes` - 83 attributes across 7 L1 categories

---

## 📋 PHASE 4: SPECIALIZED CATEGORIES ⏳ IN PROGRESS (December 2025)
**Target:** 60%+ L3 consistency | **Est. Time:** 8 hours | **Priority:** 🟢 NORMAL

### ✅ Phase 4 Results Summary (Partial - 4/5 Complete)

| Category | Before | After | L2 Count | L2 with L3 | Status |
|----------|--------|-------|----------|------------|--------|
| **Tools & Industrial** | 27.5% | 27.5% | 269 | 74 | 🔴 **NEEDS WORK** |
| **Health & Wellness** | 21% | **64.9%** | 57 | 37 | ✅ PASS |
| **Hobbies** | 26% | **77.0%** | 74 | 57 | ✅ PASS |
| **Grocery & Food** | 7% | **71.8%** | 117 | 84 | ✅ PASS |
| **Jewelry & Watches** | 0% | **80.8%** | 120 | 97 | ✅ PASS |

### Phase 4.1: Tools & Industrial Tasks 🔴 INCOMPLETE (27.5%)

**L0 ID:** `e6f6ece0-ec00-4c0f-8b57-c52ae40a7399`
**Current State:** 25 L1s, 269 L2s, 354 L3s (but only 74 L2s have L3s)

- [ ] **4.1.1 Power Tools L3 Categories**
  - [ ] Drills: Cordless, Corded, Impact, Hammer, Rotary
  - [ ] Saws: Circular, Jigsaw, Miter, Reciprocating, Table
  - [ ] Sanders: Belt, Orbital, Detail, Random Orbital

- [ ] **4.1.2 Hand Tools L3 Categories**
  - [ ] Wrenches: Adjustable, Socket, Combination, Torque
  - [ ] Screwdrivers: Sets, Phillips, Flathead, Precision
  - [ ] Pliers: Needle Nose, Channel Lock, Lineman's

- [ ] **4.1.3 Tool Attributes**
  - [ ] Power Source (Cordless, Corded, Pneumatic, Manual)
  - [ ] Voltage (12V, 18V, 20V, 40V)
  - [ ] Brand (DeWalt, Makita, Milwaukee, Bosch, Ryobi)
  - [ ] Use Type (Professional, DIY, Industrial)

**L2s Missing L3s (by L1, top 15):**
- Safety Equipment: 23 L2s need L3s
- Tool Storage: 13 L2s need L3s
- Garden & Outdoor Power: 12 L2s need L3s
- Welding & Soldering: 12 L2s need L3s
- Pneumatic & Air Tools: 12 L2s need L3s
- Woodworking Tools: 11 L2s need L3s
- Metalworking Tools: 11 L2s need L3s
- Hardware: 10 L2s need L3s
- Fasteners & Hardware: 10 L2s need L3s
- Test & Measurement: 10 L2s need L3s
- Painting & Finishing: 9 L2s need L3s
- Plumbing Tools: 9 L2s need L3s
- Electrical Tools: 9 L2s need L3s
- Tool Accessories & Parts: 8 L2s need L3s
- HVAC Tools & Equipment: 8 L2s need L3s

### Phase 4.2: Health & Wellness Tasks ✅ COMPLETE (64.9%)

**L0 ID:** Health & Wellness (verify via query)
**Final State:** 57 L2s, 37 with L3 children = **64.9% consistency** ✅

- [x] **4.2.1 Supplements L3 Categories** ✅
  - [x] Vitamins: Multivitamins, Vitamin D, C, B Complex, E
  - [x] Minerals: Magnesium, Zinc, Iron, Calcium
  - [x] Specialty: Omega-3, Probiotics, Collagen, Joint Support

- [x] **4.2.2 Fitness Supplements L3 Categories** ✅
  - [x] Protein: Whey, Casein, Plant-Based, Mass Gainer
  - [x] Pre-Workout, BCAAs, Creatine, Fat Burners

- [x] **4.2.3 Health Attributes** ✅
  - [x] Form (Capsules, Tablets, Powder, Liquid, Gummies)
  - [x] Dietary Preference (Vegan, Vegetarian, Gluten-Free, Non-GMO)
  - [x] Target Benefit (Energy, Immunity, Sleep, Weight, Joint)

### Phase 4.3: Hobbies Tasks ✅ COMPLETE (77.0%)

**L0 ID:** Hobbies (verify via query)
**Final State:** 74 L2s, 57 with L3 children = **77.0% consistency** ✅

- [x] **4.3.1 Trading Cards L3 Categories** ✅
  - [x] Pokemon: Singles, Booster Boxes, ETBs, Japanese
  - [x] Magic: The Gathering: Singles, Commander Decks, Boosters
  - [x] Sports Cards: Baseball, Basketball, Football

- [x] **4.3.2 Musical Instruments L3 Categories** ✅
  - [x] Guitars: Electric, Acoustic, Bass, Classical
  - [x] Keyboards: Digital Pianos, Synthesizers, MIDI Controllers
  - [x] Drums: Acoustic, Electronic, Cymbals, Hardware

- [x] **4.3.3 Hobby Attributes** ✅
  - [x] Skill Level (Beginner, Intermediate, Advanced)
  - [x] Condition (Sealed, Near Mint, Lightly Played, Played)
  - [x] Rarity (Common, Uncommon, Rare, Ultra Rare)

### Phase 4.4: Grocery & Food Tasks ✅ COMPLETE (71.8%)

**L0 ID:** `0325b1a5-4e95-40d8-9eb9-6220f20710b5`
**Final State:** 117 L2s, 84 with L3 children, 447 total L3s = **71.8% consistency** ✅

- [x] **4.4.1 Bulgarian Specialty L3 Categories** ✅
  - [x] Dairy: Sirene Types, Kashkaval Types, Yogurt Varieties
  - [x] Preserves: Lutenitsa, Kyopolou, Turshia
  - [x] Drinks: Rakia Types (Grape, Plum, Apricot), Bulgarian Wine

- [x] **4.4.2 Pantry L3 Categories** ✅
  - [x] Oils: Olive, Sunflower, Coconut, Sesame
  - [x] Pasta: Spaghetti, Penne, Fusilli, Lasagna

- [x] **4.4.3 Additional Categories Added** ✅
  - [x] Dairy & Eggs: Milk Types, Cheese Types, Butter, Cream, Eggs
  - [x] Beverages: Coffee, Tea, Soft Drinks, Water, Juices
  - [x] Bakery: Bread Types, Pastries, Cakes
  - [x] Meat & Seafood: Beef, Pork, Poultry, Fish, Shellfish
  - [x] Snacks: Chips, Nuts, Candy, Chocolate, Cookies
  - [x] Fruits: Apples, Berries, Citrus, Tropical, Stone Fruits
  - [x] Vegetables: Leafy Greens, Root Vegetables, Tomatoes, Mushrooms
  - [x] Frozen Foods: Frozen Meals, Ice Cream, Frozen Vegetables
  - [x] International Foods: Asian, Mexican, Italian, Indian
  - [x] Baby Food & Organic/Bio Products

- [x] **4.4.4 Grocery Attributes** ✅
  - [x] Organic Certified (Yes/No)
  - [x] Dietary (Vegan, Gluten-Free, Lactose-Free, Keto)
  - [x] Country of Origin (Bulgaria, EU, Greece, Turkey)
  - [x] Expiry Date, Weight/Volume

### Phase 4.5: Jewelry & Watches Tasks ✅ COMPLETE (80.8%)

**L0 ID:** `f6c0dcd2-e560-4ef5-bdad-e784dc4d57bf`
**Final State:** 120 L2s, 97 with L3 children, 359 total L3s = **80.8% consistency** ✅

- [x] **4.5.1 Rings L3 Categories** ✅
  - [x] Engagement: Solitaire, Halo, Three-Stone, Vintage
  - [x] Wedding: Plain Bands, Diamond Bands, Eternity
  - [x] Fashion: Cocktail, Stackable, Signet

- [x] **4.5.2 Watches L3 Categories** ✅
  - [x] Luxury: By Brand (Rolex, Omega, Patek, Tag Heuer)
  - [x] Style: Dress, Sport, Dive, Chronograph
  - [x] Smartwatches: Apple, Samsung, Garmin, Fitbit

- [x] **4.5.3 Additional Categories Added** ✅
  - [x] Necklaces: Chains, Pendants, Chokers, Lariats
  - [x] Earrings: Studs, Hoops, Dangles, Huggies
  - [x] Bracelets: Bangles, Tennis, Charm, Cuffs
  - [x] Fine Jewelry: Diamond, Gold, Platinum pieces
  - [x] Fashion Jewelry: Costume, Statement pieces
  - [x] Men's Jewelry: Rings, Chains, Bracelets
  - [x] Vintage & Antique: Art Deco, Victorian, Estate
  - [x] Jewelry Supplies: Beads, Findings, Wire, Tools

- [x] **4.5.4 Jewelry Attributes** ✅
  - [x] Metal Type (Gold, Silver, Platinum, Rose Gold, Tungsten)
  - [x] Metal Purity (24K, 22K, 18K, 14K, 10K, Sterling 925)
  - [x] Gemstone (Diamond, Ruby, Sapphire, Emerald)
  - [x] Ring Size (US 4-14, EU 44-68)
  - [x] Watch Movement (Automatic, Quartz, Manual)
  - [x] Condition, Brand, Certification

---

## ✅ PHASE 5: SERVICES & DIGITAL (Listings/Digital) - COMPLETED
**Target:** Attribute-based (L3 optional) | **Completed:** December 9, 2025 | **Priority:** 🔵 LOW

### 📊 Phase 5 Results Summary

| Category | L3s Added | Attributes Added | Status |
|----------|-----------|------------------|--------|
| **Books** | 30+ | 9 | ✅ COMPLETE |
| **E-Mobility** | 25+ | 8 | ✅ COMPLETE |
| **Collectibles** | 50+ | 12 | ✅ COMPLETE |
| **Bulgarian Traditional** | 20+ | 6 | ✅ COMPLETE |
| **Movies & Music** | 15+ | 7 | ✅ COMPLETE |
| **Software** | 30+ | 8 | ✅ COMPLETE |
| **Services** | 40+ | 10 | ✅ COMPLETE |
| **Real Estate** | - | 13 | ✅ COMPLETE |
| **Jobs** | - | 10 | ✅ COMPLETE |
| **Wholesale** | 45+ | 15 | ✅ COMPLETE |

### Phase 5.1: Software Tasks ✅ COMPLETE

- [x] **5.1.1 Software L3 Categories**
  - [x] AI Tools: ChatGPT Plus, Claude Pro, Midjourney, Stable Diffusion, GitHub Copilot
  - [x] Business Apps: ERP Systems, CRM Platforms, Accounting, HR Management, Project Management
  - [x] Creative Software: Video Editing Pro, Photo Editing, Animation, Audio DAW, 3D Modeling
  - [x] Development Tools: IDEs (VS Code, JetBrains, Xcode, Android Studio), Database Tools, API Tools

- [x] **5.1.2 Software Attributes**
  - [x] Platform (Windows, macOS, Linux, iOS, Android, Web, Cross-Platform)
  - [x] License Type (One-Time, Subscription, Free, Freemium, Open Source)
  - [x] Users (Single, Multi-User, Team, Enterprise)
  - [x] Delivery (Download, Physical, Key Only, Cloud)

### Phase 5.2: Real Estate Tasks ✅ COMPLETE

- [x] **5.2.1 Real Estate Attributes** (13 total)
  - [x] Property Type (Apartment, House, Villa, Studio, Land, Commercial, Parking)
  - [x] Bedrooms (Studio, 1, 2, 3, 4, 5+)
  - [x] Bathrooms (1, 1.5, 2, 2.5, 3+)
  - [x] Area (m², ranges)
  - [x] Price, Location, Year Built
  - [x] Floor, Heating Type, Parking
  - [x] Furnished (Yes/No), Pet Friendly (Yes/No)
  - [x] Available From (date)

### Phase 5.3: Jobs Tasks ✅ COMPLETE

- [x] **5.3.1 Jobs Attributes** (Core - 7 attrs)
  - [x] Employment Type (Full-time, Part-time, Contract, Freelance, Internship, Temporary)
  - [x] Experience Level (Entry Level, Junior, Mid-Level, Senior, Lead/Manager, Executive)
  - [x] Work Location (On-site, Remote, Hybrid)
  - [x] Education Required (None, High School, Bachelor's, Master's, PhD, Vocational)
  - [x] Salary Type (Hourly, Monthly, Annual, Commission, Negotiable)
  - [x] Benefits, Start Date

- [x] **5.3.2 IT Jobs Attributes** (3 attrs)
  - [x] Tech Stack, Specialization, Remote Work

- [x] **5.3.3 Healthcare Jobs Attributes** (3 attrs)
  - [x] License Required, Shift Type, Specialization

### Phase 5.4: Services Tasks ✅ COMPLETE

- [x] **5.4.1 Services L3 Categories**
  - [x] Auto Services: Oil Change, Tire Service, Brake Service, AC Repair, Detailing, Inspection
  - [x] Cleaning Services: House Cleaning, Office Cleaning, Carpet, Window, Deep Cleaning, Move-Out
  - [x] Construction: Plumbing, Electrical, Roofing, Painting, Flooring, HVAC, Remodeling
  - [x] Business Services: Accounting, Legal, Marketing, Consulting, Translation, Notary
  - [x] Tech Services: Computer Repair, Phone Repair, Network Setup, Data Recovery, Web Design
  - [x] Education: Tutoring, Language Classes, Music Lessons, Test Prep, Online Courses

- [x] **5.4.2 Services Attributes**
  - [x] Service Type, Availability, Location, Pricing

### Phase 5.5: Books Tasks ✅ COMPLETE

- [x] **5.5.1 Books L3 Categories**
  - [x] Fiction: Sci-Fi, Fantasy, Mystery, Thriller, Romance, Horror, Literary Fiction
  - [x] Non-Fiction: Biography, History, Self-Help, Business, Science, Travel
  - [x] Children's Books: Picture Books, Chapter Books, Middle Grade, Teen/YA
  - [x] Textbooks: STEM, Humanities, Medical, Law, Business, Test Prep
  - [x] Comics & Graphic Novels, Rare Books, E-Books, Magazines, Bulgarian Authors, Foreign Language

- [x] **5.5.2 Books Attributes** (9 attrs)
  - [x] Genre, Format (Hardcover, Paperback, E-Book, Audiobook), Condition
  - [x] Language, Author, ISBN, Edition, Year Published, Age Range

### Phase 5.6: E-Mobility Tasks ✅ COMPLETE

- [x] **5.6.1 E-Mobility L3 Categories**
  - [x] E-Bikes: City E-Bikes, Mountain E-Bikes, Folding E-Bikes, Cargo E-Bikes, Fat Tire, Road E-Bikes
  - [x] E-Scooters: Commuter, Performance, Off-Road, Seated, Kids E-Scooters
  - [x] Electric Skateboards, E-Unicycles, Hoverboards, E-Go-Karts
  - [x] Accessories, Parts, Charging Equipment

- [x] **5.6.2 E-Mobility Attributes** (8 attrs)
  - [x] Battery Range, Motor Power, Max Speed, Weight
  - [x] Battery Capacity, Charging Time, Max Load, Wheel Size

### Phase 5.7: Collectibles Tasks ✅ COMPLETE

- [x] **5.7.1 Collectibles L3 Categories**
  - [x] Art & Antiques: Paintings, Sculptures, Prints, Antique Furniture, Porcelain, Glassware
  - [x] Coins & Currency: Ancient, Medieval, Modern, Bulgarian, World Coins, Banknotes
  - [x] Toys & Games: Vintage Toys, Die-Cast, Action Figures, Model Trains, Dolls
  - [x] Trading Cards: Sports Cards, Pokemon, Magic, Yu-Gi-Oh
  - [x] Sports Memorabilia: Autographed Items, Game-Used, Jerseys, Programs
  - [x] Entertainment: Movie Props, TV Memorabilia, Music Memorabilia, Celebrity Autographs
  - [x] Stamps: By Country, By Era, By Topic
  - [x] Autographs, Militaria, Vintage Electronics, Vintage Comics

- [x] **5.7.2 Collectibles Attributes** (12 attrs)
  - [x] Era/Period, Condition, Authentication, Rarity
  - [x] Provenance, Material, Origin Country, Artist/Maker
  - [x] Certification, Year/Date, Category Type, Value Estimate

### Phase 5.8: Bulgarian Traditional Tasks ✅ COMPLETE

- [x] **5.8.1 Bulgarian Traditional L3 Categories**
  - [x] Costumes: Men's Costumes, Women's Costumes, Children's Costumes, Regional Costumes, Costume Accessories, Dance Costumes
  - [x] Instruments: Gaida, Kaval, Gadulka, Tambura, Tupan, Tapan, Zurna
  - [x] Foods: Lukanka, Sudzhuk, Bulgarian Cheese, Rakia, Bulgarian Wine, Rose Products
  - [x] Crafts: Pottery, Woodcarving, Textiles, Embroidery, Icons, Copperwork

- [x] **5.8.2 Bulgarian Traditional Attributes** (6 attrs)
  - [x] Region, Material, Handmade (Yes/No), Era/Period
  - [x] Authenticity Certificate, Traditional Use

### Phase 5.9: Movies & Music Tasks ✅ COMPLETE

- [x] **5.9.1 Movies & Music L3 Categories**
  - [x] Movies: Blu-ray, 4K UHD, DVD, VHS, Digital
  - [x] Music: Vinyl Records, CDs, Cassettes, Digital Downloads

- [x] **5.9.2 Movies & Music Attributes** (7 attrs)
  - [x] Genre, Format, Year, Condition, Region Code
  - [x] Artist/Director, Language

### Phase 5.10: Wholesale Tasks ✅ COMPLETE

- [x] **5.10.1 Wholesale L3 Categories**
  - [x] Wholesale Automotive: Hand Tools, Power Tools, Diagnostic Equipment, Car Care, Tires
  - [x] Wholesale Beauty: Shampoos, Hair Color, Nail Polish, Fragrances, Personal Care, Beauty Tools

- [x] **5.10.2 Wholesale Attributes** (Core - 7 attrs)
  - [x] Minimum Order, Pricing Tier, Lead Time
  - [x] Private Label (Yes/No), Dropshipping (Yes/No), Sample Available (Yes/No)
  - [x] Certifications

- [x] **5.10.3 Wholesale Electronics Attributes** (3 attrs)
  - [x] Warranty, Condition, OEM/Generic

- [x] **5.10.4 Wholesale Clothing Attributes** (4 attrs)
  - [x] Size Range, Material, Style, Season

- [x] **5.10.5 Wholesale Food Attributes** (4 attrs)
  - [x] Storage Requirements, Shelf Life, Organic (Yes/No), HACCP Certified (Yes/No)

### Applied Migrations (Phase 5 - 13 total):

1. `phase5_books_l3_fiction` - Fiction subcategories (Sci-Fi, Fantasy, Mystery, etc.)
2. `phase5_books_l3_nonfiction_children` - Non-fiction & Children's books
3. `phase5_books_l3_textbooks_comics` - Textbooks, Comics, Rare books
4. `phase5_books_l3_ebooks_magazines` - E-books, Magazines, Bulgarian Authors
5. `phase5_books_attributes` - 9 book attributes
6. `phase5_emobility_l3_ebikes` - E-bike types (City, Mountain, Folding, Cargo)
7. `phase5_emobility_l3_escooters` - E-scooters & other electric vehicles
8. `phase5_emobility_l3_accessories` - Accessories, Parts, Charging
9. `phase5_emobility_attributes` - 8 e-mobility attributes
10. `phase5_collectibles_l3_art_antiques` - Art, Antiques, Coins
11. `phase5_collectibles_l3_toys_trading` - Toys, Trading Cards
12. `phase5_collectibles_l3_sports_entertainment` - Sports & Entertainment memorabilia
13. `phase5_collectibles_l3_stamps_autographs` - Stamps, Autographs, Militaria
14. `phase5_collectibles_attributes` - 12 collectibles attributes
15. `phase5_bulgarian_trad_l3_costumes_instruments` - Traditional costumes & instruments
16. `phase5_bulgarian_trad_l3_foods_wine` - Traditional foods & beverages
17. `phase5_bulgarian_trad_l3_crafts` - Traditional crafts
18. `phase5_bulgarian_trad_attributes` - 6 Bulgarian traditional attributes
19. `phase5_movies_music_l3_formats` - Movie & Music formats (Blu-ray, Vinyl, etc.)
20. `phase5_movies_music_attributes` - 7 movies & music attributes
21. `phase5_software_l3_ai_business` - AI tools & Business software
22. `phase5_software_l3_creative_dev` - Creative & Development tools
23. `phase5_software_attributes` - 8 software attributes
24. `phase5_services_l3_auto_cleaning` - Auto & Cleaning services
25. `phase5_services_l3_construction_business` - Construction & Business services
26. `phase5_services_l3_tech_education` - Tech & Education services
27. `phase5_services_attributes` - 10 services attributes
28. `phase5_real_estate_attributes` - 13 real estate attributes
29. `phase5_jobs_wholesale_attributes` - Jobs (10 attrs) & Wholesale (18 attrs) attributes
30. `phase5_wholesale_l3_automotive_beauty` - Wholesale L3 subcategories
31. `fix_orphaned_ide_db_tools` - Fixed orphaned IDE & DB tools (assigned to correct parents)
32. `fix_orphaned_creative_tools` - Fixed orphaned audio/video/photo/3D tools
33. `fix_orphaned_entertainment_collectibles` - Fixed orphaned entertainment memorabilia
34. `fix_orphaned_vintage_clothing` - Fixed orphaned vintage clothing by era/designer
35. `fix_orphaned_militaria` - Fixed orphaned militaria equipment
36. `fix_orphaned_stamps_sports_militaria` - Fixed orphaned stamps, sports memorabilia

---

## 🎯 THE RULES (NON-NEGOTIABLE)

### Rule 1: MAX DEPTH = L4 (5 Levels)
```
L0: Electronics           (Root)
  └─ L1: Smartphones      (Category Type)
       └─ L2: iPhones     (Brand/Line)
            └─ L3: iPhone 15 Series   (Product Line) ← THIS IS WHAT WE NEED
                 └─ L4: iPhone 15 Pro Max (Specific Model) ← OPTIONAL
```

**❌ NEVER create L5/L6:**
```
iPhone 15 Pro Max → 256GB Variant → Black 256GB (L6) ← WRONG! Use attributes!
```

### Rule 2: L3 = PRODUCT SUBTYPES, ATTRIBUTES = VARIATIONS
```
✅ CORRECT:
L3: "iPhone 15 Series" + attributes: Storage (128GB/256GB/512GB/1TB), Color, Condition

❌ WRONG:
L3: "iPhone 15 Series" → L4: "iPhone 15 128GB" → L5: "iPhone 15 128GB Black"
```

**When to use L3 Category vs Attribute:**
| Use L3 Category | Use Attribute |
|-----------------|---------------|
| iPhone 15 vs iPhone 14 (different products) | 128GB vs 256GB (same phone, different storage) |
| Gaming Desktops vs Mini PCs (different form factors) | Intel vs AMD (same product type, different CPU) |
| AirPods Pro vs AirPods Max (different products) | Black vs White (same product, different color) |

### Rule 3: ATTRIBUTES LIVE AT EVERY BROWSABLE LEVEL
| Level | Needs Attributes? | Why |
|-------|-------------------|-----|
| L0 | ✅ YES | Universal filters (Condition, Brand, Price) |
| L1 | ✅ YES | Category-specific filters (Smartphones→Storage, RAM) |
| L2 | ⚠️ Inherits | Inherits from L1, add specifics if needed |
| L3 | ✅ YES | Product-specific filters (iPhone 15→Color, Carrier Lock) |
| L4 | ⚠️ Optional | Subtype-specific if needed |

### Rule 4: HOW AMAZON/EBAY DO IT
```
Amazon: Electronics → Cell Phones → iPhones → iPhone 15 (L3) + Filters: Storage, Color
eBay: Electronics → Cell Phones → iPhones → iPhone 15 (L3) + Filters: Storage, Carrier
        └─ FILTERS: Storage (128GB, 256GB), Color, Carrier, Condition

NOT: iPhone 15 → iPhone 15 128GB → iPhone 15 128GB Unlocked → Black Unlocked 128GB
```

**Key insight:** Amazon has ~3-4 category levels MAX, then uses FACETED FILTERS.

---

## 🚨 CRITICAL: MIGRATION SAFETY RULES (LEARNED THE HARD WAY)

> **⚠️ PHASE 3 DISASTER:** We created 74 orphaned categories with `parent_id = NULL` that showed up as L0 categories in the subheader. This section prevents that from EVER happening again.

### Rule 5: NEVER INSERT WITHOUT VERIFIED PARENT_ID

**❌ DANGEROUS - Parent lookup can silently return NULL:**
```sql
-- THIS IS DANGEROUS! If parent slug doesn't exist, parent_id becomes NULL = L0 CATEGORY!
INSERT INTO categories (name, slug, parent_id)
VALUES ('My Category', 'my-cat', (SELECT id FROM categories WHERE slug = 'nonexistent-parent'));
```

**✅ SAFE - Always verify parent exists FIRST:**
```sql
-- Step 1: VERIFY parent exists
SELECT id, slug, name FROM categories WHERE slug = 'target-parent-slug';
-- If this returns 0 rows, DO NOT PROCEED!

-- Step 2: Only then insert with hardcoded UUID
INSERT INTO categories (name, slug, parent_id)
VALUES ('My Category', 'my-cat', 'verified-uuid-from-step-1');
```

### Rule 6: ALWAYS CHECK FOR ORPHANS AFTER MIGRATIONS

**Run this IMMEDIATELY after any category migration:**
```sql
-- This should return EXACTLY 24 rows (our L0 categories)
SELECT slug, name, display_order 
FROM categories 
WHERE parent_id IS NULL 
ORDER BY display_order;

-- If you see MORE than 24, you created orphans! Fix immediately!
```

### Rule 7: USE SAFE INSERT PATTERN

**✅ RECOMMENDED: Insert with explicit parent verification**
```sql
-- Safe batch insert with parent verification
DO $$
DECLARE
  parent_uuid UUID;
BEGIN
  -- Get and verify parent
  SELECT id INTO parent_uuid FROM categories WHERE slug = 'target-parent-slug';
  
  IF parent_uuid IS NULL THEN
    RAISE EXCEPTION 'Parent category not found: target-parent-slug';
  END IF;
  
  -- Now safe to insert
  INSERT INTO categories (name, slug, parent_id, name_bg, display_order)
  VALUES 
    ('Child 1', 'child-1', parent_uuid, 'Дете 1', 100),
    ('Child 2', 'child-2', parent_uuid, 'Дете 2', 101)
  ON CONFLICT (slug) DO NOTHING;
END $$;
```

### Rule 8: PRE-FLIGHT CHECKLIST FOR MIGRATIONS

Before running ANY category migration:

- [ ] **1. Verify parent slug exists:** `SELECT id FROM categories WHERE slug = 'parent-slug';`
- [ ] **2. Copy the UUID** from the result (don't rely on subqueries)
- [ ] **3. Use hardcoded UUID** in your INSERT statement
- [ ] **4. After migration, check L0 count:** Must be exactly 24
- [ ] **5. If orphans created, FIX IMMEDIATELY** with UPDATE to set correct parent_id

### Rule 9: WHAT TO DO IF YOU CREATE ORPHANS

**Immediate fix:**
```sql
-- 1. Find orphans (categories with parent_id = NULL that shouldn't be L0)
SELECT slug, name FROM categories 
WHERE parent_id IS NULL AND display_order = 0;

-- 2. Find correct parent
SELECT id, slug, name FROM categories WHERE slug LIKE '%expected-parent%';

-- 3. Fix with UPDATE
UPDATE categories 
SET parent_id = 'correct-parent-uuid', display_order = 100
WHERE slug IN ('orphan-1', 'orphan-2', 'orphan-3')
AND parent_id IS NULL;

-- 4. Verify fix
SELECT COUNT(*) FROM categories WHERE parent_id IS NULL; -- Must be 24
```

### The 24 Valid L0 Categories (Reference)

| # | Slug | Name | display_order |
|---|------|------|---------------|
| 1 | fashion | Fashion | 1 |
| 2 | electronics | Electronics | 2 |
| 3 | home | Home & Kitchen | 3 |
| 4 | beauty | Beauty | 4 |
| 5 | health-wellness | Health | 5 |
| 6 | sports | Sports | 6 |
| 7 | baby-kids | Kids | 7 |
| 8 | gaming | Gaming | 8 |
| 9 | automotive | Automotive | 9 |
| 10 | pets | Pets | 10 |
| 11 | real-estate | Real Estate | 11 |
| 12 | software | Software | 12 |
| 13 | collectibles | Collectibles | 13 |
| 14 | wholesale | Wholesale | 14 |
| 15 | hobbies | Hobbies | 15 |
| 16 | jewelry-watches | Jewelry & Watches | 16 |
| 17 | grocery | Grocery & Food | 17 |
| 18 | tools-home | Tools & Industrial | 18 |
| 19 | e-mobility | E-Mobility | 19 |
| 20 | services | Services & Events | 20 |
| 21 | bulgarian-traditional | Bulgarian Traditional | 21 |
| 22 | books | Books | 22 |
| 23 | movies-music | Movies & Music | 23 |
| 24 | jobs | Jobs | 24 |

**If you see ANY other slugs with `parent_id = NULL`, they are ORPHANS and must be fixed!**

---

## 📊 EXECUTION TRACKING

### Phase Progress Summary

| Phase | Categories | Tasks | Progress | Status |
|-------|------------|-------|----------|--------|
| **Phase 1** | Electronics | 8 major tasks | 8/8 | ✅ **COMPLETED** |
| **Phase 2** | Fashion, Gaming, Beauty | 12 major tasks | 12/12 | ✅ **COMPLETED** |
| **Phase 3** | Automotive, Sports, Pets, Kids | 16 major tasks | 16/16 | ✅ **COMPLETED** |
| **Phase 4** | Tools, Health, Hobbies, Grocery, Jewelry | 16 major tasks | 12/16 | ⚠️ Tools Incomplete |
| **Phase 5** | Software, Real Estate, Jobs, Services, Books, E-Mobility, Collectibles, Bulgarian Traditional, Movies & Music, Wholesale | 10 major tasks | 10/10 | ✅ **COMPLETED** |

### L0 Category Completion Tracker

| # | L0 Category | L3 Cats Added | Attributes Added | Verified | Status |
|---|-------------|---------------|------------------|----------|--------|
| 1 | Electronics | ✅ ~400+ | ✅ 116 | ✅ | ✅ **DONE** Phase 1 |
| 2 | Fashion | ✅ ~350+ | ✅ 140+ | ✅ | ✅ **DONE** Phase 2 |
| 3 | Gaming | ✅ ~200+ | ✅ 80+ | ✅ | ✅ **DONE** Phase 2 |
| 4 | Beauty | ✅ ~300+ | ✅ 120+ | ✅ | ✅ **DONE** Phase 2 |
| 5 | Automotive | ✅ ~200+ | ✅ 64 | ✅ 100% | ✅ **DONE** Phase 3 |
| 6 | Sports | ✅ ~250+ | ✅ 105 | ✅ 100% | ✅ **DONE** Phase 3 |
| 7 | Pets | ✅ ~300+ | ✅ 93 | ✅ 100% | ✅ **DONE** Phase 3 |
| 8 | Kids | ✅ ~180+ | ✅ 83 | ✅ 100% | ✅ **DONE** Phase 3 |
| 9 | Tools & Industrial | ⏳ | ⏳ | ⏳ | 🔄 Phase 4 |
| 10 | Health & Wellness | ⏳ | ⏳ | ⏳ | 🔄 Phase 4 |
| 11 | Hobbies | ⏳ | ⏳ | ⏳ | 🔄 Phase 4 |
| 12 | Grocery & Food | ⏳ | ⏳ | ⏳ | 🔄 Phase 4 |
| 13 | Jewelry & Watches | ⏳ | ⏳ | ⏳ | 🔄 Phase 4 |
| 14 | **Home & Kitchen** | ✅ 596 | ✅ 5,035 | ✅ | ✅ **DONE** |
| 15 | Software | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 16 | Real Estate | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 17 | Jobs | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 18 | Services & Events | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 19 | Books | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 20 | E-Mobility | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 21 | Collectibles | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 22 | Bulgarian Traditional | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 23 | Movies & Music | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |
| 24 | Wholesale | ⏳ | ⏳ | ⏳ | 🔄 Phase 5 |

---

## 📋 ATTRIBUTE TEMPLATES (Reference)

### Universal Attributes (All L0s)
| Attribute | Type | Options |
|-----------|------|---------|
| Condition | select | New, Like New, Very Good, Good, Acceptable, For Parts |
| Brand | text/select | Category-specific brands |
| Warranty | select | No Warranty, 1 Month, 3 Months, 6 Months, 1 Year, 2+ Years |
| Ships From | select | Bulgaria, EU, Worldwide |

### Electronics Attributes
| Attribute | Type | Options |
|-----------|------|---------|
| Storage | select | 32GB, 64GB, 128GB, 256GB, 512GB, 1TB, 2TB |
| RAM | select | 4GB, 6GB, 8GB, 12GB, 16GB, 32GB, 64GB |
| Screen Size | select | Ranges by product type |
| Network | select | 5G, 4G LTE, 3G Only |
| Processor | select | Intel Core i3/i5/i7/i9, AMD Ryzen 3/5/7/9, Apple M1/M2/M3/M4 |

### Fashion Attributes
| Attribute | Type | Options |
|-----------|------|---------|
| Size | select | XS, S, M, L, XL, XXL, XXXL (or EU/US sizes) |
| Color | select | 30+ color options |
| Material | select | Cotton, Polyester, Wool, Silk, Leather, etc. |
| Style | select | Casual, Formal, Sport, Vintage, Bohemian |
| Fit | select | Slim, Regular, Relaxed, Oversized |

### Gaming Attributes
| Attribute | Type | Options |
|-----------|------|---------|
| Platform | select | PC, PS5, PS4, Xbox Series X/S, Nintendo Switch, Multi-Platform |
| Connection | select | Wired, Wireless 2.4GHz, Bluetooth, Triple Mode |
| Refresh Rate | select | 60Hz, 144Hz, 165Hz, 240Hz, 360Hz |
| Resolution | select | 1080p, 1440p, 4K |

### Automotive Attributes  
| Attribute | Type | Options |
|-----------|------|---------|
| Make | select | 50+ car brands |
| Year | range | 1990-2025 |
| Compatibility | select | OEM, Aftermarket, Universal |
| Part Condition | select | New, Refurbished, Used |

### Pets Attributes
| Attribute | Type | Options |
|-----------|------|---------|
| Pet Type | select | Dog, Cat, Bird, Fish, Small Animal, Reptile |
| Pet Size | select | Extra Small, Small, Medium, Large, Extra Large, Giant |
| Life Stage | select | Puppy/Kitten, Adult, Senior |
| Special Diet | multiselect | Grain-Free, Limited Ingredient, Weight Management |

---

## 🚀 QUICK COMMANDS

### Find L3 consistency by L0
```sql
WITH RECURSIVE tree AS (
  SELECT id, name, slug, parent_id, 0 as level, id as root_id, name as root_name
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.slug, c.parent_id, t.level + 1, t.root_id, t.root_name
  FROM categories c JOIN tree t ON c.parent_id = t.id
),
l2_cats AS (
  SELECT root_name, id FROM tree WHERE level = 2
),
l3_counts AS (
  SELECT l2.root_name, l2.id as l2_id, COUNT(c.id) as l3_count
  FROM l2_cats l2
  LEFT JOIN categories c ON c.parent_id = l2.id
  GROUP BY l2.root_name, l2.id
)
SELECT 
  root_name as "L0 Category",
  COUNT(*) as "Total L2",
  SUM(CASE WHEN l3_count > 0 THEN 1 ELSE 0 END) as "L2 with L3",
  ROUND(100.0 * SUM(CASE WHEN l3_count > 0 THEN 1 ELSE 0 END) / COUNT(*), 1) || '%' as "Consistency"
FROM l3_counts
GROUP BY root_name
ORDER BY "Consistency" DESC;
```

### Add L3 categories batch template
```sql
-- Template: Add L3 subcategories under an L2 parent
INSERT INTO categories (name, slug, parent_id, name_bg, icon)
SELECT 
  unnest(ARRAY['Category 1', 'Category 2', 'Category 3']),
  unnest(ARRAY['cat-1-slug', 'cat-2-slug', 'cat-3-slug']),
  (SELECT id FROM categories WHERE slug = 'PARENT_L2_SLUG'),
  unnest(ARRAY['Категория 1', 'Категория 2', 'Категория 3']),
  '📦'
ON CONFLICT (slug) DO NOTHING;
```

### Add attributes batch template
```sql
-- Template: Add attributes to a category
INSERT INTO category_attributes (category_id, name, name_bg, attribute_type, is_required, is_filterable, options, options_bg, sort_order)
SELECT 
  (SELECT id FROM categories WHERE slug = 'TARGET_CATEGORY_SLUG'),
  a.name, a.name_bg, a.attr_type, a.required, true, a.options::jsonb, a.options_bg::jsonb, a.sort_order
FROM (VALUES
  ('Attribute 1', 'Атрибут 1', 'select', true, '["Option 1","Option 2"]', '["Опция 1","Опция 2"]', 1),
  ('Attribute 2', 'Атрибут 2', 'select', false, '["A","B","C"]', '["А","Б","В"]', 2)
) AS a(name, name_bg, attr_type, required, options, options_bg, sort_order)
ON CONFLICT DO NOTHING;
```

### Find categories without attributes
```sql
WITH RECURSIVE tree AS (
  SELECT id, name, slug, 0 as level FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.slug, t.level + 1 FROM categories c JOIN tree t ON c.parent_id = t.id
)
SELECT t.level, t.name, t.slug 
FROM tree t
LEFT JOIN category_attributes ca ON t.id = ca.category_id
WHERE t.level IN (1, 2, 3) -- L1, L2, L3
GROUP BY t.level, t.id, t.name, t.slug
HAVING COUNT(ca.id) = 0
ORDER BY t.level, t.name
LIMIT 100;
```

### Verify phase completion
```sql
-- Check L3 coverage for specific L0
WITH RECURSIVE tree AS (
  SELECT id, name, slug, parent_id, 0 as level
  FROM categories WHERE slug = 'TARGET_L0_SLUG' -- e.g., 'electronics'
  UNION ALL
  SELECT c.id, c.name, c.slug, c.parent_id, t.level + 1
  FROM categories c JOIN tree t ON c.parent_id = t.id
),
l2_with_l3 AS (
  SELECT 
    t.id,
    t.name,
    EXISTS (SELECT 1 FROM categories c WHERE c.parent_id = t.id) as has_children
  FROM tree t
  WHERE t.level = 2
)
SELECT 
  SUM(CASE WHEN has_children THEN 1 ELSE 0 END) as "L2 with L3",
  COUNT(*) as "Total L2",
  ROUND(100.0 * SUM(CASE WHEN has_children THEN 1 ELSE 0 END) / COUNT(*), 1) as "Consistency %"
FROM l2_with_l3;
```

---

## 📚 REFERENCE FILES

| File | Purpose |
|------|---------|
| `SUPABASE_CATEGORIES_FULL.md` | Complete L0→L3 hierarchy for all 24 categories with attribute definitions |
| `supabase/schema.sql` | Production database schema |
| `app/api/categories/[slug]/attributes/route.ts` | Attribute API (supports inheritance) |
| `components/attribute-filters.tsx` | Filter UI component |

---

## 🔗 QUICK LINKS

- [Supabase Dashboard](https://supabase.com/dashboard/project/dhtzybnkvpimmomzwrce)
- [SQL Editor](https://supabase.com/dashboard/project/dhtzybnkvpimmomzwrce/editor)
- [Categories Table](https://supabase.com/dashboard/project/dhtzybnkvpimmomzwrce/editor/29219)
- [Attributes Table](https://supabase.com/dashboard/project/dhtzybnkvpimmomzwrce/editor/29220)
