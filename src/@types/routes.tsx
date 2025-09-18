import { LayoutType } from './theme'
import type { LazyExoticComponent, ReactNode, JSX } from 'react'

export type PageHeaderProps = {
  title?: string | ReactNode | LazyExoticComponent<() => JSX.Element>
  description?: string | ReactNode
  contained?: boolean
  extraHeader?: string | ReactNode | LazyExoticComponent<() => JSX.Element>
}

export interface Meta {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  pageBackgroundType?: 'default' | 'plain'
  header?: PageHeaderProps
  footer?: boolean
  layout?: LayoutType
}

export type Route = {
  key: string
  path: string
  component: LazyExoticComponent<<T extends Meta>(props: T) => JSX.Element>
  authority: string[]
  // Jika diisi, override penentuan menu aktif menggunakan key bertingkat dipisah titik, contoh: 'masters.settings.othersSetting'
  activeMenuKey?: string
  meta?: Meta
}

export type Routes = Route[]
