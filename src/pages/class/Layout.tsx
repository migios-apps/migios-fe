import FormClassPage from '@/components/form/class/FormClassPage'
import FromClassCategory from '@/components/form/class/FromClassCategory'
import {
  resetClassCategoryPageForm,
  resetClassPageForm,
  useClassCategoryPageForm,
  useClassPageForm,
} from '@/components/form/class/validation'
import { AdaptiveCard, Container } from '@/components/shared'
import { Button, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { Add, Calendar, DocumentText1, Layer } from 'iconsax-react'
import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const LayoutClasses = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const routeSchedule = '/class/schedule'
  const routeList = '/class/list'
  const routeCategory = '/class/category'

  const formProps = useClassPageForm()
  const formPropsCategory = useClassCategoryPageForm()
  const [showForm, setShowForm] = React.useState<boolean>(false)
  const [showFormCategory, setShowFormCategory] = React.useState<boolean>(false)

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h3>
              Class{' '}
              {pathname === routeSchedule
                ? 'schedule'
                : pathname === routeCategory
                  ? 'category'
                  : 'list'}
            </h3>
            {pathname !== routeCategory ? (
              <Button
                variant="solid"
                icon={
                  <Add
                    color="currentColor"
                    size={24}
                    className="w-5 h-5 mr-1"
                  />
                }
                onClick={() => {
                  resetClassPageForm(formProps)
                  setShowForm(true)
                }}
              >
                Add new class
              </Button>
            ) : (
              <Button
                variant="solid"
                icon={
                  <Add
                    color="currentColor"
                    size={24}
                    className="w-5 h-5 mr-1"
                  />
                }
                onClick={() => {
                  resetClassCategoryPageForm(formPropsCategory)
                  setShowFormCategory(true)
                }}
              >
                Add new category
              </Button>
            )}
          </div>
          <Tabs defaultValue={pathname} onChange={(tab) => navigate(tab)}>
            <TabList>
              <TabNav
                value={routeSchedule}
                icon={
                  <Calendar color="currentColor" size={24} variant="Bold" />
                }
                className="min-w-[140px]"
              >
                Schedule
              </TabNav>
              <TabNav
                value={routeList}
                icon={
                  <DocumentText1
                    color="currentColor"
                    size={24}
                    variant="Bold"
                  />
                }
                className="min-w-[140px]"
              >
                Class List
              </TabNav>
              <TabNav
                value={routeCategory}
                icon={<Layer color="currentColor" size={24} variant="Bold" />}
                className="min-w-[140px]"
              >
                Category
              </TabNav>
            </TabList>
            <div className="relative">{children || <Outlet />}</div>
          </Tabs>

          <FormClassPage
            open={showForm}
            type={'create'}
            formProps={formProps}
            onClose={() => setShowForm(false)}
          />

          <FromClassCategory
            open={showFormCategory}
            type={'create'}
            formProps={formPropsCategory}
            onClose={() => setShowFormCategory(false)}
          />
        </div>
      </AdaptiveCard>
    </Container>
  )
}

export default LayoutClasses
