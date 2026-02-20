'use client'

import { createErrorBoundaryPage } from '../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'account.title',
  descriptionKey: 'account.description',
  ctaIcon: 'user',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Account',
})
