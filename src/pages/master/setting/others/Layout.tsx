import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import React, { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const LayoutOtherSetting = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tabListRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLDivElement>(null)

  const routeCommission = '/settings/others/commission'
  const routeTax = '/settings/others/taxes'
  const routeInvoice = '/settings/others/invoice'
  const routeLoyaltyPoint = '/settings/others/loyalty-point'
  const routeMembership = '/settings/others/membership'

  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const tabList = tabListRef.current
      const activeTab = activeTabRef.current

      const scrollLeft =
        activeTab.offsetLeft -
        tabList.clientWidth / 2 +
        activeTab.clientWidth / 2

      tabList.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    }
  }, [pathname])

  return (
    <div className="h-full">
      <div className="sticky top-16 z-[5] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <Tabs defaultValue={pathname} onChange={(tab) => navigate(tab)}>
          <TabList ref={tabListRef} className="overflow-x-auto">
            <TabNav
              ref={pathname === routeCommission ? activeTabRef : undefined}
              value={routeCommission}
              className="w-full min-w-fit"
            >
              Commission
            </TabNav>
            <TabNav
              ref={pathname === routeTax ? activeTabRef : undefined}
              value={routeTax}
              className="w-full min-w-fit"
            >
              Tax
            </TabNav>
            <TabNav
              ref={pathname === routeInvoice ? activeTabRef : undefined}
              value={routeInvoice}
              className="w-full min-w-fit"
            >
              Invoice
            </TabNav>
            <TabNav
              ref={pathname === routeLoyaltyPoint ? activeTabRef : undefined}
              value={routeLoyaltyPoint}
              className="w-full min-w-fit"
            >
              Loyalty Point
            </TabNav>
            <TabNav
              ref={pathname === routeMembership ? activeTabRef : undefined}
              value={routeMembership}
              className="w-full min-w-fit"
            >
              Membership
            </TabNav>
          </TabList>
        </Tabs>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-6 md:px-8">
        {children || <Outlet />}
      </div>
    </div>
  )
}

export default LayoutOtherSetting
