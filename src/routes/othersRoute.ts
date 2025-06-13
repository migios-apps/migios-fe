import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const othersRoute: Routes = [
  {
    key: 'accessDenied',
    path: `/access-denied`,
    component: lazy(() => import('@/pages/others/AccessDenied')),
    authority: [ADMIN, USER],
    meta: {
      pageBackgroundType: 'plain',
      pageContainerType: 'contained',
    },
  },
]

export default othersRoute
