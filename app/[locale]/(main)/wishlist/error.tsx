'use client'

import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'wishlist.title',
  descriptionKey: 'wishlist.description',
  ctaIcon: 'house',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Wishlist',
})
