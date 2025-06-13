import { ApiTypes, MetaApi } from './api'

export interface TrainerDetail {
  id: number
  user_id: number
  club_id: number
  code: string
  name: string
  identity_number: string
  identity_type: string
  birth_date: string
  address: string
  photo?: string
  description?: string
  phone: string
  email: string
  gender: string
  specialist: string
  join_date: string
  enabled: boolean
  created_at?: string
  updated_at?: string
}

export interface TrainerType extends TrainerDetail {
  members?: {
    id: number
    name: string
    photo: object
    code: string
  }[]
  packages?: {
    total_package: number
    total_members: number
  }
}

export type TrainerListTypeResponse = Omit<ApiTypes, 'data'> & {
  data: { data: TrainerType[]; meta: MetaApi }
}
export type TrainerDetailListResponse = Omit<ApiTypes, 'data'> & {
  data: { data: TrainerDetail[]; meta: MetaApi }
}
