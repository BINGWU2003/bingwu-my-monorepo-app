<script setup lang="ts">
import { showFailToast, showSuccessToast } from 'vant';
import { useAuthStore } from '@/store/modules/auth';
import 'vant/es/toast/style';

defineOptions({ name: 'Login' });

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});
const loading = ref(false);

async function handleLogin() {
  if (!form.email || !form.password) {
    showFailToast('请填写完整信息');
    return;
  }
  loading.value = true;
  try {
    await authStore.login({ email: form.email, password: form.password });
    showSuccessToast('登录成功');
    router.replace({ name: 'Demo' });
  } catch (err: any) {
    showFailToast(err?.message || '登录失败');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="login-page flex flex-col items-center justify-center min-h-screen px-6 bg-[var(--van-background)]"
  >
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold mb-2">书籍管理</h1>
      <p class="text-sm text-[var(--van-text-color-2)]">登录以继续</p>
    </div>

    <van-form class="w-full" @submit="handleLogin">
      <van-cell-group inset>
        <van-field
          v-model="form.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          type="email"
          :rules="[{ required: true, message: '请输入邮箱' }]"
        />
        <van-field
          v-model="form.password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          type="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>

      <div class="mt-6 px-4">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
          loading-text="登录中..."
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>
