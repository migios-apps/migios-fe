import type { Routes } from '@/@types/routes'
import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import { attendanceRoute } from './page/attendance.route'
import { classRoute } from './page/class.route'
import { clubSetupRoute } from './page/club-setup.route'
import { employeeRoute } from './page/employee.route'
import { financeRoute } from './page/finance.route'
import { measurementRoute } from './page/measurement.route'
import { memberRoute } from './page/member.route'
import { packageRoute } from './page/package.route'
import { salesRoute } from './page/sales.route'
import { settingsRoute } from './page/settings/settings.route'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
  ...othersRoute,
  ...classRoute,
  ...memberRoute,
  ...packageRoute,
  ...salesRoute,
  ...financeRoute,
  ...attendanceRoute,
  ...clubSetupRoute,
  ...settingsRoute,
  ...employeeRoute,
  ...measurementRoute,
  {
    key: 'clubs',
    path: '/clubs',
    component: lazy(() => import('@/pages/clubs')),
    authority: [],
    meta: {
      pageBackgroundType: 'plain',
      pageContainerType: 'default',
      layout: 'blank',
      footer: false,
    },
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/pages/dashboard')),
    authority: [],
  },
  {
    key: 'schedule',
    path: '/schedule',
    component: lazy(() => import('@/pages/schedule')),
    authority: [],
  },
  {
    key: 'cuttingSessions',
    path: '/cutting-sessions',
    component: lazy(() => import('@/pages/cutting-sessions')),
    authority: [],
  },
  {
    key: 'products',
    path: '/products',
    component: lazy(() => import('@/pages/master/products')),
    authority: [],
  },
  {
    key: 'reports',
    path: '/reports',
    component: lazy(() => import('@/pages/master/reports')),
    authority: [],
  },
  {
    key: 'testInfinite',
    path: '/testInfinite',
    component: lazy(() => import('@/pages/testinfinite')),
    authority: [],
  },
]
