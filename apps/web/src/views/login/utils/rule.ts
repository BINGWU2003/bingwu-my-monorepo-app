import { reactive } from 'vue';
import type { FormRules } from 'element-plus';
import { registerSchema, loginSchema } from '@bingwu-my-monorepo/shared-schemas';

/** 登录校验 */
const loginRules = reactive<FormRules>({
  email: [
    {
      validator: (_rule, value, callback) => {
        const result = loginSchema.shape.email.safeParse(value);
        result.success ? callback() : callback(new Error(result.error.issues[0]?.message));
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        const result = loginSchema.shape.password.safeParse(value);
        result.success ? callback() : callback(new Error(result.error.issues[0]?.message));
      },
      trigger: 'blur',
    },
  ],
});

/** 注册校验 */
const registerRules = reactive<FormRules>({
  email: [
    {
      validator: (_rule, value, callback) => {
        const result = registerSchema.shape.email.safeParse(value);
        result.success ? callback() : callback(new Error(result.error.issues[0]?.message));
      },
      trigger: 'blur',
    },
  ],
  username: [
    {
      validator: (_rule, value, callback) => {
        const result = registerSchema.shape.username.safeParse(value);
        result.success ? callback() : callback(new Error(result.error.issues[0]?.message));
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        const result = registerSchema.shape.password.safeParse(value);
        result.success ? callback() : callback(new Error(result.error.issues[0]?.message));
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

export { loginRules, registerRules };
