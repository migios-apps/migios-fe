import type { LayoutType } from '@/@types/theme'
import { Suspense, type ComponentType } from 'react'
import Loading from '@/components/shared/Loading'

export type AppRouteProps<T> = {
  component: ComponentType<T>
  layout?: LayoutType
}

const AppRoute = <T extends Record<string, unknown>>({
  component: Component,
  ...props
}: AppRouteProps<T>) => {
  return (
    <Suspense fallback={<Loading loading={true} className="w-full h-full" />}>
      <Component {...(props as T)} />
    </Suspense>
  )
}

export default AppRoute
