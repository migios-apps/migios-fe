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
    path: '/members/create',
    component: lazy(() => import('@/pages/members/create')),
    authority: [],
    meta: {
      header: {
        title: 'Create Member',
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: 'member-edit',
    path: '/members/edit/:code',
    component: lazy(() => import('@/pages/members/edit')),
    authority: [],
    meta: {
      header: {
        title: 'Edit Member',
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: 'memberDetails',
    path: '/members/details/:id',
    component: lazy(() => import('@/pages/members/detail')),
    authority: [],
  },
  // Old route (dikomentar untuk referensi)
  // {
  //   key: 'member-create-old',
  //   path: '/members/member-create',
  //   component: lazy(() => import('@/pages/members/MemberCreate')),
  //   authority: [],
  // },
]
