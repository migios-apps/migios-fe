export type Direction = 'ltr' | 'rtl'
export type Mode = 'light' | 'dark'
export type ControlSize = 'lg' | 'md' | 'sm'
export type LayoutType =
  | 'blank'
  | 'collapsibleSide'
  | 'stackedSide'
  | 'topBarClassic'
  | 'framelessSide'
  | 'contentOverlay'

export type Theme = {
  themeSchema: string
  direction: Direction
  mode: Mode
  panelExpand: boolean
  welcome: boolean
  layout: {
    type: LayoutType
    sideNavCollapse: boolean
    showFooter: boolean
    previousType?: LayoutType | ''
  }
}
