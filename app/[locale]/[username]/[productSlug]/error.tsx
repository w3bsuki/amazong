"use client"


import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'product.title',
  descriptionKey: 'product.description',
  ctaIcon: 'house',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Product page',
})
