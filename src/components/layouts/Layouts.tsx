import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useCallback, useEffect } from 'react'
// import { useThemeStore } from '@/store/themeStore'
import { LayoutType } from '@/@types/theme'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useThemeStore } from '@/store/themeStore'
import { useLocation } from 'react-router-dom'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'

const Layout = ({
  children,
  layout,
  routeKey,
  activeMenuKey,
}: CommonProps & {
  layout?: LayoutType
  routeKey: string
  activeMenuKey?: string
}) => {
  const location = useLocation()
  // const layoutType = useThemeStore((state) => state.layout.type)

  const { authenticated } = useAuth()

  const {
    layout: currentLayoutType,
    setPreviousLayout,
    setLayout,
  } = useThemeStore((state) => state)

  const { type: layoutType, previousType: previousLayout } = currentLayoutType

  const setCurrentRouteKey = useRouteKeyStore(
    (state) => state.setCurrentRouteKey
  )

  const handleLayoutChange = useCallback(() => {
    const overriddenKey = activeMenuKey?.split('.')?.pop()
    setCurrentRouteKey(overriddenKey || routeKey)

    if (layout && layout !== layoutType) {
      setPreviousLayout(layoutType)
      setLayout(layout)
    }

    if (!layout && previousLayout && layoutType !== previousLayout) {
      setLayout(previousLayout)
      setPreviousLayout('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, routeKey, activeMenuKey])

  useEffect(() => {
    handleLayoutChange()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location, handleLayoutChange])

  return (
    <>
      {authenticated ? (
        <PostLoginLayout layoutType={layout ?? layoutType}>
          {children}
        </PostLoginLayout>
      ) : (
        <PreLoginLayout>{children}</PreLoginLayout>
      )}
    </>
  )
}

export default Layout
