"use client"


import { createErrorBoundaryPage } from '../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'checkout.title',
  descriptionKey: 'checkout.description',
  ctaIcon: 'house',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Checkout',
})
