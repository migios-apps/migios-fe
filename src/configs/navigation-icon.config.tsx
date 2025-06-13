import type { JSX } from 'react'
import { IoCalendarNumberOutline } from 'react-icons/io5'
import {
  PiAcornDuotone,
  PiArrowsInDuotone,
  PiBagSimpleDuotone,
  PiBookBookmarkDuotone,
  PiBookOpenUserDuotone,
  PiHouseLineDuotone,
} from 'react-icons/pi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  dashboard: <PiHouseLineDuotone />,
  schedule: <IoCalendarNumberOutline />,
  singleMenu: <PiAcornDuotone />,
  collapseMenu: <PiArrowsInDuotone />,
  groupSingleMenu: <PiBookOpenUserDuotone />,
  groupCollapseMenu: <PiBookBookmarkDuotone />,
  groupMenu: <PiBagSimpleDuotone />,
}

export default navigationIcon
