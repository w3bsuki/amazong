# 🎸 Musical Instruments | Музикални инструменти

**Category Slug:** `musical-instruments`  
**Icon:** 🎸  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Instruments → Guitars → Electric |
| **Attributes** | Filtering, Search, Campaigns | Brand, Condition, Year |
| **Tags** | Dynamic Collections & SEO | "vintage", "professional" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🎸 Musical Instruments (L0)
│
├── 🎸 Guitars (L1)
│   ├── Electric Guitars (L2)
│   ├── Acoustic Guitars (L2)
│   ├── Bass Guitars (L2)
│   ├── Classical Guitars (L2)
│   ├── 12-String Guitars (L2)
│   └── Guitar Amps (L2)
│
├── 🎹 Keyboards & Pianos (L1)
│   ├── Digital Pianos (L2)
│   ├── Synthesizers (L2)
│   ├── MIDI Controllers (L2)
│   ├── Acoustic Pianos (L2)
│   ├── Organs (L2)
│   └── Keyboard Stands (L2)
│
├── 🥁 Drums & Percussion (L1)
│   ├── Acoustic Drum Kits (L2)
│   ├── Electronic Drums (L2)
│   ├── Cymbals (L2)
│   ├── Drum Hardware (L2)
│   ├── Percussion (L2)
│   └── Drum Heads (L2)
│
├── 🎻 String Instruments (L1)
│   ├── Violins (L2)
│   ├── Violas (L2)
│   ├── Cellos (L2)
│   ├── Double Bass (L2)
│   ├── Mandolins (L2)
│   └── Ukuleles (L2)
│
├── 🎷 Wind Instruments (L1)
│   ├── Saxophones (L2)
│   ├── Trumpets (L2)
│   ├── Trombones (L2)
│   ├── Clarinets (L2)
│   ├── Flutes (L2)
│   └── Harmonicas (L2)
│
├── 🎺 Brass Instruments (L1)
│   ├── French Horns (L2)
│   ├── Tubas (L2)
│   ├── Euphoniums (L2)
│   ├── Cornets (L2)
│   └── Bugles (L2)
│
├── 🎙️ Pro Audio (L1)
│   ├── Microphones (L2)
│   ├── Audio Interfaces (L2)
│   ├── Mixers (L2)
│   ├── Studio Monitors (L2)
│   ├── PA Systems (L2)
│   └── Headphones (L2)
│
├── 🔌 Effects & Pedals (L1)
│   ├── Guitar Pedals (L2)
│   ├── Multi-Effects (L2)
│   ├── Pedalboards (L2)
│   ├── Rack Effects (L2)
│   └── Bass Pedals (L2)
│
├── 🎵 Accessories (L1)
│   ├── Strings (L2)
│   ├── Picks (L2)
│   ├── Capos (L2)
│   ├── Stands (L2)
│   ├── Cases & Bags (L2)
│   └── Tuners (L2)
│
└── 🇧🇬 Bulgarian Folk (L1)
    ├── Gadulka (L2)
    ├── Gaida (L2)
    ├── Kaval (L2)
    ├── Tambura (L2)
    └── Tapan (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 56 (L2) = 67 categories**

---

## 📊 Complete Category Reference

### L1: 🎸 GUITARS | КИТАРИ

#### L2: Electric Guitars | Електрически китари
**Slug:** `musical-instruments/guitars/electric`

| EN | BG | Description |
|----|----|----|
| Solid Body | Цял корпус | Standard |
| Semi-Hollow | Полукух | Jazz/Blues |
| Hollow Body | Кух корпус | Jazz |
| Signature | Signature | Artist models |
| 7/8-String | 7/8 струни | Extended range |
| Travel | Пътнически | Compact |

**Top Brands:**
- Fender | Фендър
- Gibson | Гибсън
- PRS | PRS
- Ibanez | Ибанез
- Epiphone | Епифон
- ESP | ESP

---

#### L2: Acoustic Guitars | Акустични китари
**Slug:** `musical-instruments/guitars/acoustic`

| EN | BG | Description |
|----|----|----|
| Dreadnought | Дреднаут | Full size |
| Concert | Концертна | Medium |
| Parlor | Салонна | Small |
| Jumbo | Джъмбо | Large |
| Travel | Пътническа | Compact |
| Electro-Acoustic | Електро-акустична | With pickup |

**Brands:**
- Martin | Мартин
- Taylor | Тейлър
- Yamaha | Ямаха
- Takamine | Такамине
- Fender | Фендър

---

### L1: 🎹 KEYBOARDS & PIANOS | КЛАВИШИ И ПИАНА

#### L2: Synthesizers | Синтезатори
**Slug:** `musical-instruments/keyboards/synths`

| EN | BG | Description |
|----|----|----|
| Analog | Аналогови | Classic |
| Digital | Дигитални | Modern |
| Modular | Модулни | Eurorack |
| Workstations | Работни станции | All-in-one |
| Grooveboxes | Грувбокс | Sequencer |

**Brands:**
- Korg | Корг
- Roland | Роланд
- Moog | Муг
- Arturia | Артурия
- Nord | Норд

---

### L1: 🥁 DRUMS & PERCUSSION | БАРАБАНИ И ПЕРКУСИИ

#### L2: Acoustic Drum Kits | Акустични барабани
**Slug:** `musical-instruments/drums/acoustic`

| EN | BG | Description |
|----|----|----|
| Shell Packs | Шел пакове | Drums only |
| Full Kits | Пълни комплекти | With hardware |
| Snare Drums | Соло барабани | Snare only |
| Kick Drums | Бас барабани | Bass only |
| Toms | Томове | Toms |

**Brands:**
- Pearl | Пърл
- DW | DW
- Tama | Тама
- Ludwig | Лудвиг
- Gretsch | Гретч

---

### L1: 🇧🇬 BULGARIAN FOLK | БЪЛГАРСКИ ФОЛКЛОР

#### L2: Gaida | Гайда
**Slug:** `musical-instruments/folk/gaida`

| EN | BG | Description |
|----|----|----|
| Rhodope Gaida | Родопска гайда | Deep tone |
| Thracian Gaida | Тракийска гайда | High pitch |
| Macedonian Gaida | Македонска гайда | Traditional |
| Professional | Професионална | Concert |
| Student | Ученическа | Learning |

---

#### L2: Gadulka | Гъдулка
**Slug:** `musical-instruments/folk/gadulka`

| EN | BG | Description |
|----|----|----|
| Prima | Прима | Lead |
| Burdun | Бурдон | Bass |
| Professional | Професионална | Concert |
| Student | Ученическа | Learning |

---

---

## 🏷️ Attribute System (The Power Layer)

### Musical Instrument Attributes Schema

```typescript
interface MusicalInstrumentProduct {
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
  made_in?: string;
  
  // === GUITAR SPECIFIC ===
  body_wood?: string;
  neck_wood?: string;
  fretboard_wood?: string;
  pickups?: string;
  scale_length?: string;
  frets?: number;
  
  // === CONDITION ===
  condition: ProductCondition;
  has_mods: boolean;
  
  // === INCLUDED ===
  includes_case: boolean;
  includes_original_accessories: boolean;
  
  // === WARRANTY ===
  warranty_months?: number;
  
  seller_type: 'private' | 'store' | 'studio';
  location_city: string;
  
  images: string[];
}

type ProductCondition = 'new' | 'mint' | 'excellent' | 'good' | 'fair' | 'project';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('musical-instruments', 'Musical Instruments', 'Музикални инструменти', 'musical-instruments', 'musical-instruments', NULL, 0, '🎸', 35, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('mi-guitars', 'Guitars', 'Китари', 'guitars', 'musical-instruments/guitars', 'musical-instruments', 1, '🎸', 1, true),
('mi-keyboards', 'Keyboards & Pianos', 'Клавиши и пиана', 'keyboards', 'musical-instruments/keyboards', 'musical-instruments', 1, '🎹', 2, true),
('mi-drums', 'Drums & Percussion', 'Барабани', 'drums', 'musical-instruments/drums', 'musical-instruments', 1, '🥁', 3, true),
('mi-strings', 'String Instruments', 'Струнни', 'strings', 'musical-instruments/strings', 'musical-instruments', 1, '🎻', 4, true),
('mi-wind', 'Wind Instruments', 'Духови', 'wind', 'musical-instruments/wind', 'musical-instruments', 1, '🎷', 5, true),
('mi-brass', 'Brass Instruments', 'Месинг', 'brass', 'musical-instruments/brass', 'musical-instruments', 1, '🎺', 6, true),
('mi-audio', 'Pro Audio', 'Про аудио', 'audio', 'musical-instruments/audio', 'musical-instruments', 1, '🎙️', 7, true),
('mi-effects', 'Effects & Pedals', 'Ефекти и педали', 'effects', 'musical-instruments/effects', 'musical-instruments', 1, '🔌', 8, true),
('mi-accessories', 'Accessories', 'Аксесоари', 'accessories', 'musical-instruments/accessories', 'musical-instruments', 1, '🎵', 9, true),
('mi-folk', 'Bulgarian Folk', 'Български фолклор', 'folk', 'musical-instruments/folk', 'musical-instruments', 1, '🇧🇬', 10, true);

-- L2: Guitars
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('guit-electric', 'Electric Guitars', 'Електрически', 'electric', 'musical-instruments/guitars/electric', 'mi-guitars', 2, '⚡', 1, true),
('guit-acoustic', 'Acoustic Guitars', 'Акустични', 'acoustic', 'musical-instruments/guitars/acoustic', 'mi-guitars', 2, '🪕', 2, true),
('guit-bass', 'Bass Guitars', 'Бас китари', 'bass', 'musical-instruments/guitars/bass', 'mi-guitars', 2, '🎸', 3, true),
('guit-classical', 'Classical Guitars', 'Класически', 'classical', 'musical-instruments/guitars/classical', 'mi-guitars', 2, '🎵', 4, true),
('guit-12string', '12-String Guitars', '12-струнни', '12string', 'musical-instruments/guitars/12string', 'mi-guitars', 2, '🎶', 5, true),
('guit-amps', 'Guitar Amps', 'Усилватели', 'amps', 'musical-instruments/guitars/amps', 'mi-guitars', 2, '🔊', 6, true);

-- L2: Keyboards
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('keys-digital', 'Digital Pianos', 'Дигитални пиана', 'digital', 'musical-instruments/keyboards/digital', 'mi-keyboards', 2, '🎹', 1, true),
('keys-synth', 'Synthesizers', 'Синтезатори', 'synths', 'musical-instruments/keyboards/synths', 'mi-keyboards', 2, '🎛️', 2, true),
('keys-midi', 'MIDI Controllers', 'MIDI контролери', 'midi', 'musical-instruments/keyboards/midi', 'mi-keyboards', 2, '🎚️', 3, true),
('keys-acoustic', 'Acoustic Pianos', 'Акустични пиана', 'acoustic', 'musical-instruments/keyboards/acoustic', 'mi-keyboards', 2, '🎵', 4, true),
('keys-organ', 'Organs', 'Органи', 'organs', 'musical-instruments/keyboards/organs', 'mi-keyboards', 2, '⛪', 5, true);

-- L2: Drums
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('drum-acoustic', 'Acoustic Drum Kits', 'Акустични комплекти', 'acoustic', 'musical-instruments/drums/acoustic', 'mi-drums', 2, '🥁', 1, true),
('drum-electronic', 'Electronic Drums', 'Електронни барабани', 'electronic', 'musical-instruments/drums/electronic', 'mi-drums', 2, '🎧', 2, true),
('drum-cymbals', 'Cymbals', 'Чинели', 'cymbals', 'musical-instruments/drums/cymbals', 'mi-drums', 2, '🔔', 3, true),
('drum-hardware', 'Drum Hardware', 'Хардуер', 'hardware', 'musical-instruments/drums/hardware', 'mi-drums', 2, '🔩', 4, true),
('drum-percussion', 'Percussion', 'Перкусии', 'percussion', 'musical-instruments/drums/percussion', 'mi-drums', 2, '🪘', 5, true);

-- L2: Folk
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('folk-gadulka', 'Gadulka', 'Гъдулка', 'gadulka', 'musical-instruments/folk/gadulka', 'mi-folk', 2, '🎻', 1, true),
('folk-gaida', 'Gaida', 'Гайда', 'gaida', 'musical-instruments/folk/gaida', 'mi-folk', 2, '🎵', 2, true),
('folk-kaval', 'Kaval', 'Кавал', 'kaval', 'musical-instruments/folk/kaval', 'mi-folk', 2, '🎶', 3, true),
('folk-tambura', 'Tambura', 'Тамбура', 'tambura', 'musical-instruments/folk/tambura', 'mi-folk', 2, '🪕', 4, true),
('folk-tapan', 'Tapan', 'Тъпан', 'tapan', 'musical-instruments/folk/tapan', 'mi-folk', 2, '🥁', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Musical Instruments | Музикални инструменти |
| Guitars | Китари |
| Keyboards & Pianos | Клавиши и пиана |
| Bulgarian Folk | Български фолклор |
| Pro Audio | Про аудио |

### Attribute Labels

| EN | BG |
|----|----|
| Brand | Марка |
| Condition | Състояние |
| Year | Година |
| Made In | Произведено в |
| Includes Case | Вкл. куфар |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add brands reference
- [ ] Add wood types reference

### Frontend
- [ ] Category browser
- [ ] Brand filter
- [ ] Condition filter
- [ ] Year filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 67  
**Created:** December 3, 2025
