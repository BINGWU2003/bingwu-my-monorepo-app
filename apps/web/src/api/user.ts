import { http } from '@/utils/http';

export type UserResult = {
  success: boolean;
  data: {
    avatar: string;
    username: string;
    nickname: string;
    roles: Array<string>;
    permissions: Array<string>;
    accessToken: string;
    refreshToken: string;
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expires: Date;
  };
};

/** 登录（对接真实后端 /api/auth/login） */
export const getLogin = (data?: { email: string; password: string }) => {
  return http.post<any>('/api/auth/login', data).then((res: any) => {
    const loginData = res.data;
    const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return {
      success: res.code === 0,
      data: {
        avatar: '',
        username: loginData.user.username,
        nickname: loginData.user.username,
        roles: [loginData.user.role],
        permissions: loginData.user.role === 'admin' ? ['*:*:*'] : [],
        accessToken: loginData.token,
        refreshToken: loginData.token,
        expires: sevenDaysLater,
      },
    } as UserResult;
  });
};

export type RegisterResult = {
  success: boolean;
  message: string;
};

/** 注册（对接真实后端 /api/auth/register） */
export const getRegister = (data: { email: string; username: string; password: string }) => {
  return http.post<any>('/api/auth/register', data).then((res: any) => {
    return {
      success: res.code === 0,
      message: res.message ?? '',
    } as RegisterResult;
  });
};

/** 刷新`token`（后端暂不支持，直接 reject 触发重新登录） */
export const refreshTokenApi = (_data?: object) => {
  return Promise.reject(new Error('Refresh token not supported'));
};
