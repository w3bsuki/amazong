# 📱 Electronics | Електроника

**Category Slug:** `electronics`  
**Icon:** 📱  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Electronics → Phones → Smartphones |
| **Attributes** | Filtering, Search, Campaigns | Brand, Storage, RAM, Screen Size |
| **Tags** | Dynamic Collections & SEO | "flagship", "budget", "gaming" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
📱 Electronics (L0)
│
├── 📱 Phones & Tablets (L1)
│   ├── Smartphones (L2)
│   ├── Tablets (L2)
│   ├── Smartwatches & Wearables (L2)
│   ├── Phone Accessories (L2)
│   └── Tablet Accessories (L2)
│
├── 💻 Computers (L1)
│   ├── Laptops (L2)
│   ├── Desktop Computers (L2)
│   ├── Monitors (L2)
│   ├── Computer Components (L2)
│   ├── Peripherals (L2)
│   ├── Networking (L2)
│   └── Storage Devices (L2)
│
├── 📺 TV & Audio (L1)
│   ├── Televisions (L2)
│   ├── Home Theater Systems (L2)
│   ├── Soundbars & Speakers (L2)
│   ├── Headphones & Earphones (L2)
│   ├── Streaming Devices (L2)
│   └── Projectors (L2)
│
├── 📷 Cameras & Photo (L1)
│   ├── Digital Cameras (L2)
│   ├── Camera Lenses (L2)
│   ├── Action Cameras (L2)
│   ├── Drones (L2)
│   ├── Camera Accessories (L2)
│   └── Studio Equipment (L2)
│
├── 🎮 Gaming (L1)
│   ├── Gaming Consoles (L2)
│   ├── Video Games (L2)
│   ├── Gaming Accessories (L2)
│   └── Gaming PCs & Laptops (L2)
│
└── 🔌 Smart Home & Appliances (L1)
    ├── Smart Home Devices (L2)
    ├── Home Security (L2)
    ├── Small Appliances (L2)
    └── Major Appliances (L2)
```

**Total Categories: 1 (L0) + 6 (L1) + 31 (L2) = 38 categories**

---

## 📊 Complete Category Reference

### L1: 📱 PHONES & TABLETS

#### L2: Smartphones | Смартфони
**Slug:** `phones-tablets/smartphones`  
**Description:** Mobile phones with touchscreen displays and app ecosystems.

**Types (Attribute, not subcategory):**

| EN | BG | Description |
|----|----|----|
| Flagship | Флагман | Premium, high-end models |
| Mid-range | Среден клас | Balanced price/performance |
| Budget | Бюджетен | Affordable options |
| Gaming Phone | Геймърски | Optimized for gaming |
| Rugged | Устойчив | Durable, water/dust resistant |
| Foldable | Сгъваем | Foldable screen |

---

#### L2: Tablets | Таблети
**Slug:** `phones-tablets/tablets`

| EN | BG | Description |
|----|----|----|
| Standard Tablet | Стандартен таблет | General use |
| Pro/Premium Tablet | Про таблет | Professional features |
| Kids Tablet | Детски таблет | For children |
| E-Reader | Четец | E-ink display |
| Drawing Tablet | Графичен таблет | For digital art |

---

#### L2: Smartwatches & Wearables | Смарт часовници и Носими устройства
**Slug:** `phones-tablets/wearables`

| EN | BG | Description |
|----|----|----|
| Smartwatch | Смарт часовник | Full-featured watch |
| Fitness Tracker | Фитнес гривна | Activity tracking |
| Sports Watch | Спортен часовник | GPS, workout modes |
| Hybrid Watch | Хибриден часовник | Analog with smart features |

---

#### L2: Phone Accessories | Аксесоари за телефони
**Slug:** `phones-tablets/phone-accessories`

- Cases & Covers | Калъфи
- Screen Protectors | Протектори
- Chargers & Cables | Зарядни и кабели
- Power Banks | Външна батерия
- Phone Holders | Стойки за телефон
- Wireless Chargers | Безжични зарядни
- PopSockets & Grips | Пръстени и грипове
- Selfie Sticks | Селфи стикове

---

#### L2: Tablet Accessories | Аксесоари за таблети
**Slug:** `phones-tablets/tablet-accessories`

- Cases & Covers | Калъфи
- Keyboard Cases | Клавиатурни калъфи
- Stylus Pens | Писалки
- Stands | Стойки
- Screen Protectors | Протектори

---

### L1: 💻 COMPUTERS

#### L2: Laptops | Лаптопи
**Slug:** `computers/laptops`

| EN | BG | Description |
|----|----|----|
| Ultrabook | Ултрабук | Thin and light |
| Gaming Laptop | Геймърски лаптоп | High-performance gaming |
| Business Laptop | Бизнес лаптоп | Professional use |
| 2-in-1 Laptop | Хибриден лаптоп | Convertible/detachable |
| Chromebook | Хромбук | Chrome OS |
| Workstation | Работна станция | Professional workload |

---

#### L2: Desktop Computers | Настолни компютри
**Slug:** `computers/desktops`

| EN | BG | Description |
|----|----|----|
| Gaming PC | Геймърски компютър | High-performance |
| Office PC | Офис компютър | Business use |
| All-in-One | Всичко в едно | Integrated display |
| Mini PC | Мини компютър | Compact form factor |
| Custom Build | Конфигурация по поръчка | Self-assembled |
| Workstation | Работна станция | Professional |

---

#### L2: Monitors | Монитори
**Slug:** `computers/monitors`

| EN | BG | Description |
|----|----|----|
| Gaming Monitor | Геймърски монитор | High refresh rate |
| Office Monitor | Офис монитор | Standard use |
| Ultrawide | Ултраширок | 21:9 or wider |
| 4K/UHD Monitor | 4K монитор | High resolution |
| Curved Monitor | Извит монитор | Curved panel |
| Professional | Професионален | Color accurate |

---

#### L2: Computer Components | Компютърни компоненти
**Slug:** `computers/components`

- Processors (CPU) | Процесори
- Graphics Cards (GPU) | Видеокарти
- Memory (RAM) | Оперативна памет
- Motherboards | Дънни платки
- Power Supplies | Захранвания
- Cases | Кутии
- Cooling | Охлаждане
- Fans | Вентилатори

---

#### L2: Peripherals | Периферия
**Slug:** `computers/peripherals`

- Keyboards | Клавиатури
- Mice | Мишки
- Webcams | Уебкамери
- Mousepads | Подложки за мишка
- USB Hubs | USB хъбове
- Docking Stations | Докинг станции
- External Drives | Външни дискове

---

#### L2: Networking | Мрежово оборудване
**Slug:** `computers/networking`

- Routers | Рутери
- Switches | Суичове
- Access Points | Точки за достъп
- Network Cards | Мрежови карти
- Modems | Модеми
- Range Extenders | Усилватели на сигнал
- Mesh Systems | Меш системи

---

#### L2: Storage Devices | Устройства за съхранение
**Slug:** `computers/storage`

- SSDs | SSD дискове
- HDDs | HDD дискове
- NVMe Drives | NVMe дискове
- External SSDs | Външни SSD
- External HDDs | Външни HDD
- USB Flash Drives | USB флашки
- Memory Cards | Карти памет
- NAS Systems | NAS системи

---

### L1: 📺 TV & AUDIO

#### L2: Televisions | Телевизори
**Slug:** `tv-audio/televisions`

| EN | BG | Description |
|----|----|----|
| LED TV | LED телевизор | Standard LED |
| OLED TV | OLED телевизор | Premium OLED |
| QLED TV | QLED телевизор | Quantum dot |
| Smart TV | Смарт телевизор | Connected features |
| 4K UHD TV | 4K телевизор | Ultra HD resolution |
| 8K TV | 8K телевизор | 8K resolution |

---

#### L2: Home Theater Systems | Домашно кино
**Slug:** `tv-audio/home-theater`

- Complete Systems | Цялостни системи
- AV Receivers | AV ресивъри
- Subwoofers | Събуфери
- Center Speakers | Централни тонколони
- Surround Speakers | Съраунд тонколони

---

#### L2: Soundbars & Speakers | Саундбарове и Тонколони
**Slug:** `tv-audio/speakers`

- Soundbars | Саундбарове
- Bluetooth Speakers | Bluetooth тонколони
- Smart Speakers | Смарт тонколони
- Portable Speakers | Портативни тонколони
- Bookshelf Speakers | Рафтови тонколони
- Floor Speakers | Подови тонколони

---

#### L2: Headphones & Earphones | Слушалки
**Slug:** `tv-audio/headphones`

| EN | BG | Description |
|----|----|----|
| Over-Ear | Над ушите | Full-size headphones |
| On-Ear | На ушите | Compact headphones |
| In-Ear/Earbuds | Вътрешноушни | In-ear |
| True Wireless | Напълно безжични | No wire between ears |
| Gaming Headset | Геймърски слушалки | With microphone |
| Noise Cancelling | С шумопотискане | ANC technology |

---

#### L2: Streaming Devices | Стрийминг устройства
**Slug:** `tv-audio/streaming`

- Streaming Sticks | Стрийминг стикове
- TV Boxes | ТВ боксове
- Android TV | Android TV
- Apple TV | Apple TV
- Chromecast | Chromecast

---

#### L2: Projectors | Проектори
**Slug:** `tv-audio/projectors`

| EN | BG | Description |
|----|----|----|
| Home Theater | Домашно кино | For movies |
| Portable | Преносим | Compact/mini |
| Business | Бизнес | Presentations |
| 4K Projector | 4K проектор | Ultra HD |
| Short Throw | Късофокусен | Close distance |
| Laser | Лазерен | Laser light source |

---

### L1: 📷 CAMERAS & PHOTO

#### L2: Digital Cameras | Цифрови фотоапарати
**Slug:** `cameras/digital-cameras`

| EN | BG | Description |
|----|----|----|
| DSLR | DSLR | Mirror camera |
| Mirrorless | Безогледален | Mirrorless interchangeable |
| Compact | Компактен | Point and shoot |
| Medium Format | Среден формат | Professional |
| Instant Camera | Моментален | Prints instantly |
| Film Camera | Филмов | Analog |

---

#### L2: Camera Lenses | Обективи
**Slug:** `cameras/lenses`

- Wide Angle | Широкоъгълни
- Standard/Kit | Стандартни
- Telephoto | Телеобективи
- Prime | Фикси
- Zoom | Зуум
- Macro | Макро
- Fisheye | Рибешко око

---

#### L2: Action Cameras | Екшън камери
**Slug:** `cameras/action-cameras`

- GoPro | GoPro
- DJI Action | DJI Action
- 360 Cameras | 360 камери
- Waterproof | Водоустойчиви
- Body Cameras | Боди камери

---

#### L2: Drones | Дронове
**Slug:** `cameras/drones`

| EN | BG | Description |
|----|----|----|
| Consumer | Потребителски | For hobbyists |
| Professional | Професионален | Film/photo work |
| Racing | Състезателен | FPV racing |
| Mini/Nano | Мини | Compact drones |
| Agricultural | Земеделски | For farming |

---

#### L2: Camera Accessories | Аксесоари за камери
**Slug:** `cameras/accessories`

- Tripods | Триподи
- Camera Bags | Чанти за камери
- Memory Cards | Карти памет
- Batteries | Батерии
- Flashes | Светкавици
- Filters | Филтри
- Gimbals | Стабилизатори
- Straps | Каишки
- Cleaning Kits | Комплекти за почистване

---

#### L2: Studio Equipment | Студио оборудване
**Slug:** `cameras/studio`

- Lighting Kits | Осветление
- Backgrounds | Фонове
- Softboxes | Софтбоксове
- Light Stands | Стойки за светлина
- Reflectors | Рефлектори
- Green Screens | Зелени екрани

---

### L1: 🎮 GAMING

#### L2: Gaming Consoles | Игрови конзоли
**Slug:** `gaming/consoles`

- PlayStation | PlayStation
- Xbox | Xbox
- Nintendo Switch | Nintendo Switch
- Retro Consoles | Ретро конзоли
- Handheld Consoles | Преносими конзоли

---

#### L2: Video Games | Видео игри
**Slug:** `gaming/games`

**Platform (Attribute):**
- PlayStation | PlayStation
- Xbox | Xbox
- Nintendo | Nintendo
- PC | PC

**Genre (Attribute):**
- Action | Екшън
- Adventure | Приключенски
- RPG | Ролева игра
- Sports | Спортни
- Racing | Състезателни
- Shooter | Шутър
- Strategy | Стратегии
- Simulation | Симулатори

---

#### L2: Gaming Accessories | Геймърски аксесоари
**Slug:** `gaming/accessories`

- Controllers | Контролери
- Gaming Headsets | Геймърски слушалки
- Gaming Chairs | Геймърски столове
- VR Headsets | VR очила
- Racing Wheels | Волани
- Flight Sticks | Джойстици
- Arcade Sticks | Аркадни стикове
- Capture Cards | Кепчър карти

---

#### L2: Gaming PCs & Laptops | Геймърски компютри
**Slug:** `gaming/gaming-pcs`

- Pre-built Gaming PCs | Готови геймърски компютри
- Gaming Laptops | Геймърски лаптопи
- Custom Gaming Builds | Конфигурации по поръчка
- Streaming PCs | Стрийминг компютри

---

### L1: 🔌 SMART HOME & APPLIANCES

#### L2: Smart Home Devices | Смарт дом устройства
**Slug:** `smart-home/devices`

- Smart Displays | Смарт дисплеи
- Smart Speakers | Смарт тонколони
- Smart Lighting | Смарт осветление
- Smart Plugs | Смарт контакти
- Smart Thermostats | Смарт термостати
- Smart Locks | Смарт ключалки
- Robot Vacuums | Прахосмукачки роботи
- Smart Sensors | Смарт сензори

---

#### L2: Home Security | Домашна сигурност
**Slug:** `smart-home/security`

- Security Cameras | Камери за сигурност
- Video Doorbells | Видео звънци
- Alarm Systems | Алармени системи
- Motion Sensors | Сензори за движение
- Smart Safes | Смарт сейфове

---

#### L2: Small Appliances | Малки уреди
**Slug:** `smart-home/small-appliances`

- Coffee Makers | Кафемашини
- Blenders | Блендери
- Toasters | Тостери
- Electric Kettles | Електрически кани
- Air Fryers | Еър фрайъри
- Vacuum Cleaners | Прахосмукачки
- Irons | Ютии
- Hair Dryers | Сешоари

---

#### L2: Major Appliances | Големи уреди
**Slug:** `smart-home/major-appliances`

- Refrigerators | Хладилници
- Washing Machines | Перални
- Dryers | Сушилни
- Dishwashers | Съдомиялни
- Ovens & Stoves | Фурни и печки
- Microwaves | Микровълнови
- Air Conditioners | Климатици

---

## 🏷️ Attribute System (The Power Layer)

### Phone/Tablet Attributes Schema

```typescript
interface PhoneProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;           // e.g., "phones-tablets/smartphones"
  
  // === BASIC INFO ===
  title: string;                 // "iPhone 15 Pro Max 256GB"
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === DEVICE IDENTIFICATION ===
  brand: string;                 // "Apple"
  model: string;                 // "iPhone 15 Pro Max"
  variant: string;               // "256GB Natural Titanium"
  
  // === SPECIFICATIONS ===
  storage: number;               // 256 (GB)
  ram: number;                   // 8 (GB)
  screen_size: number;           // 6.7 (inches)
  screen_type: ScreenType;
  resolution: string;            // "2796x1290"
  processor: string;             // "A17 Pro"
  battery_capacity: number;      // 4441 (mAh)
  
  // === CAMERA ===
  main_camera: string;           // "48MP + 12MP + 12MP"
  front_camera: string;          // "12MP"
  
  // === CONNECTIVITY ===
  network: NetworkType;
  dual_sim: boolean;
  esim: boolean;
  nfc: boolean;
  wireless_charging: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  warranty: string;              // "12 months", "No warranty"
  original_box: boolean;
  accessories_included: string[];
  
  // === APPEARANCE ===
  color: string;
  
  // === FEATURES (Arrays) ===
  features: string[];            // ["Face ID", "ProMotion", "USB-C"]
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  // === LISTING META ===
  images: string[];
  featured: boolean;
  promoted: boolean;
  
  // === SYSTEM TAGS ===
  tags: string[];                // ["flagship", "5g", "gaming"]
}

// === ENUMS ===
type ScreenType = 'LCD' | 'OLED' | 'AMOLED' | 'Super AMOLED' | 'Retina' | 'IPS';
type NetworkType = '5G' | '4G LTE' | '3G';
type ProductCondition = 'new' | 'like_new' | 'used' | 'for_parts';
```

### Computer/Laptop Attributes Schema

```typescript
interface ComputerProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  
  // === COMPUTER IDENTIFICATION ===
  brand: string;                 // "Apple", "Dell", "HP"
  model: string;                 // "MacBook Pro 14"
  
  // === SPECIFICATIONS ===
  processor_brand: string;       // "Apple", "Intel", "AMD"
  processor_model: string;       // "M3 Pro", "Core i7-13700H"
  processor_cores: number;
  ram: number;                   // 16 (GB)
  ram_type: string;              // "DDR5", "LPDDR5"
  storage_type: StorageType;
  storage_capacity: number;      // 512 (GB)
  
  // === DISPLAY (for laptops/monitors) ===
  screen_size: number;
  screen_resolution: string;
  screen_type: string;
  refresh_rate: number;          // 120 (Hz)
  touch_screen: boolean;
  
  // === GRAPHICS ===
  gpu_brand: string;             // "NVIDIA", "AMD", "Intel"
  gpu_model: string;             // "RTX 4080", "RX 7900"
  gpu_vram: number;
  
  // === CONNECTIVITY ===
  wifi: string;                  // "WiFi 6E"
  bluetooth: string;             // "5.3"
  ports: string[];               // ["USB-C", "HDMI", "Thunderbolt 4"]
  
  // === CONDITION ===
  condition: ProductCondition;
  warranty: string;
  battery_health?: number;       // 95 (% for laptops)
  
  // === APPEARANCE ===
  color: string;
  
  // === FEATURES ===
  features: string[];
  
  // === SELLER INFO ===
  seller_type: 'private' | 'dealer';
  location_city: string;
  location_region: string;
  
  images: string[];
}

type StorageType = 'SSD' | 'HDD' | 'NVMe' | 'Hybrid';
```

### TV/Audio Attributes Schema

```typescript
interface TVProduct {
  id: string;
  category_id: string;
  
  title: string;
  description: string;
  price: number;
  
  // === TV IDENTIFICATION ===
  brand: string;
  model: string;
  year: number;
  
  // === DISPLAY ===
  screen_size: number;           // 55 (inches)
  display_type: DisplayType;
  resolution: Resolution;
  hdr_support: string[];         // ["HDR10", "Dolby Vision"]
  refresh_rate: number;          // 120
  
  // === SMART FEATURES ===
  smart_tv: boolean;
  operating_system: string;      // "webOS", "Tizen", "Android TV"
  voice_assistant: string[];     // ["Google Assistant", "Alexa"]
  
  // === AUDIO ===
  speakers_power: number;        // 40 (W)
  dolby_atmos: boolean;
  
  // === CONNECTIVITY ===
  hdmi_ports: number;
  usb_ports: number;
  wifi: boolean;
  bluetooth: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  warranty: string;
  
  seller_type: 'private' | 'dealer';
  location_city: string;
  
  images: string[];
}

type DisplayType = 'LED' | 'OLED' | 'QLED' | 'Mini-LED' | 'Micro-LED';
type Resolution = '720p' | '1080p' | '4K' | '8K';
```

---

## 🎯 Campaign & Filter Examples

### Dynamic Campaigns (No Extra Categories Needed)

```sql
-- 🏷️ "Apple Ecosystem" Campaign
SELECT * FROM products 
WHERE category LIKE 'electronics/%'
AND attributes->>'brand' = 'Apple';

-- 🏷️ "Gaming Setup" Campaign  
SELECT * FROM products 
WHERE (category LIKE 'gaming/%' OR category = 'computers/gaming-pcs')
AND attributes->>'condition' IN ('new', 'like_new');

-- 🏷️ "Budget Smartphones Under 500 лв" Campaign
SELECT * FROM products 
WHERE category = 'phones-tablets/smartphones'
AND price <= 500
AND attributes->>'condition' = 'new';

-- 🏷️ "4K Entertainment" Campaign
SELECT * FROM products 
WHERE category IN ('tv-audio/televisions', 'tv-audio/projectors')
AND attributes->>'resolution' = '4K';

-- 🏷️ "Work From Home Bundle"
SELECT * FROM products 
WHERE category IN ('computers/laptops', 'computers/monitors', 'computers/peripherals')
AND price BETWEEN 200 AND 3000;
```

### Search Filter Configuration

```typescript
const phoneFilters = {
  // Price & Location (Always visible)
  price: { type: 'range', min: 0, max: 10000, step: 50 },
  location: { type: 'location', regions: bulgarianRegions },
  
  // Main Filters
  brand: { type: 'searchable-select', options: phoneBrands },
  model: { type: 'searchable-select', dependsOn: 'brand' },
  
  // Specifications
  storage: { type: 'multi-select', options: [32, 64, 128, 256, 512, 1024] },
  ram: { type: 'multi-select', options: [2, 3, 4, 6, 8, 12, 16] },
  screen_size: { type: 'range', min: 4.0, max: 7.5, step: 0.1 },
  
  // Features
  network: { type: 'multi-select', options: ['5G', '4G LTE', '3G'] },
  dual_sim: { type: 'checkbox' },
  
  // Condition
  condition: { type: 'multi-select' },
  
  // Seller
  seller_type: { type: 'radio', options: ['all', 'private', 'dealer'] },
};

const laptopFilters = {
  price: { type: 'range', min: 0, max: 20000, step: 100 },
  brand: { type: 'searchable-select', options: laptopBrands },
  
  processor_brand: { type: 'multi-select', options: ['Intel', 'AMD', 'Apple'] },
  ram: { type: 'multi-select', options: [4, 8, 16, 32, 64] },
  storage_capacity: { type: 'range', min: 128, max: 4096 },
  screen_size: { type: 'range', min: 11, max: 18 },
  
  gpu_brand: { type: 'multi-select', options: ['NVIDIA', 'AMD', 'Intel', 'Apple'] },
  
  condition: { type: 'multi-select' },
  seller_type: { type: 'radio' },
};
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('electronics', 'Electronics', 'Електроника', 'electronics', 'electronics', NULL, 0, '📱', 2, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('phones-tablets', 'Phones & Tablets', 'Телефони и таблети', 'phones-tablets', 'electronics/phones-tablets', 'electronics', 1, '📱', 1, true),
('computers', 'Computers', 'Компютри', 'computers', 'electronics/computers', 'electronics', 1, '💻', 2, true),
('tv-audio', 'TV & Audio', 'ТВ и аудио', 'tv-audio', 'electronics/tv-audio', 'electronics', 1, '📺', 3, true),
('cameras', 'Cameras & Photo', 'Камери и фото', 'cameras', 'electronics/cameras', 'electronics', 1, '📷', 4, true),
('gaming', 'Gaming', 'Гейминг', 'gaming', 'electronics/gaming', 'electronics', 1, '🎮', 5, true),
('smart-home', 'Smart Home & Appliances', 'Смарт дом и уреди', 'smart-home', 'electronics/smart-home', 'electronics', 1, '🔌', 6, true);

-- L2: Phones & Tablets
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('phones-smartphones', 'Smartphones', 'Смартфони', 'smartphones', 'phones-tablets/smartphones', 'phones-tablets', 2, '📱', 1, true),
('phones-tablets-main', 'Tablets', 'Таблети', 'tablets', 'phones-tablets/tablets', 'phones-tablets', 2, '📲', 2, true),
('phones-wearables', 'Smartwatches & Wearables', 'Смарт часовници', 'wearables', 'phones-tablets/wearables', 'phones-tablets', 2, '⌚', 3, true),
('phones-accessories', 'Phone Accessories', 'Аксесоари за телефони', 'phone-accessories', 'phones-tablets/phone-accessories', 'phones-tablets', 2, '🔌', 4, true),
('tablets-accessories', 'Tablet Accessories', 'Аксесоари за таблети', 'tablet-accessories', 'phones-tablets/tablet-accessories', 'phones-tablets', 2, '⌨️', 5, true);

-- L2: Computers
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('computers-laptops', 'Laptops', 'Лаптопи', 'laptops', 'computers/laptops', 'computers', 2, '💻', 1, true),
('computers-desktops', 'Desktop Computers', 'Настолни компютри', 'desktops', 'computers/desktops', 'computers', 2, '🖥️', 2, true),
('computers-monitors', 'Monitors', 'Монитори', 'monitors', 'computers/monitors', 'computers', 2, '🖥️', 3, true),
('computers-components', 'Computer Components', 'Компютърни компоненти', 'components', 'computers/components', 'computers', 2, '🔧', 4, true),
('computers-peripherals', 'Peripherals', 'Периферия', 'peripherals', 'computers/peripherals', 'computers', 2, '🖱️', 5, true),
('computers-networking', 'Networking', 'Мрежово оборудване', 'networking', 'computers/networking', 'computers', 2, '🌐', 6, true),
('computers-storage', 'Storage Devices', 'Устройства за съхранение', 'storage', 'computers/storage', 'computers', 2, '💾', 7, true);

-- L2: TV & Audio
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('tv-televisions', 'Televisions', 'Телевизори', 'televisions', 'tv-audio/televisions', 'tv-audio', 2, '📺', 1, true),
('tv-home-theater', 'Home Theater Systems', 'Домашно кино', 'home-theater', 'tv-audio/home-theater', 'tv-audio', 2, '🎬', 2, true),
('tv-speakers', 'Soundbars & Speakers', 'Саундбарове и тонколони', 'speakers', 'tv-audio/speakers', 'tv-audio', 2, '🔊', 3, true),
('tv-headphones', 'Headphones & Earphones', 'Слушалки', 'headphones', 'tv-audio/headphones', 'tv-audio', 2, '🎧', 4, true),
('tv-streaming', 'Streaming Devices', 'Стрийминг устройства', 'streaming', 'tv-audio/streaming', 'tv-audio', 2, '📡', 5, true),
('tv-projectors', 'Projectors', 'Проектори', 'projectors', 'tv-audio/projectors', 'tv-audio', 2, '📽️', 6, true);

-- L2: Cameras
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cameras-digital', 'Digital Cameras', 'Цифрови фотоапарати', 'digital-cameras', 'cameras/digital-cameras', 'cameras', 2, '📷', 1, true),
('cameras-lenses', 'Camera Lenses', 'Обективи', 'lenses', 'cameras/lenses', 'cameras', 2, '🔭', 2, true),
('cameras-action', 'Action Cameras', 'Екшън камери', 'action-cameras', 'cameras/action-cameras', 'cameras', 2, '📹', 3, true),
('cameras-drones', 'Drones', 'Дронове', 'drones', 'cameras/drones', 'cameras', 2, '🚁', 4, true),
('cameras-accessories', 'Camera Accessories', 'Аксесоари за камери', 'camera-accessories', 'cameras/camera-accessories', 'cameras', 2, '🎒', 5, true),
('cameras-studio', 'Studio Equipment', 'Студио оборудване', 'studio', 'cameras/studio', 'cameras', 2, '💡', 6, true);

-- L2: Gaming
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gaming-consoles', 'Gaming Consoles', 'Игрови конзоли', 'consoles', 'gaming/consoles', 'gaming', 2, '🎮', 1, true),
('gaming-games', 'Video Games', 'Видео игри', 'games', 'gaming/games', 'gaming', 2, '💿', 2, true),
('gaming-accessories', 'Gaming Accessories', 'Геймърски аксесоари', 'gaming-accessories', 'gaming/gaming-accessories', 'gaming', 2, '🎯', 3, true),
('gaming-pcs', 'Gaming PCs & Laptops', 'Геймърски компютри', 'gaming-pcs', 'gaming/gaming-pcs', 'gaming', 2, '🖥️', 4, true);

-- L2: Smart Home
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('smart-devices', 'Smart Home Devices', 'Смарт дом устройства', 'devices', 'smart-home/devices', 'smart-home', 2, '🏠', 1, true),
('smart-security', 'Home Security', 'Домашна сигурност', 'security', 'smart-home/security', 'smart-home', 2, '🔒', 2, true),
('smart-small-appliances', 'Small Appliances', 'Малки уреди', 'small-appliances', 'smart-home/small-appliances', 'smart-home', 2, '☕', 3, true),
('smart-major-appliances', 'Major Appliances', 'Големи уреди', 'major-appliances', 'smart-home/major-appliances', 'smart-home', 2, '🧊', 4, true);
```

### Electronics Brands Reference Data

```sql
-- Popular electronics brands for Bulgaria
INSERT INTO public.electronics_brands (id, name, category, is_popular, display_order) VALUES
-- Phones
('apple', 'Apple', 'phones', true, 1),
('samsung', 'Samsung', 'phones', true, 2),
('xiaomi', 'Xiaomi', 'phones', true, 3),
('huawei', 'Huawei', 'phones', true, 4),
('google', 'Google', 'phones', false, 5),
('oneplus', 'OnePlus', 'phones', false, 6),
('oppo', 'OPPO', 'phones', false, 7),
('vivo', 'Vivo', 'phones', false, 8),
('realme', 'Realme', 'phones', false, 9),
('motorola', 'Motorola', 'phones', false, 10),
('nokia', 'Nokia', 'phones', false, 11),
('sony-mobile', 'Sony', 'phones', false, 12),

-- Laptops
('apple-laptops', 'Apple', 'laptops', true, 1),
('lenovo', 'Lenovo', 'laptops', true, 2),
('hp', 'HP', 'laptops', true, 3),
('dell', 'Dell', 'laptops', true, 4),
('asus', 'ASUS', 'laptops', true, 5),
('acer', 'Acer', 'laptops', true, 6),
('msi', 'MSI', 'laptops', false, 7),
('razer', 'Razer', 'laptops', false, 8),

-- TVs
('samsung-tv', 'Samsung', 'tvs', true, 1),
('lg-tv', 'LG', 'tvs', true, 2),
('sony-tv', 'Sony', 'tvs', true, 3),
('philips-tv', 'Philips', 'tvs', true, 4),
('tcl', 'TCL', 'tvs', false, 5),
('hisense', 'Hisense', 'tvs', false, 6);
```

---

## 🔍 Example JSONB Queries

```sql
-- Find all iPhone 15 models
SELECT * FROM products 
WHERE category_id = 'phones-smartphones'
AND attributes->>'brand' = 'Apple'
AND attributes->>'model' LIKE 'iPhone 15%';

-- Find gaming laptops with RTX graphics under 4000 лв
SELECT * FROM products 
WHERE category_id IN ('computers-laptops', 'gaming-pcs')
AND attributes->>'gpu_brand' = 'NVIDIA'
AND attributes->>'gpu_model' LIKE 'RTX%'
AND price <= 4000;

-- Find 4K TVs 55" or larger
SELECT * FROM products 
WHERE category_id = 'tv-televisions'
AND attributes->>'resolution' = '4K'
AND (attributes->>'screen_size')::numeric >= 55;

-- Find products with specific features
SELECT * FROM products 
WHERE category_id = 'phones-smartphones'
AND attributes->'features' ? '5G'
AND attributes->'features' ? 'wireless_charging';
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Electronics | Електроника |
| Phones & Tablets | Телефони и таблети |
| Smartphones | Смартфони |
| Tablets | Таблети |
| Smartwatches & Wearables | Смарт часовници и носими устройства |
| Computers | Компютри |
| Laptops | Лаптопи |
| Desktop Computers | Настолни компютри |
| Monitors | Монитори |
| TV & Audio | ТВ и аудио |
| Televisions | Телевизори |
| Headphones | Слушалки |
| Cameras & Photo | Камери и фото |
| Digital Cameras | Цифрови фотоапарати |
| Drones | Дронове |
| Gaming | Гейминг |
| Gaming Consoles | Игрови конзоли |
| Video Games | Видео игри |
| Smart Home | Смарт дом |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Model | Модел |
| Storage | Памет |
| RAM | RAM |
| Screen Size | Размер на екрана |
| Processor | Процесор |
| Graphics Card | Видеокарта |
| Condition | Състояние |
| Price | Цена |
| Color | Цвят |
| Resolution | Резолюция |
| Refresh Rate | Честота на опресняване |

### Attribute Values

| EN | BG |
|----|----|
| New | Ново |
| Like New | Като ново |
| Used | Употребявано |
| For Parts | За части |
| Flagship | Флагман |
| Budget | Бюджетен |
| Gaming | Геймърски |
| Professional | Професионален |
| Wireless | Безжичен |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add electronics brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/electronics (tree structure)
- [ ] GET /categories/electronics/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Product listing form (multi-step)
- [ ] Search filters component
- [ ] Results grid/list view
- [ ] Product detail page

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 38  
**Created:** December 3, 2025
