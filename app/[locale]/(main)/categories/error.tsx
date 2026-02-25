"use client"


import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'categories.title',
  descriptionKey: 'categories.description',
  ctaIcon: 'folder',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Categories page',
})
