# 🎬 Movies, Music & Media | Филми, музика и медия

**Category Slug:** `movies-music`  
**Icon:** 🎬  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Media → Vinyl → Rock |
| **Attributes** | Filtering, Search, Campaigns | Format, Genre, Year |
| **Tags** | Dynamic Collections & SEO | "rare", "limited-edition" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🎬 Movies, Music & Media (L0)
│
├── 🎵 Vinyl Records (L1)
│   ├── Rock & Pop (L2)
│   ├── Electronic (L2)
│   ├── Jazz (L2)
│   ├── Classical (L2)
│   ├── Hip Hop (L2)
│   ├── Bulgarian Music (L2)
│   └── Rare & Collectible (L2)
│
├── 💿 CDs (L1)
│   ├── Music CDs (L2)
│   ├── Audiobooks (L2)
│   ├── Compilations (L2)
│   └── Bulgarian CDs (L2)
│
├── 📼 DVDs & Blu-ray (L1)
│   ├── Movies (L2)
│   ├── TV Series (L2)
│   ├── Documentaries (L2)
│   ├── Concerts (L2)
│   ├── Kids & Family (L2)
│   └── Bulgarian Films (L2)
│
├── 📼 VHS & Cassettes (L1)
│   ├── VHS Tapes (L2)
│   ├── Audio Cassettes (L2)
│   ├── Betamax (L2)
│   └── Rare Formats (L2)
│
├── 🎧 Digital Media (L1)
│   ├── Digital Downloads (L2)
│   ├── Streaming Codes (L2)
│   └── Digital Bundles (L2)
│
├── 📖 Sheet Music (L1)
│   ├── Piano (L2)
│   ├── Guitar (L2)
│   ├── Orchestral (L2)
│   ├── Songbooks (L2)
│   └── Bulgarian Folk (L2)
│
├── 🎤 Audio Equipment (L1)
│   ├── Turntables (L2)
│   ├── Speakers (L2)
│   ├── Amplifiers (L2)
│   ├── Headphones (L2)
│   ├── Cassette Players (L2)
│   └── CD Players (L2)
│
├── 🎥 Video Equipment (L1)
│   ├── DVD Players (L2)
│   ├── Blu-ray Players (L2)
│   ├── VCRs (L2)
│   ├── Projectors (L2)
│   └── Streaming Devices (L2)
│
├── 📚 Movie Memorabilia (L1)
│   ├── Posters (L2)
│   ├── Props (L2)
│   ├── Autographs (L2)
│   ├── Press Kits (L2)
│   └── Lobby Cards (L2)
│
└── 🎭 Music Memorabilia (L1)
    ├── Concert Posters (L2)
    ├── Tour Merchandise (L2)
    ├── Signed Items (L2)
    ├── Tickets & Passes (L2)
    └── Photos (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 51 (L2) = 62 categories**

---

## 📊 Complete Category Reference

### L1: 🎵 VINYL RECORDS | ВИНИЛОВИ ПЛОЧИ

#### L2: Rock & Pop | Рок и поп
**Slug:** `movies-music/vinyl/rock`

| EN | BG | Description |
|----|----|----|
| Classic Rock | Класически рок | 60s-80s |
| Hard Rock | Хард рок | Heavy |
| Alternative | Алтернативен | 90s+ |
| Pop Rock | Поп рок | Mainstream |
| Progressive | Прогресив | Art rock |
| Punk | Пънк | Raw |

---

#### L2: Bulgarian Music | Българска музика
**Slug:** `movies-music/vinyl/bulgarian`

| EN | BG | Description |
|----|----|----|
| Pop Folk | Поп фолк | Chalga |
| Rock | Рок | BG rock |
| Folk | Фолклор | Traditional |
| Estrada | Естрада | Classic pop |
| Jazz | Джаз | BG jazz |

**Notable Labels:**
- Balkanton | Балкантон
- RTB | РТБ
- Radiorama | Радиорама

---

### L1: 📼 DVDs & BLU-RAY | DVD И BLU-RAY

#### L2: Movies | Филми
**Slug:** `movies-music/dvd/movies`

| EN | BG | Description |
|----|----|----|
| Action | Екшън | Action films |
| Comedy | Комедия | Funny |
| Drama | Драма | Serious |
| Horror | Ужаси | Scary |
| Sci-Fi | Научна фантастика | Future |
| Documentary | Документални | Real |

---

### L1: 🎧 AUDIO EQUIPMENT | АУДИО ОБОРУДВАНЕ

#### L2: Turntables | Грамофони
**Slug:** `movies-music/audio/turntables`

| EN | BG | Description |
|----|----|----|
| Belt Drive | С ремък | Entry-level |
| Direct Drive | Директен | DJ/Pro |
| Vintage | Ретро | Classic |
| USB | С USB | Digital out |
| All-in-One | Комплект | With speakers |

**Brands:**
- Audio-Technica | Аудио-Техника
- Pro-Ject | Про-Джект
- Rega | Рега
- Technics | Техникс

---

---

## 🏷️ Attribute System (The Power Layer)

### Media Product Attributes Schema

```typescript
interface MediaProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === MEDIA INFO ===
  format: MediaFormat;
  genre?: string[];
  artist?: string;
  year?: number;
  
  // === VINYL SPECIFIC ===
  vinyl_speed?: VinylSpeed;
  vinyl_size?: VinylSize;
  pressing_country?: string;
  label?: string;
  catalog_number?: string;
  
  // === CONDITION ===
  media_condition: MediaCondition;
  sleeve_condition?: MediaCondition;
  
  // === EXTRAS ===
  includes_insert: boolean;
  is_sealed: boolean;
  is_limited_edition: boolean;
  
  seller_type: 'private' | 'store' | 'collector';
  location_city: string;
  
  images: string[];
}

type MediaFormat = 'vinyl_lp' | 'vinyl_7' | 'cd' | 'dvd' | 'bluray' | 'vhs' | 'cassette';
type VinylSpeed = '33' | '45' | '78';
type VinylSize = '7_inch' | '10_inch' | '12_inch';
type MediaCondition = 'mint' | 'near_mint' | 'very_good_plus' | 'very_good' | 'good' | 'fair' | 'poor';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('movies-music', 'Movies, Music & Media', 'Филми, музика и медия', 'movies-music', 'movies-music', NULL, 0, '🎬', 34, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('mm-vinyl', 'Vinyl Records', 'Винилови плочи', 'vinyl', 'movies-music/vinyl', 'movies-music', 1, '🎵', 1, true),
('mm-cd', 'CDs', 'Компакт дискове', 'cd', 'movies-music/cd', 'movies-music', 1, '💿', 2, true),
('mm-dvd', 'DVDs & Blu-ray', 'DVD и Blu-ray', 'dvd', 'movies-music/dvd', 'movies-music', 1, '📼', 3, true),
('mm-vhs', 'VHS & Cassettes', 'VHS и касети', 'vhs', 'movies-music/vhs', 'movies-music', 1, '📼', 4, true),
('mm-digital', 'Digital Media', 'Дигитална медия', 'digital', 'movies-music/digital', 'movies-music', 1, '🎧', 5, true),
('mm-sheet', 'Sheet Music', 'Ноти', 'sheet', 'movies-music/sheet', 'movies-music', 1, '📖', 6, true),
('mm-audio', 'Audio Equipment', 'Аудио оборудване', 'audio', 'movies-music/audio', 'movies-music', 1, '🎤', 7, true),
('mm-video', 'Video Equipment', 'Видео оборудване', 'video', 'movies-music/video', 'movies-music', 1, '🎥', 8, true),
('mm-movie-mem', 'Movie Memorabilia', 'Филмови сувенири', 'movie-memorabilia', 'movies-music/movie-memorabilia', 'movies-music', 1, '📚', 9, true),
('mm-music-mem', 'Music Memorabilia', 'Музикални сувенири', 'music-memorabilia', 'movies-music/music-memorabilia', 'movies-music', 1, '🎭', 10, true);

-- L2: Vinyl
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('vinyl-rock', 'Rock & Pop', 'Рок и поп', 'rock', 'movies-music/vinyl/rock', 'mm-vinyl', 2, '🎸', 1, true),
('vinyl-electronic', 'Electronic', 'Електронна', 'electronic', 'movies-music/vinyl/electronic', 'mm-vinyl', 2, '🎹', 2, true),
('vinyl-jazz', 'Jazz', 'Джаз', 'jazz', 'movies-music/vinyl/jazz', 'mm-vinyl', 2, '🎷', 3, true),
('vinyl-classical', 'Classical', 'Класическа', 'classical', 'movies-music/vinyl/classical', 'mm-vinyl', 2, '🎻', 4, true),
('vinyl-hiphop', 'Hip Hop', 'Хип хоп', 'hiphop', 'movies-music/vinyl/hiphop', 'mm-vinyl', 2, '🎤', 5, true),
('vinyl-bulgarian', 'Bulgarian Music', 'Българска музика', 'bulgarian', 'movies-music/vinyl/bulgarian', 'mm-vinyl', 2, '🇧🇬', 6, true),
('vinyl-rare', 'Rare & Collectible', 'Редки', 'rare', 'movies-music/vinyl/rare', 'mm-vinyl', 2, '💎', 7, true);

-- L2: DVD
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('dvd-movies', 'Movies', 'Филми', 'movies', 'movies-music/dvd/movies', 'mm-dvd', 2, '🎬', 1, true),
('dvd-series', 'TV Series', 'Сериали', 'series', 'movies-music/dvd/series', 'mm-dvd', 2, '📺', 2, true),
('dvd-docs', 'Documentaries', 'Документални', 'docs', 'movies-music/dvd/docs', 'mm-dvd', 2, '🎞️', 3, true),
('dvd-concerts', 'Concerts', 'Концерти', 'concerts', 'movies-music/dvd/concerts', 'mm-dvd', 2, '🎤', 4, true),
('dvd-kids', 'Kids & Family', 'Детски', 'kids', 'movies-music/dvd/kids', 'mm-dvd', 2, '👶', 5, true),
('dvd-bulgarian', 'Bulgarian Films', 'Български филми', 'bulgarian', 'movies-music/dvd/bulgarian', 'mm-dvd', 2, '🇧🇬', 6, true);

-- L2: Audio
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('audio-turntables', 'Turntables', 'Грамофони', 'turntables', 'movies-music/audio/turntables', 'mm-audio', 2, '🎵', 1, true),
('audio-speakers', 'Speakers', 'Тонколони', 'speakers', 'movies-music/audio/speakers', 'mm-audio', 2, '🔊', 2, true),
('audio-amps', 'Amplifiers', 'Усилватели', 'amplifiers', 'movies-music/audio/amplifiers', 'mm-audio', 2, '🎚️', 3, true),
('audio-headphones', 'Headphones', 'Слушалки', 'headphones', 'movies-music/audio/headphones', 'mm-audio', 2, '🎧', 4, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Movies, Music & Media | Филми, музика и медия |
| Vinyl Records | Винилови плочи |
| DVDs & Blu-ray | DVD и Blu-ray |
| Audio Equipment | Аудио оборудване |
| Bulgarian Music | Българска музика |

### Attribute Labels

| EN | BG |
|----|----|
| Format | Формат |
| Genre | Жанр |
| Condition | Състояние |
| Year | Година |
| Artist | Изпълнител |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add genres reference
- [ ] Add condition grades reference

### Frontend
- [ ] Category browser
- [ ] Genre filter
- [ ] Format filter
- [ ] Condition filter

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 62  
**Created:** December 3, 2025
