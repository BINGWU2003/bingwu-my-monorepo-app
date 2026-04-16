import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@bingwu-my-monorepo/shared-schemas';
import type { ApiResult, HttpAdapter } from './types';

export interface AuthApi {
  login(data: LoginRequest): Promise<ApiResult<LoginResponse>>;
  register(data: RegisterRequest): Promise<ApiResult<RegisterResponse>>;
}

export function createAuthApi(http: HttpAdapter): AuthApi {
  return {
    login(data) {
      return http.post<ApiResult<LoginResponse>>('/auth/login', data);
    },
    register(data) {
      return http.post<ApiResult<RegisterResponse>>('/auth/register', data);
    },
  };
}
