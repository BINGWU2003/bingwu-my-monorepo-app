<script setup lang="ts">
import { showSuccessToast } from 'vant';
import type { FieldRule } from 'vant';
import { useAuthStore } from '@/store/modules/auth';
import { useDarkModeStore } from '@/store/modules/dark-mode';
import logo from '@/assets/logo.svg';
import logoDark from '@/assets/logo-dark.svg';
import { registerApi } from '@/api/auth';
import { loginSchema, registerSchema } from '@bingwu-my-monorepo/shared-schemas';
import 'vant/es/toast/style';

interface ZodLike {
  safeParse(
    val: unknown
  ): { success: true } | { success: false; error: { issues: { message: string }[] } };
}

defineOptions({ name: 'Login' });

const router = useRouter();
const authStore = useAuthStore();
const { theme, isDark } = storeToRefs(useDarkModeStore());

const activeTab = ref<'login' | 'register'>('login');

const loginForm = reactive({ email: '', password: '' });
const registerForm = reactive({ email: '', username: '', password: '', confirmPassword: '' });
const loading = ref(false);

/** 将 zod 字段 schema 转为 Vant FieldRule */
function zodRule(schema: ZodLike): FieldRule {
  return {
    validator: (val: string) => {
      const result = schema.safeParse(val);
      return result.success ? true : (result.error.issues[0]?.message ?? '格式错误');
    },
    trigger: 'onBlur',
  };
}

const loginRules = {
  email: [zodRule(loginSchema.shape.email)],
  password: [zodRule(loginSchema.shape.password)],
};

const registerRules = {
  email: [zodRule(registerSchema.shape.email)],
  username: [zodRule(registerSchema.shape.username)],
  password: [zodRule(registerSchema.shape.password)],
  confirmPassword: [
    {
      validator: (val: string) => val === registerForm.password || '两次密码输入不一致',
      trigger: 'onBlur',
    } as FieldRule,
  ],
};

async function handleLogin() {
  loading.value = true;
  try {
    await authStore.login({ email: loginForm.email, password: loginForm.password });
    showSuccessToast('登录成功');
    router.replace({ name: 'Demo' });
  } catch {
    // HTTP 层的 onError 已统一弹出错误提示
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  loading.value = true;
  try {
    const email = registerForm.email;
    await registerApi({
      email,
      username: registerForm.username,
      password: registerForm.password,
    });
    showSuccessToast('注册成功，请登录');
    registerForm.email = '';
    registerForm.username = '';
    registerForm.password = '';
    registerForm.confirmPassword = '';
    loginForm.email = email;
    activeTab.value = 'login';
  } catch {
    // HTTP 层的 onError 已统一弹出错误提示
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <van-config-provider :theme="theme">
    <div class="flex flex-col items-center justify-center min-h-screen bg-(--van-background)">
      <div class="mx-auto p-3 text-center w-full max-w-md">
        <div class="mb-8 mt-2">
          <van-image :src="isDark ? logoDark : logo" class="h-24 w-24" alt="logo" />
        </div>

        <van-tabs v-model:active="activeTab" class="mb-6" shrink>
          <van-tab title="登录" name="login" />
          <van-tab title="注册" name="register" />
        </van-tabs>

        <!-- 登录表单 -->
        <van-form v-if="activeTab === 'login'" validate-trigger="onSubmit" @submit="handleLogin">
          <div class="rounded-md overflow-hidden">
            <van-field
              v-model="loginForm.email"
              name="email"
              placeholder="邮箱"
              type="email"
              :rules="loginRules.email"
            />
          </div>
          <div class="mt-4 rounded-md overflow-hidden">
            <van-field
              v-model="loginForm.password"
              name="password"
              placeholder="密码"
              type="password"
              :rules="loginRules.password"
            />
          </div>
          <div class="mt-4">
            <van-button round block type="primary" native-type="submit" :loading="loading">
              登录
            </van-button>
          </div>
        </van-form>

        <!-- 注册表单 -->
        <van-form v-else validate-trigger="onSubmit" @submit="handleRegister">
          <div class="rounded-md overflow-hidden">
            <van-field
              v-model="registerForm.email"
              name="email"
              placeholder="邮箱"
              type="email"
              :rules="registerRules.email"
            />
          </div>
          <div class="mt-4 rounded-md overflow-hidden">
            <van-field
              v-model="registerForm.username"
              name="username"
              placeholder="用户名（2~20个字符）"
              :rules="registerRules.username"
            />
          </div>
          <div class="mt-4 rounded-md overflow-hidden">
            <van-field
              v-model="registerForm.password"
              name="password"
              placeholder="密码（至少6位）"
              type="password"
              :rules="registerRules.password"
            />
          </div>
          <div class="mt-4 rounded-md overflow-hidden">
            <van-field
              v-model="registerForm.confirmPassword"
              name="confirmPassword"
              placeholder="确认密码"
              type="password"
              :rules="registerRules.confirmPassword"
            />
          </div>
          <div class="mt-4">
            <van-button round block type="primary" native-type="submit" :loading="loading">
              注册
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </van-config-provider>
</template>
