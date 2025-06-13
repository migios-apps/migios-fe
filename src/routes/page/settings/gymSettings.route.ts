import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const gymSettingsRoute: Routes = [
  {
    key: 'aboutGym',
    path: '/settings/gym/about',
    component: lazy(() => import('@/pages/master/setting/gym/AboutGym')),
    authority: [],
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'locationGym',
    path: '/settings/gym/location',
    component: lazy(() => import('@/pages/master/setting/gym/GymLocation')),
    authority: [],
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'planGym',
    path: '/settings/gym/plan',
    component: lazy(() => import('@/pages/master/setting/gym/GymPlan')),
    authority: [],
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'paymentsGym',
    path: '/settings/gym/payments',
    component: lazy(() => import('@/pages/master/setting/gym/GymPayments')),
    authority: [],
    meta: {
      pageContainerType: 'gutterless',
    },
  },
]
