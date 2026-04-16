import {
  createApiClient,
  type ApiResult,
  type HttpAdapter,
  type HttpRequestConfig,
} from '@bingwu-my-monorepo/api-client';
import { ApiCode } from '@bingwu-my-monorepo/shared';
import { http } from '@/utils/http';

function wrapSuccess<T>(data: T): ApiResult<T> {
  return {
    code: ApiCode.SUCCESS,
    message: 'ok',
    data,
  };
}

async function requestAsApiResult<T>(request: () => Promise<unknown>): Promise<T> {
  const data = await request();
  return wrapSuccess(data) as T;
}

const apiHttp: HttpAdapter = {
  get: (url, config) => requestAsApiResult(() => http.get(url, config as HttpRequestConfig)),
  post: (url, data, config) =>
    requestAsApiResult(() => http.post(url, data, config as HttpRequestConfig)),
  put: (url, data, config) =>
    requestAsApiResult(() => http.put(url, data, config as HttpRequestConfig)),
  delete: (url, config) => requestAsApiResult(() => http.delete(url, config as HttpRequestConfig)),
};

export const apiClient = createApiClient(apiHttp);
