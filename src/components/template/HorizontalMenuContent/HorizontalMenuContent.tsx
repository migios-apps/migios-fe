import type { TraslationFn } from '@/@types/common'
import type { NavigationTree } from '@/@types/navigation'
import { Direction } from '@/@types/theme'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import useMenuActive from '@/utils/hooks/useMenuActive'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbChevronDown } from 'react-icons/tb'
import HorizontalMenuDropdown from './HorizontalMenuDropdown'
import HorizontalMenuDropdownContent from './HorizontalMenuDropdownContent'
import HorizontalMenuDropdownTrigger from './HorizontalMenuDropdownTrigger'

type HorizontalMenuContentProps = {
  routeKey: string
  navigationTree?: NavigationTree[]
  direction?: Direction
  translationSetup?: boolean
  userAuthority: string[]
}

const HorizontalMenuContent = (props: HorizontalMenuContentProps) => {
  const {
    routeKey,
    navigationTree = [],
    translationSetup,
    userAuthority,
  } = props

  const { t } = useTranslation(!translationSetup)
  const { activedRoute } = useMenuActive(navigationTree, routeKey)

  // Fungsi untuk memeriksa apakah menu parent harus aktif
  const isParentActive = (nav: NavigationTree) => {
    // Jika nav adalah parent yang memiliki submenu
    if (nav.subMenu && nav.subMenu.length > 0) {
      // Periksa apakah ada submenu yang aktif (path saat ini dimulai dengan path submenu)
      return nav.subMenu.some((subItem) => {
        return (
          activedRoute?.key === subItem.key ||
          (subItem.path && activedRoute?.path?.startsWith(subItem.path)) ||
          // Periksa nested submenu jika ada
          (subItem.subMenu &&
            subItem.subMenu.length > 0 &&
            subItem.subMenu.some(
              (nestedItem) =>
                activedRoute?.key === nestedItem.key ||
                (nestedItem.path &&
                  activedRoute?.path?.startsWith(nestedItem.path))
            ))
        )
      })
    }
    return false
  }

  return (
    <div className="flex gap-1">
      {navigationTree.map((nav) => (
        <AuthorityCheck
          key={nav.key}
          userAuthority={userAuthority}
          authority={nav.authority}
        >
          {nav.subMenu.length > 0 ? (
            <HorizontalMenuDropdown
              dropdownLean={nav.meta?.horizontalMenu?.layout === 'default'}
              triggerContent={({ ref, props }) => (
                <HorizontalMenuDropdownTrigger
                  ref={ref}
                  {...props}
                  asElement="button"
                  active={Boolean(
                    activedRoute?.key === nav.key ||
                      (nav.path && activedRoute?.path?.startsWith(nav.path)) ||
                      isParentActive(nav)
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span>{t(nav.translateKey, nav.title)}</span>
                    <TbChevronDown />
                  </div>
                </HorizontalMenuDropdownTrigger>
              )}
              menuContent={({ styles, handleDropdownClose }) => (
                <HorizontalMenuDropdownContent
                  style={styles}
                  navigationTree={nav.subMenu}
                  t={t as TraslationFn}
                  layoutMeta={nav?.meta?.horizontalMenu}
                  routeKey={routeKey}
                  routeParentKey={activedRoute?.parentKey}
                  userAuthority={userAuthority}
                  onDropdownClose={handleDropdownClose}
                />
              )}
            ></HorizontalMenuDropdown>
          ) : (
            <HorizontalMenuDropdownTrigger
              {...props}
              path={nav.path}
              isExternalLink={nav.isExternalLink}
              active={Boolean(
                activedRoute?.key === nav.key ||
                  (nav.path && activedRoute?.path?.startsWith(nav.path))
              )}
              asElement="a"
            >
              <div className="flex items-center gap-1">
                <span>{t(nav.translateKey, nav.title)}</span>
              </div>
            </HorizontalMenuDropdownTrigger>
          )}
        </AuthorityCheck>
      ))}
    </div>
  )
}

export default HorizontalMenuContent
