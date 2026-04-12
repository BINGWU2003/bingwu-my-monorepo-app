import { createHttp, ApiCode, HTTP_ERROR_MAP } from '@bingwu-my-monorepo/shared';
import { showFailToast } from 'vant';
import NProgress from '../progress';
import 'vant/es/toast/style';

export const http = createHttp({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 0,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  getToken: () => localStorage.getItem('token'),
  onRequestStart: () => NProgress.start(),
  onRequestEnd: () => NProgress.done(),
  onError: (message) => showFailToast(message),
  httpErrorMap: HTTP_ERROR_MAP,
  responseHandler: (response) => {
    const { code, data } = response.data;
    if (Reflect.has(response.data, 'code') && code === ApiCode.SUCCESS) {
      return data;
    }
    return Promise.reject(response.data);
  },
});
