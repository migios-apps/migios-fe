import { AdaptiveCard, Container } from '@/components/shared'
import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { MoneyArchive, Moneys, Wallet1 } from 'iconsax-react'
import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const LayoutFinance = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const routeRekening = '/finance/rekening'
  const routeCategory = '/finance/category'
  const routeHistory = '/finance/history'

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Finance</h3>
          </div>
          <Tabs defaultValue={pathname} onChange={(tab) => navigate(tab)}>
            <TabList>
              <TabNav
                value={routeRekening}
                icon={<Wallet1 color="currentColor" size={24} variant="Bold" />}
              >
                Rekening
              </TabNav>
              <TabNav
                value={routeCategory}
                icon={<Moneys color="currentColor" size={24} variant="Bold" />}
                className="min-w-[155px]"
              >
                Category
              </TabNav>
              <TabNav
                value={routeHistory}
                icon={
                  <MoneyArchive color="currentColor" size={24} variant="Bold" />
                }
              >
                History
              </TabNav>
            </TabList>
            <div className="relative">{children || <Outlet />}</div>
          </Tabs>
        </div>
      </AdaptiveCard>
    </Container>
  )
}

export default LayoutFinance
