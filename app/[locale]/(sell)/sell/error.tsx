'use client'

import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'sell.title',
  descriptionKey: 'sell.description',
  ctaIcon: 'house',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Sell',
})
