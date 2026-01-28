# Homepage (BG) Audit - http://localhost:3000/bg

**Date:** January 28, 2026  
**Viewport:** 1920x1080  
**Screenshot:** See audit-desktop-2026-01-28/screenshots/homepage_bg_1920.png

## Page Overview

- **Title:** Начало | Treido
- **Language:** bg
- **URL:** /bg

## i18n Verification ✅

### Header Translations
| Element | EN | BG | Status |
|---------|-----|-----|--------|
| Menu | Menu | Меню | ✅ |
| Search | Search... | Търсене... | ✅ |
| Wishlist | Wishlist | Любими | ✅ |
| Cart | Cart | Кошница | ✅ |

### Category Translations
| EN | BG | Status |
|-----|-----|--------|
| All | Всички | ✅ |
| Fashion | Мода | ✅ |
| Tech | Техника | ✅ |
| Home | Дом | ✅ |
| Beauty | Красота | ✅ |
| Health | Здраве | ✅ |
| Sports | Спорт | ✅ |
| Kids | Деца | ✅ |
| Gaming | Гейминг | ✅ |
| Auto | Авто | ✅ |
| Pets | Зоо | ✅ |
| Real Estate | Имоти | ✅ |
| Software | Софтуер | ✅ |
| Grocery & Food | Храна | ✅ |
| Wholesale | На едро | ✅ |
| Hobbies | Хобита | ✅ |
| Jewelry | Бижута | ✅ |
| Bulgarian Traditional | Българско | ✅ |
| E-Mobility | Е-мобилност | ✅ |
| Services | Услуги | ✅ |
| Books | Книги | ✅ |
| Media | Медия | ✅ |
| Jobs | Работа | ✅ |
| Collect | Колекции | ✅ |
| Tools & Industrial | Инструменти | ✅ |

### Section Header Translations
| EN | BG | Status |
|-----|-----|--------|
| Promoted Listings | Промотирани обяви | ✅ |
| Today's Offers | Днешни оферти | ✅ |
| Trending in Fashion | Мода на деня | ✅ |
| Electronics | Електроника | ✅ |
| Automotive Deals | Автомобили | ✅ |
| See all | Виж всички | ✅ |

### Filter Button Translations
| EN | BG | Status |
|-----|-----|--------|
| Sort and filter | Сортиране и филтри | ✅ |
| Newest | Най-нови | ✅ |
| Offers | Оферти | ✅ |
| Nearby | Близо | ✅ |
| Sale | Намаление | ✅ |
| Top Rated | Топ оценени | ✅ |
| Free Ship | Безпл. дост. | ✅ |

### Trust Badges Translations
| EN | BG | Status |
|-----|-----|--------|
| Protected | Защитени | ✅ |
| Fast Ship | Бърза доставка | ✅ |
| Best Prices | Топ цени | ✅ |

### Sell CTA Translations
| EN | BG | Status |
|-----|-----|--------|
| Have something to sell? | Имаш нещо за продан? | ✅ |
| Free to list • Reach thousands | Безплатно публикуване • Достигни хиляди | ✅ |

### Footer Translations
| EN | BG | Status |
|-----|-----|--------|
| Company | Компания | ✅ |
| Help | Помощ | ✅ |
| Sell & Business | Продажби и бизнес | ✅ |
| Services | Услуги | ✅ |
| Treido Help | Помощен център Treido | ✅ |
| Returns | Връщания | ✅ |
| Track Orders | Проследи поръчки | ✅ |
| Contact Us | Свържи се с нас | ✅ |
| Security | Сигурност | ✅ |
| Feedback | Обратна връзка | ✅ |
| Terms of Service | Условия за ползване | ✅ |
| Privacy Policy | Политика за поверителност | ✅ |
| Cookie Preferences | Предпочитания за бисквитки | ✅ |
| Online Dispute Resolution | Онлайн решаване на спорове | ✅ |
| Go to homepage | Към начална страница | ✅ |

### Mobile Bottom Navigation
| EN | BG | Status |
|-----|-----|--------|
| Home | Начало | ✅ |
| Listings | Обяви | ✅ |
| Sell | Продай | ✅ |
| Chat | Чат | ✅ |
| Profile | Профил | ✅ |

### Date Formatting
- Dates show in Bulgarian format: "Вчера", "22.12.2025 г."
- Relative dates: "Вчера" (Yesterday)

### Product Card Elements
- "Add to wishlist" → "Добави в любими" ✅
- "Promo" badge → "Промо" ✅
- "Open product:" → "Отвори продукт:" ✅

## BG-Specific Observations

1. **Cart Badge:** Shows "9" items (persisted from session)
2. **Product Names:** Remain in original language (Cyrillic products show: "Айсифон 17", "Грозни обувки", "БУБА")
3. **Category Names in Cards:** Show translated subcategories:
   - "OLED TVs" → "OLED телевизори"
   - "Sedans" → "Седани"
   - "Women's Perfume" → "Дамски парфюм"
   - "Foundations" → "Фон дьо тен"
   - "Cars" → "Коли"
   - "Vans" → "Ванове"
   - "Doctor Jobs" → "Лекари"

4. **Currency Format:** Uses Euro (€) with Bulgarian number separators
   - "€38,500" → "38 500 €" (currency after amount)
   - "€2,500" → "2500 €"

## Console Errors

1. ⚠️ Hydration mismatch warnings (2x) - Same as EN version
2. ⚠️ Next.js Dev Tools overlay showing "1" and "2" issues

## Issues Found

### Minor
- Product names not translated (expected - user-generated content)
- Some product subcategories may not have Bulgarian translations

## Accessibility Notes

### Landmarks (BG)
- `contentinfo "Долен колонтитул на сайта"` ✅
- `navigation "Правни връзки и поверителност"` ✅
- `navigation "Мобилна навигация"` ✅

## Conclusion

✅ **i18n Implementation Status: EXCELLENT**
- All UI strings properly translated
- Category names translated
- Filter buttons translated
- Footer and legal links translated
- Date formats localized
- Currency formatting localized
- ARIA labels translated
