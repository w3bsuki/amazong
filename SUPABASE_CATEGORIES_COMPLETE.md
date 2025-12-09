# Supabase Categories & Attributes - Complete Documentation

> **Generated:** December 8, 2025  
> **Database:** Supabase PostgreSQL  
> **Total Categories:** 5,780  
> **Total Category Attributes:** 1,196

---

## 🚨 CATEGORY REFACTORING GUIDE

> **RULE: L0 → L1 → L2 → L3 MAXIMUM. NO L4/L5!**
> **Filtering = ATTRIBUTES, not deeper categories!**

### ✅ DO (Smart & Logical)

1. **Max Depth = L3**
   ```
   Electronics (L0) → Smartphones (L1) → iPhone (L2) → iPhone 15 Series (L3) ✅
   ```

2. **Use ATTRIBUTES for variations:**
   - Model variants: iPhone 15 Pro Max → `Model Series` attribute
   - Specs: Intel i7, 16GB RAM → `Processor`, `RAM` attributes
   - Colors, sizes, conditions → ALL attributes

3. **L3 = Series/Product Lines, NOT individual models:**
   - ✅ `iPhone 15 Series` (L3) + Model attribute for Pro/Pro Max
   - ✅ `Galaxy S Series` (L3) + Model attribute for S24/S24+/S24 Ultra
   - ✅ `CPUs` (L3) + Processor Brand/Series attributes

4. **Remove duplicates aggressively:**
   - Keep the one with cleaner slug
   - Delete generic duplicates: "Samsung Galaxy" under Samsung brand

### ❌ DON'T (Over-Engineering)

1. **NO L4/L5 categories:**
   ```
   ❌ CPUs (L3) → Intel (L4) → Core i5 (L5)  
   ✅ CPUs (L3) + Processor attribute = "Intel Core i5"
   ```

2. **NO individual model categories:**
   ```
   ❌ iPhone 15, iPhone 15 Plus, iPhone 15 Pro, iPhone 15 Pro Max (4 L3s)
   ✅ iPhone 15 Series (1 L3) + Model Series attribute
   ```

3. **NO duplicate/redundant categories:**
   ```
   ❌ "Smart Speakers" appearing 3 times under Audio
   ❌ "Apple iPhone", "iPhone", "iPhones" under same parent
   ```

### 🔧 REFACTORING STEPS

```sql
-- STEP 1: Find L4+ categories (MUST BE 0)
WITH RECURSIVE tree AS (
  SELECT id, name, slug, parent_id, 0 as level FROM categories WHERE slug = 'TARGET_SLUG'
  UNION ALL
  SELECT c.id, c.name, c.slug, c.parent_id, t.level + 1 FROM categories c JOIN tree t ON c.parent_id = t.id
)
SELECT level, COUNT(*) FROM tree GROUP BY level ORDER BY level;

-- STEP 2: Delete L4/L5 categories
DELETE FROM categories WHERE id IN (SELECT id FROM tree WHERE level >= 4);

-- STEP 3: Find duplicates
SELECT name, COUNT(*) FROM categories WHERE parent_id = 'PARENT_ID' GROUP BY name HAVING COUNT(*) > 1;

-- STEP 4: Verify attributes exist for L1 categories
SELECT c.name, COUNT(ca.id) FROM categories c 
LEFT JOIN category_attributes ca ON ca.category_id = c.id 
WHERE c.parent_id = 'L0_ID' GROUP BY c.id;
```

### 📊 COMPLETED REFACTORS

| Category | Status | Before | After | Removed |
|----------|--------|--------|-------|---------|
| Fashion | ✅ Done | - | L0→L3 | Debloated |
| Electronics | ✅ Done | 710 cats, L5 depth | 545 cats, L3 max | 165 (-23%) |
| Home & Kitchen | ⏳ Pending | - | - | - |
| Beauty | ⏳ Pending | - | - | - |
| ... | ⏳ Pending | - | - | - |

---

## 📊 Category Hierarchy Summary

| Level | Description | Count |
|-------|-------------|-------|
| **L0** | Main Categories (Top Level) | 24 |
| **L1** | Subcategories | 288 |
| **L2** | Sub-subcategories | 3,010 |
| **L3** | Deep subcategories | 2,458 |

---

## 🏷️ L0 Main Categories (24)

| # | Icon | Name (EN) | Name (BG) | Slug | Description |
|---|------|-----------|-----------|------|-------------|
| 1 | 👗 | Fashion | Мода | `fashion` | Clothing, shoes, accessories and jewelry |
| 2 | 📱 | Electronics | Електроника | `electronics` | Phones, computers, audio and smart devices |
| 3 | 🏠 | Home & Kitchen | Дом и кухня | `home` | Furniture, kitchen, bedding and décor |
| 4 | 💄 | Beauty | Красота | `beauty` | Makeup, skincare, haircare and fragrances |
| 5 | 💊 | Health | Здраве | `health-wellness` | Vitamins, supplements and health products |
| 6 | ⚽ | Sports | Спорт | `sports` | Sports equipment, fitness and outdoor gear |
| 7 | 👶 | Kids | Деца | `baby-kids` | Baby gear, kids clothing and toys |
| 8 | 🎮 | Gaming | Гейминг | `gaming` | Consoles, video games, PC gaming and accessories |
| 9 | 🚗 | Automotive | Автомобили | `automotive` | Vehicles, parts, accessories and services |
| 10 | 🐕 | Pets | Зоо | `pets` | Food, toys and supplies for all pets |
| 11 | 🏡 | Real Estate | Имоти | `real-estate` | Property sales and rentals |
| 12 | 💿 | Software | Софтуер | `software` | Software, apps and digital products |
| 13 | 🎨 | Collectibles | Колекционерски | `collectibles` | Art, antiques, coins and memorabilia |
| 14 | 📦 | Wholesale | На едро | `wholesale` | Bulk and wholesale products |
| 15 | 🎯 | Hobbies | Хобита | `hobbies` | Crafts, models, games, music, and creative hobbies |
| 16 | 💎 | Jewelry & Watches | Бижута и часовници | `jewelry-watches` | Fine jewelry, watches and accessories |
| 17 | 🛒 | Grocery & Food | Храна | `grocery` | Food, beverages and household items |
| 18 | 🔧 | Tools & Industrial | Инструменти | `tools-home` | Power tools, hand tools and hardware |
| 19 | ⚡ | E-Mobility | Електромобилност | `e-mobility` | Electric vehicles, scooters and bikes |
| 20 | 🛠️ | Services & Events | Услуги и събития | `services` | Professional and personal services |
| 21 | 🇧🇬 | Bulgarian Traditional | Българско | `bulgarian-traditional` | Traditional Bulgarian products |
| 22 | 📚 | Books | Книги | `books` | Books, textbooks, magazines, comics, and reading materials |
| 23 | 🎬 | Movies & Music | Филми и музика | `movies-music` | Movies, music, vinyl records, DVDs, Blu-rays, CDs |
| 24 | 💼 | Jobs | Работа | `jobs` | Job listings and employment |

---

## 📂 Complete L0 → L1 → L2 Hierarchy

### 1. 👗 Fashion (10 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Men's | Мъже | `fashion-mens` | 4 |
| Women's | Жени | `fashion-womens` | 4 |
| Kids | Деца | `fashion-kids` | 3 |
| Unisex | Унисекс | `fashion-unisex` | 3 |
| Bags & Luggage | Чанти и багаж | `bags-luggage` | 12 |
| Accessories | Аксесоари | `fashion-accessories-main` | 13 |
| Watches | Часовници | `fashion-watches-main` | 6 |
| Plus Size Women | Големи размери жени | `fashion-plus-size-women` | 2 |
| Vintage Clothing | Винтидж облекло | `fashion-vintage-clothing` | 3 |
| Plus Size Men | Големи размери мъже | `fashion-plus-size-men` | 1 |

**Attributes:** 16 total | 15 filterable | 1 required  
**Attribute Types:** boolean, multiselect, select

---

### 2. 📱 Electronics (8 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Smartphones | Смартфони | `smartphones` | 16 |
| Tablets | Таблети | `tablets` | 7 |
| PC & Laptops | Компютри и лаптопи | `pc-laptops` | 13 |
| Audio | Аудио | `audio` | 16 |
| Televisions | Телевизори | `televisions-category` | 14 |
| Cameras | Камери | `electronics-cameras` | 19 |
| Smart Devices | Умни устройства | `smart-devices` | 10 |
| Accessories | Аксесоари | `electronics-accessories` | 10 |

**Attributes:** 123 total | 119 filterable | 37 required  
**Attribute Types:** boolean, multiselect, select, text

---

### 3. 🏠 Home & Kitchen (11 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Furniture | Мебели | `furniture` | 17 |
| Kitchen & Dining | Кухня и хранене | `kitchen-dining` | 14 |
| Bedding & Bath | Спално бельо и баня | `bedding-bath` | 12 |
| Lighting | Осветление | `lighting` | 11 |
| Home Décor | Декорация | `home-decor` | 14 |
| Household & Cleaning | Домакинство | `household` | 11 |
| Storage & Organization | Съхранение и организация | `home-storage` | 13 |
| Climate Control | Климатизация | `home-climate` | 4 |
| Home Improvement | Ремонт и подобрения | `home-improvement` | 5 |
| Office & School | Офис и училище | `home-office` | 6 |
| Garden & Outdoor | Градина | `garden-outdoor` | 14 |

**Attributes:** 65 total | 61 filterable | 19 required  
**Attribute Types:** boolean, multiselect, select, text

---

### 4. 💄 Beauty (8 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Makeup | Грим | `makeup` | 9 |
| Skincare | Грижа за кожата | `skincare` | 11 |
| Hair Care | Грижа за косата | `haircare` | 10 |
| Fragrance | Парфюмерия | `fragrance` | 11 |
| Bath & Body | Баня и тяло | `bath-body` | 11 |
| Oral Care | Орална хигиена | `oral-care` | 8 |
| Men's Grooming | Мъжка грижа | `mens-grooming` | 12 |
| Beauty Tools | Инструменти за красота | `beauty-tools` | 8 |

**Attributes:** 48 total | 46 filterable | 8 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 5. 💊 Health (5 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Supplements & Vitamins | Хранителни добавки и витамини | `supplements-vitamins` | 17 |
| Specialty & Targeted Health | Специализирано здраве | `specialty-health` | 7 |
| Sports & Fitness Nutrition | Спортно хранене и фитнес | `sports-fitness-nutrition` | 10 |
| Medical & Personal Care | Медицински и лични грижи | `medical-personal-care` | 12 |
| Natural & Alternative Wellness | Натурално и алтернативно здраве | `natural-alternative-wellness` | 11 |

**Attributes:** 23 total | 23 filterable | 2 required  
**Attribute Types:** multiselect, select, text

---

### 6. ⚽ Sports (16 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Exercise & Fitness | Фитнес | `fitness` | 7 |
| Cycling | Колоездене | `cycling` | 13 |
| Team Sports | Отборни спортове | `team-sports` | 11 |
| Water Sports | Водни спортове | `water-sports` | 9 |
| Winter Sports | Зимни спортове | `winter-sports` | 9 |
| Hiking & Camping | Туризъм и къмпинг | `hiking-camping` | 16 |
| Running | Бягане | `running` | 6 |
| Golf | Голф | `golf` | 8 |
| Combat Sports | Бойни спортове | `combat-sports` | 6 |
| Racket Sports | Ракетни спортове | `racket-sports` | 5 |
| Fishing & Hunting | Риболов и лов | `fishing-hunting` | 4 |
| Outdoor Recreation | Отдих на открито | `outdoor-recreation` | 13 |
| Sports Supplements | Спортни добавки | `sports-supplements` | 9 |
| Fan Gear & Merchandise | Фен артикули | `sports-fan-gear` | 3 |
| Equestrian | Конен спорт | `equestrian` | 8 |

**Attributes:** 45 total | 45 filterable | 12 required  
**Attribute Types:** multiselect, select, text

---

### 7. 👶 Kids (7 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Baby Gear | Бебешки артикули и пътуване | `baby-gear` | 10 |
| Baby Feeding | Хранене | `baby-feeding` | 16 |
| Diapering & Potty | Пелени и гърне | `diapering` | 14 |
| Baby Safety & Health | Безопасност и здраве | `baby-safety` | 9 |
| Nursery & Furniture | Детска стая и мебели | `nursery` | 16 |
| Kids Clothing & Shoes | Детско облекло и обувки | `kids-clothing` | 11 |
| Toys & Games | Играчки и игри | `toys-games` | 14 |

**Attributes:** 56 total | 56 filterable | 10 required  
**Attribute Types:** boolean, select, text

---

### 8. 🎮 Gaming (11 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| PC Gaming | PC Гейминг | `pc-gaming-main` | 14 |
| Console Gaming | Конзолен гейминг | `console-gaming` | 21 |
| Gaming Furniture | Гейминг мебели | `gaming-furniture` | 11 |
| VR & AR Gaming | VR и AR гейминг | `vr-ar-gaming` | 9 |
| Streaming & Content Creation | Стрийминг и съдържание | `streaming-equipment` | 9 |
| Retro Gaming | Ретро гейминг | `retro-gaming` | 4 |
| Trading Cards | Колекционерски карти | `trading-cards` | 6 |
| Board Games | Настолни игри | `board-games` | 11 |
| Controllers | Контролери | `gaming-controllers` | 5 |
| Gaming Accessories | Гейминг аксесоари | `gaming-accessories` | 6 |

**Attributes:** 25 total | 25 filterable | 8 required  
**Attribute Types:** boolean, select

---

### 9. 🚗 Automotive (9 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Vehicles | Превозни средства | `vehicles` | 13 |
| Electric Vehicles | Електромобили | `electric-vehicles` | 5 |
| EV Chargers | Зарядни станции | `ev-chargers` | 6 |
| E-Bikes | Електрически велосипеди | `e-bikes-cat` | 8 |
| Parts & Components | Части и компоненти | `auto-parts` | 24 |
| Car Accessories | Автоаксесоари | `auto-accessories` | 13 |
| E-Scooters | Електрически тротинетки | `e-scooters` | 7 |
| Auto Services | Автоуслуги | `auto-services` | 15 |
| EV Parts & Accessories | Части и аксесоари за EV | `ev-parts` | 7 |

**Attributes:** 64 total | 63 filterable | 22 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 10. 🐕 Pets (12 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Dogs | Кучета | `dogs` | 15 |
| Cats | Котки | `cats` | 13 |
| Birds | Птици | `birds` | 22 |
| Fish & Aquatic | Риби и аквариуми | `fish-aquatic` | 19 |
| Small Animals | Малки животни | `small-animals` | 12 |
| Reptiles | Влечуги | `reptiles` | 14 |
| Horses | Коне | `horses` | 10 |
| Pet Tech & Monitoring | Технологии и мониторинг | `pet-tech` | 6 |
| Pet Health & Pharmacy | Здраве и аптека за домашни любимци | `pet-pharmacy` | 6 |
| Pet Travel & Carriers | Пътуване и транспорт | `pet-travel` | 8 |
| Pet Memorials | Възпоменания за домашни любимци | `pet-memorials` | 6 |
| Pet Gifts & Personalized | Подаръци и персонализирани | `pet-gifts` | 6 |

**Attributes:** 74 total | 74 filterable | 8 required  
**Attribute Types:** multiselect, select, text

---

### 11. 🏡 Real Estate (11 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Residential Sales | В продажба | `residential-sales` | 25 |
| Residential Rentals | Под наем | `residential-rentals` | 20 |
| Commercial | Търговски имоти | `commercial` | 21 |
| Land | Земя | `land` | 24 |
| Vacation Rentals | Ваканционни имоти | `vacation-rentals` | 8 |
| New Construction | Ново строителство | `new-construction` | 8 |
| Luxury Properties | Луксозни имоти | `luxury-properties` | 8 |
| Investment Properties | Инвестиционни имоти | `investment-properties` | 8 |
| Parking & Storage | Паркоместа и складове | `parking-storage` | 9 |
| Rural & Agricultural | Селски и земеделски | `rural-agricultural` | 9 |
| Foreclosures & Auctions | Публични продажби | `foreclosures-auctions` | 7 |

**Attributes:** 17 total | 17 filterable | 6 required  
**Attribute Types:** boolean, multiselect, number, select

---

### 12. 💿 Software (16 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Operating Systems | Операционни системи | `operating-systems` | 10 |
| Office Software | Офис софтуер | `office-software` | 14 |
| Productivity | Продуктивност | `productivity-software` | 8 |
| Security Software | Защитен софтуер | `security-software` | 17 |
| Creative Software | Творчески софтуер | `creative-software` | 19 |
| Development Tools | Инструменти за разработка | `development-tools` | 14 |
| Games & Entertainment | Игри и забавления | `games-software` | 15 |
| Web & Development | Уеб и разработка | `web-development` | 13 |
| Utilities & System Tools | Помощни програми | `utilities-system` | 19 |
| Business Software | Бизнес софтуер | `business-software` | 20 |
| Educational Software | Образователен софтуер | `educational-software` | 10 |
| AI & Machine Learning | ИИ и машинно обучение | `ai-machine-learning` | 17 |
| Mobile Apps | Мобилни приложения | `mobile-apps` | 8 |
| Cloud Services & SaaS | Облачни услуги и SaaS | `cloud-saas` | 8 |
| Multimedia Software | Мултимедиен софтуер | `multimedia-software` | 14 |
| Scientific & Engineering | Научен и инженерен софтуер | `scientific-engineering` | 9 |
| Communication & Collaboration | Комуникация и сътрудничество | `communication-collab` | 8 |

**Attributes:** 78 total | 65 filterable | 8 required  
**Attribute Types:** multiselect, number, select, text

---

### 13. 🎨 Collectibles (14 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Art | Изкуство | `art` | 11 |
| Antiques | Антики | `antiques` | 14 |
| Coins & Currency | Монети и банкноти | `coins-currency` | 21 |
| Stamps | Марки | `stamps` | 13 |
| Sports Memorabilia | Спортни сувенири | `sports-memorabilia` | 21 |
| Entertainment Memorabilia | Филмови сувенири | `entertainment-memorabilia` | 19 |
| Vintage Clothing | Винтидж облекло | `vintage-clothing` | 8 |
| Trading Cards | Колекционерски карти | `coll-trading-cards` | 16 |
| Autographs & Signed Items | Автографи и подписани вещи | `coll-autographs` | 9 |
| Comics & Graphic Novels | Комикси и графични романи | `coll-comics` | 10 |
| Collectible Toys & Figures | Колекционерски играчки и фигурки | `coll-toys` | 19 |
| Rare & Limited Items | Редки и лимитирани вещи | `coll-rare` | 8 |
| Vintage Electronics | Винтидж електроника | `coll-vintage-electronics` | 8 |
| Militaria | Милитария | `coll-militaria` | 10 |

**Attributes:** 64 total | 59 filterable | 7 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 14. 📦 Wholesale (20 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Wholesale Electronics & Tech | Електроника на едро | `wholesale-electronics` | 20 |
| Wholesale Fashion & Apparel | Мода и облекло на едро | `wholesale-clothing` | 19 |
| Wholesale Beauty & Personal Care | Красота и грижа за тялото на едро | `wholesale-beauty` | 8 |
| Wholesale Home & Garden | Дом и градина на едро | `wholesale-home` | 8 |
| Wholesale Food & Beverages | Храни и напитки на едро | `wholesale-food` | 15 |
| Wholesale Toys & Games | Играчки и игри на едро | `wholesale-toys` | 8 |
| Wholesale Sports & Outdoor | Спорт и отдих на едро | `wholesale-sports` | 8 |
| Wholesale Automotive & Parts | Авточасти и аксесоари на едро | `wholesale-automotive` | 8 |
| Wholesale Health & Medical | Здраве и медицина на едро | `wholesale-health` | 8 |
| Wholesale Office & School | Офис и училищни консумативи на едро | `business-supplies` | 9 |
| Wholesale Industrial & Hardware | Индустриални стоки и железария на едро | `wholesale-industrial` | 18 |
| Wholesale Pet Supplies | Зоостоки на едро | `wholesale-pet` | 8 |
| Wholesale Packaging & Shipping | Опаковки и доставки на едро | `wholesale-packaging` | 14 |
| Wholesale Printing & Customization | Печат и персонализация на едро | `wholesale-printing` | 8 |
| Wholesale Raw Materials | Суровини на едро | `wholesale-raw-materials` | 8 |
| Wholesale Seasonal & Holiday | Сезонни и празнични стоки на едро | `wholesale-seasonal` | 8 |
| Wholesale Restaurant & Hospitality | Ресторантьорство и хотелиерство на едро | `wholesale-restaurant` | 12 |
| Wholesale Jewelry & Accessories | Бижута и аксесоари на едро | `wholesale-jewelry` | 8 |
| Wholesale Baby & Maternity | Бебешки стоки и майчинство на едро | `wholesale-baby` | 8 |
| Wholesale Crafts & Hobbies | Хоби и занаяти на едро | `wholesale-crafts` | 8 |

**Attributes:** 21 total | 20 filterable | 10 required  
**Attribute Types:** boolean, multiselect, select, text

---

### 15. 🎯 Hobbies (9 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Handmade & Crafts | Ръчна изработка и занаяти | `handmade` | 22 |
| Trading Card Games | Търговски карти игри | `hobby-tcg` | 7 |
| Board Games & Puzzles | Настолни игри и пъзели | `hobby-tabletop` | 8 |
| Model Building & RC | Моделизъм и RC | `hobby-model-building` | 13 |
| Musical Instruments | Музикални инструменти | `musical-instruments` | 7 |
| Outdoor Hobbies | Хобита на открито | `hobby-outdoor` | 5 |
| Creative Arts | Творчески изкуства | `hobby-creative-arts` | 11 |
| Scale Models | Мащабни модели | `hobby-scale-models` | 1 |

**Attributes:** 16 total | 16 filterable | 3 required  
**Attribute Types:** boolean, multiselect, select, text

---

### 16. 💎 Jewelry & Watches (10 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Rings | Пръстени | `jw-rings` | 13 |
| Necklaces & Pendants | Колиета и медальони | `jw-necklaces` | 10 |
| Earrings | Обеци | `jw-earrings` | 13 |
| Bracelets & Bangles | Гривни | `jw-bracelets` | 14 |
| Watches | Часовници | `watches` | 21 |
| Fine Jewelry | Скъпоценни бижута | `fine-jewelry` | 12 |
| Fashion Jewelry | Модни бижута | `costume-jewelry` | 10 |
| Men's Jewelry | Мъжки бижута | `jw-mens` | 9 |
| Vintage & Estate Jewelry | Винтидж и наследствени бижута | `jw-vintage-estate` | 9 |
| Jewelry Supplies & Care | Материали и грижа за бижута | `jw-supplies` | 9 |

**Attributes:** 68 total | 64 filterable | 4 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 17. 🛒 Grocery & Food (13 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Dairy & Animal Products | Млечни и животински продукти | `grocery-dairy` | 8 |
| Fruits | Плодове | `grocery-fruits` | 8 |
| Vegetables | Зеленчуци | `grocery-vegetables` | 9 |
| Meat & Seafood | Месо и морски дарове | `grocery-meat` | 11 |
| Bakery & Bread | Хлебни и сладкарски изделия | `grocery-bakery` | 8 |
| Drinks & Beverages | Напитки | `grocery-drinks` | 11 |
| Pantry & Dry Goods | Бакалия и сухи храни | `grocery-pantry` | 16 |
| Organic & Bio | Био и органични | `grocery-organic` | 8 |
| Bulgarian Specialty | Български специалитети | `grocery-bulgarian` | 8 |
| Frozen Foods | Замразени храни | `grocery-frozen` | 6 |
| Snacks & Sweets | Снаксове и сладости | `grocery-snacks` | 11 |
| Baby & Kids Food | Бебешка и детска храна | `grocery-baby-food` | 6 |
| International Foods | Международна кухня | `grocery-international` | 7 |

**Attributes:** 16 total | 15 filterable | 2 required  
**Attribute Types:** boolean, multiselect, select, text

---

### 18. 🔧 Tools & Industrial (27 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Power Tools | Електроинструменти | `power-tools` | 17 |
| Hand Tools | Ръчни инструменти | `hand-tools` | 13 |
| Tool Storage | Съхранение на инструменти | `tool-storage` | 13 |
| Hardware | Железария | `hardware` | 10 |
| Safety Equipment | Предпазни средства | `safety-equipment` | 23 |
| Welding & Soldering | Заваръчна техника | `welding-soldering` | 12 |
| Pneumatic & Air Tools | Пневматични инструменти | `pneumatic-air-tools` | 12 |
| Automotive Tools | Автомобилни инструменти | `automotive-tools` | 21 |
| Garden & Outdoor Power | Градинска техника | `garden-outdoor-power` | 12 |
| Woodworking Tools | Дървообработващи инструменти | `woodworking-tools` | 11 |
| Metalworking Tools | Металообработващи инструменти | `metalworking-tools` | 11 |
| Plumbing Tools | Водопроводни инструменти | `plumbing-tools` | 9 |
| Electrical Tools | Електроинсталационни инструменти | `electrical-tools` | 9 |
| Construction & Masonry | Строителство и зидария | `construction-masonry` | 9 |
| Painting & Finishing | Бояджийско оборудване | `painting-finishing` | 9 |
| Abrasives & Finishing | Абразиви и шлифовъчни материали | `abrasives-finishing` | 9 |
| Adhesives & Sealants | Лепила и уплътнители | `adhesives-sealants` | 9 |
| HVAC Tools & Equipment | ОВК инструменти | `hvac-tools` | 8 |
| Fasteners & Hardware | Крепежни елементи | `fasteners-hardware` | 10 |
| Test & Measurement | Измервателна апаратура | `test-measurement-equipment` | 10 |
| Tool Accessories & Parts | Аксесоари и части за инструменти | `tool-accessories-parts` | 8 |
| Generators & Power | Генератори и захранване | `generators-power` | 7 |
| Cleaning Equipment | Почистващо оборудване | `cleaning-equipment` | 6 |
| Industrial & Scientific | Индустриално | `industrial` | 6 |
| Agriculture | Земеделие | `agriculture` | 5 |

**Attributes:** 24 total | 22 filterable | 8 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 19. ⚡ E-Mobility (9 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| E-Scooters | Електрически тротинетки | `emob-escooters` | 7 |
| E-Bikes | Електрически велосипеди | `emob-ebikes` | 13 |
| E-Skateboards & Boards | Електрически скейтборди | `emob-eboards` | 4 |
| Hoverboards & Segways | Ховърборди и сегуеи | `emob-hoverboards` | 4 |
| E-Unicycles | Електрически моноколела | `emob-eunicycles` | 4 |
| Electric Go-Karts | Електрически картинги | `emob-gokarts` | 3 |
| E-Mobility Accessories | Аксесоари за електромобилност | `emob-accessories` | 9 |
| E-Mobility Parts | Части за електромобилност | `emob-parts` | 10 |
| Charging & Power | Зареждане и захранване | `emob-charging` | 8 |

**Attributes:** 23 total | 23 filterable | 4 required  
**Attribute Types:** boolean, number, select, text

---

### 20. 🛠️ Services & Events (23 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Cleaning Services | Услуги по почистване | `cleaning-services` | 18 |
| Repairs & Maintenance | Ремонти и поддръжка | `repairs-maintenance` | 12 |
| Moving & Relocation | Преместване и транспорт | `moving-relocation` | 10 |
| Wellness Services | Уелнес услуги | `wellness-services` | 12 |
| Education & Tutoring | Образование и уроци | `education-tutoring` | 18 |
| Tech & IT Services | Технологии и IT услуги | `tech-it-services` | 12 |
| Business Services | Бизнес услуги | `business-services` | 12 |
| Wedding Services | Сватбени услуги | `wedding-services` | 14 |
| Legal & Financial | Правни и финансови услуги | `legal-financial` | 10 |
| Transportation Services | Транспортни услуги | `transportation-services` | 10 |
| Freelance & Creative | Фрийланс и творчески услуги | `freelance-creative` | 12 |
| Construction & Renovation | Строителство и ремонт | `construction-renovation` | 12 |
| Automotive Services | Автомобилни услуги | `automotive-services` | 12 |
| Security Services | Охранителни услуги | `security-services` | 8 |
| Agricultural Services | Селскостопански услуги | `agricultural-services` | 8 |
| Home Services | Домашни услуги | `home-services` | 15 |
| Personal Services | Лични услуги | `personal-services` | 14 |
| Pet Services | Услуги за домашни любимци | `pet-services` | 8 |
| Professional Services | Професионални услуги | `professional-services` | 28 |
| Lessons & Classes | Уроци и курсове | `lessons-classes` | 8 |
| Events & Entertainment | Събития и развлечения | `events-entertainment` | 23 |
| Tickets & Events | Билети | `tickets` | 5 |
| Gift Cards | Ваучери | `gift-cards` | 8 |

**Attributes:** 84 total | 80 filterable | 6 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 21. 🇧🇬 Bulgarian Traditional (12 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Traditional Foods | Традиционни храни | `traditional-foods` | 28 |
| Bulgarian Folk Costumes | Български народни носии | `bulgarian-folk-costumes` | 5 |
| Rose Products | Розови продукти | `rose-products` | 9 |
| Traditional Crafts | Традиционни занаяти | `traditional-crafts` | 8 |
| Bulgarian Wood Carving | Българска дърворезба | `bulgarian-wood-carving` | 0 |
| Folk Costumes | Народни носии | `folk-costumes` | 5 |
| Bulgarian Wine | Българско вино | `bulgarian-wine` | 5 |
| Bulgarian Wines | Български вина | `bulgarian-wines` | 0 |
| Souvenirs | Сувенири | `souvenirs` | 5 |
| Bulgarian Spirits | Български спиртни напитки | `bulgarian-spirits` | 0 |
| Bulgarian Herbs | Български билки | `bulgarian-herbs` | 0 |
| Bulgarian Honey | Български мед | `bulgarian-honey` | 0 |
| Bulgarian Instruments | Български инструменти | `bulgarian-instruments` | 5 |

**Attributes:** 28 total | 25 filterable | 4 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 22. 📚 Books (13 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Fiction | Художествена литература | `books-fiction` | 13 |
| Non-Fiction | Нехудожествена литература | `books-nonfiction` | 17 |
| Children's Books | Детски книги | `childrens-books` | 16 |
| Textbooks & Education | Учебници и образование | `textbooks` | 17 |
| Comics & Graphic Novels | Комикси и графични романи | `books-comics` | 7 |
| Rare & Antiquarian | Редки и антикварни | `books-rare` | 5 |
| Self-Published & Zines | Самоиздадени и зини | `books-zines` | 5 |
| Bulgarian Literature | Българска литература | `books-bulgarian` | 7 |
| Foreign Language Books | Книги на чужди езици | `books-foreign` | 7 |
| Magazines & Periodicals | Списания и периодика | `books-magazines` | 12 |
| Book Accessories | Аксесоари за книги | `books-accessories` | 6 |
| E-Books | Е-книги | `books-ebooks` | 1 |

**Attributes:** 27 total | 25 filterable | 5 required  
**Attribute Types:** boolean, multiselect, number, select, text

---

### 23. 🎬 Movies & Music (15 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| Vinyl Records | Грамофонни плочи | `vinyl-records` | 26 |
| CDs | Компактдискове | `music-cds` | 14 |
| Cassette Tapes | Касети | `cassettes` | 5 |
| DVDs | DVD дискове | `movies-dvd` | 19 |
| Turntables & Equipment | Грамофони и оборудване | `turntables` | 9 |
| TV Series | ТВ сериали | `tv-series` | 6 |
| Blu-ray | Blu-ray дискове | `movies-bluray` | 14 |
| 4K Ultra HD | 4K Ultra HD | `movies-4k-uhd` | 7 |
| VHS Tapes | VHS касети | `movies-vhs` | 6 |
| Musical Instruments | Музикални инструменти | `mm-instruments` | 11 |
| Audio Equipment | Аудио оборудване | `mm-audio-equipment` | 10 |
| Movie Memorabilia | Филмови сувенири | `movie-memorabilia` | 6 |
| Music Memorabilia | Музикални сувенири | `music-memorabilia` | 6 |
| Digital Music | Дигитална музика | `digital-music` | 3 |
| Concert Recordings | Концертни записи | `mm-concerts` | 3 |

**Attributes:** 40 total | 38 filterable | 4 required  
**Attribute Types:** boolean, multiselect, select, text

---

### 24. 💼 Jobs (3 L1 categories)

| L1 Category | Bulgarian | Slug | L2 Count |
|-------------|-----------|------|----------|
| IT & Technology | IT и технологии | `it-tech-jobs` | 8 |
| Business & Office | Бизнес и офис | `business-office-jobs` | 7 |
| Healthcare | Здравеопазване | `healthcare-jobs` | 6 |

**Attributes:** 6 total | 5 filterable | 3 required  
**Attribute Types:** boolean, select, text

---

## 🏷️ Category Attributes Summary

### Attribute Types Available

| Type | Description | Used For |
|------|-------------|----------|
| `select` | Single choice dropdown | Condition, Brand, Size |
| `multiselect` | Multiple choice | Features, Connectivity |
| `text` | Free text input | Model, Serial Number |
| `number` | Numeric input | Year, Price, Dimensions |
| `boolean` | Yes/No toggle | In Stock, Original, Featured |

### Sample Attributes by Category

#### Automotive Attributes
- **Vehicle Make:** Audi, BMW, Mercedes-Benz, VW, Toyota, Honda, Ford, Opel, Peugeot, Renault, Skoda, Hyundai, Kia, Nissan, Mazda, Volvo, Fiat, Seat, Citroen, Dacia
- **Condition:** New, New OEM, New Aftermarket, Refurbished, Used - Like New, Used - Good, Used - Fair, For Parts
- **Part Type:** Engine Parts, Transmission, Brakes, Suspension, Electrical, Body Parts, Interior, Exhaust, Cooling, Fuel System, Steering, Wheels & Tires, Lighting, Filters, Belts & Hoses
- **Fuel Type:** Petrol/Gasoline, Diesel, Hybrid, Electric, LPG, CNG, Universal
- **Year Range:** 2020-2025, 2015-2019, 2010-2014, 2005-2009, 2000-2004, 1995-1999, 1990-1994, Before 1990, Universal
- **Part Origin:** OEM (Original), Aftermarket, Performance/Tuning, Used/Salvage
- **Warranty:** No Warranty, 30 Days, 90 Days, 6 Months, 1 Year, 2 Years, Lifetime

#### Audio Attributes
- **Type:** Headphones, Earbuds, Speakers, Soundbar, Amplifier, Receiver, Turntable, Microphone, Studio Monitors
- **Connectivity:** Wired, Bluetooth, Wi-Fi, USB, Optical, RCA
- **Noise Cancellation:** Active, Passive, None
- **Condition:** New, Like New, Excellent, Good, Fair

#### Art Attributes
- **Art Medium:** Oil Painting, Acrylic, Watercolor, Pastel, Pencil/Charcoal, Digital Art, Mixed Media, Sculpture, Photography, Print
- **Art Style:** Abstract, Realism, Impressionism, Modern, Contemporary, Pop Art, Street Art, Classical, Surrealism, Minimalist
- **Subject:** Portrait, Landscape, Still Life, Abstract, Nature, Urban, Figure, Animal, Floral
- **Original/Print:** Original, Limited Edition Print, Open Edition Print, Reproduction
- **Size Category:** Small (Under 30cm), Medium (30-60cm), Large (60-100cm), Extra Large (100cm+)

#### Antiques Attributes
- **Type:** Painting, Sculpture, Furniture, Ceramics, Glassware, Jewelry, Textiles, Books, Clocks, Silverware
- **Era/Period:** Pre-1800, 19th Century, Art Nouveau, Art Deco, Mid-Century Modern, Victorian, Edwardian
- **Authenticity:** Verified, Certificate Included, Unverified
- **Condition:** Excellent, Good, Fair, For Restoration, As Is

---

## 📊 Database Schema Reference

### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    name_bg TEXT,
    description TEXT,
    description_bg TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0
);
```

### Category Attributes Table
```sql
CREATE TABLE category_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    name_bg TEXT,
    attribute_type TEXT CHECK (attribute_type IN ('text', 'number', 'select', 'multiselect', 'boolean', 'date')),
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT true,
    options JSONB DEFAULT '[]',
    options_bg JSONB DEFAULT '[]',
    placeholder TEXT,
    placeholder_bg TEXT,
    validation_rules JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## ✅ Data Quality Notes

### Completeness
- ✅ All L0 categories have Bulgarian translations
- ✅ All L0 categories have icons (emoji)
- ✅ All categories have unique slugs
- ✅ Display order is set for all L0 categories (1-24)

### Potential Issues Found
- ⚠️ Some L1 categories under "Bulgarian Traditional" have 0 L2 categories (Bulgarian Wood Carving, Bulgarian Wines, Bulgarian Spirits, Bulgarian Herbs, Bulgarian Honey)
- ⚠️ Some L1 categories in "Health" have display_order = 0 (should be 1-5)
- ⚠️ Duplicate category types exist (e.g., "Folk Costumes" and "Bulgarian Folk Costumes")

### Recommendations
1. Add L2 categories to empty Bulgarian Traditional L1 categories
2. Fix display_order for Health L1 categories
3. Review and consolidate duplicate category entries
4. Add more attributes to categories with low attribute counts (Fashion: 16, Grocery: 16, Hobbies: 16)

---

*Document generated from Supabase database on December 8, 2025*
