# 🎮 Gaming | Гейминг

**Category Slug:** `gaming`  
**Icon:** 🎮  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Gaming → Consoles → PlayStation |
| **Attributes** | Filtering, Search, Campaigns | Platform, Genre, Condition, Region |
| **Tags** | Dynamic Collections & SEO | "multiplayer", "exclusive", "limited-edition" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🎮 Gaming (L0)
│
├── 🕹️ Video Game Consoles (L1)
│   ├── PlayStation (L2)
│   ├── Xbox (L2)
│   ├── Nintendo (L2)
│   ├── Retro Consoles (L2)
│   ├── Handheld Consoles (L2)
│   └── Console Accessories (L2)
│
├── 💿 Video Games (L1)
│   ├── PlayStation Games (L2)
│   ├── Xbox Games (L2)
│   ├── Nintendo Games (L2)
│   ├── PC Games (L2)
│   └── Retro Games (L2)
│
├── 🖥️ PC Gaming (L1)
│   ├── Gaming PCs (L2)
│   ├── Gaming Laptops (L2)
│   ├── Graphics Cards (L2)
│   ├── Gaming Monitors (L2)
│   ├── Gaming Keyboards (L2)
│   ├── Gaming Mice (L2)
│   ├── Gaming Headsets (L2)
│   ├── Gaming Chairs (L2)
│   └── PC Components (L2)
│
├── 🎧 Gaming Accessories (L1)
│   ├── Controllers (L2)
│   ├── Headsets (L2)
│   ├── VR Headsets (L2)
│   ├── Racing Wheels (L2)
│   ├── Flight Sticks (L2)
│   ├── Arcade Sticks (L2)
│   ├── Capture Cards (L2)
│   └── Gaming Desks (L2)
│
├── 📱 Mobile Gaming (L1)
│   ├── Gaming Phones (L2)
│   ├── Mobile Controllers (L2)
│   ├── Mobile Accessories (L2)
│   └── Handheld Gaming (L2)
│
├── 🃏 Trading Cards & Collectibles (L1)
│   ├── Pokémon Cards (L2)
│   ├── Magic: The Gathering (L2)
│   ├── Yu-Gi-Oh! Cards (L2)
│   ├── Sports Cards (L2)
│   └── Card Accessories (L2)
│
├── 🎲 Board Games & Puzzles (L1)
│   ├── Strategy Games (L2)
│   ├── Family Games (L2)
│   ├── Party Games (L2)
│   ├── Puzzles (L2)
│   ├── Role-Playing Games (L2)
│   └── Game Accessories (L2)
│
└── 🎯 Gaming Merchandise (L1)
    ├── Figures & Statues (L2)
    ├── Apparel (L2)
    ├── Posters & Art (L2)
    └── Collectibles (L2)
```

**Total Categories: 1 (L0) + 8 (L1) + 46 (L2) = 55 categories**

---

## 📊 Complete Category Reference

### L1: 🕹️ VIDEO GAME CONSOLES

#### L2: PlayStation | PlayStation
**Slug:** `gaming/consoles/playstation`

| EN | BG | Description |
|----|----|----|
| PlayStation 5 | PlayStation 5 | Current gen |
| PlayStation 5 Digital | PS5 Digital | Disc-less |
| PlayStation 4 | PlayStation 4 | Last gen |
| PlayStation 4 Pro | PS4 Pro | Enhanced |
| PlayStation VR | PlayStation VR | VR headset |
| PlayStation VR2 | PlayStation VR2 | Current VR |

---

#### L2: Xbox | Xbox
**Slug:** `gaming/consoles/xbox`

| EN | BG | Description |
|----|----|----|
| Xbox Series X | Xbox Series X | Current gen |
| Xbox Series S | Xbox Series S | Digital |
| Xbox One X | Xbox One X | Last gen enhanced |
| Xbox One S | Xbox One S | Last gen |
| Xbox One | Xbox One | Original |

---

#### L2: Nintendo | Nintendo
**Slug:** `gaming/consoles/nintendo`

| EN | BG | Description |
|----|----|----|
| Nintendo Switch OLED | Switch OLED | Premium |
| Nintendo Switch | Nintendo Switch | Hybrid |
| Nintendo Switch Lite | Switch Lite | Handheld only |
| Nintendo 3DS | Nintendo 3DS | Portable |
| Nintendo Wii U | Nintendo Wii U | Last gen |

---

#### L2: Retro Consoles | Ретро конзоли
**Slug:** `gaming/consoles/retro`

- PlayStation 3 | PlayStation 3
- PlayStation 2 | PlayStation 2
- PlayStation 1 | PlayStation 1
- Xbox 360 | Xbox 360
- Nintendo Wii | Nintendo Wii
- Nintendo GameCube | Nintendo GameCube
- Nintendo 64 | Nintendo 64
- SNES | Super Nintendo
- NES | Nintendo NES
- Sega Genesis | Sega Mega Drive
- Sega Dreamcast | Sega Dreamcast
- Atari | Atari

---

### L1: 💿 VIDEO GAMES

#### L2: PlayStation Games | Игри за PlayStation
**Slug:** `gaming/games/playstation`

**By Genre (Attribute):**
| EN | BG |
|----|----|
| Action | Екшън |
| Adventure | Приключенски |
| RPG | RPG |
| Sports | Спортни |
| Racing | Състезателни |
| Shooter | Шутъри |
| Fighting | Бойни |
| Horror | Хорър |
| Simulation | Симулатори |
| Strategy | Стратегии |

---

#### L2: PC Games | Игри за PC
**Slug:** `gaming/games/pc`

- Physical Games | Физически игри
- Digital Codes | Цифрови кодове
- Collector's Editions | Колекционерски издания
- Game Bundles | Пакети игри

---

### L1: 🖥️ PC GAMING

#### L2: Gaming PCs | Гейминг компютри
**Slug:** `gaming/pc/desktops`

| EN | BG | Description |
|----|----|----|
| Pre-built Gaming PC | Готов гейминг PC | Complete systems |
| Custom Gaming PC | Кастъм PC | Custom builds |
| Mini Gaming PC | Мини гейминг PC | Compact |
| Gaming Workstation | Работна станция | High-end |

---

#### L2: Graphics Cards | Видеокарти
**Slug:** `gaming/pc/graphics-cards`

| EN | BG | Description |
|----|----|----|
| NVIDIA RTX 40 Series | RTX 40 серия | Current gen |
| NVIDIA RTX 30 Series | RTX 30 серия | Last gen |
| AMD RX 7000 Series | RX 7000 серия | Current AMD |
| AMD RX 6000 Series | RX 6000 серия | Last AMD |

**Attributes:**
- `gpu_brand`: nvidia, amd, intel
- `vram_gb`: 6, 8, 10, 12, 16, 24
- `cooling_type`: blower, axial, liquid

---

#### L2: Gaming Monitors | Гейминг монитори
**Slug:** `gaming/pc/monitors`

- 1080p Monitors | Full HD монитори
- 1440p Monitors | QHD монитори
- 4K Monitors | 4K монитори
- Ultrawide Monitors | Ултраширок
- Curved Monitors | Извити монитори
- High Refresh Rate | Висока честота (144Hz+)

---

#### L2: Gaming Keyboards | Гейминг клавиатури
**Slug:** `gaming/pc/keyboards`

- Mechanical Keyboards | Механични клавиатури
- Membrane Keyboards | Мембранни клавиатури
- Wireless Keyboards | Безжични клавиатури
- TKL Keyboards | TKL (без NumPad)
- 60% Keyboards | Компактни клавиатури
- RGB Keyboards | RGB клавиатури

---

#### L2: Gaming Mice | Гейминг мишки
**Slug:** `gaming/pc/mice`

- Wired Gaming Mice | Жични мишки
- Wireless Gaming Mice | Безжични мишки
- Lightweight Mice | Леки мишки
- MMO Mice | MMO мишки
- FPS Mice | FPS мишки
- Ergonomic Mice | Ергономични мишки

---

### L1: 🃏 TRADING CARDS

#### L2: Pokémon Cards | Покемон карти
**Slug:** `gaming/trading-cards/pokemon`

| EN | BG | Description |
|----|----|----|
| Booster Packs | Бустер пакове | Sealed packs |
| Booster Boxes | Бустер кутии | 36 packs |
| Elite Trainer Box | ETB | Premium box |
| Single Cards | Единични карти | Individual |
| Graded Cards | Оценени карти | PSA/CGC |
| Complete Sets | Пълни сетове | All cards |

**Attributes:**
- `card_condition`: mint, near_mint, excellent, good, played
- `grading_company`: psa, cgc, bgs
- `grade`: 10, 9.5, 9, 8.5, 8, etc.
- `rarity`: common, uncommon, rare, holo, ultra_rare, secret_rare
- `set_name`: string
- `language`: english, japanese, korean

---

#### L2: Magic: The Gathering | Magic: The Gathering
**Slug:** `gaming/trading-cards/mtg`

- Booster Packs | Бустер пакове
- Booster Boxes | Кутии
- Commander Decks | Commander тестета
- Single Cards | Единични карти
- Sealed Products | Запечатани продукти

---

### L1: 🎲 BOARD GAMES

#### L2: Strategy Games | Стратегически игри
**Slug:** `gaming/board-games/strategy`

- Eurogames | Евроигри
- War Games | Военни игри
- Economic Games | Икономически игри
- Area Control | Контрол на територия
- Worker Placement | Worker Placement

---

#### L2: Role-Playing Games | Ролеви игри
**Slug:** `gaming/board-games/rpg`

- Dungeons & Dragons | D&D
- Pathfinder | Pathfinder
- Call of Cthulhu | Call of Cthulhu
- Dice Sets | Комплекти зарове
- RPG Accessories | Аксесоари

---

---

## 🏷️ Attribute System (The Power Layer)

### Gaming Product Attributes Schema

```typescript
interface GamingProduct {
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
  model?: string;
  
  // === GAMING SPECIFICS ===
  platform?: Platform[];
  genre?: Genre[];
  region?: GameRegion;
  
  // === HARDWARE SPECS ===
  storage_gb?: number;
  memory_gb?: number;
  color?: string;
  
  // === CARD SPECIFICS ===
  card_condition?: CardCondition;
  graded: boolean;
  grade?: number;
  grading_company?: GradingCompany;
  
  // === CONDITION ===
  condition: ProductCondition;
  includes_box: boolean;
  includes_manual: boolean;
  
  seller_type: 'private' | 'dealer' | 'store';
  location_city: string;
  
  images: string[];
}

type Platform = 'ps5' | 'ps4' | 'xbox_series' | 'xbox_one' | 'switch' | 'pc' | 'mobile';
type Genre = 'action' | 'adventure' | 'rpg' | 'sports' | 'racing' | 'shooter' | 'fighting' | 'horror' | 'simulation' | 'strategy';
type GameRegion = 'pal' | 'ntsc' | 'ntsc_j' | 'region_free';
type CardCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'played' | 'poor';
type GradingCompany = 'psa' | 'cgc' | 'bgs';
type ProductCondition = 'new_sealed' | 'new_open' | 'like_new' | 'good' | 'fair';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gaming', 'Gaming', 'Гейминг', 'gaming', 'gaming', NULL, 0, '🎮', 12, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('gaming-consoles', 'Video Game Consoles', 'Конзоли', 'consoles', 'gaming/consoles', 'gaming', 1, '🕹️', 1, true),
('gaming-games', 'Video Games', 'Видео игри', 'games', 'gaming/games', 'gaming', 1, '💿', 2, true),
('gaming-pc', 'PC Gaming', 'PC гейминг', 'pc-gaming', 'gaming/pc-gaming', 'gaming', 1, '🖥️', 3, true),
('gaming-accessories', 'Gaming Accessories', 'Аксесоари', 'accessories', 'gaming/accessories', 'gaming', 1, '🎧', 4, true),
('gaming-mobile', 'Mobile Gaming', 'Мобилен гейминг', 'mobile-gaming', 'gaming/mobile-gaming', 'gaming', 1, '📱', 5, true),
('gaming-cards', 'Trading Cards', 'Колекционерски карти', 'trading-cards', 'gaming/trading-cards', 'gaming', 1, '🃏', 6, true),
('gaming-board', 'Board Games & Puzzles', 'Настолни игри', 'board-games', 'gaming/board-games', 'gaming', 1, '🎲', 7, true),
('gaming-merch', 'Gaming Merchandise', 'Мърчандайз', 'merchandise', 'gaming/merchandise', 'gaming', 1, '🎯', 8, true);

-- L2: Consoles
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('consoles-playstation', 'PlayStation', 'PlayStation', 'playstation', 'gaming/consoles/playstation', 'gaming-consoles', 2, '🎮', 1, true),
('consoles-xbox', 'Xbox', 'Xbox', 'xbox', 'gaming/consoles/xbox', 'gaming-consoles', 2, '🟢', 2, true),
('consoles-nintendo', 'Nintendo', 'Nintendo', 'nintendo', 'gaming/consoles/nintendo', 'gaming-consoles', 2, '🔴', 3, true),
('consoles-retro', 'Retro Consoles', 'Ретро конзоли', 'retro', 'gaming/consoles/retro', 'gaming-consoles', 2, '📺', 4, true),
('consoles-handheld', 'Handheld Consoles', 'Преносими конзоли', 'handheld', 'gaming/consoles/handheld', 'gaming-consoles', 2, '🎮', 5, true),
('consoles-accessories', 'Console Accessories', 'Аксесоари за конзоли', 'accessories', 'gaming/consoles/accessories', 'gaming-consoles', 2, '🔌', 6, true);

-- L2: Games
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('games-playstation', 'PlayStation Games', 'Игри за PlayStation', 'playstation', 'gaming/games/playstation', 'gaming-games', 2, '💿', 1, true),
('games-xbox', 'Xbox Games', 'Игри за Xbox', 'xbox', 'gaming/games/xbox', 'gaming-games', 2, '💿', 2, true),
('games-nintendo', 'Nintendo Games', 'Игри за Nintendo', 'nintendo', 'gaming/games/nintendo', 'gaming-games', 2, '💿', 3, true),
('games-pc', 'PC Games', 'Игри за PC', 'pc', 'gaming/games/pc', 'gaming-games', 2, '💿', 4, true),
('games-retro', 'Retro Games', 'Ретро игри', 'retro', 'gaming/games/retro', 'gaming-games', 2, '📼', 5, true);

-- L2: PC Gaming
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('pc-desktops', 'Gaming PCs', 'Гейминг компютри', 'desktops', 'gaming/pc-gaming/desktops', 'gaming-pc', 2, '🖥️', 1, true),
('pc-laptops', 'Gaming Laptops', 'Гейминг лаптопи', 'laptops', 'gaming/pc-gaming/laptops', 'gaming-pc', 2, '💻', 2, true),
('pc-gpus', 'Graphics Cards', 'Видеокарти', 'graphics-cards', 'gaming/pc-gaming/graphics-cards', 'gaming-pc', 2, '🎴', 3, true),
('pc-monitors', 'Gaming Monitors', 'Гейминг монитори', 'monitors', 'gaming/pc-gaming/monitors', 'gaming-pc', 2, '🖥️', 4, true),
('pc-keyboards', 'Gaming Keyboards', 'Гейминг клавиатури', 'keyboards', 'gaming/pc-gaming/keyboards', 'gaming-pc', 2, '⌨️', 5, true),
('pc-mice', 'Gaming Mice', 'Гейминг мишки', 'mice', 'gaming/pc-gaming/mice', 'gaming-pc', 2, '🖱️', 6, true),
('pc-headsets', 'Gaming Headsets', 'Гейминг слушалки', 'headsets', 'gaming/pc-gaming/headsets', 'gaming-pc', 2, '🎧', 7, true),
('pc-chairs', 'Gaming Chairs', 'Гейминг столове', 'chairs', 'gaming/pc-gaming/chairs', 'gaming-pc', 2, '🪑', 8, true);

-- L2: Trading Cards
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cards-pokemon', 'Pokémon Cards', 'Покемон карти', 'pokemon', 'gaming/trading-cards/pokemon', 'gaming-cards', 2, '⚡', 1, true),
('cards-mtg', 'Magic: The Gathering', 'Magic: The Gathering', 'mtg', 'gaming/trading-cards/mtg', 'gaming-cards', 2, '🧙', 2, true),
('cards-yugioh', 'Yu-Gi-Oh! Cards', 'Yu-Gi-Oh! карти', 'yugioh', 'gaming/trading-cards/yugioh', 'gaming-cards', 2, '🃏', 3, true),
('cards-sports', 'Sports Cards', 'Спортни карти', 'sports', 'gaming/trading-cards/sports', 'gaming-cards', 2, '⚽', 4, true),
('cards-accessories', 'Card Accessories', 'Аксесоари за карти', 'accessories', 'gaming/trading-cards/accessories', 'gaming-cards', 2, '📦', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Gaming | Гейминг |
| Video Game Consoles | Конзоли |
| Video Games | Видео игри |
| PC Gaming | PC гейминг |
| Trading Cards | Колекционерски карти |
| Board Games | Настолни игри |

### Attribute Labels

| EN | BG |
|----|----|
| Platform | Платформа |
| Genre | Жанр |
| Region | Регион |
| Condition | Състояние |
| Graded | Оценена |
| Storage | Памет |

### Game Genres

| EN | BG |
|----|----|
| Action | Екшън |
| Adventure | Приключенски |
| RPG | Ролева игра |
| Sports | Спортни |
| Racing | Състезателни |
| Shooter | Шутър |
| Fighting | Бойни |
| Horror | Хорър |
| Strategy | Стратегии |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add gaming brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/gaming (tree structure)
- [ ] GET /categories/gaming/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Platform filter
- [ ] Genre filter
- [ ] Card grading display
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 55  
**Created:** December 3, 2025
