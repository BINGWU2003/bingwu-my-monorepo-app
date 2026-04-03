import { reactive } from 'vue';
import type { FormRules } from 'element-plus';

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** 登录校验 */
const loginRules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '请输入有效的邮箱地址',
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

/** 注册校验 */
const registerRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为 2-20 位', trigger: 'blur' },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
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
