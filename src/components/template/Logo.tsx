import type { CommonProps } from '@/@types/common'
import { APP_NAME } from '@/constants/app.constant'
import classNames from 'classnames'

interface LogoProps extends CommonProps {
  type?: 'full' | 'full2' | 'streamline'
  mode?: 'light' | 'dark'
  imgClass?: string
  logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
  const {
    type = 'full',
    mode = 'light',
    className,
    imgClass,
    style,
    logoWidth = 'auto',
  } = props

  return (
    <div
      className={classNames('logo', className)}
      style={{ ...style, ...{ width: logoWidth } }}
    >
      <img
        className={imgClass}
        src={`${LOGO_SRC_PATH}logo-${mode}-${type}.svg`}
        alt={`${APP_NAME} logo`}
      />
    </div>
  )
}

export default Logo
