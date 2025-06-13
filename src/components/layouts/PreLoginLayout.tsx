import type { CommonProps } from '@/@types/common'
import authRoute from '@/routes/authRoute'
import { useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'

const PreLoginLayout = ({ children }: CommonProps) => {
  const location = useLocation()

  const { pathname } = location

  const isAuthPath = authRoute.some((route) => route.path === pathname)

  return (
    <div className="flex flex-auto flex-col h-[100vh]">
      {isAuthPath ? <AuthLayout>{children}</AuthLayout> : children}
    </div>
  )
}

export default PreLoginLayout
