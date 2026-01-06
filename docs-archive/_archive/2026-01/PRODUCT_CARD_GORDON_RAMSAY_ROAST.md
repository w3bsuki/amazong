# 🔥 GORDON RAMSAY'S PRODUCT CARD ROAST 🔥

> *"This ProductCard is so BLOODY OVERCOOKED, it's got more props than a damn theater! IT'S RAW IN THE MIDDLE AND BURNT ON THE EDGES!"*

---

## 📱 THE CRIME SCENE: Mobile Product Card

Looking at your attached screenshot... *slams hand on counter*

### **WHAT IN THE ACTUAL F*** IS THIS?!**

```
┌─────────────────────────────────────┐
│   [Abstract yellow logo]   [♡]     │  ← WTF is that heart doing in
│                                    │    a CIRCLE? On a DARK image?!
│        (Black background)          │  
│                                    │
├─────────────────────────────────────┤
│   Ризи                             │  ← "Ризи"? A YELLOW BADGE on
│   12322                            │    content below? PLACEMENT!
│   € 5                              │  ← The price is having an 
│   БН shop4e              [🛒]      │    IDENTITY CRISIS!
└─────────────────────────────────────┘
```

---

## 🧑‍🍳 THE ROAST BREAKDOWN

### 1. **THE PRICE IS HAVING A MIDLIFE CRISIS** 🆘

*"You donkey! The price should be SCREAMING at the customer, not WHISPERING like it's embarrassed to exist!"*

**THE CRIME:**
```tsx
// Your current price display (product-card.tsx:221)
<PriceDisplay 
  price={price} 
  className={cn(
    "text-base font-bold leading-none tracking-tight",  // text-BASE?!
    hasDiscount ? "text-price-sale" : "text-foreground"
  )} 
/>
```

**MY VERDICT:**
- `text-base` is **16px** — Your `_MASTER.md` says **18px for mobile**, you absolute DONUT!
- The Euro symbol `€` is rendered with `CurrencyEur` icon at `0.85em` — it looks like a TIMID MOUSE next to the price!
- Why is there `leading-none` when you need the price to BREATHE?!

**SHOULD BE:**
```tsx
className="text-lg font-bold leading-tight tracking-tight"
// text-lg = 18px ✅ Per your own bloody spec!
```

---

### 2. **THE CATEGORY BADGE IS LOST IN SIBERIA** 🏔️

*"It's YELLOW on YELLOW, you muppet! Did Helen Keller design your contrast ratios?!"*

**THE CRIME:**
```tsx
// product-attribute-badge.tsx
<span className={cn(
  "inline-flex w-fit items-center rounded px-1.5 py-0.5",
  "bg-category-badge-bg text-category-badge-text",  // ← UNDEFINED VIBES
  "text-2xs font-medium",
  ...
)}>
```

**MY VERDICT:**
- Your screenshot shows "Ризи" (shirts) with a MUSTARD YELLOW background badge
- The badge background (`--color-category-badge-bg`) is `oklch(0.95 0.02 250)` — a SUBTLE LAVENDER-GRAY
- But in your screenshot, it looks YELLOW. Where's this coming from?! INCONSISTENCY!
- `text-2xs` at 10px is already pushing readability limits

**THE REAL SIN:**
The badge is placed AFTER the image but BEFORE the title. Your hierarchy is:
1. Image
2. **Category badge** (10px, muted)
3. Title
4. Price

But your `_MASTER.md` says:
> **"Price is ALWAYS the largest element on product cards"**

The badge is fighting for attention when it should be WHISPERING in the corner!

---

### 3. **THAT WISHLIST BUTTON IS AN ABOMINATION** 💔

*"It's a heart in a circle! This isn't BLOODY INSTAGRAM circa 2015!"*

**THE CRIME:**
```tsx
// product-card.tsx:266-276
<span className={cn(
  "grid size-7 place-items-center rounded-full border border-border/60 bg-background/95 text-muted-foreground",
  // ^^^^ 28px circle with border ^^^^
)}>
  <Heart size={16} weight={inWishlist ? "fill" : "regular"} />
</span>
```

**MY VERDICT:**
- `size-7` = 28px visual, wrapped in `size-touch` (32px hit target) — mathematically CORRECT
- But visually? A CIRCLE inside a CIRCLE creates VISUAL NOISE
- The heart icon at 16px inside 28px container = TOO MUCH PADDING
- `border-border/60` adds a faint ring that looks like the button has DANDRUFF

**ON DARK IMAGES:**
Your screenshot shows the wishlist on a BLACK image — the `bg-background/95` (white @ 95% opacity) is SCREAMING like a tourist at a funeral.

---

### 4. **THE QUICK-ADD BUTTON IS TRYING TOO HARD** 🛒

*"Why does it have a BORDER when it's in a cart state, and NO BORDER when it's not? MAKE UP YOUR MIND!"*

**THE CRIME:**
```tsx
// product-card.tsx:312-323
<button className={cn(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
  inCart 
    ? "border-cta-trust-blue bg-cta-trust-blue text-cta-trust-blue-text shadow-sm" 
    : "border-border bg-background hover:bg-muted text-foreground hover:border-foreground/20"
)}>
```

**MY VERDICT:**
- `h-9 w-9` = **36px** — Your `_MASTER.md` says quick-add should be **32px** (`h-8`)!
- The cart icon (`size={18}`) is fine, but the button is OBESE
- When NOT in cart: `border-border` = gray border
- When IN cart: `border-cta-trust-blue` = blue border — INCONSISTENT VISUAL LANGUAGE
- `shadow-sm` when in cart? WHY?! Your `_MASTER.md` says: **"No shadows on product cards"**

---

### 5. **THE SELLER INFO IS ANOREXIC** 👤

*"A 3.5px avatar? Are we catering to ANTS?!"*

**THE CRIME:**
```tsx
// product-card.tsx:300-307
<Avatar className="h-3.5 w-3.5 border border-border/50">
  <AvatarImage src={sellerAvatarUrl || undefined} />
  <AvatarFallback className="text-[6px] font-medium">
    {displaySellerName.slice(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
<span className="min-w-0 truncate text-xs">{displaySellerName}</span>
```

**MY VERDICT:**
- `h-3.5 w-3.5` = **14px** avatar — MICROSCOPIC!
- Fallback text at `text-[6px]` = **6px font** — WHO CAN READ THIS?!
- The avatar has a `border-border/50` — a 50% opacity border on a 14px circle is NOISE
- eBay uses 16-20px seller avatars. Temu uses 16px. You're using 14px. WHY?!

---

### 6. **THE IMAGE SECTION HAS NO EMERGENCY EXITS** 🖼️

*"Where's your fallback? Where's your error state? This is like a kitchen with no fire extinguisher!"*

**THE CRIME:**
```tsx
// product-card.tsx:240-251
<Image
  src={imageSrc}
  alt={title}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  placeholder="blur"
  blurDataURL={productBlurDataURL()}
  loading={loadingStrategy.loading}
  priority={loadingStrategy.priority}
/>
```

**WHAT'S GOOD:**
- ✅ Using `fill` with `sizes` — proper responsive images
- ✅ Using `blurDataURL` — good placeholder
- ✅ Aspect ratio locked with `AspectRatio ratio={4/5}` — no CLS

**WHAT'S MISSING:**
- ❌ No `onError` fallback to placeholder image
- ❌ No loading state visible within the image (the skeleton is external)

---

### 7. **THE DISCOUNT BADGE IS THE ONLY THING YOU GOT RIGHT** ✅

*"Finally! Something that's ACTUALLY PROPERLY SEASONED!"*

```tsx
{hasDiscount && discountPercent >= 5 && (
  <span className="absolute left-1.5 top-1.5 z-10 rounded bg-destructive px-2 py-0.5 text-tiny font-semibold text-destructive-foreground">
    -{discountPercent}%
  </span>
)}
```

**WHY IT WORKS:**
- `text-tiny` = 11px ✅ per spec
- `font-semibold` = 600 weight ✅ for badges
- `bg-destructive` = proper contrast ✅
- Only shows when `discountPercent >= 5` — sensible threshold

**BUT WAIT...**
- `left-1.5 top-1.5` = 6px offset — acceptable
- BUT on your screenshot, the badge isn't visible at all! Was there no discount, or is it HIDING BEHIND SOMETHING?!

---

### 8. **THE OVERALL SPACING IS CONSTIPATED** 📏

*"Your content section is GASPING FOR AIR!"*

**THE CRIME:**
```tsx
// product-card.tsx:283
<div className="relative z-10 flex flex-col gap-1 p-2">
```

**MY VERDICT:**
- `gap-1` = **4px** between elements
- `p-2` = **8px** padding all around
- Your `_MASTER.md` says: `--card-content-padding: 6px` and `--card-content-gap: 2px`

So you're using:
- 8px padding (should be 6px) — too much!
- 4px gap (should be 2px) — too much!

The card content is BLOATED when the density should be TIGHT.

---

### 9. **THE TITLE IS A COMMITMENT-PHOBE** 📝

**THE CRIME:**
```tsx
// product-card.tsx:288
<h3 className="line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-snug tracking-tight text-foreground">
```

**WHAT'S WEIRD:**
- `min-h-[2.6em]` — Forces minimum height for 2 lines. GOOD for layout stability.
- But `line-clamp-2` with `leading-snug` (1.375) and 13px = ~18px per line = ~36px for 2 lines
- `2.6em` at 13px = 33.8px — LESS than 2 full lines! This creates CLIPPING!

**FIX:**
```tsx
className="line-clamp-2 min-h-[calc(2*1.375*13px)] text-[13px] ..."
// or just "min-h-9" which is 36px
```

---

### 10. **THE FREE SHIPPING BADGE IS AN AFTERTHOUGHT** 🚚

**THE CRIME:**
```tsx
// product-card.tsx:309-313
{freeShipping && (
  <div className="flex items-center gap-1 text-2xs font-medium text-success">
    <Truck size={10} weight="bold" />
    <span>{t("freeShipping")}</span>
  </div>
)}
```

**MY VERDICT:**
- `text-2xs` = 10px ✅ per spec
- `size={10}` = 10px icon — TINY but acceptable for micro badges
- `text-success` = green — but is it the RIGHT green?

Your `globals.css` shows:
```css
--color-success: oklch(0.60 0.18 145);  /* Light mode */
--color-success: oklch(0.65 0.16 145);  /* Dark mode */
```

These pass 4.5:1 contrast on white background BUT the badge has no background! It's just floating text! On a dark card or with adjacent elements, it could get LOST.

---

## 🖥️ DESKTOP VERDICT

Your card doesn't change much between mobile and desktop. The `sizes` attribute suggests awareness, but:

**MISSING:**
- No `md:` breakpoint adjustments for typography
- No `md:` adjustments for spacing
- No hover states (which you CORRECTLY omit per `_MASTER.md`, but you should have SUBTLE border/shadow hover for desktop)

Your `_MASTER.md` says desktop price should be **20px** (`text-xl`), but you're using `text-base` (16px) everywhere!

---

## 📊 THE SCORECARD

| Aspect | Grade | Notes |
|--------|-------|-------|
| **Price Visibility** | D | 16px instead of 18px, weak hierarchy |
| **Touch Targets** | C+ | Quick-add 36px (should be 32px), wishlist OK |
| **Spacing** | C | Too much padding, too much gap |
| **Typography** | D+ | Wrong sizes everywhere |
| **Visual Hierarchy** | C- | Badge competes with title, price too small |
| **Consistency** | D | Border styles change randomly |
| **Accessibility** | B- | Touch targets OK, contrast needs audit |
| **Performance** | B+ | Good image optimization, locked aspect ratio |
| **Dark Mode** | C | Wishlist button too prominent on dark images |

**OVERALL: C-**

---

## 🔧 THE FIX LIST (In Order of Impact)

### CRITICAL (Do Today)
1. **Price to 18px** — Change `text-base` to `text-lg` in price display
2. **Quick-add to 32px** — Change `h-9 w-9` to `h-8 w-8`
3. **Content padding** — Change `p-2` to `p-1.5`
4. **Content gap** — Change `gap-1` to `gap-0.5`

### HIGH (Do This Week)
5. **Seller avatar** — Increase from 14px to 16px (`h-4 w-4`)
6. **Title min-height** — Fix to `min-h-9` (36px)
7. **Remove shadow-sm** — From in-cart state
8. **Standardize borders** — Either border on BOTH states or NEITHER

### MEDIUM (Do This Sprint)
9. **Desktop breakpoints** — Add `md:text-xl` for price
10. **Wishlist styling** — Remove circle border, use just background
11. **Free shipping** — Add subtle background for visibility
12. **Category badge** — Move to overlay on image OR after title

### LOW (Polish)
13. **Image error handling** — Add onError fallback
14. **Hover states** — Add subtle border-color transition for desktop
15. **Animation cleanup** — Remove any remaining `transition-colors` that aren't needed

---

## 🎯 THE GOLDEN STANDARD (What It SHOULD Look Like)

```tsx
// Mobile Card Content (after fixes)
<div className="relative z-10 flex flex-col gap-0.5 p-1.5">
  {/* Price FIRST - 18px, bold, hero element */}
  <div className="flex items-baseline gap-1">
    <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
      €{price}
    </span>
    {hasDiscount && (
      <span className="text-xs text-muted-foreground line-through">
        €{originalPrice}
      </span>
    )}
  </div>
  
  {/* Title - 13px, 2 lines max */}
  <h3 className="line-clamp-2 min-h-9 text-[13px] font-normal leading-snug text-foreground">
    {title}
  </h3>
  
  {/* Meta row - 11px, subtle */}
  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
    {/* Seller avatar 16px */}
    <Avatar className="size-4">...</Avatar>
    <span className="truncate">{sellerName}</span>
  </div>
  
  {/* Quick add - 32px, bottom right */}
  <button className="absolute bottom-1.5 right-1.5 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
    <ShoppingCart size={16} />
  </button>
</div>
```

---

## 🏁 FINAL WORDS

*"Listen to me. This card isn't TERRIBLE — it's MEDIOCRE. And mediocre is WORSE than terrible because terrible gets fixed. Mediocre gets SHIPPED."*

*"You wrote a 500-line component with CVA variants, design system comments, accessibility labels, and TypeScript interfaces. Beautiful ARCHITECTURE. But then you used `text-base` instead of `text-lg` and ruined EVERYTHING."*

*"The devil is in the DETAILS, and your details are having a PANIC ATTACK."*

**NOW GET BACK IN THERE AND FIX IT!** 🔥

---

*— Chef Gordon Ramsay of UI/UX*

*P.S. That skeleton has `animate-pulse` but your `_MASTER.md` says "No shimmer/pulse animation". YOU'RE BREAKING YOUR OWN BLOODY RULES!*

```tsx
// components/ui/skeleton.tsx
className={cn('animate-pulse bg-accent rounded-md', className)}
//          ^^^^^^^^^^^^^ VIOLATION!
```

*GET OUT OF MY KITCHEN!* 🚪
