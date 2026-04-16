import { apiClient } from './client';
type AuthApi = typeof apiClient.auth;

export const loginApi = async (...args: Parameters<AuthApi['login']>) => {
  const res = await apiClient.auth.login(...args);
  return res.data;
};

export const registerApi = (...args: Parameters<AuthApi['register']>) =>
  apiClient.auth.register(...args).then((res) => res.data);
