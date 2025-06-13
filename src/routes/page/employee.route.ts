import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const employeeRoute: Routes = [
  {
    key: 'employee',
    path: '/employee',
    component: lazy(() => import('@/pages/master/employee')),
    authority: [],
  },
  {
    key: 'employee-detail',
    path: '/employee/detail/:id',
    component: lazy(() => import('@/pages/master/employee/detail')),
    authority: [],
  },
  {
    key: 'employee-create',
    path: '/employee/create',
    component: lazy(() => import('@/pages/master/employee/create')),
    authority: [],
    meta: {
      header: {
        title: 'Create Employee',
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: 'employee-edit',
    path: '/employee/edit/:id',
    component: lazy(() => import('@/pages/master/employee/edit')),
    authority: [],
    meta: {
      header: {
        title: 'Edit Employee',
        contained: true,
      },
      footer: false,
    },
  },
]
