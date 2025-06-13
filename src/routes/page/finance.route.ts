import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const financeRoute: Routes = [
  {
    key: 'history',
    path: '/finance/history',
    component: lazy(() => import('@/pages/master/finance/history')),
    authority: [],
  },
  {
    key: 'rekening',
    path: '/finance/rekening',
    component: lazy(() => import('@/pages/master/finance/rekening')),
    authority: [],
  },
  {
    key: 'category',
    path: '/finance/category',
    component: lazy(() => import('@/pages/master/finance/category')),
    authority: [],
  },
]
