import type { Routes } from '@/@types/routes'
// import { lazy } from 'react'
import { gymSettingsRoute } from './gymSettings.route'
import { othersSettingsRoute } from './othersSettings.route'
import { rolesPermissionsRoute } from './rolesPermissions.route'

export const settingsRoute: Routes = [
  ...rolesPermissionsRoute,
  ...othersSettingsRoute,
  ...gymSettingsRoute,
  // {
  //   key: 'logActivity',
  //   path: '/settings/log-activity',
  //   component: lazy(() => import('@/pages/master/setting/logs')),
  //   authority: [],
  // },
]
