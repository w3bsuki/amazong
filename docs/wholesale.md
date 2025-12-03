````markdown
# 📦 Wholesale & Bulk | Търговия на едро

**Category Slug:** `wholesale`  
**Icon:** 📦  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Wholesale → Electronics → Consumer Electronics |
| **Attributes** | Filtering, Search, Campaigns | MOQ, Price per Unit, Lot Size, Condition |
| **Tags** | Dynamic Collections & SEO | "liquidation", "overstock", "returns" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
📦 Wholesale & Bulk (L0)
│
├── 📱 Electronics Wholesale (L1)
│   ├── Consumer Electronics (L2)
│   ├── Computer Hardware (L2)
│   ├── Mobile Devices (L2)
│   ├── Gaming Equipment (L2)
│   ├── Audio & Video (L2)
│   ├── Smart Home Devices (L2)
│   └── Electronic Components (L2)
│
├── 👗 Fashion & Apparel (L1)
│   ├── Women's Clothing (L2)
│   ├── Men's Clothing (L2)
│   ├── Children's Clothing (L2)
│   ├── Footwear (L2)
│   ├── Accessories & Jewelry (L2)
│   ├── Bags & Luggage (L2)
│   └── Textiles & Fabrics (L2)
│
├── 🏠 Home & Living (L1)
│   ├── Furniture (L2)
│   ├── Home Decor (L2)
│   ├── Kitchen & Dining (L2)
│   ├── Bedding & Bath (L2)
│   ├── Storage & Organization (L2)
│   └── Garden & Outdoor (L2)
│
├── 🍎 Food & Beverages (L1)
│   ├── Packaged Foods (L2)
│   ├── Beverages (L2)
│   ├── Snacks & Confectionery (L2)
│   ├── Health Foods (L2)
│   ├── Ingredients & Supplies (L2)
│   └── Restaurant Supplies (L2)
│
├── 💄 Beauty & Personal Care (L1)
│   ├── Cosmetics (L2)
│   ├── Skincare (L2)
│   ├── Haircare (L2)
│   ├── Fragrances (L2)
│   ├── Personal Hygiene (L2)
│   └── Salon Supplies (L2)
│
├── 🏥 Health & Medical (L1)
│   ├── Medical Supplies (L2)
│   ├── PPE & Safety (L2)
│   ├── Pharmacy Supplies (L2)
│   ├── Supplements (L2)
│   ├── Dental Supplies (L2)
│   └── Laboratory Equipment (L2)
│
├── 🧸 Toys & Hobbies (L1)
│   ├── Toys & Games (L2)
│   ├── Arts & Crafts (L2)
│   ├── Party Supplies (L2)
│   ├── Sporting Goods (L2)
│   ├── Outdoor Recreation (L2)
│   └── Musical Instruments (L2)
│
├── 🏭 Industrial & Tools (L1)
│   ├── Hand Tools (L2)
│   ├── Power Tools (L2)
│   ├── Safety Equipment (L2)
│   ├── Industrial Supplies (L2)
│   ├── Electrical Equipment (L2)
│   └── Construction Materials (L2)
│
├── 🚗 Automotive (L1)
│   ├── Auto Parts (L2)
│   ├── Car Accessories (L2)
│   ├── Tires & Wheels (L2)
│   ├── Oils & Fluids (L2)
│   ├── Tools & Equipment (L2)
│   └── Detailing Supplies (L2)
│
├── 📚 Office & School (L1)
│   ├── Office Supplies (L2)
│   ├── School Supplies (L2)
│   ├── Office Furniture (L2)
│   ├── Printers & Ink (L2)
│   └── Packaging Materials (L2)
│
├── 🔄 Liquidation & Returns (L1)
│   ├── Amazon Returns (L2)
│   ├── eBay Returns (L2)
│   ├── Store Returns (L2)
│   ├── Overstock (L2)
│   ├── Shelf Pulls (L2)
│   └── Mixed Pallets (L2)
│
└── 🎁 Mixed Categories (L1)
    ├── Mystery Boxes (L2)
    ├── Assorted Lots (L2)
    ├── Seasonal Closeouts (L2)
    ├── Brand Liquidation (L2)
    └── Wholesale Bundles (L2)
```

**Total Categories: 1 (L0) + 12 (L1) + 67 (L2) = 80 categories**

---

## 📊 Complete Category Reference

### L1: 📱 ELECTRONICS WHOLESALE

#### L2: Consumer Electronics | Потребителска електроника
**Slug:** `electronics-wholesale/consumer`  
**Description:** Bulk consumer electronics including TVs, cameras, audio equipment.

**Product Types (Attribute, not subcategory):**
- TVs & Monitors | Телевизори и монитори
- Cameras & Photography | Камери и фотография
- Audio Equipment | Аудио оборудване
- Home Theater | Домашно кино
- Wearables | Носими устройства
- Drones | Дронове

---

#### L2: Computer Hardware | Компютърен хардуер
**Slug:** `electronics-wholesale/computers`

- Laptops | Лаптопи
- Desktop PCs | Настолни компютри
- Components | Компоненти
- Peripherals | Периферни устройства
- Networking | Мрежово оборудване
- Storage | Съхранение

---

#### L2: Mobile Devices | Мобилни устройства
**Slug:** `electronics-wholesale/mobile`

- Smartphones | Смартфони
- Tablets | Таблети
- Accessories | Аксесоари
- Cases & Covers | Калъфи
- Chargers & Cables | Зарядни и кабели
- Screen Protectors | Протектори за екран

---

### L1: 👗 FASHION & APPAREL

#### L2: Women's Clothing | Дамски дрехи
**Slug:** `fashion-wholesale/womens`

**Garment Types:**
- Dresses | Рокли
- Tops & Blouses | Блузи
- Pants & Jeans | Панталони и дънки
- Skirts | Поли
- Outerwear | Горни дрехи
- Activewear | Спортни дрехи
- Swimwear | Бански

---

#### L2: Footwear | Обувки
**Slug:** `fashion-wholesale/footwear`

- Women's Shoes | Дамски обувки
- Men's Shoes | Мъжки обувки
- Children's Shoes | Детски обувки
- Athletic Shoes | Спортни обувки
- Sandals & Slippers | Сандали и чехли
- Boots | Ботуши

---

### L1: 🏠 HOME & LIVING

#### L2: Furniture | Мебели
**Slug:** `home-wholesale/furniture`

- Living Room | Хол
- Bedroom | Спалня
- Office Furniture | Офис мебели
- Outdoor Furniture | Градински мебели
- Storage Furniture | Мебели за съхранение

---

#### L2: Kitchen & Dining | Кухня и трапезария
**Slug:** `home-wholesale/kitchen`

- Cookware | Готварски съдове
- Appliances | Уреди
- Utensils | Прибори
- Dinnerware | Съдове за хранене
- Food Storage | Съхранение на храна
- Bakeware | Форми за печене

---

### L1: 🍎 FOOD & BEVERAGES

#### L2: Packaged Foods | Пакетирани храни
**Slug:** `food-wholesale/packaged`

**Categories:**
- Canned Goods | Консерви
- Dried Foods | Сушени храни
- Frozen Foods | Замразени храни
- Ready Meals | Готови ястия
- Condiments | Подправки
- Organic Foods | Био храни

---

#### L2: Beverages | Напитки
**Slug:** `food-wholesale/beverages`

- Soft Drinks | Безалкохолни
- Water | Вода
- Juices | Сокове
- Energy Drinks | Енергийни напитки
- Coffee & Tea | Кафе и чай
- Alcoholic (B2B only) | Алкохолни (само B2B)

---

### L1: 💄 BEAUTY & PERSONAL CARE

#### L2: Cosmetics | Козметика
**Slug:** `beauty-wholesale/cosmetics`

- Makeup | Грим
- Nail Care | Маникюр
- Lipsticks | Червила
- Foundations | Фон дьо тен
- Eye Makeup | Грим за очи
- Brushes & Tools | Четки и инструменти

---

### L1: 🏥 HEALTH & MEDICAL

#### L2: PPE & Safety | ЛПС и безопасност
**Slug:** `health-wholesale/ppe`

- Face Masks | Маски за лице
- Gloves | Ръкавици
- Protective Clothing | Защитно облекло
- Eye Protection | Защита за очи
- Sanitizers | Дезинфектанти
- First Aid | Първа помощ

---

### L1: 🔄 LIQUIDATION & RETURNS

#### L2: Amazon Returns | Amazon връщания
**Slug:** `liquidation/amazon-returns`

**Condition Types:**
- Like New | Като нови
- Open Box | Отворена кутия
- Used - Very Good | Използвани - много добри
- Used - Good | Използвани - добри
- Damaged Packaging | Повредена опаковка
- Tested Returns | Тествани връщания

---

#### L2: Overstock | Свръхзапаси
**Slug:** `liquidation/overstock`

- Department Store Overstock | Свръхзапаси от магазини
- Seasonal Overstock | Сезонни свръхзапаси
- Discontinued Products | Спрени от производство
- End of Line | Край на серия

---

#### L2: Mixed Pallets | Смесени палети
**Slug:** `liquidation/mixed-pallets`

- Electronics Pallets | Палети електроника
- Apparel Pallets | Палети дрехи
- Home Goods Pallets | Палети домакинство
- Mixed Category Pallets | Смесени категории
- Customer Returns Pallets | Палети върнати стоки

---

### L1: 🎁 MIXED CATEGORIES

#### L2: Mystery Boxes | Мистериозни кутии
**Slug:** `mixed/mystery-boxes`

**Box Types:**
- Electronics Mystery | Мистерия електроника
- Fashion Mystery | Мистерия мода
- Toys Mystery | Мистерия играчки
- Mixed Mystery | Смесена мистерия
- Premium Mystery | Премиум мистерия

---

---

## 🏷️ Attribute System (The Power Layer)

### Wholesale Product Attributes Schema

```typescript
interface WholesaleProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "electronics-wholesale/mobile"
  
  // === BASIC INFO ===
  title: string;                 // "iPhone Cases Lot - 500 Units Mixed"
  description: string;
  
  // === PRICING ===
  lot_price: number;             // Total lot price
  price_per_unit: number;        // Calculated price per unit
  currency: 'BGN' | 'EUR' | 'USD';
  negotiable: boolean;
  
  // === QUANTITY ===
  quantity_available: number;    // 500 units
  moq: number;                   // Minimum Order Quantity
  units_per_lot: number;         // Units in this lot
  
  // === LOT DETAILS ===
  lot_type: LotType;
  manifest_available: boolean;   // Detailed inventory list
  manifest_link?: string;
  
  // === CONDITION ===
  condition: WholesaleCondition;
  condition_breakdown?: {        // % of each condition
    new: number;
    like_new: number;
    used_good: number;
    damaged: number;
  };
  
  // === SOURCE ===
  source_type: SourceType;
  source_company?: string;       // "Amazon", "eBay", etc.
  
  // === PRODUCT INFO ===
  brand?: string;                // "Apple", "Samsung", or "Mixed"
  brand_type: 'single' | 'mixed';
  product_types: string[];       // ["Cases", "Chargers", "Cables"]
  
  // === RETAIL VALUE ===
  estimated_retail_value?: number;
  retail_value_source?: string;
  
  // === SHIPPING ===
  shipping_type: ShippingType;
  pallet_count?: number;
  weight_kg?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // === LOCATION ===
  warehouse_location: string;    // City or region
  pickup_available: boolean;
  delivery_available: boolean;
  
  // === SELLER INFO ===
  seller_type: 'private' | 'business' | 'liquidator' | 'distributor';
  seller_verified: boolean;
  business_license?: boolean;
  location_city: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];                // ["liquidation", "overstock", "new-stock"]
}

// === ENUMS ===

type LotType = 
  | 'pallet' | 'truckload' | 'container' 
  | 'case' | 'box' | 'unit_lot';

type WholesaleCondition = 
  | 'new_sealed' | 'new_open_box' | 'refurbished' 
  | 'customer_returns' | 'shelf_pulls' | 'salvage' 
  | 'mixed_condition' | 'as_is';

type SourceType = 
  | 'amazon_returns' | 'ebay_returns' | 'store_returns' 
  | 'overstock' | 'liquidation' | 'manufacturer' 
  | 'distributor' | 'closeout' | 'bankruptcy';

type ShippingType = 
  | 'pallet' | 'freight' | 'ltl' | 'ftl' 
  | 'parcel' | 'pickup_only';
```

### Liquidation Pallet Attributes Schema

```typescript
interface LiquidationPallet {
  id: string;
  category_id: string;
  
  title: string;                 // "Amazon Returns Pallet - Electronics"
  description: string;
  lot_price: number;
  
  // === PALLET INFO ===
  pallet_type: PalletType;
  pallet_count: number;
  
  // === CONTENTS ===
  category_focus: string;        // "Electronics", "Mixed"
  item_count: number;            // Total items on pallet
  sku_count?: number;            // Unique SKUs
  
  // === CONDITION ===
  condition_type: PalletCondition;
  tested: boolean;
  manifest_available: boolean;
  
  // === VALUE ===
  estimated_retail_value: number;
  avg_retail_per_item: number;
  
  // === SOURCE ===
  source_company: string;        // "Amazon", "Target", "Walmart"
  source_type: SourceType;
  
  // === LOGISTICS ===
  weight_kg: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  warehouse_location: string;
  
  seller_type: 'liquidator' | 'business';
  
  images: string[];
}

type PalletType = 'standard' | 'oversized' | 'gaylord' | 'tote';
type PalletCondition = 'uninspected' | 'inspected' | 'tested' | 'manifested';
```

### B2B Food/Beverage Attributes Schema

```typescript
interface FoodWholesaleProduct {
  id: string;
  category_id: string;
  
  title: string;                 // "Coca-Cola 330ml x 24 - 100 Cases"
  description: string;
  lot_price: number;
  price_per_case: number;
  
  // === PRODUCT INFO ===
  brand: string;
  product_name: string;
  unit_size: string;             // "330ml"
  units_per_case: number;        // 24
  cases_available: number;       // 100
  
  // === DATES ===
  expiration_date: string;
  days_to_expiry: number;
  production_date?: string;
  
  // === STORAGE ===
  storage_requirements: StorageType;
  temperature_range?: string;
  
  // === CERTIFICATIONS ===
  certifications: string[];      // ["Halal", "Kosher", "Organic"]
  country_of_origin: string;
  
  // === LICENSING ===
  requires_food_license: boolean;
  alcohol_content?: number;      // If applicable
  
  moq: number;
  
  seller_type: 'distributor' | 'business';
  location_city: string;
  
  images: string[];
}

type StorageType = 'ambient' | 'refrigerated' | 'frozen' | 'controlled';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "Amazon Returns - Under 1000 лв"
SELECT * FROM products 
WHERE category LIKE 'wholesale/liquidation/%'
AND attributes->>'source_company' = 'Amazon'
AND lot_price <= 1000;

-- 🏷️ "Electronics Pallets"
SELECT * FROM products 
WHERE category LIKE 'wholesale/liquidation/%'
AND attributes->>'category_focus' = 'Electronics';

-- 🏷️ "New Stock Only"
SELECT * FROM products 
WHERE category LIKE 'wholesale/%'
AND attributes->>'condition' = 'new_sealed';

-- 🏷️ "Sofia Pickup Available"
SELECT * FROM products 
WHERE category LIKE 'wholesale/%'
AND attributes->>'pickup_available' = 'true'
AND attributes->>'warehouse_location' = 'Sofia';

-- 🏷️ "MOQ Under 50 Units"
SELECT * FROM products 
WHERE category LIKE 'wholesale/%'
AND (attributes->>'moq')::int <= 50;

-- 🏷️ "High Value Lots (>5000 лв retail)"
SELECT * FROM products 
WHERE category LIKE 'wholesale/%'
AND (attributes->>'estimated_retail_value')::numeric > 5000;

-- 🏷️ "Manifested Pallets"
SELECT * FROM products 
WHERE category LIKE 'wholesale/liquidation/%'
AND attributes->>'manifest_available' = 'true';

-- 🏷️ "Food Near Expiry Deals"
SELECT * FROM products 
WHERE category LIKE 'wholesale/food-wholesale/%'
AND (attributes->>'days_to_expiry')::int <= 30;
```

### Search Filter Configuration

```typescript
const wholesaleFilters = {
  // Price
  lot_price: { type: 'range', min: 0, max: 50000, step: 100 },
  price_per_unit: { type: 'range', min: 0, max: 500 },
  
  // Quantity
  quantity_available: { type: 'range', min: 1, max: 10000 },
  moq: { type: 'range', min: 1, max: 1000 },
  
  // Condition
  condition: { type: 'multi-select', options: wholesaleConditions },
  
  // Source
  source_type: { type: 'multi-select', options: sourceTypes },
  source_company: { type: 'searchable-select', options: ['Amazon', 'eBay', 'Target', 'Walmart'] },
  
  // Lot Type
  lot_type: { type: 'multi-select', options: ['pallet', 'box', 'case', 'truckload'] },
  
  // Features
  manifest_available: { type: 'checkbox' },
  pickup_available: { type: 'checkbox' },
  
  // Location
  warehouse_location: { type: 'searchable-select', options: cities },
  
  // Seller
  seller_type: { type: 'radio', options: ['all', 'business', 'liquidator', 'distributor'] },
};

const liquidationFilters = {
  lot_price: { type: 'range', min: 0, max: 20000 },
  
  estimated_retail_value: { type: 'range', min: 0, max: 100000 },
  
  pallet_count: { type: 'range', min: 1, max: 52 },
  
  condition_type: { type: 'multi-select', options: palletConditions },
  
  tested: { type: 'checkbox' },
  manifest_available: { type: 'checkbox' },
  
  source_company: { type: 'multi-select', options: majorRetailers },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('wholesale', 'Wholesale & Bulk', 'Търговия на едро', 'wholesale', 'wholesale', NULL, 0, '📦', 40, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('ws-electronics', 'Electronics Wholesale', 'Електроника на едро', 'electronics-wholesale', 'wholesale/electronics-wholesale', 'wholesale', 1, '📱', 1, true),
('ws-fashion', 'Fashion & Apparel', 'Мода и облекло', 'fashion-wholesale', 'wholesale/fashion-wholesale', 'wholesale', 1, '👗', 2, true),
('ws-home', 'Home & Living', 'Дом и бит', 'home-wholesale', 'wholesale/home-wholesale', 'wholesale', 1, '🏠', 3, true),
('ws-food', 'Food & Beverages', 'Храни и напитки', 'food-wholesale', 'wholesale/food-wholesale', 'wholesale', 1, '🍎', 4, true),
('ws-beauty', 'Beauty & Personal Care', 'Красота и грижа', 'beauty-wholesale', 'wholesale/beauty-wholesale', 'wholesale', 1, '💄', 5, true),
('ws-health', 'Health & Medical', 'Здраве и медицина', 'health-wholesale', 'wholesale/health-wholesale', 'wholesale', 1, '🏥', 6, true),
('ws-toys', 'Toys & Hobbies', 'Играчки и хобита', 'toys-wholesale', 'wholesale/toys-wholesale', 'wholesale', 1, '🧸', 7, true),
('ws-industrial', 'Industrial & Tools', 'Индустрия и инструменти', 'industrial-wholesale', 'wholesale/industrial-wholesale', 'wholesale', 1, '🏭', 8, true),
('ws-auto', 'Automotive', 'Автомобилни', 'auto-wholesale', 'wholesale/auto-wholesale', 'wholesale', 1, '🚗', 9, true),
('ws-office', 'Office & School', 'Офис и училище', 'office-wholesale', 'wholesale/office-wholesale', 'wholesale', 1, '📚', 10, true),
('ws-liquidation', 'Liquidation & Returns', 'Ликвидация и връщания', 'liquidation', 'wholesale/liquidation', 'wholesale', 1, '🔄', 11, true),
('ws-mixed', 'Mixed Categories', 'Смесени категории', 'mixed', 'wholesale/mixed', 'wholesale', 1, '🎁', 12, true);

-- L2: Electronics Wholesale
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('elec-consumer', 'Consumer Electronics', 'Потребителска електроника', 'consumer', 'electronics-wholesale/consumer', 'ws-electronics', 2, '📺', 1, true),
('elec-computers', 'Computer Hardware', 'Компютърен хардуер', 'computers', 'electronics-wholesale/computers', 'ws-electronics', 2, '💻', 2, true),
('elec-mobile', 'Mobile Devices', 'Мобилни устройства', 'mobile', 'electronics-wholesale/mobile', 'ws-electronics', 2, '📱', 3, true),
('elec-gaming', 'Gaming Equipment', 'Гейминг оборудване', 'gaming', 'electronics-wholesale/gaming', 'ws-electronics', 2, '🎮', 4, true),
('elec-av', 'Audio & Video', 'Аудио и видео', 'audio-video', 'electronics-wholesale/audio-video', 'ws-electronics', 2, '🔊', 5, true),
('elec-smarthome', 'Smart Home Devices', 'Смарт устройства', 'smart-home', 'electronics-wholesale/smart-home', 'ws-electronics', 2, '🏠', 6, true),
('elec-components', 'Electronic Components', 'Електронни компоненти', 'components', 'electronics-wholesale/components', 'ws-electronics', 2, '🔌', 7, true);

-- L2: Fashion Wholesale
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fash-womens', 'Women''s Clothing', 'Дамски дрехи', 'womens', 'fashion-wholesale/womens', 'ws-fashion', 2, '👗', 1, true),
('fash-mens', 'Men''s Clothing', 'Мъжки дрехи', 'mens', 'fashion-wholesale/mens', 'ws-fashion', 2, '👔', 2, true),
('fash-kids', 'Children''s Clothing', 'Детски дрехи', 'kids', 'fashion-wholesale/kids', 'ws-fashion', 2, '👶', 3, true),
('fash-footwear', 'Footwear', 'Обувки', 'footwear', 'fashion-wholesale/footwear', 'ws-fashion', 2, '👟', 4, true),
('fash-accessories', 'Accessories & Jewelry', 'Аксесоари и бижута', 'accessories', 'fashion-wholesale/accessories', 'ws-fashion', 2, '💍', 5, true),
('fash-bags', 'Bags & Luggage', 'Чанти и багаж', 'bags', 'fashion-wholesale/bags', 'ws-fashion', 2, '👜', 6, true),
('fash-textiles', 'Textiles & Fabrics', 'Текстил и платове', 'textiles', 'fashion-wholesale/textiles', 'ws-fashion', 2, '🧵', 7, true);

-- L2: Liquidation & Returns
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('liq-amazon', 'Amazon Returns', 'Amazon връщания', 'amazon-returns', 'liquidation/amazon-returns', 'ws-liquidation', 2, '📦', 1, true),
('liq-ebay', 'eBay Returns', 'eBay връщания', 'ebay-returns', 'liquidation/ebay-returns', 'ws-liquidation', 2, '🛒', 2, true),
('liq-store', 'Store Returns', 'Връщания от магазини', 'store-returns', 'liquidation/store-returns', 'ws-liquidation', 2, '🏪', 3, true),
('liq-overstock', 'Overstock', 'Свръхзапаси', 'overstock', 'liquidation/overstock', 'ws-liquidation', 2, '📈', 4, true),
('liq-shelf', 'Shelf Pulls', 'От рафтове', 'shelf-pulls', 'liquidation/shelf-pulls', 'ws-liquidation', 2, '🗄️', 5, true),
('liq-pallets', 'Mixed Pallets', 'Смесени палети', 'mixed-pallets', 'liquidation/mixed-pallets', 'ws-liquidation', 2, '🎲', 6, true);

-- L2: Mixed Categories
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('mix-mystery', 'Mystery Boxes', 'Мистериозни кутии', 'mystery-boxes', 'mixed/mystery-boxes', 'ws-mixed', 2, '❓', 1, true),
('mix-assorted', 'Assorted Lots', 'Асортирани лотове', 'assorted', 'mixed/assorted', 'ws-mixed', 2, '🎁', 2, true),
('mix-seasonal', 'Seasonal Closeouts', 'Сезонни разпродажби', 'seasonal', 'mixed/seasonal', 'ws-mixed', 2, '🍂', 3, true),
('mix-brand', 'Brand Liquidation', 'Ликвидация на марки', 'brand-liquidation', 'mixed/brand-liquidation', 'ws-mixed', 2, '🏷️', 4, true),
('mix-bundles', 'Wholesale Bundles', 'Пакети на едро', 'bundles', 'mixed/bundles', 'ws-mixed', 2, '📦', 5, true);
```

### Wholesale Source Reference Data

```sql
-- Major Retailers for Liquidation
INSERT INTO public.liquidation_sources (code, name, country, typical_conditions) VALUES
('amazon', 'Amazon', 'Global', ARRAY['customer_returns', 'overstock', 'damaged']),
('ebay', 'eBay', 'Global', ARRAY['customer_returns', 'refurbished']),
('target', 'Target', 'USA', ARRAY['overstock', 'shelf_pulls', 'customer_returns']),
('walmart', 'Walmart', 'USA', ARRAY['overstock', 'customer_returns']),
('costco', 'Costco', 'USA', ARRAY['overstock', 'customer_returns']),
('lidl', 'Lidl', 'EU', ARRAY['overstock', 'end_of_line']),
('kaufland', 'Kaufland', 'EU', ARRAY['overstock', 'end_of_line']);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Wholesale & Bulk | Търговия на едро |
| Electronics Wholesale | Електроника на едро |
| Fashion & Apparel | Мода и облекло |
| Home & Living | Дом и бит |
| Food & Beverages | Храни и напитки |
| Liquidation & Returns | Ликвидация и връщания |
| Mixed Pallets | Смесени палети |
| Overstock | Свръхзапаси |
| Mystery Boxes | Мистериозни кутии |

### Attribute Labels

| EN | BG |
|----|----|
| Lot Price | Цена на лот |
| Price Per Unit | Цена на бройка |
| Quantity Available | Налично количество |
| Minimum Order Quantity | Минимална поръчка |
| Condition | Състояние |
| Source | Източник |
| Manifest Available | Наличен манифест |
| Warehouse Location | Местоположение на склад |
| Pickup Available | Възможност за взимане |

### Condition Values

| EN | BG |
|----|----|
| New Sealed | Ново запечатано |
| New Open Box | Ново отворена кутия |
| Refurbished | Рефърбишд |
| Customer Returns | Клиентски връщания |
| Shelf Pulls | От рафтове |
| Salvage | Спасени |
| Mixed Condition | Смесено състояние |
| As Is | Както е |

### Lot Types

| EN | BG |
|----|----|
| Pallet | Палет |
| Truckload | Камион |
| Container | Контейнер |
| Case | Кашон |
| Box | Кутия |

---

## 🏢 B2B Features

### Business Verification
```typescript
interface B2BVerification {
  business_name: string;
  vat_number: string;           // Bulgarian VAT: BG + 9/10 digits
  company_registration: string;
  business_type: 'wholesale' | 'retail' | 'distributor' | 'manufacturer';
  verified: boolean;
  verification_date?: string;
}
```

### Bulk Pricing Tiers
```typescript
interface BulkPricing {
  tiers: PricingTier[];
}

interface PricingTier {
  min_quantity: number;
  max_quantity: number;
  price_per_unit: number;
  discount_percent: number;
}

// Example:
// 1-99 units: 10 лв/unit (0% discount)
// 100-499 units: 8 лв/unit (20% discount)
// 500+ units: 6 лв/unit (40% discount)
```

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add liquidation sources reference
- [ ] Add B2B verification table
- [ ] Test JSONB queries for bulk pricing
- [ ] Verify indexes for MOQ queries

### API
- [ ] GET /categories/wholesale (tree structure)
- [ ] GET /categories/wholesale/.../products
- [ ] POST /products (with B2B validation)
- [ ] GET /products/search (with filters)
- [ ] B2B verification endpoint

### Frontend
- [ ] Category browser component
- [ ] MOQ filter
- [ ] Condition filter
- [ ] Source filter (Amazon, eBay, etc.)
- [ ] Manifest viewer
- [ ] Bulk pricing calculator
- [ ] B2B badge display

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 80  
**Created:** December 3, 2025

````

