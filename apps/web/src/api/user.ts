import { apiClient } from './client';
type AuthApi = typeof apiClient.auth;

export type UserResult = {
  success: boolean;
  message?: string;
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

const emptyUserData: UserResult['data'] = {
  avatar: '',
  username: '',
  nickname: '',
  roles: [],
  permissions: [],
  accessToken: '',
  refreshToken: '',
  expires: new Date(0),
};

/** 登录（对接真实后端 /auth/login） */
export const getLogin = (data?: Parameters<AuthApi['login']>[0]): Promise<UserResult> => {
  if (!data) {
    return Promise.resolve({
      success: false,
      message: '缺少登录参数',
      data: emptyUserData,
    });
  }

  return apiClient.auth
    .login(data)
    .then((res) => {
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
    })
    .catch((error: any) => ({
      success: false,
      message: error?.response?.data?.message || error?.message || '登录失败，请稍后重试',
      data: emptyUserData,
    }));
};

export type RegisterResult = {
  success: boolean;
  message: string;
};

/** 注册（对接真实后端 /auth/register） */
export const getRegister = (data: Parameters<AuthApi['register']>[0]): Promise<RegisterResult> => {
  return apiClient.auth
    .register(data)
    .then((res) => ({ success: res.code === 0, message: res.message ?? '' }))
    .catch((error: any) => ({
      success: false,
      message: error?.response?.data?.message || error?.message || '注册失败，请稍后重试',
    }));
};

/** 刷新`token`（后端暂不支持，直接 reject 触发重新登录） */
export const refreshTokenApi = (_data?: object) => {
  return Promise.reject(new Error('Refresh token not supported'));
};
