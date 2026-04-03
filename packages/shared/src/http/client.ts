import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { CreateHttpOptions, HttpInstance } from './types';

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

export function createHttp(options: CreateHttpOptions = {}): HttpInstance {
  const {
    baseURL,
    timeout = 10_000,
    headers = defaultHeaders,
    paramsSerializer,
    getToken,
    formatToken = (t: string) => `Bearer ${t}`,
    whiteList = [],
    onRequestStart,
    onRequestEnd,
    onUnauthorized,
    onError,
    responseHandler,
    httpErrorMap,
  } = options;

  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout,
    headers,
    ...(paramsSerializer ? { paramsSerializer } : {}),
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      onRequestStart?.();

      if (whiteList.some((url) => config.url?.endsWith(url))) {
        return config;
      }
      const token = getToken?.();
      if (token) {
        config.headers.Authorization = formatToken(token);
      }
      return config;
    },
    (error) => {
      onRequestEnd?.();
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      onRequestEnd?.();
      if (responseHandler) {
        return responseHandler(response);
      }
      return response.data;
    },
    (error) => {
      onRequestEnd?.();

      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        onUnauthorized?.();
      }

      if (onError) {
        const status: number | undefined = error.response?.status;
        const message = (status && httpErrorMap?.[status]) || error.message || '网络连接故障';
        onError(message, status);
      }

      return Promise.reject(error);
    }
  );

  return {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return instance.get(url, config);
    },
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return instance.post(url, data, config);
    },
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      return instance.put(url, data, config);
    },
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return instance.delete(url, config);
    },
    request<T = any>(config: AxiosRequestConfig): Promise<T> {
      return instance.request(config);
    },
    requestWithCancel<T = any>(config: AxiosRequestConfig) {
      const controller = new AbortController();
      return {
        promise: instance.request<any, T>({ ...config, signal: controller.signal }),
        cancel: () => controller.abort(),
      };
    },
  };
}
