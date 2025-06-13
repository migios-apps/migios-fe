import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const salesRoute: Routes = [
  {
    key: 'sales',
    path: '/sales',
    component: lazy(() => import('@/pages/master/sales')),
    authority: [],
  },
  {
    key: 'newSales',
    path: '/sales/new',
    component: lazy(() => import('@/pages/master/sales/New')),
    authority: [],
    meta: {
      pageBackgroundType: 'plain',
      pageContainerType: 'gutterless',
      layout: 'blank',
      footer: false,
    },
  },
  {
    key: 'detailSales',
    path: '/sales/:id',
    component: lazy(() => import('@/pages/master/sales/Detail')),
    authority: [],
    meta: {
      pageBackgroundType: 'plain',
      pageContainerType: 'gutterless',
      layout: 'blank',
      footer: false,
    },
  },
]
