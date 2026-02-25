"use client"


import { createErrorBoundaryPage } from '../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'generic.title',
  descriptionKey: 'generic.description',
  ctaIcon: 'house',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Plans',
})
