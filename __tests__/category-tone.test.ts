import { describe, expect, test } from 'vitest'

import { getCategoryColor, resolveCategoryTone } from '@/app/[locale]/(main)/_components/category/category-icons'

describe('resolveCategoryTone', () => {
  test('maps root meta slugs to all tone', () => {
    expect(resolveCategoryTone('all')).toBe('all')
    expect(resolveCategoryTone('categories')).toBe('all')
  })

  test('maps representative ecommerce slugs to strong category tones', () => {
    expect(resolveCategoryTone('electronics')).toBe('tech')
    expect(resolveCategoryTone('fashion')).toBe('fashion')
    expect(resolveCategoryTone('home-garden')).toBe('home')
    expect(resolveCategoryTone('sports-outdoors')).toBe('sports')
    expect(resolveCategoryTone('gaming')).toBe('gaming')
    expect(resolveCategoryTone('beauty-health')).toBe('beauty')
    expect(resolveCategoryTone('baby-toys')).toBe('family')
    expect(resolveCategoryTone('books-music')).toBe('media')
    expect(resolveCategoryTone('office-services')).toBe('business')
    expect(resolveCategoryTone('grocery')).toBe('lifestyle')
    expect(resolveCategoryTone('automotive')).toBe('auto')
  })

  test('falls back to business tone for unknown slugs', () => {
    expect(resolveCategoryTone('unknown-segment')).toBe('business')
  })
})

describe('getCategoryColor', () => {
  test('returns strong tone classes for mapped categories', () => {
    expect(getCategoryColor('electronics')).toMatchObject({
      bg: 'bg-category-tech-bg',
      text: 'text-category-tech-fg',
      ring: 'ring-category-tech-ring',
      hoverRing: 'group-hover:ring-category-tech-ring',
    })
  })

  test('returns stable fallback classes for unknown categories', () => {
    expect(getCategoryColor('totally-unknown')).toMatchObject({
      bg: 'bg-category-business-bg',
      text: 'text-category-business-fg',
      ring: 'ring-category-business-ring',
      hoverRing: 'group-hover:ring-category-business-ring',
    })
  })
})
