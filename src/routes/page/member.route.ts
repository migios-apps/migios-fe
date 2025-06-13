import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

export const memberRoute: Routes = [
  {
    key: 'members',
    path: '/members',
    component: lazy(() => import('@/pages/members')),
    authority: [],
  },
  {
    key: 'member-details',
    path: '/members/member-details/:id',
    component: lazy(() => import('@/pages/members/MemberDetails')),
    authority: [],
  },
  {
    key: 'member-create',
    path: '/members/member-create',
    component: lazy(() => import('@/pages/members/MemberCreate')),
    authority: [],
  },
]
