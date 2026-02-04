---
title: Vitest Unit Testing
impact: high
impactDescription: Unit tests ensure utilities and hooks work correctly in isolation
tags: [unit, vitest, mocking, testing-library, hooks]
---

# vitest.md — Vitest Unit Testing

> Treido-specific Vitest patterns, mocking strategies, and test utilities.

## Test Structure

### File Locations

```
__tests__/              # Primary unit test directory
├── *.test.ts           # Utility/function tests
├── *.test.tsx          # Component tests
└── hooks/              # Hook tests

lib/**/*.test.ts        # Co-located tests (allowed)
hooks/**/*.test.ts      # Co-located tests (allowed)
components/**/*.test.ts # Co-located tests (allowed)
```

### Basic Test Pattern

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatPrice } from '@/lib/utils/format-price';

describe('formatPrice', () => {
  it('formats EUR correctly for BG locale', () => {
    expect(formatPrice(29.99, 'bg')).toBe('29,99 €');
  });
  
  it('handles zero values', () => {
    expect(formatPrice(0, 'bg')).toBe('0,00 €');
  });
});
```

---

## Mocking (`test-unit-mock`)

### Module Mocking

```tsx
import { vi, describe, it, expect } from 'vitest';

// Mock entire module
vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    from: () => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
}));
```

### Hoisted Mocks

For mocks that need to be hoisted above imports:

```tsx
import { vi, describe, it, expect } from 'vitest';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/en/test',
}));
```

### Function Mocks

```tsx
const mockFn = vi.fn();

// Return values
mockFn.mockReturnValue('sync value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('failed'));

// Implementation
mockFn.mockImplementation((x) => x * 2);
```

### Spy on Methods

```tsx
const spy = vi.spyOn(console, 'error');
// ... code that calls console.error
expect(spy).toHaveBeenCalledWith('expected message');
spy.mockRestore();
```

---

## Async Testing (`test-unit-async`)

### Always Await Async Operations

```tsx
// ✅ Correct
it('fetches data', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// ❌ Wrong (test may pass before assertion runs)
it('fetches data', () => {
  fetchData().then(result => {
    expect(result).toBeDefined();
  });
});
```

### Testing Async Errors

```tsx
it('throws on invalid input', async () => {
  await expect(fetchData(-1)).rejects.toThrow('Invalid ID');
});
```

---

## Hook Testing

### Using renderHook

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/use-cart';

describe('useCart', () => {
  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({ id: '1', name: 'Test', price: 10 });
    });
    
    expect(result.current.items).toHaveLength(1);
  });
});
```

### Hooks with Context

```tsx
import { renderHook } from '@testing-library/react';
import { IntlProvider } from 'next-intl';
import { useLocalePrice } from '@/hooks/use-locale-price';

const wrapper = ({ children }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

it('formats locale price', () => {
  const { result } = renderHook(() => useLocalePrice(29.99), { wrapper });
  expect(result.current).toContain('€');
});
```

---

## Component Testing

### Basic Component Test

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

it('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);
  
  await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
  
  expect(onClick).toHaveBeenCalledOnce();
});
```

### With i18n Context

```tsx
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

const renderWithI18n = (ui: React.ReactElement, locale = 'en') => {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      {ui}
    </NextIntlClientProvider>
  );
};
```

---

## Test Cleanup (`test-unit-cleanup`)

### Auto-Cleanup

Vitest config includes:
- `clearMocks: true` — Clears mock calls between tests
- `restoreMocks: true` — Restores original implementations
- `mockReset: true` — Resets mock state

### Manual Cleanup (when needed)

```tsx
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

---

## Test Setup (`test/setup.ts`)

### What Setup Provides

1. **Jest-DOM matchers** — `@testing-library/jest-dom/vitest`
2. **Environment variables** — Loads `.env`, `.env.local`, `.env.test`
3. **Browser polyfills**:
   - `matchMedia` — For responsive hooks
   - `ResizeObserver` — For size-aware components

### Using Setup

Automatically applied via `vitest.config.ts`:

```ts
test: {
  setupFiles: ['./test/setup.ts'],
}
```

---

## Configuration Reference

### Key Settings (`vitest.config.ts`)

| Setting | Value | Notes |
|---------|-------|-------|
| `environment` | `jsdom` | Browser-like environment |
| `include` | `__tests__/**`, `lib/**`, etc. | Test file globs |
| `coverage.provider` | `v8` | Fast coverage |
| `coverage.thresholds.lines` | 80% | Minimum coverage |

### Coverage Exclusions

Files excluded from coverage (complex runtime deps):
- `lib/supabase/**` — Requires Supabase runtime
- `lib/stripe.ts` — Requires Stripe env vars
- `lib/data/**` — Server-only with `use cache`
- `lib/ai/**` — Requires API keys
- `lib/auth/**` — Requires Supabase session

---

## Common Patterns

### Testing Utilities

```tsx
// Simple function test
describe('slugify', () => {
  it.each([
    ['Hello World', 'hello-world'],
    ['Test 123', 'test-123'],
    ['', ''],
  ])('slugify(%s) = %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});
```

### Testing Error Cases

```tsx
it('throws on invalid input', () => {
  expect(() => parsePrice('invalid')).toThrow('Invalid price');
});
```

### Snapshot Testing

```tsx
it('matches snapshot', () => {
  const { container } = render(<ProductCard product={mockProduct} />);
  expect(container).toMatchSnapshot();
});
```

---

## Running Tests

```bash
pnpm test:unit              # Run all unit tests
pnpm test:unit --watch      # Watch mode
pnpm test:unit:coverage     # With coverage report
pnpm test __tests__/format-price.test.ts  # Specific file
```

---

## Debugging

```tsx
// Console output
console.log(result);

// Screen debug (testing-library)
import { screen } from '@testing-library/react';
screen.debug();

// Vitest UI
pnpm test:unit --ui
```
