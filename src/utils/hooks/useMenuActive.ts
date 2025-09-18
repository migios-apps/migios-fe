import type { NavigationTree } from '@/@types/navigation'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

interface NavInfo extends NavigationTree {
  parentKey?: string
}

const getRouteInfo = (
  navTree: NavInfo | NavInfo[],
  key: string,
  currentPath?: string
): NavInfo | undefined => {
  // Jika array, telusuri setiap node
  if (Array.isArray(navTree)) {
    for (const node of navTree) {
      const found = getRouteInfo(node, key, currentPath)
      if (found) return found
    }
    return undefined
  }

  // 1) Cocokkan key pada node saat ini
  if (navTree?.key === key) {
    return navTree
  }

  // 2) Prioritaskan pencarian ke anak (berdasarkan key), agar activeMenuKey menang atas prefix path parent
  if (navTree?.subMenu?.length) {
    for (const child of navTree.subMenu) {
      const foundByKey = getRouteInfo(child, key, currentPath)
      if (foundByKey && foundByKey.key === key) {
        if (!foundByKey.parentKey) {
          foundByKey.parentKey = navTree.key
        }
        return foundByKey
      }
    }
  }

  // 3) Jika belum ketemu berdasarkan key, cari ke anak dengan fallback path
  if (navTree?.subMenu?.length) {
    for (const child of navTree.subMenu) {
      const found = getRouteInfo(child, key, currentPath)
      if (found) {
        // Tetapkan parent langsung
        if (!found.parentKey) {
          found.parentKey = navTree.key
        }
        return found
      }
    }
  }

  // 4) Terakhir, fallback ke prefix path pada node saat ini
  if (navTree?.path && currentPath && currentPath.startsWith(navTree.path)) {
    return navTree
  }

  return undefined
}

const findNestedRoute = (
  navTree: NavigationTree[],
  key: string,
  currentPath?: string
): boolean => {
  const found = navTree?.find((node) => {
    return (
      node?.key === key ||
      (node?.path && currentPath && currentPath.startsWith(node.path))
    )
  })
  if (found) {
    return true
  }
  return navTree.some((c) => findNestedRoute(c.subMenu, key, currentPath))
}

const getTopRouteKey = (
  navTree: NavigationTree[],
  key: string,
  currentPath?: string
): NavigationTree => {
  let foundNav = {} as NavigationTree
  navTree?.forEach((nav) => {
    if (findNestedRoute([nav], key, currentPath)) {
      foundNav = nav
    }
  })
  return foundNav
}

function useMenuActive(navTree: NavigationTree[], key: string) {
  const location = useLocation()
  const currentPath = location.pathname

  const activedRoute = useMemo(() => {
    const route = getRouteInfo(navTree, key, currentPath)
    return route
  }, [navTree, key, currentPath])

  const includedRouteTree = useMemo(() => {
    const included = getTopRouteKey(navTree, key, currentPath)
    return included
  }, [navTree, key, currentPath])

  return { activedRoute, includedRouteTree }
}

export default useMenuActive
