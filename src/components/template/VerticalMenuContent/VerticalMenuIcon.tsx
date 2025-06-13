// import navigationIcon from '@/configs/navigation-icon.config'
import type { ComponentPropsWithRef, ElementType } from 'react'
import React, { JSX } from 'react'

type VerticalMenuIconProps = {
  icon?: React.ComponentType<
    React.SVGProps<SVGSVGElement> & JSX.IntrinsicAttributes
  >
  gutter?: string
}

export const Icon = <T extends ElementType>({
  component,
  ...props
}: { header: T } & ComponentPropsWithRef<T>) => {
  const Component = component
  return <Component {...props} />
}

const VerticalMenuIcon = ({ icon }: VerticalMenuIconProps) => {
  // if (typeof icon !== 'string' && !icon) {
  //     return <></>
  // }
  const Icon = icon as unknown as React.ComponentType<
    React.SVGProps<SVGSVGElement> & JSX.IntrinsicAttributes
  >
  const iconItem = icon ? <Icon /> : <></>

  return (
    <>
      {/* {navigationIcon[icon] && (
                <span className={`text-2xl`}>{navigationIcon[icon]}</span>
            )} */}
      {icon && <span className={`text-2xl`}>{iconItem}</span>}
    </>
  )
}

export default VerticalMenuIcon
