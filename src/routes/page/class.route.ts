import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const classRoute: Routes = [
  {
    key: 'class-list',
    path: '/class/list',
    component: lazy(() => import('@/pages/class/list')),
    activeMenuKey: 'class',
    authority: [],
  },
  {
    key: 'class-category',
    path: '/class/category',
    component: lazy(() => import('@/pages/class/category')),
    activeMenuKey: 'class',
    authority: [],
  },
  {
    key: 'class-schedule',
    path: '/class/schedule',
    component: lazy(() => import('@/pages/class/Schedule')),
    activeMenuKey: 'class',
    authority: [],
  },
  {
    key: 'class-detail',
    path: '/class/detail',
    component: lazy(() => import('@/pages/class/Schedule/detail')),
    activeMenuKey: 'class',
    authority: [],
  },
]
