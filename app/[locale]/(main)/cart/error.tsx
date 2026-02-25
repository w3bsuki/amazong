"use client"


import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'cart.title',
  descriptionKey: 'cart.description',
  ctaIcon: 'cart',
  ctaLabelKey: 'common.continueShopping',
  ctaHref: '/',
  logPrefix: 'Cart page',
})
