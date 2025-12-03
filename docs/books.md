# 📚 Books & Magazines | Книги и списания

**Category Slug:** `books`  
**Icon:** 📚  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Books → Fiction → Science Fiction |
| **Attributes** | Filtering, Search, Campaigns | Language, Format, Author, Condition |
| **Tags** | Dynamic Collections & SEO | "bestseller", "signed-copy", "first-edition" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
📚 Books & Magazines (L0)
│
├── 📖 Fiction (L1)
│   ├── Science Fiction (L2)
│   ├── Fantasy (L2)
│   ├── Mystery & Thriller (L2)
│   ├── Romance (L2)
│   ├── Horror (L2)
│   ├── Historical Fiction (L2)
│   ├── Literary Fiction (L2)
│   └── Short Stories (L2)
│
├── 📘 Non-Fiction (L1)
│   ├── Biography & Memoir (L2)
│   ├── History (L2)
│   ├── Science & Nature (L2)
│   ├── Self-Help (L2)
│   ├── Business & Economics (L2)
│   ├── Philosophy (L2)
│   ├── Psychology (L2)
│   ├── Travel (L2)
│   └── True Crime (L2)
│
├── 📕 Textbooks & Education (L1)
│   ├── School Textbooks (L2)
│   ├── University Textbooks (L2)
│   ├── Test Prep (L2)
│   ├── Language Learning (L2)
│   ├── Professional Certification (L2)
│   └── Reference Books (L2)
│
├── 👶 Children's Books (L1)
│   ├── Picture Books (L2)
│   ├── Early Readers (L2)
│   ├── Middle Grade (L2)
│   ├── Young Adult (L2)
│   ├── Activity Books (L2)
│   └── Educational (L2)
│
├── 🎨 Arts & Photography (L1)
│   ├── Art Books (L2)
│   ├── Photography (L2)
│   ├── Architecture (L2)
│   ├── Fashion & Design (L2)
│   ├── Music (L2)
│   └── Film & TV (L2)
│
├── 🍳 Lifestyle (L1)
│   ├── Cookbooks (L2)
│   ├── Home & Garden (L2)
│   ├── Health & Fitness (L2)
│   ├── Crafts & Hobbies (L2)
│   ├── Sports (L2)
│   └── Pets (L2)
│
├── 📰 Magazines & Periodicals (L1)
│   ├── News Magazines (L2)
│   ├── Fashion Magazines (L2)
│   ├── Technology Magazines (L2)
│   ├── Sports Magazines (L2)
│   ├── Home & Lifestyle (L2)
│   └── Trade Publications (L2)
│
├── 🗞️ Comics & Graphic Novels (L1)
│   ├── Superhero Comics (L2)
│   ├── Manga (L2)
│   ├── Graphic Novels (L2)
│   ├── Comic Strips (L2)
│   └── Indie Comics (L2)
│
├── 📕 Bulgarian Literature (L1)
│   ├── Bulgarian Fiction (L2)
│   ├── Bulgarian Poetry (L2)
│   ├── Bulgarian History (L2)
│   ├── Bulgarian Folklore (L2)
│   └── Bulgarian Classics (L2)
│
└── 📦 Rare & Collectible (L1)
    ├── Antiquarian Books (L2)
    ├── First Editions (L2)
    ├── Signed Books (L2)
    ├── Limited Editions (L2)
    └── Vintage Magazines (L2)
```

**Total Categories: 1 (L0) + 10 (L1) + 57 (L2) = 68 categories**

---

## 📊 Complete Category Reference

### L1: 📖 FICTION

#### L2: Science Fiction | Научна фантастика
**Slug:** `books/fiction/science-fiction`

| EN | BG | Description |
|----|----|----|
| Space Opera | Космическа опера | Epic space adventures |
| Cyberpunk | Киберпънк | High-tech dystopia |
| Dystopian | Дистопия | Dark futures |
| Hard Sci-Fi | Твърда НФ | Science-based |
| Time Travel | Пътуване във времето | Temporal stories |
| Alien Contact | Извънземни | First contact |
| Post-Apocalyptic | Постапокалипсис | After disaster |

---

#### L2: Fantasy | Фентъзи
**Slug:** `books/fiction/fantasy`

| EN | BG | Description |
|----|----|----|
| Epic Fantasy | Епик фентъзи | World-spanning |
| Urban Fantasy | Градско фентъзи | Modern cities |
| Dark Fantasy | Тъмно фентъзи | Gothic/horror |
| High Fantasy | Високо фентъзи | Magic-heavy |
| Sword & Sorcery | Меч и магия | Action-focused |
| Fairy Tales | Приказки | Classic tales |

---

#### L2: Mystery & Thriller | Мистерия и трилър
**Slug:** `books/fiction/mystery-thriller`

- Detective Fiction | Детективска литература
- Police Procedural | Полицейски роман
- Legal Thriller | Съдебен трилър
- Spy Thriller | Шпионски трилър
- Psychological Thriller | Психологически трилър
- Cozy Mystery | Уютна мистерия

---

### L1: 📘 NON-FICTION

#### L2: Biography & Memoir | Биографии и мемоари
**Slug:** `books/non-fiction/biography`

| EN | BG | Description |
|----|----|----|
| Autobiography | Автобиография | Self-written |
| Biography | Биография | About others |
| Memoir | Мемоари | Personal memories |
| Political Memoirs | Политически мемоари | Politicians |
| Celebrity Memoirs | Знаменитости | Famous people |

---

#### L2: Business & Economics | Бизнес и икономика
**Slug:** `books/non-fiction/business`

- Management | Мениджмънт
- Marketing | Маркетинг
- Finance & Investing | Финанси и инвестиции
- Entrepreneurship | Предприемачество
- Economics | Икономика
- Career Development | Кариерно развитие

---

#### L2: Self-Help | Самопомощ
**Slug:** `books/non-fiction/self-help`

- Personal Development | Личностно развитие
- Motivation | Мотивация
- Productivity | Продуктивност
- Relationships | Взаимоотношения
- Mindfulness | Осъзнатост
- Success | Успех

---

### L1: 👶 CHILDREN'S BOOKS

#### L2: Picture Books | Книжки с картинки
**Slug:** `books/children/picture-books`

| Age Range | EN | BG |
|-----------|----|----|
| 0-2 | Baby Books | Бебешки книжки |
| 2-4 | Toddler Books | За малки деца |
| 4-6 | Preschool Books | Предучилищни |
| 6-8 | Early Reader | Начални читатели |

---

#### L2: Young Adult | Младежки роман
**Slug:** `books/children/young-adult`

- YA Fantasy | Младежки фентъзи
- YA Romance | Младежка романтика
- YA Dystopian | Младежка дистопия
- YA Contemporary | Съвременен младежки
- YA Horror | Младежки хорър

---

### L1: 📕 BULGARIAN LITERATURE

#### L2: Bulgarian Fiction | Българска художествена литература
**Slug:** `books/bulgarian/fiction`

| EN | BG | Notable Authors |
|----|----|----|
| Contemporary | Съвременна проза | Георги Господинов, Мила Михайлова |
| Classic Fiction | Класика | Алеко Константинов, Елин Пелин |
| Historical Novels | Исторически романи | Димитър Талев, Вера Мутафчиева |
| Socialist Era | Социалистически период | - |
| Modern Bulgarian | Модерна българска | Захари Карабашлиев |

---

#### L2: Bulgarian Poetry | Българска поезия
**Slug:** `books/bulgarian/poetry`

- Classic Poetry | Класическа поезия (Ботев, Вазов, Яворов)
- Modern Poetry | Модерна поезия
- Contemporary Poetry | Съвременна поезия
- Folk Poetry | Народна поезия

---

#### L2: Bulgarian Classics | Български класици
**Slug:** `books/bulgarian/classics`

**Must-Read Bulgarian Authors:**
| Author | BG | Notable Work |
|--------|----|----|
| Ivan Vazov | Иван Вазов | Под игото |
| Hristo Botev | Христо Ботев | Poetry |
| Aleko Konstantinov | Алеко Константинов | Бай Ганьо |
| Elin Pelin | Елин Пелин | Гераците |
| Yordan Yovkov | Йордан Йовков | Старопланински легенди |
| Dimitar Talev | Димитър Талев | Железният светилник |

---

### L1: 🗞️ COMICS & GRAPHIC NOVELS

#### L2: Manga | Манга
**Slug:** `books/comics/manga`

| EN | BG | Description |
|----|----|----|
| Shonen | Шоунен | Boys' manga |
| Shojo | Шоуджо | Girls' manga |
| Seinen | Сейнен | Adult men |
| Josei | Джосей | Adult women |
| Light Novels | Лайт новели | Illustrated novels |

---

---

## 🏷️ Attribute System (The Power Layer)

### Book Attributes Schema

```typescript
interface BookProduct {
  // === IDENTIFICATION ===
  id: string;
  category_id: string;
  
  // === BASIC INFO ===
  title: string;
  description: string;
  price: number;
  currency: 'BGN' | 'EUR';
  negotiable: boolean;
  
  // === BOOK DETAILS ===
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  pages?: number;
  
  // === FORMAT ===
  format: BookFormat;
  language: string;
  edition?: string;
  
  // === CONDITION ===
  condition: BookCondition;
  has_dust_jacket?: boolean;
  signed: boolean;
  first_edition: boolean;
  
  // === COLLECTIBLE ===
  rare: boolean;
  limited_edition: boolean;
  edition_number?: string;
  
  seller_type: 'private' | 'bookstore' | 'publisher';
  location_city: string;
  
  images: string[];
}

type BookFormat = 'hardcover' | 'paperback' | 'mass_market' | 'ebook' | 'audiobook';
type BookCondition = 'new' | 'like_new' | 'very_good' | 'good' | 'acceptable' | 'poor';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('books', 'Books & Magazines', 'Книги и списания', 'books', 'books', NULL, 0, '📚', 16, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('books-fiction', 'Fiction', 'Художествена литература', 'fiction', 'books/fiction', 'books', 1, '📖', 1, true),
('books-nonfiction', 'Non-Fiction', 'Нехудожествена литература', 'non-fiction', 'books/non-fiction', 'books', 1, '📘', 2, true),
('books-textbooks', 'Textbooks & Education', 'Учебници и образование', 'textbooks', 'books/textbooks', 'books', 1, '📕', 3, true),
('books-children', 'Children''s Books', 'Детски книги', 'children', 'books/children', 'books', 1, '👶', 4, true),
('books-arts', 'Arts & Photography', 'Изкуство и фотография', 'arts', 'books/arts', 'books', 1, '🎨', 5, true),
('books-lifestyle', 'Lifestyle', 'Начин на живот', 'lifestyle', 'books/lifestyle', 'books', 1, '🍳', 6, true),
('books-magazines', 'Magazines & Periodicals', 'Списания и периодика', 'magazines', 'books/magazines', 'books', 1, '📰', 7, true),
('books-comics', 'Comics & Graphic Novels', 'Комикси', 'comics', 'books/comics', 'books', 1, '🗞️', 8, true),
('books-bulgarian', 'Bulgarian Literature', 'Българска литература', 'bulgarian', 'books/bulgarian', 'books', 1, '📕', 9, true),
('books-rare', 'Rare & Collectible', 'Редки и колекционерски', 'rare', 'books/rare', 'books', 1, '📦', 10, true);

-- L2: Fiction
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fiction-scifi', 'Science Fiction', 'Научна фантастика', 'science-fiction', 'books/fiction/science-fiction', 'books-fiction', 2, '🚀', 1, true),
('fiction-fantasy', 'Fantasy', 'Фентъзи', 'fantasy', 'books/fiction/fantasy', 'books-fiction', 2, '🧙', 2, true),
('fiction-mystery', 'Mystery & Thriller', 'Мистерия и трилър', 'mystery-thriller', 'books/fiction/mystery-thriller', 'books-fiction', 2, '🔍', 3, true),
('fiction-romance', 'Romance', 'Романтика', 'romance', 'books/fiction/romance', 'books-fiction', 2, '❤️', 4, true),
('fiction-horror', 'Horror', 'Хорър', 'horror', 'books/fiction/horror', 'books-fiction', 2, '👻', 5, true),
('fiction-historical', 'Historical Fiction', 'Исторически роман', 'historical-fiction', 'books/fiction/historical-fiction', 'books-fiction', 2, '🏰', 6, true),
('fiction-literary', 'Literary Fiction', 'Литературна проза', 'literary-fiction', 'books/fiction/literary-fiction', 'books-fiction', 2, '📖', 7, true);

-- L2: Non-Fiction
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('nonfiction-bio', 'Biography & Memoir', 'Биографии и мемоари', 'biography', 'books/non-fiction/biography', 'books-nonfiction', 2, '👤', 1, true),
('nonfiction-history', 'History', 'История', 'history', 'books/non-fiction/history', 'books-nonfiction', 2, '🏛️', 2, true),
('nonfiction-science', 'Science & Nature', 'Наука и природа', 'science', 'books/non-fiction/science', 'books-nonfiction', 2, '🔬', 3, true),
('nonfiction-selfhelp', 'Self-Help', 'Самопомощ', 'self-help', 'books/non-fiction/self-help', 'books-nonfiction', 2, '🌟', 4, true),
('nonfiction-business', 'Business & Economics', 'Бизнес и икономика', 'business', 'books/non-fiction/business', 'books-nonfiction', 2, '💼', 5, true);

-- L2: Bulgarian Literature
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('bulgarian-fiction', 'Bulgarian Fiction', 'Българска художествена', 'fiction', 'books/bulgarian/fiction', 'books-bulgarian', 2, '📖', 1, true),
('bulgarian-poetry', 'Bulgarian Poetry', 'Българска поезия', 'poetry', 'books/bulgarian/poetry', 'books-bulgarian', 2, '✒️', 2, true),
('bulgarian-history', 'Bulgarian History', 'Българска история', 'history', 'books/bulgarian/history', 'books-bulgarian', 2, '🏰', 3, true),
('bulgarian-folklore', 'Bulgarian Folklore', 'Български фолклор', 'folklore', 'books/bulgarian/folklore', 'books-bulgarian', 2, '🎭', 4, true),
('bulgarian-classics', 'Bulgarian Classics', 'Български класици', 'classics', 'books/bulgarian/classics', 'books-bulgarian', 2, '📕', 5, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Books & Magazines | Книги и списания |
| Fiction | Художествена литература |
| Non-Fiction | Нехудожествена литература |
| Textbooks | Учебници |
| Children's Books | Детски книги |
| Comics | Комикси |
| Bulgarian Literature | Българска литература |

### Attribute Labels

| EN | BG |
|----|----|
| Author | Автор |
| Publisher | Издателство |
| Language | Език |
| Format | Формат |
| Condition | Състояние |
| Year | Година |
| Pages | Страници |
| ISBN | ISBN |
| Edition | Издание |
| Signed | С автограф |

### Book Formats

| EN | BG |
|----|----|
| Hardcover | Твърда корица |
| Paperback | Мека корица |
| E-book | Електронна книга |
| Audiobook | Аудиокнига |

### Book Conditions

| EN | BG |
|----|----|
| New | Нова |
| Like New | Като нова |
| Very Good | Много добра |
| Good | Добра |
| Acceptable | Приемлива |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add popular authors reference
- [ ] Add publishers reference
- [ ] Test ISBN validation

### API
- [ ] GET /categories/books (tree structure)
- [ ] GET /books with filters
- [ ] ISBN lookup integration
- [ ] Author search

### Frontend
- [ ] Category browser
- [ ] Format filter
- [ ] Language filter
- [ ] Condition filter
- [ ] Author autocomplete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 68  
**Created:** December 3, 2025
