# 🏠 Home & Kitchen | Дом и Кухня

**Category Slug:** `home`  
**Icon:** 🏠  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Home → Furniture → Sofas |
| **Attributes** | Filtering, Search, Campaigns | Material, Color, Style, Size |
| **Tags** | Dynamic Collections & SEO | "modern", "vintage", "minimalist" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🏠 Home & Kitchen (L0)
│
├── 🛋️ Furniture (L1)
│   ├── Sofas & Couches (L2)
│   ├── Chairs & Armchairs (L2)
│   ├── Tables (L2)
│   ├── Beds & Mattresses (L2)
│   ├── Wardrobes & Storage (L2)
│   ├── Desks & Office Furniture (L2)
│   ├── Shelving & Bookcases (L2)
│   ├── TV Stands & Media (L2)
│   └── Outdoor Furniture (L2)
│
├── 🍳 Kitchen & Dining (L1)
│   ├── Cookware (L2)
│   ├── Bakeware (L2)
│   ├── Kitchen Appliances (L2)
│   ├── Dinnerware (L2)
│   ├── Glassware & Drinkware (L2)
│   ├── Cutlery & Utensils (L2)
│   ├── Food Storage (L2)
│   └── Kitchen Organization (L2)
│
├── 🛏️ Bedding & Bath (L1)
│   ├── Bedding Sets (L2)
│   ├── Sheets & Pillowcases (L2)
│   ├── Blankets & Throws (L2)
│   ├── Pillows & Cushions (L2)
│   ├── Towels (L2)
│   ├── Bathroom Accessories (L2)
│   └── Shower Curtains & Mats (L2)
│
├── 💡 Lighting (L1)
│   ├── Ceiling Lights (L2)
│   ├── Floor Lamps (L2)
│   ├── Table Lamps (L2)
│   ├── Wall Lights (L2)
│   ├── Outdoor Lighting (L2)
│   └── Smart Lighting (L2)
│
├── 🖼️ Home Décor (L1)
│   ├── Wall Art & Prints (L2)
│   ├── Mirrors (L2)
│   ├── Clocks (L2)
│   ├── Vases & Decorative Objects (L2)
│   ├── Candles & Holders (L2)
│   ├── Picture Frames (L2)
│   ├── Rugs & Carpets (L2)
│   └── Curtains & Blinds (L2)
│
└── 🧹 Household & Cleaning (L1)
    ├── Cleaning Supplies (L2)
    ├── Laundry & Ironing (L2)
    ├── Home Organization (L2)
    ├── Trash & Recycling (L2)
    └── Air Quality & Fresheners (L2)
```

**Total Categories: 1 (L0) + 6 (L1) + 43 (L2) = 50 categories**

---

## 📊 Complete Category Reference

### L1: 🛋️ FURNITURE

#### L2: Sofas & Couches | Дивани и Канапета
**Slug:** `furniture/sofas-couches`  
**Description:** Living room seating furniture.

**Types (Attribute, not subcategory):**

| EN | BG | Description |
|----|----|----|
| 2-Seater Sofa | Двуместен диван | 2 person |
| 3-Seater Sofa | Триместен диван | 3 person |
| Corner Sofa | Ъглов диван | L-shaped |
| Sectional Sofa | Секционен диван | Modular |
| Sofa Bed | Разтегателен диван | Sleeper |
| Loveseat | Канапе | Small 2-seater |
| Recliner Sofa | Диван с релакс | Reclining |
| Chesterfield | Честърфийлд | Classic tufted |

---

#### L2: Chairs & Armchairs | Столове и Кресла
**Slug:** `furniture/chairs-armchairs`

| EN | BG | Description |
|----|----|----|
| Armchair | Кресло | Single seat with arms |
| Dining Chair | Стол за хранене | Dining table |
| Office Chair | Офис стол | Desk work |
| Accent Chair | Акцентен стол | Decorative |
| Recliner | Релакс стол | Reclining |
| Rocking Chair | Люлеещ се стол | Rocking |
| Bean Bag | Пуф торба | Casual |
| Bar Stool | Бар стол | High seat |
| Gaming Chair | Геймърски стол | Gaming |

---

#### L2: Tables | Маси
**Slug:** `furniture/tables`

| EN | BG | Description |
|----|----|----|
| Coffee Table | Холна маса | Living room |
| Dining Table | Маса за хранене | Dining room |
| Side Table | Странична масичка | Accent |
| Console Table | Конзолна маса | Entry/hallway |
| Desk | Бюро | Office/study |
| Bedside Table | Нощно шкафче | Bedroom |
| Outdoor Table | Градинска маса | Outdoor |

---

#### L2: Beds & Mattresses | Легла и Матраци
**Slug:** `furniture/beds-mattresses`

| EN | BG | Description |
|----|----|----|
| Single Bed | Единично легло | 90cm |
| Double Bed | Двойно легло | 140cm |
| King Size Bed | Кралско легло | 180cm |
| Super King Bed | Супер кралско | 200cm |
| Bunk Bed | Двуетажно легло | Stacked |
| Loft Bed | Легло на етаж | Elevated |
| Sofa Bed | Разтегателен диван | Convertible |
| Kids Bed | Детско легло | Children |
| Mattress | Матрак | Mattress only |
| Bed Frame | Рамка за легло | Frame only |

---

#### L2: Wardrobes & Storage | Гардероби и Съхранение
**Slug:** `furniture/wardrobes-storage`

| EN | BG | Description |
|----|----|----|
| Wardrobe | Гардероб | Clothes storage |
| Chest of Drawers | Скрин | Drawer unit |
| Closet | Шкаф | General storage |
| Sideboard | Шкаф за трапезария | Dining storage |
| Shoe Cabinet | Шкаф за обувки | Shoe storage |
| Hallway Storage | Антре | Entry storage |
| Walk-in Closet | Гардеробна | Large closet |

---

#### L2: Desks & Office Furniture | Бюра и Офис мебели
**Slug:** `furniture/desks-office`

- Computer Desk | Компютърно бюро
- Writing Desk | Писалищно бюро
- Standing Desk | Бюро за работа прав
- Executive Desk | Директорско бюро
- Filing Cabinet | Картотека
- Office Chair | Офис стол
- Bookcase | Библиотека

---

#### L2: Shelving & Bookcases | Рафтове и Етажерки
**Slug:** `furniture/shelving-bookcases`

- Wall Shelves | Стенни рафтове
- Bookcases | Библиотеки
- Storage Units | Шкафове за съхранение
- Floating Shelves | Плаващи рафтове
- Cube Storage | Кубични рафтове
- Display Cabinets | Витрини

---

#### L2: TV Stands & Media | ТВ шкафове
**Slug:** `furniture/tv-stands`

- TV Stand | ТВ шкаф
- Media Console | Медиен шкаф
- Entertainment Center | Развлекателен център
- TV Mount | ТВ стойка
- Floating TV Unit | Плаващ ТВ шкаф

---

#### L2: Outdoor Furniture | Градински мебели
**Slug:** `furniture/outdoor`

- Garden Sofa | Градински диван
- Outdoor Dining Set | Градинска трапезария
- Lounger | Шезлонг
- Hammock | Хамак
- Garden Bench | Градинска пейка
- Parasol | Чадър
- Swing | Люлка

---

### L1: 🍳 KITCHEN & DINING

#### L2: Cookware | Съдове за готвене
**Slug:** `kitchen/cookware`

- Pots | Тенджери
- Pans | Тигани
- Frying Pans | Тигани за пържене
- Woks | Уокове
- Saucepans | Касероли
- Stockpots | Дълбоки тенджери
- Grill Pans | Грил тигани
- Cookware Sets | Комплекти съдове

---

#### L2: Bakeware | Съдове за печене
**Slug:** `kitchen/bakeware`

- Baking Trays | Тави за печене
- Cake Pans | Форми за торта
- Muffin Tins | Форми за мъфини
- Bread Pans | Форми за хляб
- Baking Sheets | Листове за печене
- Pie Dishes | Форми за пай
- Roasting Pans | Тави за печене

---

#### L2: Kitchen Appliances | Кухненски уреди
**Slug:** `kitchen/appliances`

- Blenders | Блендери
- Coffee Makers | Кафемашини
- Toasters | Тостери
- Kettles | Кани
- Mixers | Миксери
- Food Processors | Кухненски робот
- Air Fryers | Еър фрайъри
- Microwaves | Микровълнови

---

#### L2: Dinnerware | Сервизи за хранене
**Slug:** `kitchen/dinnerware`

- Plates | Чинии
- Bowls | Купи
- Dinnerware Sets | Сервизи
- Serving Dishes | Блюда
- Charger Plates | Подчинийници
- Soup Plates | Супени чинии

---

#### L2: Glassware & Drinkware | Стъклария и Чаши
**Slug:** `kitchen/glassware`

- Wine Glasses | Чаши за вино
- Beer Glasses | Халби
- Tumblers | Чаши
- Mugs | Чаши
- Water Bottles | Бутилки за вода
- Carafes | Гарафи
- Glassware Sets | Комплекти чаши

---

#### L2: Cutlery & Utensils | Прибори и Аксесоари
**Slug:** `kitchen/cutlery-utensils`

- Cutlery Sets | Комплекти прибори
- Knives | Ножове
- Kitchen Tools | Кухненски инструменти
- Ladles & Spoons | Черпаци
- Spatulas | Шпатули
- Tongs | Щипци
- Chopping Boards | Дъски за рязане

---

#### L2: Food Storage | Съхранение на храна
**Slug:** `kitchen/food-storage`

- Food Containers | Кутии за храна
- Jars | Буркани
- Vacuum Containers | Вакуум контейнери
- Bread Bins | Кутии за хляб
- Spice Racks | Поставки за подправки
- Bag Clips | Щипки за торби

---

#### L2: Kitchen Organization | Кухненска организация
**Slug:** `kitchen/organization`

- Drawer Organizers | Органайзери за чекмедже
- Cabinet Organizers | Органайзери за шкаф
- Dish Racks | Сушилници
- Pot Racks | Поставки за тенджери
- Paper Towel Holders | Поставки за кухненска хартия
- Utensil Holders | Поставки за прибори

---

### L1: 🛏️ BEDDING & BATH

#### L2: Bedding Sets | Спални комплекти
**Slug:** `bedding/bedding-sets`

- Complete Bedding Sets | Пълни комплекти
- Duvet Covers | Плик за завивка
- Comforters | Юргани
- Quilts | Шалтета
- Bedspreads | Покривала

---

#### L2: Sheets & Pillowcases | Чаршафи и Калъфки
**Slug:** `bedding/sheets`

- Fitted Sheets | Чаршафи с ластик
- Flat Sheets | Плоски чаршафи
- Sheet Sets | Комплекти чаршафи
- Pillowcases | Калъфки за възглавници
- Mattress Protectors | Протектори за матрак

---

#### L2: Blankets & Throws | Одеяла и Пледове
**Slug:** `bedding/blankets-throws`

- Blankets | Одеяла
- Throws | Пледове
- Electric Blankets | Електрически одеяла
- Weighted Blankets | Претеглени одеяла
- Fleece Blankets | Поларени одеяла

---

#### L2: Pillows & Cushions | Възглавници
**Slug:** `bedding/pillows-cushions`

- Sleeping Pillows | Възглавници за сън
- Decorative Cushions | Декоративни възглавници
- Body Pillows | Възглавници за тяло
- Neck Pillows | Възглавници за врат
- Cushion Covers | Калъфки за възглавници

---

#### L2: Towels | Хавлии
**Slug:** `bedding/towels`

- Bath Towels | Хавлии за баня
- Hand Towels | Малки хавлии
- Beach Towels | Плажни хавлии
- Towel Sets | Комплекти хавлии
- Bathrobes | Халати за баня

---

#### L2: Bathroom Accessories | Аксесоари за баня
**Slug:** `bedding/bathroom-accessories`

- Soap Dispensers | Дозатори за сапун
- Toothbrush Holders | Поставки за четки
- Towel Racks | Закачалки за хавлии
- Bathroom Mirrors | Огледала за баня
- Bathroom Scales | Кантари
- Bathroom Sets | Комплекти за баня

---

#### L2: Shower Curtains & Mats | Завеси и Килимчета за баня
**Slug:** `bedding/shower-curtains`

- Shower Curtains | Завеси за баня
- Bath Mats | Килимчета за баня
- Shower Caddies | Поставки за душ
- Non-Slip Mats | Нехлъзгащи килимчета

---

### L1: 💡 LIGHTING

#### L2: Ceiling Lights | Таванни лампи
**Slug:** `lighting/ceiling-lights`

| EN | BG | Description |
|----|----|----|
| Chandelier | Полилей | Crystal/ornate |
| Pendant Light | Висяща лампа | Single drop |
| Flush Mount | Плафон | Ceiling mounted |
| Semi-Flush | Полуплафон | Short drop |
| Track Lighting | Релсово осветление | Adjustable |
| Ceiling Fan Light | Вентилатор с осветление | Fan + light |

---

#### L2: Floor Lamps | Лампи за под
**Slug:** `lighting/floor-lamps`

- Standard Floor Lamp | Стандартна лампа
- Arc Floor Lamp | Дъгова лампа
- Tripod Floor Lamp | Тринога лампа
- Reading Floor Lamp | Лампа за четене
- Torchiere | Торшера

---

#### L2: Table Lamps | Настолни лампи
**Slug:** `lighting/table-lamps`

- Desk Lamp | Лампа за бюро
- Bedside Lamp | Нощна лампа
- Accent Lamp | Акцентна лампа
- Buffet Lamp | Буфетна лампа
- Touch Lamp | Лампа с докосване

---

#### L2: Wall Lights | Стенни лампи
**Slug:** `lighting/wall-lights`

- Sconces | Аплици
- Picture Lights | Лампи за картини
- Vanity Lights | Лампи за огледало
- Plug-in Wall Lights | Лампи с щепсел
- LED Strip Lights | LED ленти

---

#### L2: Outdoor Lighting | Външно осветление
**Slug:** `lighting/outdoor-lighting`

- Garden Lights | Градински лампи
- Path Lights | Осветление за алеи
- Security Lights | Охранително осветление
- Solar Lights | Соларни лампи
- String Lights | Гирлянди

---

#### L2: Smart Lighting | Смарт осветление
**Slug:** `lighting/smart-lighting`

- Smart Bulbs | Смарт крушки
- Smart Light Strips | Смарт LED ленти
- Smart Switches | Смарт ключове
- Smart Plugs | Смарт контакти

---

### L1: 🖼️ HOME DÉCOR

#### L2: Wall Art & Prints | Картини и Принтове
**Slug:** `decor/wall-art`

- Canvas Art | Платна
- Framed Prints | Рамкирани принтове
- Posters | Постери
- Photography | Фотографии
- Metal Wall Art | Метален декор
- Wall Decals | Стикери за стена

---

#### L2: Mirrors | Огледала
**Slug:** `decor/mirrors`

- Wall Mirrors | Стенни огледала
- Floor Mirrors | Подови огледала
- Decorative Mirrors | Декоративни огледала
- Vanity Mirrors | Тоалетни огледала
- Round Mirrors | Кръгли огледала

---

#### L2: Clocks | Часовници
**Slug:** `decor/clocks`

- Wall Clocks | Стенни часовници
- Alarm Clocks | Будилници
- Mantel Clocks | Каминни часовници
- Grandfather Clocks | Падащи часовници
- Digital Clocks | Дигитални часовници

---

#### L2: Vases & Decorative Objects | Вази и Декоративни предмети
**Slug:** `decor/vases-decorative`

- Vases | Вази
- Sculptures | Скулптури
- Figurines | Фигурки
- Decorative Bowls | Декоративни купи
- Bookends | Ограничители за книги
- Plant Pots | Саксии

---

#### L2: Candles & Holders | Свещи и Свещници
**Slug:** `decor/candles`

- Candles | Свещи
- Candle Holders | Свещници
- Candlesticks | Свещоносци
- Lanterns | Фенери
- Diffusers | Дифузери

---

#### L2: Picture Frames | Рамки за снимки
**Slug:** `decor/picture-frames`

- Photo Frames | Рамки за снимки
- Collage Frames | Колаж рамки
- Digital Frames | Дигитални рамки
- Frame Sets | Комплекти рамки

---

#### L2: Rugs & Carpets | Килими
**Slug:** `decor/rugs-carpets`

| EN | BG | Description |
|----|----|----|
| Area Rug | Килим | Large floor covering |
| Runner | Пътека | Long narrow |
| Shag Rug | Рошав килим | Long pile |
| Oriental Rug | Ориенталски килим | Traditional |
| Outdoor Rug | Външен килим | Weather resistant |
| Kids Rug | Детски килим | Children's room |

---

#### L2: Curtains & Blinds | Пердета и Щори
**Slug:** `decor/curtains-blinds`

- Curtains | Пердета
- Blackout Curtains | Затъмняващи пердета
- Sheer Curtains | Прозрачни пердета
- Blinds | Щори
- Roller Blinds | Ролетни щори
- Venetian Blinds | Венециански щори
- Curtain Rods | Корнизи

---

### L1: 🧹 HOUSEHOLD & CLEANING

#### L2: Cleaning Supplies | Почистващи препарати
**Slug:** `household/cleaning-supplies`

- All-Purpose Cleaners | Универсални почистващи
- Floor Cleaners | Почистващи за под
- Glass Cleaners | Почистващи за стъкло
- Bathroom Cleaners | Почистващи за баня
- Disinfectants | Дезинфектанти
- Mops & Brooms | Мопове и метли
- Sponges & Cloths | Гъби и кърпи

---

#### L2: Laundry & Ironing | Пране и Гладене
**Slug:** `household/laundry-ironing`

- Laundry Baskets | Кошове за пране
- Ironing Boards | Дъски за гладене
- Irons | Ютии
- Drying Racks | Простори
- Laundry Detergent | Препарати за пране
- Fabric Softener | Омекотители
- Clothes Hangers | Закачалки

---

#### L2: Home Organization | Домашна организация
**Slug:** `household/home-organization`

- Storage Boxes | Кутии за съхранение
- Baskets | Кошници
- Vacuum Bags | Вакуум торби
- Closet Organizers | Органайзери за гардероб
- Drawer Dividers | Разделители за чекмедже
- Label Makers | Етикетни машини

---

#### L2: Trash & Recycling | Боклук и Рециклиране
**Slug:** `household/trash-recycling`

- Trash Cans | Кофи за боклук
- Recycling Bins | Кошове за рециклиране
- Trash Bags | Торби за боклук
- Compost Bins | Компостери
- Pedal Bins | Кофи с педал

---

#### L2: Air Quality & Fresheners | Качество на въздуха
**Slug:** `household/air-quality`

- Air Fresheners | Освежители за въздух
- Humidifiers | Овлажнители
- Dehumidifiers | Обезвлажнители
- Air Purifiers | Пречистватели за въздух
- Essential Oil Diffusers | Дифузери за етерични масла

---

## 🏷️ Attribute System (The Power Layer)

### Furniture Attributes Schema

```typescript
interface FurnitureProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "furniture/sofas-couches"
  
  // === BASIC INFO ===
  title: string;                 // "IKEA KIVIK 3-Seater Sofa"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === PRODUCT IDENTIFICATION ===
  brand: string;                 // "IKEA"
  model: string;                 // "KIVIK"
  style: FurnitureStyle;
  
  // === DIMENSIONS ===
  width: number;                 // cm
  height: number;                // cm
  depth: number;                 // cm
  weight?: number;               // kg
  
  // === APPEARANCE ===
  color: string;
  material: string;              // "Fabric", "Leather", "Wood"
  material_details: string;      // "100% Cotton cover"
  finish?: string;               // "Matte", "Gloss", "Natural"
  
  // === FEATURES ===
  features: string[];            // ["Removable covers", "Storage"]
  assembly_required: boolean;
  
  // === CONDITION ===
  condition: FurnitureCondition;
  age_years?: number;
  
  // === DELIVERY ===
  delivery_available: boolean;
  pickup_only: boolean;
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];
}

// === ENUMS ===
type FurnitureStyle = 'modern' | 'contemporary' | 'traditional' | 'scandinavian' | 
                      'industrial' | 'mid_century' | 'rustic' | 'minimalist' | 'bohemian';

type FurnitureCondition = 'new' | 'like_new' | 'good' | 'fair' | 'for_parts';
```

### Home Décor Attributes Schema

```typescript
interface DecorProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  
  // === PRODUCT IDENTIFICATION ===
  brand?: string;
  style: string;
  
  // === DIMENSIONS ===
  width?: number;
  height?: number;
  depth?: number;
  
  // === APPEARANCE ===
  color: string;
  material: string;
  pattern?: string;
  
  // === FEATURES ===
  features: string[];
  handmade: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  
  seller_type: 'private' | 'dealer';
  location_city: string;
  
  images: string[];
}
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "Modern Living" Campaign
SELECT * FROM products 
WHERE category LIKE 'home/%'
AND attributes->>'style' = 'modern';

-- 🏷️ "IKEA Furniture" Campaign  
SELECT * FROM products 
WHERE category LIKE 'furniture/%'
AND attributes->>'brand' = 'IKEA';

-- 🏷️ "Budget Furniture Under 500 лв" Campaign
SELECT * FROM products 
WHERE category LIKE 'furniture/%'
AND price <= 500
AND attributes->>'condition' IN ('new', 'like_new');

-- 🏷️ "Wooden Furniture" Campaign
SELECT * FROM products 
WHERE category LIKE 'furniture/%'
AND attributes->>'material' LIKE '%Wood%';
```

### Search Filter Configuration

```typescript
const furnitureFilters = {
  price: { type: 'range', min: 0, max: 20000, step: 50 },
  location: { type: 'location', regions: bulgarianRegions },
  
  brand: { type: 'searchable-select', options: furnitureBrands },
  style: { type: 'multi-select', options: furnitureStyles },
  color: { type: 'color-picker' },
  material: { type: 'multi-select' },
  
  condition: { type: 'multi-select' },
  delivery_available: { type: 'checkbox' },
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer'] },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('home', 'Home & Kitchen', 'Дом и кухня', 'home', 'home', NULL, 0, '🏠', 4, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('furniture', 'Furniture', 'Мебели', 'furniture', 'home/furniture', 'home', 1, '🛋️', 1, true),
('kitchen', 'Kitchen & Dining', 'Кухня и трапезария', 'kitchen', 'home/kitchen', 'home', 1, '🍳', 2, true),
('bedding', 'Bedding & Bath', 'Спално бельо и баня', 'bedding', 'home/bedding', 'home', 1, '🛏️', 3, true),
('lighting', 'Lighting', 'Осветление', 'lighting', 'home/lighting', 'home', 1, '💡', 4, true),
('decor', 'Home Décor', 'Декорация', 'decor', 'home/decor', 'home', 1, '🖼️', 5, true),
('household', 'Household & Cleaning', 'Домакинство', 'household', 'home/household', 'home', 1, '🧹', 6, true);

-- L2: Furniture
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('furniture-sofas', 'Sofas & Couches', 'Дивани и канапета', 'sofas-couches', 'furniture/sofas-couches', 'furniture', 2, '🛋️', 1, true),
('furniture-chairs', 'Chairs & Armchairs', 'Столове и кресла', 'chairs-armchairs', 'furniture/chairs-armchairs', 'furniture', 2, '🪑', 2, true),
('furniture-tables', 'Tables', 'Маси', 'tables', 'furniture/tables', 'furniture', 2, '🪵', 3, true),
('furniture-beds', 'Beds & Mattresses', 'Легла и матраци', 'beds-mattresses', 'furniture/beds-mattresses', 'furniture', 2, '🛏️', 4, true),
('furniture-wardrobes', 'Wardrobes & Storage', 'Гардероби и съхранение', 'wardrobes-storage', 'furniture/wardrobes-storage', 'furniture', 2, '🚪', 5, true),
('furniture-desks', 'Desks & Office Furniture', 'Бюра и офис мебели', 'desks-office', 'furniture/desks-office', 'furniture', 2, '💼', 6, true),
('furniture-shelving', 'Shelving & Bookcases', 'Рафтове и етажерки', 'shelving-bookcases', 'furniture/shelving-bookcases', 'furniture', 2, '📚', 7, true),
('furniture-tv', 'TV Stands & Media', 'ТВ шкафове', 'tv-stands', 'furniture/tv-stands', 'furniture', 2, '📺', 8, true),
('furniture-outdoor', 'Outdoor Furniture', 'Градински мебели', 'outdoor', 'furniture/outdoor', 'furniture', 2, '🏡', 9, true);

-- L2: Kitchen & Dining
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('kitchen-cookware', 'Cookware', 'Съдове за готвене', 'cookware', 'kitchen/cookware', 'kitchen', 2, '🍳', 1, true),
('kitchen-bakeware', 'Bakeware', 'Съдове за печене', 'bakeware', 'kitchen/bakeware', 'kitchen', 2, '🧁', 2, true),
('kitchen-appliances', 'Kitchen Appliances', 'Кухненски уреди', 'appliances', 'kitchen/appliances', 'kitchen', 2, '☕', 3, true),
('kitchen-dinnerware', 'Dinnerware', 'Сервизи', 'dinnerware', 'kitchen/dinnerware', 'kitchen', 2, '🍽️', 4, true),
('kitchen-glassware', 'Glassware & Drinkware', 'Стъклария и чаши', 'glassware', 'kitchen/glassware', 'kitchen', 2, '🥂', 5, true),
('kitchen-cutlery', 'Cutlery & Utensils', 'Прибори и аксесоари', 'cutlery-utensils', 'kitchen/cutlery-utensils', 'kitchen', 2, '🍴', 6, true),
('kitchen-storage', 'Food Storage', 'Съхранение на храна', 'food-storage', 'kitchen/food-storage', 'kitchen', 2, '🫙', 7, true),
('kitchen-organization', 'Kitchen Organization', 'Кухненска организация', 'organization', 'kitchen/organization', 'kitchen', 2, '📦', 8, true);

-- L2: Bedding & Bath
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bedding-sets', 'Bedding Sets', 'Спални комплекти', 'bedding-sets', 'bedding/bedding-sets', 'bedding', 2, '🛏️', 1, true),
('bedding-sheets', 'Sheets & Pillowcases', 'Чаршафи и калъфки', 'sheets', 'bedding/sheets', 'bedding', 2, '🛏️', 2, true),
('bedding-blankets', 'Blankets & Throws', 'Одеяла и пледове', 'blankets-throws', 'bedding/blankets-throws', 'bedding', 2, '🧶', 3, true),
('bedding-pillows', 'Pillows & Cushions', 'Възглавници', 'pillows-cushions', 'bedding/pillows-cushions', 'bedding', 2, '🛋️', 4, true),
('bedding-towels', 'Towels', 'Хавлии', 'towels', 'bedding/towels', 'bedding', 2, '🛁', 5, true),
('bedding-bathroom', 'Bathroom Accessories', 'Аксесоари за баня', 'bathroom-accessories', 'bedding/bathroom-accessories', 'bedding', 2, '🚿', 6, true),
('bedding-shower', 'Shower Curtains & Mats', 'Завеси и килимчета за баня', 'shower-curtains', 'bedding/shower-curtains', 'bedding', 2, '🚿', 7, true);

-- L2: Lighting
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('lighting-ceiling', 'Ceiling Lights', 'Таванни лампи', 'ceiling-lights', 'lighting/ceiling-lights', 'lighting', 2, '💡', 1, true),
('lighting-floor', 'Floor Lamps', 'Лампи за под', 'floor-lamps', 'lighting/floor-lamps', 'lighting', 2, '🪔', 2, true),
('lighting-table', 'Table Lamps', 'Настолни лампи', 'table-lamps', 'lighting/table-lamps', 'lighting', 2, '🔦', 3, true),
('lighting-wall', 'Wall Lights', 'Стенни лампи', 'wall-lights', 'lighting/wall-lights', 'lighting', 2, '💡', 4, true),
('lighting-outdoor', 'Outdoor Lighting', 'Външно осветление', 'outdoor-lighting', 'lighting/outdoor-lighting', 'lighting', 2, '🏮', 5, true),
('lighting-smart', 'Smart Lighting', 'Смарт осветление', 'smart-lighting', 'lighting/smart-lighting', 'lighting', 2, '💡', 6, true);

-- L2: Home Décor
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('decor-wallart', 'Wall Art & Prints', 'Картини и принтове', 'wall-art', 'decor/wall-art', 'decor', 2, '🖼️', 1, true),
('decor-mirrors', 'Mirrors', 'Огледала', 'mirrors', 'decor/mirrors', 'decor', 2, '🪞', 2, true),
('decor-clocks', 'Clocks', 'Часовници', 'clocks', 'decor/clocks', 'decor', 2, '🕰️', 3, true),
('decor-vases', 'Vases & Decorative Objects', 'Вази и декоративни предмети', 'vases-decorative', 'decor/vases-decorative', 'decor', 2, '🏺', 4, true),
('decor-candles', 'Candles & Holders', 'Свещи и свещници', 'candles', 'decor/candles', 'decor', 2, '🕯️', 5, true),
('decor-frames', 'Picture Frames', 'Рамки за снимки', 'picture-frames', 'decor/picture-frames', 'decor', 2, '🖼️', 6, true),
('decor-rugs', 'Rugs & Carpets', 'Килими', 'rugs-carpets', 'decor/rugs-carpets', 'decor', 2, '🧶', 7, true),
('decor-curtains', 'Curtains & Blinds', 'Пердета и щори', 'curtains-blinds', 'decor/curtains-blinds', 'decor', 2, '🪟', 8, true);

-- L2: Household & Cleaning
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('household-cleaning', 'Cleaning Supplies', 'Почистващи препарати', 'cleaning-supplies', 'household/cleaning-supplies', 'household', 2, '🧹', 1, true),
('household-laundry', 'Laundry & Ironing', 'Пране и гладене', 'laundry-ironing', 'household/laundry-ironing', 'household', 2, '🧺', 2, true),
('household-organization', 'Home Organization', 'Домашна организация', 'home-organization', 'household/home-organization', 'household', 2, '📦', 3, true),
('household-trash', 'Trash & Recycling', 'Боклук и рециклиране', 'trash-recycling', 'household/trash-recycling', 'household', 2, '🗑️', 4, true),
('household-air', 'Air Quality & Fresheners', 'Качество на въздуха', 'air-quality', 'household/air-quality', 'household', 2, '🌬️', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Home & Kitchen | Дом и кухня |
| Furniture | Мебели |
| Sofas & Couches | Дивани и канапета |
| Tables | Маси |
| Beds & Mattresses | Легла и матраци |
| Kitchen & Dining | Кухня и трапезария |
| Bedding & Bath | Спално бельо и баня |
| Lighting | Осветление |
| Home Décor | Декорация |
| Household & Cleaning | Домакинство |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Style | Стил |
| Material | Материал |
| Color | Цвят |
| Width | Широчина |
| Height | Височина |
| Depth | Дълбочина |
| Condition | Състояние |
| Delivery Available | Доставка възможна |

### Attribute Values

| EN | BG |
|----|----|
| New | Ново |
| Like New | Като ново |
| Good | Добро |
| Fair | Задоволително |
| Modern | Модерен |
| Traditional | Традиционен |
| Scandinavian | Скандинавски |
| Minimalist | Минималистичен |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add furniture brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/home (tree structure)
- [ ] GET /categories/home/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Product listing form (multi-step)
- [ ] Search filters component
- [ ] Dimension inputs component
- [ ] Results grid/list view
- [ ] Product detail page

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 50  
**Created:** December 3, 2025
