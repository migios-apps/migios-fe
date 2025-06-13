import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'

const {
  unAuthenticatedEntryPath,
  clubsAuthenticatedEntryPath,
  onBoardingEntryPath,
} = appConfig

const ProtectedRoute = () => {
  const { authenticated, authDashboard, user } = useAuth()
  const total_user_clubs = user?.total_user_clubs ?? 0

  const { pathname } = useLocation()

  const getPathName =
    pathname === '/' ? '' : `?${REDIRECT_URL_KEY}=${location.pathname}`

  if (
    authenticated &&
    total_user_clubs === 0 &&
    pathname !== onBoardingEntryPath &&
    !authDashboard
  ) {
    return <Navigate replace to={`${onBoardingEntryPath}`} />
  } else if (
    authenticated &&
    total_user_clubs > 0 &&
    pathname !== clubsAuthenticatedEntryPath &&
    !authDashboard
  ) {
    return <Navigate replace to={`${clubsAuthenticatedEntryPath}`} />
  } else if (!authenticated) {
    return <Navigate replace to={`${unAuthenticatedEntryPath}${getPathName}`} />
  }

  return <Outlet />
}

export default ProtectedRoute
