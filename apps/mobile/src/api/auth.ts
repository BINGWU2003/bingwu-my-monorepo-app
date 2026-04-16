import { http } from '@/utils/http';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@bingwu-my-monorepo/shared-schemas';

export const loginApi = (data: LoginRequest) => http.post<LoginResponse>('/auth/login', data);
export const registerApi = (data: RegisterRequest) =>
  http.post<RegisterResponse>('/auth/register', data);
