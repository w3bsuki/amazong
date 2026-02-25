"use client"


import { createErrorBoundaryPage } from '../../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'category.title',
  descriptionKey: 'category.description',
  ctaIcon: 'folder',
  ctaLabelKey: 'common.browseCategories',
  ctaHref: '/categories',
  logPrefix: 'Category page',
})
