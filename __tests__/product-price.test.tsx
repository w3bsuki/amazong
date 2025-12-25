import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductPrice } from '@/components/shared/product/product-price'

describe('components/shared/product/ProductPrice', () => {
  it('renders an accessible price label', () => {
    render(<ProductPrice price={29.99} locale="en" />)

    const el = screen.getByLabelText(/Price:/i)
    expect(el).toBeInTheDocument()
    expect(el.getAttribute('aria-label') || '').toContain('29')
  })

  it('includes original price when discounted', () => {
    render(<ProductPrice price={80} originalPrice={100} locale="en" />)

    const el = screen.getByLabelText(/Price:/i)
    expect(el.getAttribute('aria-label') || '').toMatch(/was/i)
  })
})
