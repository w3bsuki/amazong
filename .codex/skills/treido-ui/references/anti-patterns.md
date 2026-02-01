# UI Anti-Patterns (What Makes Bad AI UI)

This document captures common UI anti-patterns that make designs look "AI-generated" and unprofessional. Avoid all of these.

## Visual Anti-Patterns

### ❌ Gradients Everywhere
- **Problem**: Screams "AI made this"
- **Example**: `bg-gradient-to-r from-purple-500 via-pink-500 to-red-500`
- **Fix**: Use solid semantic tokens (`bg-background`, `bg-card`, `bg-surface-subtle`)

### ❌ Purple as Dominant Color
- **Problem**: Overused AI cliché (every Copilot/ChatGPT clone uses it)
- **Example**: Purple buttons, purple accents, violet backgrounds
- **Fix**: Use neutral-dominant palettes with restrained accent colors

### ❌ Too Many Colors Competing
- **Problem**: Visual noise, unclear hierarchy
- **Example**: Red button + blue header + green badge + orange warning
- **Fix**: 90% neutral (grays, blacks, whites), 1 primary, 1-2 subtle accents

### ❌ Harsh Shadows and High Contrast
- **Problem**: Looks dated and aggressive
- **Example**: `shadow-2xl` on everything, pure black on pure white
- **Fix**: Subtle shadows (`shadow-sm`), muted foreground colors

### ❌ Rounded Corners on Everything
- **Problem**: Looks childish and inconsistent
- **Example**: `rounded-3xl` on buttons, cards, inputs all different
- **Fix**: Consistent radius (`rounded-md` or `rounded-lg` per component type)

### ❌ Excessive Animations
- **Problem**: Distracting, performance cost, accessibility issues
- **Example**: Everything bounces, fades, slides
- **Fix**: No new animations (Treido rail); prefer CSS transitions for essential feedback only

### ❌ Placeholder Text
- **Problem**: Shows design wasn't thought through
- **Example**: "Lorem ipsum", "Feature 1", "Click here"
- **Fix**: Use realistic content from the product domain

## Color Anti-Patterns (Treido-Specific)

### ❌ Palette Colors Instead of Tokens
```tsx
// Bad
className="text-slate-600 bg-gray-100"

// Good  
className="text-foreground bg-background"
```

### ❌ Opacity Hacks on Tokens
```tsx
// Bad - opacity composition breaks across surfaces
className="bg-primary/10"

// Good - dedicated semantic token
className="bg-surface-subtle"
```

### ❌ Hardcoded Colors
```tsx
// Bad
className="bg-[#1DA1F2]"
style={{ color: '#333' }}

// Good
className="bg-primary text-foreground"
```

## Layout Anti-Patterns

### ❌ No Visual Hierarchy
- **Problem**: Everything same size/weight, nothing stands out
- **Fix**: Clear title > subtitle > body > meta hierarchy

### ❌ Cramped Spacing
- **Problem**: Elements too close together
- **Fix**: Generous whitespace, consistent spacing scale (4px grid)

### ❌ No Visual Grouping
- **Problem**: Related items don't look related
- **Fix**: Use proximity + consistent spacing to group related content

### ❌ Inconsistent Alignment
- **Problem**: Text/icons/buttons don't align
- **Fix**: Align baselines, use consistent padding

## State Anti-Patterns

### ❌ Missing Loading States
- **Problem**: User doesn't know something is happening
- **Fix**: Skeleton screens, spinners with preserved layout

### ❌ Missing Empty States
- **Problem**: Blank screen when no data
- **Fix**: Helpful message + actionable CTA

### ❌ Missing Error States
- **Problem**: Silent failures
- **Fix**: Clear error message + recovery action

### ❌ No Focus States
- **Problem**: Keyboard users can't see focus
- **Fix**: Visible focus rings (Tailwind's `focus-visible:ring-*`)

## Quality Checklist (Before Shipping)

- [ ] Looks professional and intentional?
- [ ] Enough whitespace between unrelated groups?
- [ ] Color usage restrained (90% neutral)?
- [ ] No gradients (unless explicitly approved)?
- [ ] Works in light AND dark mode?
- [ ] Typography hierarchy clear?
- [ ] Interactive states defined (hover, focus, active)?
- [ ] Loading/empty/error states covered?
- [ ] Touch targets ≥ 32px on mobile?
- [ ] Focus states visible for keyboard navigation?

## The Lovable Standard

Good UI exhibits:
1. **Calm confidence** — No visual noise, clear hierarchy
2. **Generous breathing room** — Whitespace is a feature
3. **Subtle depth** — Soft shadows, not harsh contrasts
4. **Intentional restraint** — Every element earns its place
5. **Real content** — Design with actual text, not lorem ipsum
