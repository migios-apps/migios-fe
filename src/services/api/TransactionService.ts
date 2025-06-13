import ApiService from '../ApiService'
import { ParamsFilter } from './@types/api'
import {
  CheckoutRequest,
  TransactionDetailResponse,
  TransactionTypeListResponse,
} from './@types/transaction'

export async function apiCreateCheckout(data: CheckoutRequest) {
  return ApiService.fetchDataWithAxios({
    url: `/transaction/checkout`,
    method: 'post',
    data: data as unknown as Record<string, unknown>,
  })
}

export async function apiGetTransactionList(
  clubId: number,
  params?: ParamsFilter
) {
  return ApiService.fetchDataWithAxios<TransactionTypeListResponse>({
    url: `/transaction/${clubId}/list`,
    method: 'get',
    params,
  })
}

export async function apiGetTransaction(id: number | string) {
  return ApiService.fetchDataWithAxios<TransactionDetailResponse>({
    url: `/transaction/${id}`,
    method: 'get',
  })
}

export async function apiCreateRefund(data: any) {
  return ApiService.fetchDataWithAxios({
    url: `/transaction/refund`,
    method: 'POST',
    data,
  })
}
