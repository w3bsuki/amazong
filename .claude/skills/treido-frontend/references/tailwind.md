# Tailwind v4 Reference for Treido

## Forbidden Patterns

These will fail `pnpm -s styles:gate`:

### Arbitrary Values
```tsx
// ❌ All arbitrary values are forbidden
className="w-[347px]"
className="h-[calc(100vh-80px)]"
className="mt-[13px]"
className="text-[14px]"
```

### Palette Colors
```tsx
// ❌ Direct palette colors are forbidden
className="bg-blue-500"
className="text-red-600"
className="border-gray-300"
```

### Gradients
```tsx
// ❌ All gradients are forbidden
className="bg-gradient-to-r"
className="from-blue-500"
className="to-purple-500"
```

### Hardcoded Colors
```tsx
// ❌ Hex/RGB colors are forbidden
className="bg-[#1a1a1a]"
className="text-[rgb(255,0,0)]"
style={{ color: '#ff0000' }}
```

## Allowed Patterns

### Semantic Tokens
```tsx
// ✅ Use semantic tokens from CSS variables
className="bg-background"
className="text-foreground"
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"
className="bg-muted text-muted-foreground"
className="bg-accent text-accent-foreground"
className="bg-destructive text-destructive-foreground"
className="border-border"
className="ring-ring"
```

### Standard Spacing Scale
```tsx
// ✅ Use Tailwind's standard spacing
className="p-0 p-1 p-2 p-3 p-4 p-5 p-6 p-8 p-10 p-12 p-16"
className="m-0 m-1 m-2 m-3 m-4 m-5 m-6 m-8 m-10 m-12 m-16"
className="gap-0 gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 gap-8"
className="space-y-0 space-y-1 space-y-2 space-y-3 space-y-4"
```

### Standard Typography
```tsx
// ✅ Use standard text sizes
className="text-xs text-sm text-base text-lg text-xl text-2xl text-3xl"
className="font-normal font-medium font-semibold font-bold"
className="leading-none leading-tight leading-normal leading-relaxed"
```

### Standard Widths/Heights
```tsx
// ✅ Use standard sizing
className="w-full w-auto w-screen w-1/2 w-1/3 w-1/4"
className="h-full h-auto h-screen h-fit"
className="max-w-sm max-w-md max-w-lg max-w-xl max-w-2xl"
className="min-h-screen min-h-full"
```

## Validation Script

Run before committing:

```bash
pnpm -s styles:gate
```

This scans for:
- Arbitrary values `[...]`
- Gradient classes
- Palette color classes (blue-500, red-600, etc.)
- Hardcoded hex colors
