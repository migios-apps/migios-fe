import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const packageRoute: Routes = [
  {
    key: 'packages-membership',
    path: '/packages/membership',
    component: lazy(() => import('@/pages/master/packages/membership')),
    activeMenuKey: 'masters.packages',
    authority: [],
  },
  {
    key: 'packages-pt-program',
    path: '/packages/pt-program',
    component: lazy(() => import('@/pages/master/packages/pt-program')),
    activeMenuKey: 'masters.packages',
    authority: [],
  },
  {
    key: 'packages-class',
    path: '/packages/class',
    component: lazy(() => import('@/pages/master/packages/class')),
    activeMenuKey: 'masters.packages',
    authority: [],
  },
]
