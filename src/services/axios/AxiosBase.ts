import appConfig from '@/configs/app.config'
import type { AxiosError } from 'axios'
import axios from 'axios'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'

const AxiosBase = axios.create({
  timeout: 60000,
  baseURL: `${process.env.PUBLIC_API_URL_V1}${appConfig.apiPrefix}`,
})

AxiosBase.interceptors.request.use(
  (config) => {
    return AxiosRequestIntrceptorConfigCallback(config)
  },
  (error) => {
    return Promise.reject(error)
  }
)

AxiosBase.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    AxiosResponseIntrceptorErrorCallback(error)
    return Promise.reject(error)
  }
)

export default AxiosBase
