import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const packageRoute: Routes = [
  {
    key: 'packages-membership',
    path: '/packages/membership',
    component: lazy(() => import('@/pages/master/packages/membership')),
    authority: [],
  },
  {
    key: 'packages-pt-program',
    path: '/packages/pt-program',
    component: lazy(() => import('@/pages/master/packages/pt-program')),
    authority: [],
  },
  {
    key: 'packages-class',
    path: '/packages/class',
    component: lazy(() => import('@/pages/master/packages/class')),
    authority: [],
  },
]
