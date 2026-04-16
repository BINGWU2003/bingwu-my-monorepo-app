import {
  createApiClient,
  type HttpAdapter,
  type HttpRequestConfig,
} from '@bingwu-my-monorepo/api-client';
import { http } from '@/utils/http';

const apiHttp: HttpAdapter = {
  get: (url, config) => http.get(url, config as HttpRequestConfig),
  post: (url, data, config) => http.post(url, data, config as HttpRequestConfig),
  put: (url, data, config) => http.put(url, data, config as HttpRequestConfig),
  delete: (url, config) => http.delete(url, config as HttpRequestConfig),
};

export const apiClient = createApiClient(apiHttp);
