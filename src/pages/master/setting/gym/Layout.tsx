import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import React, { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const LayoutGymSetting = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tabListRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLDivElement>(null)

  const aboutGym = '/settings/gym/about'
  const routeLocation = '/settings/gym/location'
  const routePayments = '/settings/gym/payments'
  const routePlan = '/settings/gym/plan'

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
              ref={pathname === aboutGym ? activeTabRef : undefined}
              value={aboutGym}
              className="w-full min-w-fit"
            >
              Tentang Gym
            </TabNav>
            <TabNav
              ref={pathname === routeLocation ? activeTabRef : undefined}
              value={routeLocation}
              className="w-full min-w-fit"
            >
              Daftar Lokasi
            </TabNav>
            <TabNav
              ref={pathname === routePlan ? activeTabRef : undefined}
              value={routePlan}
              className="w-full min-w-fit"
            >
              Langganan
            </TabNav>
            <TabNav
              ref={pathname === routePayments ? activeTabRef : undefined}
              value={routePayments}
              className="w-full min-w-fit"
            >
              Pembayaran
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

export default LayoutGymSetting
