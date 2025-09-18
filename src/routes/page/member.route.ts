import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const memberRoute: Routes = [
  {
    key: 'members',
    path: '/members',
    component: lazy(() => import('@/pages/members')),
    authority: [],
  },
  {
    key: 'member-create',
    path: '/members/member-create',
    component: lazy(() => import('@/pages/members/MemberCreate')),
    authority: [],
  },
  {
    key: 'memberDetails',
    path: '/members/details/:id',
    component: lazy(() => import('@/pages/members/detail')),
    authority: [],
  },
]
