import ApiService from '../ApiService'
import { ParamsFilter } from './@types/api'
import {
  MemberMeasurementPayload,
  MemberMeasurementResponse,
} from './@types/measurement'

export async function apiGetMemberMeasurementList(params?: ParamsFilter) {
  return ApiService.fetchDataWithAxios<MemberMeasurementResponse>({
    url: `/measurement`,
    method: 'get',
    params,
  })
}

export async function apiCreateMemberMeasurement(
  data: MemberMeasurementPayload
) {
  return ApiService.fetchDataWithAxios<any>({
    url: `/measurement`,
    method: 'post',
    data: data as unknown as Record<string, unknown> & MemberMeasurementPayload,
  })
}

export async function apiUpdateMemberMeasurement(
  id: number,
  data: MemberMeasurementPayload
) {
  return ApiService.fetchDataWithAxios<any>({
    url: `/measurement/${id}`,
    method: 'patch',
    data: data as unknown as Record<string, unknown> & MemberMeasurementPayload,
  })
}

export async function apiGetMemberMeasurement(id: number) {
  return ApiService.fetchDataWithAxios<{ data: any }>({
    url: `/measurement/${id}`,
    method: 'get',
  })
}

export async function apiDeleteMemberMeasurement(id: number) {
  return ApiService.fetchDataWithAxios<any>({
    url: `/measurement/${id}`,
    method: 'delete',
  })
}
