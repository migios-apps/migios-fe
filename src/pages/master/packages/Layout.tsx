import { AdaptiveCard, Container } from '@/components/shared'
import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { People, Profile2User, Weight } from 'iconsax-react'
import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const LayoutPackages = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const routeMembership = '/packages/membership'
  const routePTProgram = '/packages/pt-program'
  const routeClass = '/packages/class'

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Packages</h3>
          </div>
          <Tabs defaultValue={pathname} onChange={(tab) => navigate(tab)}>
            <TabList>
              <TabNav value={routeMembership} icon={<Profile2User />}>
                Membership
              </TabNav>
              <TabNav
                value={routePTProgram}
                icon={<Weight variant="Outline" />}
                className="min-w-[155px]"
              >
                PT Program
              </TabNav>
              <TabNav value={routeClass} icon={<People />}>
                Class
              </TabNav>
            </TabList>
            <div className="relative">{children || <Outlet />}</div>
          </Tabs>
        </div>
      </AdaptiveCard>
    </Container>
  )
}

export default LayoutPackages
