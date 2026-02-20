'use client'

import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'deals.title',
  descriptionKey: 'deals.description',
  ctaIcon: 'tag',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Deals page',
})
