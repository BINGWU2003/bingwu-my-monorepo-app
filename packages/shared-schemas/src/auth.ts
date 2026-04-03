import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位').max(100),
});

export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z.string().min(2, '用户名至少2个字符').max(20, '用户名最多20个字符'),
  password: z.string().min(6, '密码至少6位').max(100, '密码最多100位'),
});

export const userInfoSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  username: z.string(),
  role: z.string(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userInfoSchema,
});

export type LoginBody = z.infer<typeof loginSchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type LoginRequest = LoginBody;
export type RegisterRequest = RegisterBody;
export type RegisterResponse = UserInfo;
