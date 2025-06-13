import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const classRoute: Routes = [
  {
    key: 'class-list',
    path: '/class/list',
    component: lazy(() => import('@/pages/class/list')),
    authority: [],
  },
  {
    key: 'class-category',
    path: '/class/category',
    component: lazy(() => import('@/pages/class/category')),
    authority: [],
  },
  {
    key: 'class-schedule',
    path: '/class/schedule',
    component: lazy(() => import('@/pages/class/Schedule')),
    authority: [],
  },
  {
    key: 'class-detail',
    path: '/class/detail',
    component: lazy(() => import('@/pages/class/Schedule/detail')),
    authority: [],
  },
]
