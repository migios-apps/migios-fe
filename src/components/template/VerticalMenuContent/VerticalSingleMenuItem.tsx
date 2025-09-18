import type { CommonProps } from '@/@types/common'
import type { NavigationTree } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Dropdown from '@/components/ui/Dropdown'
import Menu from '@/components/ui/Menu'
import Tooltip from '@/components/ui/Tooltip'
import { Link, useLocation } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
  nav: NavigationTree
  direction?: Direction
  onLinkClick?: (link: { key: string; title: string; path: string }) => void
  t: (
    key: string,
    fallback?: string | Record<string, string | number>
  ) => string
  renderAsIcon?: boolean
  userAuthority: string[]
  currentKey?: string
  parentKeys?: string[]
}

interface DefaultItemProps {
  nav: NavigationTree
  onLinkClick?: (link: { key: string; title: string; path: string }) => void
  sideCollapsed?: boolean
  t: (
    key: string,
    fallback?: string | Record<string, string | number>
  ) => string
  indent?: boolean
  userAuthority: string[]
  showIcon?: boolean
  showTitle?: boolean
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({
  nav,
  children,
  direction,
  renderAsIcon,
  onLinkClick,
  userAuthority,
  t,
  currentKey,
}: CollapsedItemProps) => {
  const location = useLocation()
  const currentPath = location.pathname
  const isActive =
    currentKey === nav.key ||
    Boolean(nav.path && currentPath.startsWith(nav.path))
  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      {renderAsIcon ? (
        <Tooltip
          title={t(nav.translateKey, nav.title)}
          placement={direction === 'rtl' ? 'left' : 'right'}
        >
          {children}
        </Tooltip>
      ) : (
        <Dropdown.Item active={isActive}>
          {nav.path ? (
            <Link
              className="h-full w-full flex items-center outline-hidden"
              to={nav.path}
              target={nav.isExternalLink ? '_blank' : ''}
              onClick={() =>
                onLinkClick?.({
                  key: nav.key,
                  title: nav.title,
                  path: nav.path,
                })
              }
            >
              <span className={isActive ? 'text-primary' : ''}>
                {t(nav.translateKey, nav.title)}
              </span>
            </Link>
          ) : (
            <span className={isActive ? 'text-primary' : ''}>
              {t(nav.translateKey, nav.title)}
            </span>
          )}
        </Dropdown.Item>
      )}
    </AuthorityCheck>
  )
}

const DefaultItem = (props: DefaultItemProps & { currentKey?: string }) => {
  const {
    nav,
    onLinkClick,
    showTitle,
    indent,
    showIcon = true,
    userAuthority,
    t,
    currentKey,
  } = props

  const location = useLocation()
  const currentPath = location.pathname

  // Check if this menu item should be active based on prefix matching
  const isActive =
    currentKey === nav.key || // Exact match by key
    (nav.path && currentPath.startsWith(nav.path)) // Prefix match by path

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuItem
        key={nav.key}
        eventKey={nav.key}
        dotIndent={indent}
        isActive={Boolean(isActive)}
      >
        <Link
          to={nav.path}
          className="flex items-center gap-2 h-full w-full"
          target={nav.isExternalLink ? '_blank' : ''}
          onClick={() =>
            onLinkClick?.({ key: nav.key, title: nav.title, path: nav.path })
          }
        >
          <div className="flex items-center gap-2">
            {showIcon && <VerticalMenuIcon icon={nav.icon} />}
            {showTitle && (
              <span className={isActive ? 'text-primary' : ''}>
                {t(nav.translateKey, nav.title)}
              </span>
            )}
          </div>
        </Link>
      </MenuItem>
    </AuthorityCheck>
  )
}

const VerticalSingleMenuItem = ({
  nav,
  onLinkClick,
  sideCollapsed,
  direction,
  indent,
  renderAsIcon,
  userAuthority,
  showIcon,
  showTitle,
  t,
  currentKey,
  parentKeys,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
  return (
    <>
      {sideCollapsed ? (
        <CollapsedItem
          currentKey={currentKey}
          parentKeys={parentKeys}
          nav={nav}
          direction={direction}
          renderAsIcon={renderAsIcon}
          userAuthority={userAuthority}
          t={t}
          onLinkClick={onLinkClick}
        >
          <DefaultItem
            nav={nav}
            sideCollapsed={sideCollapsed}
            userAuthority={userAuthority}
            showIcon={showIcon}
            showTitle={showTitle}
            t={t}
            currentKey={currentKey}
            onLinkClick={onLinkClick}
          />
        </CollapsedItem>
      ) : (
        <DefaultItem
          nav={nav}
          sideCollapsed={sideCollapsed}
          userAuthority={userAuthority}
          showIcon={showIcon}
          showTitle={showTitle}
          indent={indent}
          t={t}
          currentKey={currentKey}
          onLinkClick={onLinkClick}
        />
      )}
    </>
  )
}

export default VerticalSingleMenuItem
