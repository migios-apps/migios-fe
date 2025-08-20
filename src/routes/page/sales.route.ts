import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const salesRoute: Routes = [
  {
    key: 'sales',
    path: '/sales',
    component: lazy(() => import('@/pages/master/sales')),
    authority: [],
  },
  {
    key: 'salesOrder',
    path: '/sales/order',
    component: lazy(() => import('@/pages/master/sales/Order')),
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
