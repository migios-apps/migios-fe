import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const clubSetupRoute: Routes = [
  {
    key: 'clubSetup',
    path: '/club-setup',
    component: lazy(() => import('@/pages/club-setup')),
    authority: [],
    meta: {
      pageBackgroundType: 'plain',
      pageContainerType: 'gutterless',
      layout: 'blank',
      footer: false,
    },
  },
]
