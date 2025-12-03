# 📷 Cameras & Photo | Камери и фото

**Category Slug:** `cameras-photo`  
**Icon:** 📷  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Cameras → DSLR → Full Frame |
| **Attributes** | Filtering, Search, Campaigns | Brand, Megapixels, Sensor |
| **Tags** | Dynamic Collections & SEO | "professional", "4k-video" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
📷 Cameras & Photo (L0)
│
├── 📸 Digital Cameras (L1)
│   ├── DSLR Cameras (L2)
│   ├── Mirrorless Cameras (L2)
│   ├── Compact Cameras (L2)
│   ├── Bridge Cameras (L2)
│   ├── Medium Format (L2)
│   └── Instant Cameras (L2)
│
├── 🎥 Video Cameras (L1)
│   ├── Camcorders (L2)
│   ├── Action Cameras (L2)
│   ├── Cinema Cameras (L2)
│   ├── Webcams (L2)
│   └── 360° Cameras (L2)
│
├── 🔭 Lenses (L1)
│   ├── Prime Lenses (L2)
│   ├── Zoom Lenses (L2)
│   ├── Wide Angle (L2)
│   ├── Telephoto (L2)
│   ├── Macro Lenses (L2)
│   └── Specialty Lenses (L2)
│
├── 💡 Lighting (L1)
│   ├── Flashes (L2)
│   ├── Studio Lights (L2)
│   ├── LED Panels (L2)
│   ├── Softboxes (L2)
│   ├── Ring Lights (L2)
│   └── Light Modifiers (L2)
│
├── 🎒 Camera Bags (L1)
│   ├── Backpacks (L2)
│   ├── Shoulder Bags (L2)
│   ├── Hard Cases (L2)
│   ├── Sling Bags (L2)
│   └── Rolling Cases (L2)
│
├── 📐 Tripods & Supports (L1)
│   ├── Tripods (L2)
│   ├── Monopods (L2)
│   ├── Gimbals (L2)
│   ├── Stabilizers (L2)
│   ├── Sliders (L2)
│   └── Ball Heads (L2)
│
├── 💾 Memory & Storage (L1)
│   ├── SD Cards (L2)
│   ├── CF Cards (L2)
│   ├── Card Readers (L2)
│   └── External Drives (L2)
│
├── 🔋 Power & Batteries (L1)
│   ├── Camera Batteries (L2)
│   ├── Battery Grips (L2)
│   ├── Chargers (L2)
│   └── Power Banks (L2)
│
├── 🖼️ Photo Accessories (L1)
│   ├── Filters (L2)
│   ├── Lens Hoods (L2)
│   ├── Remote Controls (L2)
│   ├── Cleaning Kits (L2)
│   └── Straps (L2)
│
├── 🎞️ Film & Analog (L1)
│   ├── Film Cameras (L2)
│   ├── Film Rolls (L2)
│   ├── Darkroom Equipment (L2)
│   └── Instant Film (L2)
│
└── 🖥️ Photo Editing (L1)
    ├── Monitors (L2)
    ├── Graphics Tablets (L2)
    ├── Color Calibrators (L2)
    └── Software (L2)
```

**Total Categories: 1 (L0) + 11 (L1) + 54 (L2) = 66 categories**

---

## 📊 Complete Category Reference

### L1: 📸 DIGITAL CAMERAS | ДИГИТАЛНИ КАМЕРИ

#### L2: DSLR Cameras | DSLR камери
**Slug:** `cameras-photo/digital/dslr`

| EN | BG | Description |
|----|----|----|
| Full Frame | Пълен кадър | Professional |
| APS-C | APS-C | Enthusiast |
| Entry Level | Начално ниво | Beginner |
| Professional | Професионални | Pro body |

**Top Brands:**
- Canon | Канон
- Nikon | Никон
- Sony | Сони
- Pentax | Пентакс

---

#### L2: Mirrorless Cameras | Безогледални камери
**Slug:** `cameras-photo/digital/mirrorless`

| EN | BG | Description |
|----|----|----|
| Full Frame | Пълен кадър | Pro |
| APS-C | APS-C | Compact |
| Micro Four Thirds | MFT | Smaller sensor |
| Entry Level | Начално ниво | Beginner |

**Top Brands:**
- Sony | Сони
- Canon | Канон
- Nikon | Никон
- Fujifilm | Фуджифилм
- Panasonic | Панасоник
- Olympus | Олимпус

---

### L1: 🎥 VIDEO CAMERAS | ВИДЕОКАМЕРИ

#### L2: Action Cameras | Екшън камери
**Slug:** `cameras-photo/video/action`

| EN | BG | Description |
|----|----|----|
| 4K Action | 4K екшън | High res |
| 360° Action | 360° екшън | Immersive |
| Waterproof | Водоустойчиви | Diving |
| Budget | Бюджетни | Affordable |

**Popular Brands:**
- GoPro | ГоПро
- DJI | Ди Джей Ай
- Insta360 | Инста360

---

### L1: 🔭 LENSES | ОБЕКТИВИ

#### L2: Prime Lenses | Обективи с фиксирано фокусно
**Slug:** `cameras-photo/lenses/prime`

| EN | BG | Description |
|----|----|----|
| 35mm | 35мм | Standard |
| 50mm | 50мм | Nifty fifty |
| 85mm | 85мм | Portrait |
| 24mm | 24мм | Wide |
| 135mm | 135мм | Telephoto |

---

#### L2: Zoom Lenses | Зуум обективи
**Slug:** `cameras-photo/lenses/zoom`

| EN | BG | Description |
|----|----|----|
| Standard Zoom | Стандартен зуум | Kit lens |
| Telephoto Zoom | Телефото зуум | Long range |
| Wide Zoom | Широкоъгълен зуум | Landscape |
| Superzoom | Суперзуум | All-in-one |

---

### L1: 💡 LIGHTING | ОСВЕТЛЕНИЕ

#### L2: Studio Lights | Студийно осветление
**Slug:** `cameras-photo/lighting/studio`

| EN | BG | Description |
|----|----|----|
| Strobe Lights | Светкавици | Flash |
| Continuous | Постоянно | Video/Photo |
| Monolight | Монолайт | Single unit |
| Studio Kits | Комплекти | Full setup |

**Brands:**
- Godox | Годокс
- Profoto | Профото
- Broncolor | Бронколор
- Elinchrom | Елинхром

---

---

## 🏷️ Attribute System (The Power Layer)

### Camera Product Attributes Schema

```typescript
interface CameraProduct {
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
  
  // === CAMERA SPECS ===
  sensor_type?: SensorType;
  sensor_size?: SensorSize;
  megapixels?: number;
  iso_range?: string;
  
  // === VIDEO SPECS ===
  video_resolution?: VideoResolution;
  fps_max?: number;
  
  // === LENS SPECS (for lenses) ===
  focal_length_mm?: string;
  aperture_max?: number;
  mount_type?: string;
  
  // === PHYSICAL ===
  weight_g?: number;
  weather_sealed: boolean;
  
  // === CONDITION ===
  condition: ProductCondition;
  shutter_count?: number;
  warranty_months?: number;
  
  // === INCLUDED ===
  includes_box: boolean;
  includes_accessories?: string[];
  
  seller_type: 'private' | 'store' | 'professional';
  location_city: string;
  
  images: string[];
}

type SensorType = 'cmos' | 'bsi_cmos' | 'ccd' | 'stacked_cmos';
type SensorSize = 'full_frame' | 'aps_c' | 'mft' | 'medium_format' | '1_inch';
type VideoResolution = '8k' | '4k' | '1080p' | '720p';
type ProductCondition = 'new' | 'like_new' | 'excellent' | 'good' | 'fair';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cameras-photo', 'Cameras & Photo', 'Камери и фото', 'cameras-photo', 'cameras-photo', NULL, 0, '📷', 25, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cp-digital', 'Digital Cameras', 'Дигитални камери', 'digital', 'cameras-photo/digital', 'cameras-photo', 1, '📸', 1, true),
('cp-video', 'Video Cameras', 'Видеокамери', 'video', 'cameras-photo/video', 'cameras-photo', 1, '🎥', 2, true),
('cp-lenses', 'Lenses', 'Обективи', 'lenses', 'cameras-photo/lenses', 'cameras-photo', 1, '🔭', 3, true),
('cp-lighting', 'Lighting', 'Осветление', 'lighting', 'cameras-photo/lighting', 'cameras-photo', 1, '💡', 4, true),
('cp-bags', 'Camera Bags', 'Чанти за камери', 'bags', 'cameras-photo/bags', 'cameras-photo', 1, '🎒', 5, true),
('cp-tripods', 'Tripods & Supports', 'Статivi', 'tripods', 'cameras-photo/tripods', 'cameras-photo', 1, '📐', 6, true),
('cp-memory', 'Memory & Storage', 'Памет и съхранение', 'memory', 'cameras-photo/memory', 'cameras-photo', 1, '💾', 7, true),
('cp-power', 'Power & Batteries', 'Захранване', 'power', 'cameras-photo/power', 'cameras-photo', 1, '🔋', 8, true),
('cp-accessories', 'Photo Accessories', 'Аксесоари', 'accessories', 'cameras-photo/accessories', 'cameras-photo', 1, '🖼️', 9, true),
('cp-film', 'Film & Analog', 'Филм и аналогово', 'film', 'cameras-photo/film', 'cameras-photo', 1, '🎞️', 10, true),
('cp-editing', 'Photo Editing', 'Обработка', 'editing', 'cameras-photo/editing', 'cameras-photo', 1, '🖥️', 11, true);

-- L2: Digital Cameras
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('digital-dslr', 'DSLR Cameras', 'DSLR камери', 'dslr', 'cameras-photo/digital/dslr', 'cp-digital', 2, '📷', 1, true),
('digital-mirrorless', 'Mirrorless Cameras', 'Безогледални', 'mirrorless', 'cameras-photo/digital/mirrorless', 'cp-digital', 2, '📸', 2, true),
('digital-compact', 'Compact Cameras', 'Компактни камери', 'compact', 'cameras-photo/digital/compact', 'cp-digital', 2, '📱', 3, true),
('digital-bridge', 'Bridge Cameras', 'Бридж камери', 'bridge', 'cameras-photo/digital/bridge', 'cp-digital', 2, '🔍', 4, true),
('digital-instant', 'Instant Cameras', 'Моментални камери', 'instant', 'cameras-photo/digital/instant', 'cp-digital', 2, '🖼️', 5, true);

-- L2: Lenses
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('lenses-prime', 'Prime Lenses', 'Фиксирани обективи', 'prime', 'cameras-photo/lenses/prime', 'cp-lenses', 2, '🎯', 1, true),
('lenses-zoom', 'Zoom Lenses', 'Зуум обективи', 'zoom', 'cameras-photo/lenses/zoom', 'cp-lenses', 2, '🔭', 2, true),
('lenses-wide', 'Wide Angle', 'Широкоъгълни', 'wide', 'cameras-photo/lenses/wide', 'cp-lenses', 2, '🌄', 3, true),
('lenses-tele', 'Telephoto', 'Телефото', 'telephoto', 'cameras-photo/lenses/telephoto', 'cp-lenses', 2, '🦅', 4, true),
('lenses-macro', 'Macro Lenses', 'Макро обективи', 'macro', 'cameras-photo/lenses/macro', 'cp-lenses', 2, '🔬', 5, true);

-- L2: Video
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('video-camcorders', 'Camcorders', 'Видеокамери', 'camcorders', 'cameras-photo/video/camcorders', 'cp-video', 2, '🎥', 1, true),
('video-action', 'Action Cameras', 'Екшън камери', 'action', 'cameras-photo/video/action', 'cp-video', 2, '🏃', 2, true),
('video-cinema', 'Cinema Cameras', 'Кино камери', 'cinema', 'cameras-photo/video/cinema', 'cp-video', 2, '🎬', 3, true),
('video-webcams', 'Webcams', 'Уеб камери', 'webcams', 'cameras-photo/video/webcams', 'cp-video', 2, '💻', 4, true),
('video-360', '360° Cameras', '360° камери', '360', 'cameras-photo/video/360', 'cp-video', 2, '🌐', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Cameras & Photo | Камери и фото |
| Digital Cameras | Дигитални камери |
| Lenses | Обективи |
| Lighting | Осветление |
| Video Cameras | Видеокамери |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Megapixels | Мегапиксели |
| Sensor Size | Размер на сензора |
| Shutter Count | Брой изстрелвания |
| Condition | Състояние |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add camera brands reference
- [ ] Add sensor sizes reference
- [ ] Add lens mounts reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Sensor size filter
- [ ] Megapixel range filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 66  
**Created:** December 3, 2025
