import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const measurementRoute: Routes = [
  {
    key: 'measurement',
    path: '/measurement',
    component: lazy(() => import('@/pages/measurement')),
    authority: [],
  },
  {
    key: 'measurement-create',
    path: '/measurement/create',
    component: lazy(() => import('@/pages/measurement/create')),
    authority: [],
    meta: {
      header: {
        title: 'Create Measurement',
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: 'measurement-edit',
    path: '/measurement/edit/:id',
    component: lazy(() => import('@/pages/measurement/edit')),
    authority: [],
    meta: {
      header: {
        title: 'Edit Measurement',
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: 'measurement-details',
    path: '/measurement/details/:id',
    component: lazy(() => import('@/pages/measurement/details')),
    authority: [],
    meta: {
      header: {
        title: 'Measurement Detail',
        contained: true,
      },
      footer: false,
    },
  },
]
