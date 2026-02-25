"use client"


import { createErrorBoundaryPage } from '../../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'sellerDashboard.title',
  descriptionKey: 'sellerDashboard.description',
  ctaIcon: 'storefront',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Account sales',
})
