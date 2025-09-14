import type { LayoutType } from '@/@types/theme'
import { useAuth } from '@/auth'
import Layout from '@/components/layouts'
import PageContainer from '@/components/template/PageContainer'
import appConfig from '@/configs/app.config'
import { protectedRoutes, publicRoutes } from '@/routes'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppRoute from './AppRoute'
import AuthorityGuard from './AuthorityGuard'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const Error404 = lazy(() => import('@/pages/others/Error/Error404'))

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath, clubsAuthenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
  const { user, authDashboard, authenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        {protectedRoutes.map((route, index) => (
          <Route
            key={route.key + index}
            path={route.path}
            element={
              <Layout layout={route.meta?.layout} routeKey={route.key}>
                <AuthorityGuard
                  userAuthority={
                    user?.role_permission?.permissions?.map(
                      (permission) => permission.name
                    ) ?? []
                  }
                  authority={route.authority}
                >
                  <PageContainer {...props} {...route.meta}>
                    <AppRoute component={route.component} {...route.meta} />
                  </PageContainer>
                </AuthorityGuard>
              </Layout>
            }
          />
        ))}
        <Route
          path="/"
          element={
            <Navigate
              replace
              to={
                authenticated && !authDashboard
                  ? clubsAuthenticatedEntryPath
                  : authenticatedEntryPath
              }
            />
          }
        />
        <Route path="*" element={<Error404 />} />
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layout layout={route.meta?.layout} routeKey={route.key}>
                <AppRoute component={route.component} {...route.meta} />
              </Layout>
            }
          />
        ))}
      </Route>
    </Routes>
  )
}

export default AllRoutes
