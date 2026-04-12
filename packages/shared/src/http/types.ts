import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// --------------- API 响应类型 ---------------

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PageQuery {
  page: number;
  pageSize: number;
}

// --------------- HTTP 客户端类型 ---------------

export interface CreateHttpOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  paramsSerializer?: AxiosRequestConfig['paramsSerializer'];

  getToken?: () => string | null;
  /** 默认: (t) => `Bearer ${t}` */
  formatToken?: (token: string) => string;
  whiteList?: string[];

  onRequestStart?: () => void;
  onRequestEnd?: () => void;
  onUnauthorized?: () => void;
  onError?: (message: string, status?: number) => void;

  responseHandler?: (response: AxiosResponse) => any;

  httpErrorMap?: Record<number, string>;
}

export interface HttpInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
  requestWithCancel<T = any>(
    config: AxiosRequestConfig
  ): {
    promise: Promise<T>;
    cancel: () => void;
  };
}
