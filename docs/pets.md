# 🐕 Pet Supplies | Зоомагазин

**Category Slug:** `pets`  
**Icon:** 🐕  
**Status:** ✅ Production Ready  
**Last Updated:** December 3, 2025  
**Version:** 2.0 (Attribute-First Architecture)

---

## 📐 Architecture Philosophy

This document follows the **eBay/Amazon hybrid model**:

| Layer | Purpose | Example |
|-------|---------|---------|
| **Categories** | Navigation & Browse Structure | Pets → Dogs → Dog Food |
| **Attributes** | Filtering, Search, Campaigns | Pet Size, Age, Brand, Flavor |
| **Tags** | Dynamic Collections & SEO | "grain-free", "organic", "senior-dog" |

**Key Principle:** Categories are for **navigation**, Attributes are for **everything else**.

---

## 🗂️ Category Structure (3 Levels Max)

```
🐕 Pet Supplies (L0)
│
├── 🐶 Dogs (L1)
│   ├── Dog Food (L2)
│   ├── Dog Treats (L2)
│   ├── Dog Toys (L2)
│   ├── Dog Beds & Furniture (L2)
│   ├── Dog Collars & Leashes (L2)
│   ├── Dog Clothing (L2)
│   ├── Dog Grooming (L2)
│   ├── Dog Health (L2)
│   └── Dog Training (L2)
│
├── 🐱 Cats (L1)
│   ├── Cat Food (L2)
│   ├── Cat Treats (L2)
│   ├── Cat Toys (L2)
│   ├── Cat Furniture (L2)
│   ├── Cat Litter & Accessories (L2)
│   ├── Cat Collars & Leashes (L2)
│   ├── Cat Grooming (L2)
│   └── Cat Health (L2)
│
├── 🐦 Birds (L1)
│   ├── Bird Food (L2)
│   ├── Bird Cages (L2)
│   ├── Bird Toys (L2)
│   └── Bird Accessories (L2)
│
├── 🐠 Fish & Aquatic (L1)
│   ├── Fish Food (L2)
│   ├── Aquariums (L2)
│   ├── Filters & Pumps (L2)
│   ├── Decorations (L2)
│   ├── Water Treatment (L2)
│   └── Heating & Lighting (L2)
│
├── 🐹 Small Animals (L1)
│   ├── Small Animal Food (L2)
│   ├── Habitats & Cages (L2)
│   ├── Bedding & Litter (L2)
│   ├── Toys & Accessories (L2)
│   └── Health & Grooming (L2)
│
├── 🦎 Reptiles (L1)
│   ├── Reptile Food (L2)
│   ├── Terrariums (L2)
│   ├── Heating & Lighting (L2)
│   ├── Substrate & Bedding (L2)
│   └── Décor & Accessories (L2)
│
├── 🐴 Horses (L1)
│   ├── Horse Feed (L2)
│   ├── Tack & Riding (L2)
│   ├── Horse Care (L2)
│   └── Stable Supplies (L2)
│
└── 🏠 Pet Carriers & Travel (L1)
    ├── Dog Carriers (L2)
    ├── Cat Carriers (L2)
    ├── Travel Accessories (L2)
    └── Car Safety (L2)
```

**Total Categories: 1 (L0) + 8 (L1) + 47 (L2) = 56 categories**

---

## 📊 Complete Category Reference

### L1: 🐶 DOGS

#### L2: Dog Food | Храна за кучета
**Slug:** `pets/dogs/food`

| EN | BG | Description |
|----|----|----|
| Dry Food | Суха храна | Kibble |
| Wet Food | Мокра храна | Canned/pouches |
| Raw Food | Сурова храна | BARF diet |
| Grain-Free | Без зърнени | Grain-free formula |
| Puppy Food | Храна за кученца | Growth formula |
| Senior Food | Храна за възрастни | Senior formula |
| Weight Management | За контрол на теглото | Diet food |
| Veterinary Diet | Ветеринарна диета | Prescription food |

**Attributes:**
- `pet_size`: toy, small, medium, large, giant
- `pet_age`: puppy, adult, senior
- `protein_source`: chicken, beef, fish, lamb, duck
- `dietary`: grain_free, limited_ingredient, organic

---

#### L2: Dog Treats | Лакомства за кучета
**Slug:** `pets/dogs/treats`

- Training Treats | Лакомства за обучение
- Dental Chews | Дентални лакомства
- Biscuits | Бисквити
- Jerky | Сушено месо
- Bones | Кокали
- Natural Treats | Натурални лакомства
- Freeze-Dried | Лиофилизирани

---

#### L2: Dog Toys | Играчки за кучета
**Slug:** `pets/dogs/toys`

| EN | BG | Description |
|----|----|----|
| Chew Toys | Гризалки | Durable chewing |
| Plush Toys | Плюшени играчки | Soft toys |
| Fetch Toys | Играчки за хвърляне | Balls, frisbees |
| Rope Toys | Въжени играчки | Tug-of-war |
| Puzzle Toys | Пъзел играчки | Mental stimulation |
| Squeaky Toys | Пищящи играчки | Sound toys |
| Indestructible | Неразрушими | Heavy-duty |

---

#### L2: Dog Beds & Furniture | Легла и мебели
**Slug:** `pets/dogs/beds-furniture`

- Dog Beds | Легла за кучета
- Crates | Клетки
- Dog Houses | Къщички
- Pet Stairs | Стълби
- Furniture Covers | Покривала

---

#### L2: Dog Collars & Leashes | Нашийници и каишки
**Slug:** `pets/dogs/collars-leashes`

- Collars | Нашийници
- Harnesses | Нагръдници
- Leashes | Каишки
- Retractable Leashes | Ролетки
- Training Collars | Тренировъчни нашийници
- ID Tags | Адресници

---

#### L2: Dog Grooming | Грижа за козината
**Slug:** `pets/dogs/grooming`

- Shampoo | Шампоан
- Brushes & Combs | Четки и гребени
- Nail Care | Грижа за ноктите
- Ear Care | Грижа за ушите
- Dental Care | Дентална грижа
- Grooming Clippers | Машинки за подстригване

---

### L1: 🐱 CATS

#### L2: Cat Food | Храна за котки
**Slug:** `pets/cats/food`

| EN | BG | Description |
|----|----|----|
| Dry Food | Суха храна | Kibble |
| Wet Food | Мокра храна | Canned/pouches |
| Kitten Food | Храна за котенца | Growth formula |
| Senior Food | Храна за възрастни | Senior formula |
| Indoor Cat | За домашни котки | Indoor formula |
| Hairball Control | Контрол на космени топки | Hairball formula |
| Urinary Health | Уринарно здраве | Urinary care |

---

#### L2: Cat Litter & Accessories | Котешка тоалетна
**Slug:** `pets/cats/litter`

- Clumping Litter | Сбиваща се постелка
- Non-Clumping Litter | Несбиваща се постелка
- Crystal Litter | Кристална постелка
- Natural Litter | Натурална постелка
- Litter Boxes | Тоалетни
- Litter Mats | Постелки
- Litter Scoops | Лопатки
- Litter Deodorizers | Дезодоранти

---

#### L2: Cat Furniture | Мебели за котки
**Slug:** `pets/cats/furniture`

- Cat Trees | Катерушки
- Scratching Posts | Драскалки
- Cat Beds | Легла
- Cat Condos | Домчета
- Window Perches | Перваз легла
- Cat Shelves | Рафтове

---

### L1: 🐠 FISH & AQUATIC

#### L2: Aquariums | Аквариуми
**Slug:** `pets/fish/aquariums`

| EN | BG | Description |
|----|----|----|
| Freshwater Tanks | Сладководни аквариуми | Fresh water |
| Saltwater Tanks | Соленоводни аквариуми | Marine |
| Nano Tanks | Нано аквариуми | Small tanks |
| Aquarium Kits | Аквариум комплекти | Complete sets |
| Tank Stands | Поставки | Furniture |

---

#### L2: Filters & Pumps | Филтри и помпи
**Slug:** `pets/fish/filters`

- Canister Filters | Външни филтри
- Hang-On Filters | Вътрешни филтри
- Sponge Filters | Гъбени филтри
- Air Pumps | Помпи за въздух
- Water Pumps | Водни помпи
- Filter Media | Пълнеж за филтри

---

### L1: 🐹 SMALL ANIMALS

#### L2: Habitats & Cages | Клетки
**Slug:** `pets/small-animals/habitats`

- Hamster Cages | Клетки за хамстери
- Guinea Pig Cages | Клетки за морски свинчета
- Rabbit Hutches | Клетки за зайци
- Ferret Cages | Клетки за порове
- Chinchilla Cages | Клетки за чинчили
- Cage Accessories | Аксесоари

---

---

## 🏷️ Attribute System (The Power Layer)

### Pet Product Attributes Schema

```typescript
interface PetProduct {
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
  product_type: string;
  
  // === PET SPECIFICS ===
  pet_type: PetType;
  pet_size?: PetSize;
  pet_age?: PetAge;
  pet_breed?: string;
  
  // === FOOD SPECIFICS ===
  protein_source?: string[];
  dietary_features?: DietaryFeature[];
  weight_kg?: number;
  
  // === AQUARIUM SPECIFICS ===
  tank_size_liters?: number;
  water_type?: 'freshwater' | 'saltwater' | 'both';
  
  // === CONDITION ===
  condition: ProductCondition;
  expiry_date?: string;
  
  seller_type: 'private' | 'dealer' | 'store';
  location_city: string;
  
  images: string[];
}

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'small_animal' | 'reptile' | 'horse';
type PetSize = 'toy' | 'small' | 'medium' | 'large' | 'giant';
type PetAge = 'baby' | 'puppy' | 'kitten' | 'junior' | 'adult' | 'senior';
type DietaryFeature = 'grain_free' | 'organic' | 'natural' | 'limited_ingredient' | 'high_protein';
type ProductCondition = 'new' | 'like_new' | 'used';
```

---

## 🗃️ Database Schema (Supabase)

### Category Seed Data

```sql
-- L0: Root
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('pets', 'Pet Supplies', 'Зоомагазин', 'pets', 'pets', NULL, 0, '🐕', 10, true);

-- L1: Main Sections
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('pets-dogs', 'Dogs', 'Кучета', 'dogs', 'pets/dogs', 'pets', 1, '🐶', 1, true),
('pets-cats', 'Cats', 'Котки', 'cats', 'pets/cats', 'pets', 1, '🐱', 2, true),
('pets-birds', 'Birds', 'Птици', 'birds', 'pets/birds', 'pets', 1, '🐦', 3, true),
('pets-fish', 'Fish & Aquatic', 'Риби и аквариуми', 'fish', 'pets/fish', 'pets', 1, '🐠', 4, true),
('pets-small', 'Small Animals', 'Малки животни', 'small-animals', 'pets/small-animals', 'pets', 1, '🐹', 5, true),
('pets-reptiles', 'Reptiles', 'Влечуги', 'reptiles', 'pets/reptiles', 'pets', 1, '🦎', 6, true),
('pets-horses', 'Horses', 'Коне', 'horses', 'pets/horses', 'pets', 1, '🐴', 7, true),
('pets-travel', 'Pet Carriers & Travel', 'Транспортни чанти', 'carriers-travel', 'pets/carriers-travel', 'pets', 1, '🏠', 8, true);

-- L2: Dogs
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('dogs-food', 'Dog Food', 'Храна за кучета', 'food', 'pets/dogs/food', 'pets-dogs', 2, '🥩', 1, true),
('dogs-treats', 'Dog Treats', 'Лакомства за кучета', 'treats', 'pets/dogs/treats', 'pets-dogs', 2, '🦴', 2, true),
('dogs-toys', 'Dog Toys', 'Играчки за кучета', 'toys', 'pets/dogs/toys', 'pets-dogs', 2, '🎾', 3, true),
('dogs-beds', 'Dog Beds & Furniture', 'Легла и мебели', 'beds-furniture', 'pets/dogs/beds-furniture', 'pets-dogs', 2, '🛏️', 4, true),
('dogs-collars', 'Dog Collars & Leashes', 'Нашийници и каишки', 'collars-leashes', 'pets/dogs/collars-leashes', 'pets-dogs', 2, '🎀', 5, true),
('dogs-clothing', 'Dog Clothing', 'Дрехи за кучета', 'clothing', 'pets/dogs/clothing', 'pets-dogs', 2, '👕', 6, true),
('dogs-grooming', 'Dog Grooming', 'Грижа за козината', 'grooming', 'pets/dogs/grooming', 'pets-dogs', 2, '🛁', 7, true),
('dogs-health', 'Dog Health', 'Здраве', 'health', 'pets/dogs/health', 'pets-dogs', 2, '💊', 8, true),
('dogs-training', 'Dog Training', 'Обучение', 'training', 'pets/dogs/training', 'pets-dogs', 2, '🎓', 9, true);

-- L2: Cats
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('cats-food', 'Cat Food', 'Храна за котки', 'food', 'pets/cats/food', 'pets-cats', 2, '🥩', 1, true),
('cats-treats', 'Cat Treats', 'Лакомства за котки', 'treats', 'pets/cats/treats', 'pets-cats', 2, '🐟', 2, true),
('cats-toys', 'Cat Toys', 'Играчки за котки', 'toys', 'pets/cats/toys', 'pets-cats', 2, '🧶', 3, true),
('cats-furniture', 'Cat Furniture', 'Мебели за котки', 'furniture', 'pets/cats/furniture', 'pets-cats', 2, '🏠', 4, true),
('cats-litter', 'Cat Litter & Accessories', 'Котешка тоалетна', 'litter', 'pets/cats/litter', 'pets-cats', 2, '🚽', 5, true),
('cats-collars', 'Cat Collars & Leashes', 'Нашийници и каишки', 'collars-leashes', 'pets/cats/collars-leashes', 'pets-cats', 2, '🎀', 6, true),
('cats-grooming', 'Cat Grooming', 'Грижа за козината', 'grooming', 'pets/cats/grooming', 'pets-cats', 2, '🛁', 7, true),
('cats-health', 'Cat Health', 'Здраве', 'health', 'pets/cats/health', 'pets-cats', 2, '💊', 8, true);

-- L2: Fish & Aquatic
INSERT INTO public.categories (id, name, name_bg, slug, full_slug, parent_id, level, icon, display_order, is_active) VALUES
('fish-food', 'Fish Food', 'Храна за риби', 'food', 'pets/fish/food', 'pets-fish', 2, '🥗', 1, true),
('fish-aquariums', 'Aquariums', 'Аквариуми', 'aquariums', 'pets/fish/aquariums', 'pets-fish', 2, '🏠', 2, true),
('fish-filters', 'Filters & Pumps', 'Филтри и помпи', 'filters', 'pets/fish/filters', 'pets-fish', 2, '⚙️', 3, true),
('fish-decor', 'Decorations', 'Декорации', 'decorations', 'pets/fish/decorations', 'pets-fish', 2, '🌿', 4, true),
('fish-water', 'Water Treatment', 'Третиране на вода', 'water-treatment', 'pets/fish/water-treatment', 'pets-fish', 2, '💧', 5, true),
('fish-heating', 'Heating & Lighting', 'Отопление и осветление', 'heating-lighting', 'pets/fish/heating-lighting', 'pets-fish', 2, '💡', 6, true);
```

---

## 🌍 Bulgarian Translations

### Categories

| EN | BG |
|----|----|
| Pet Supplies | Зоомагазин |
| Dogs | Кучета |
| Cats | Котки |
| Birds | Птици |
| Fish & Aquatic | Риби и аквариуми |
| Small Animals | Малки животни |
| Reptiles | Влечуги |

### Attribute Labels

| EN | BG |
|----|----|
| Pet Type | Вид животно |
| Pet Size | Размер |
| Pet Age | Възраст |
| Brand | Марка |
| Protein Source | Източник на протеин |
| Weight | Тегло |

### Pet Sizes

| EN | BG |
|----|----|
| Toy | Миниатюрен |
| Small | Малък |
| Medium | Среден |
| Large | Голям |
| Giant | Гигантски |

### Pet Ages

| EN | BG |
|----|----|
| Puppy/Kitten | Кученце/Котенце |
| Junior | Млад |
| Adult | Възрастен |
| Senior | Старец |

---

## ✅ Implementation Checklist

### Database
- [ ] Create categories table entries
- [ ] Add pet brands reference data
- [ ] Test JSONB queries
- [ ] Verify indexes

### API
- [ ] GET /categories/pets (tree structure)
- [ ] GET /categories/pets/.../products
- [ ] POST /products (with validation)
- [ ] GET /products/search (with filters)

### Frontend
- [ ] Category browser component
- [ ] Pet size/age selectors
- [ ] Dietary features filter
- [ ] Brand filter
- [ ] Results grid/list view

### SEO
- [ ] Meta titles for all L2 categories
- [ ] Meta descriptions
- [ ] Bulgarian translations complete

---

**Document Version:** 2.0  
**Architecture:** Attribute-First (eBay/Amazon Model)  
**Total Categories:** 56  
**Created:** December 3, 2025
