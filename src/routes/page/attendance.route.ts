import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const attendanceRoute: Routes = [
  {
    key: 'checkin',
    path: '/attendance/checkin',
    component: lazy(() => import('@/pages/attendance/checkin')),
    authority: [],
    // meta: {
    //   layout: 'contentOverlay',
    //   footer: false,
    // },
  },
  {
    key: 'checkout',
    path: '/attendance/checkout',
    component: lazy(() => import('@/pages/attendance/checkout')),
    authority: [],
    // meta: {
    //   layout: 'contentOverlay',
    //   footer: false,
    // },
  },
  {
    key: 'history',
    path: '/attendance/history',
    component: lazy(() => import('@/pages/attendance/history')),
    authority: [],
    // meta: {
    //   layout: 'contentOverlay',
    //   footer: false,
    // },
  },
]
