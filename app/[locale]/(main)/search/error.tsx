"use client"


import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'search.title',
  descriptionKey: 'search.description',
  ctaIcon: 'search',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Search page',
})
