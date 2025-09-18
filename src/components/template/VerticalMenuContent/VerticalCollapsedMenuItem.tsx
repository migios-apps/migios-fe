import type { CommonProps, TraslationFn } from '@/@types/common'
import type { NavigationTree } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Dropdown from '@/components/ui/Dropdown'
import Menu from '@/components/ui/Menu'
import { useLocation } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'

interface DefaultItemProps extends CommonProps {
  nav: NavigationTree
  onLinkClick?: (link: { key: string; title: string; path: string }) => void
  t: TraslationFn
  indent?: boolean
  dotIndent?: boolean
  userAuthority: string[]
}

interface CollapsedItemProps extends DefaultItemProps {
  direction: Direction
  renderAsIcon?: boolean
  currentKey?: string
  parentKeys?: string[]
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
  sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({
  nav,
  indent,
  dotIndent,
  children,
  userAuthority,
  t,
  currentKey,
  parentKeys,
}: DefaultItemProps & { currentKey?: string; parentKeys?: string[] }) => {
  const location = useLocation()
  const currentPath = location.pathname

  // Check if any submenu item matches current path (prefix matching)
  const isActive =
    nav.subMenu?.some(
      (subItem: NavigationTree) =>
        subItem.key === currentKey ||
        (subItem.path && currentPath.startsWith(subItem.path))
    ) ||
    parentKeys?.includes(nav.key) ||
    (nav.path && currentPath.startsWith(nav.path))

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuCollapse
        key={nav.key}
        label={
          <>
            <VerticalMenuIcon icon={nav.icon} />
            <span>{t(nav.translateKey, nav.title)}</span>
          </>
        }
        eventKey={nav.key}
        expanded={Boolean(isActive)}
        active={Boolean(isActive)}
        dotIndent={dotIndent}
        indent={indent}
      >
        {children}
      </MenuCollapse>
    </AuthorityCheck>
  )
}

const CollapsedItem = ({
  nav,
  direction,
  children,
  t,
  renderAsIcon,
  userAuthority,
  parentKeys,
  currentKey,
}: CollapsedItemProps) => {
  const location = useLocation()
  const currentPath = location.pathname

  // Check if any submenu item matches current path (prefix matching)
  const isDropdownActive =
    (nav.path && currentPath.startsWith(nav.path)) || // Dropdown aktif jika path sesuai
    nav.subMenu?.some(
      (subItem: NavigationTree) =>
        subItem.key === currentKey ||
        (subItem.path && currentPath.startsWith(subItem.path))
    ) ||
    parentKeys?.includes(nav.key)

  const menuItem = (
    <MenuItem
      key={nav.key}
      isActive={isDropdownActive}
      eventKey={nav.key}
      className="mb-2"
    >
      <VerticalMenuIcon icon={nav.icon} />
    </MenuItem>
  )

  const dropdownItem = (
    <div
      key={nav.key}
      className={isDropdownActive ? 'text-primary font-bold' : ''}
    >
      {t(nav.translateKey, nav.title)}
    </div>
  )

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <Dropdown
        trigger="hover"
        renderTitle={renderAsIcon ? menuItem : dropdownItem}
        placement={direction === 'rtl' ? 'left-start' : 'right-start'}
      >
        {children}
      </Dropdown>
    </AuthorityCheck>
  )
}

const VerticalCollapsedMenuItem = ({
  sideCollapsed,
  ...rest
}: VerticalCollapsedMenuItemProps) => {
  return sideCollapsed ? <CollapsedItem {...rest} /> : <DefaultItem {...rest} />
}

export default VerticalCollapsedMenuItem
