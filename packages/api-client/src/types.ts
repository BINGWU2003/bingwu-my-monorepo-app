import type { ApiResponse } from '@bingwu-my-monorepo/shared';

export type HttpRequestConfig = Record<string, unknown>;
export type ApiResult<T> = ApiResponse<T>;

export interface HttpAdapter {
  get<T>(url: string, config?: HttpRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<T>;
}
