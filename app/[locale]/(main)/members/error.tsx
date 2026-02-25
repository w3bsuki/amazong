"use client"


import { createErrorBoundaryPage } from '../../_components/create-error-boundary-page'

export default createErrorBoundaryPage({
  titleKey: 'members.title',
  descriptionKey: 'members.description',
  ctaIcon: 'users',
  ctaLabelKey: 'common.goToHomepage',
  ctaHref: '/',
  logPrefix: 'Members page',
})
