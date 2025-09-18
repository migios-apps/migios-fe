import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const rolesPermissionsRoute: Routes = [
  {
    key: 'rolesPermissions',
    path: '/settings/roles-permissions',
    component: lazy(() => import('@/pages/master/setting/roles-permissions')),
    authority: [],
    activeMenuKey: 'masters.settings.rolesPermissions',
  },
  {
    key: 'createRole',
    path: '/settings/roles-permissions/create',
    component: lazy(
      () => import('@/pages/master/setting/roles-permissions/create')
    ),
    authority: [],
    activeMenuKey: 'masters.settings.rolesPermissions',
    meta: {
      header: {
        title: 'Create Role',
        contained: true,
      },
      footer: false,
    },
  },
  {
    key: 'editRole',
    path: '/settings/roles-permissions/edit/:id',
    component: lazy(
      () => import('@/pages/master/setting/roles-permissions/edit')
    ),
    authority: [],
    activeMenuKey: 'masters.settings.rolesPermissions',
    meta: {
      header: {
        title: 'Edit Role',
        contained: true,
      },
      footer: false,
    },
  },
]
