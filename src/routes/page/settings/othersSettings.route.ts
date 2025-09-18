import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

export const othersSettingsRoute: Routes = [
  {
    key: 'taxSetting',
    path: '/settings/others/taxes',
    component: lazy(() => import('@/pages/master/setting/others/taxes')),
    authority: [],
    activeMenuKey: 'masters.settings.othersSetting',
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'invoiceSetting',
    path: '/settings/others/invoice',
    component: lazy(
      () => import('@/pages/master/setting/others/invoices/invoice')
    ),
    authority: [],
    activeMenuKey: 'masters.settings.othersSetting',
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'commissionSetting',
    path: '/settings/others/commission',
    component: lazy(() => import('@/pages/master/setting/others/commission')),
    authority: [],
    activeMenuKey: 'masters.settings.othersSetting',
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'loyaltyPointSetting',
    path: '/settings/others/loyalty-point',
    component: lazy(() => import('@/pages/master/setting/others/loyaltyPoint')),
    authority: [],
    activeMenuKey: 'masters.settings.othersSetting',
    meta: {
      pageContainerType: 'gutterless',
    },
  },
  {
    key: 'membershipSetting',
    path: '/settings/others/membership',
    component: lazy(() => import('@/pages/master/setting/others/membership')),
    authority: [],
    activeMenuKey: 'masters.settings.othersSetting',
    meta: {
      pageContainerType: 'gutterless',
    },
  },
]
