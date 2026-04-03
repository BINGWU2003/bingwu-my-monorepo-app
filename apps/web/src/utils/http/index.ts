import { createHttp } from '@bingwu-my-monorepo/shared';
import type { CustomParamsSerializer } from 'axios';
import { stringify } from 'qs';
import { getToken, formatToken, removeToken } from '@/utils/auth';
import { router } from '@/router';

export const http = createHttp({
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
  whiteList: ['/api/auth/login', '/api/auth/register'],
  getToken: () => getToken()?.accessToken ?? null,
  formatToken: (token: string) => formatToken(token),
  onUnauthorized: () => {
    removeToken();
    router.push('/login');
  },
});
