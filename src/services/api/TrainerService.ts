import ApiService from '@/services/ApiService'
import { ParamsFilter } from './@types/api'
import { TrainerListTypeResponse } from './@types/trainer'

export async function apiGetTrainerList(params?: ParamsFilter) {
  return ApiService.fetchDataWithAxios<TrainerListTypeResponse>({
    url: `/trainer/list`,
    method: 'get',
    params,
  })
}

export async function apiGetTrainerListByPackageId(
  packageId: number,
  params?: ParamsFilter
) {
  return ApiService.fetchDataWithAxios<TrainerListTypeResponse>({
    url: `/trainer/list-by-package/${packageId}`,
    method: 'get',
    params,
  })
}
