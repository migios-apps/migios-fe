import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const financeRoute: Routes = [
  {
    key: 'history',
    path: '/finance/history',
    component: lazy(() => import('@/pages/master/finance/history')),
    activeMenuKey: 'masters.finance',
    authority: [],
  },
  {
    key: 'rekening',
    path: '/finance/rekening',
    component: lazy(() => import('@/pages/master/finance/rekening')),
    activeMenuKey: 'masters.finance',
    authority: [],
  },
  {
    key: 'category',
    path: '/finance/category',
    component: lazy(() => import('@/pages/master/finance/category')),
    activeMenuKey: 'masters.finance',
    authority: [],
  },
]
