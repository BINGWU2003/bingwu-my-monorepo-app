<script setup lang="ts">
import { showSuccessToast } from 'vant';
import 'vant/es/toast/style';
import { useAuthStore } from '@/store/modules/auth';
import pkg from '../../../package.json';

defineOptions({
  name: 'About',
});

const router = useRouter();
const authStore = useAuthStore();

const version = pkg.version;

function handleLogout() {
  authStore.logout();
  showSuccessToast('已退出登录');
  router.replace({ name: 'Login' });
}
</script>

<template>
  <div class="about-page bg-(--van-background) pb-8">
    <!-- 用户信息卡片 -->
    <div class="flex flex-col items-center pt-12 pb-6 bg-(--van-background-2)">
      <van-icon name="manager-o" size="64" color="var(--van-primary-color)" class="mb-3" />
      <template v-if="authStore.isLoggedIn && authStore.user">
        <p class="text-lg font-bold text-(--van-text-color)">
          {{ authStore.user.username || '用户' }}
        </p>
        <p class="text-sm text-(--van-text-color-2) mt-1">{{ authStore.user.email }}</p>
      </template>
      <template v-else>
        <p class="text-base text-(--van-text-color-2)">未登录</p>
        <van-button
          type="primary"
          size="small"
          round
          class="mt-3"
          @click="router.push({ name: 'Login' })"
        >
          立即登录
        </van-button>
      </template>
    </div>

    <!-- 账号信息列表 -->
    <template v-if="authStore.isLoggedIn && authStore.user">
      <van-cell-group inset class="mt-4" title="账号信息">
        <van-cell title="用户名" :value="authStore.user.username || '—'" />
        <van-cell title="邮箱" :value="authStore.user.email" />
      </van-cell-group>
    </template>

    <!-- 应用信息 -->
    <van-cell-group inset class="mt-4" title="应用信息">
      <van-cell title="应用版本" :value="`v${version}`" />
      <van-cell title="应用名称" value="书籍管理" />
    </van-cell-group>

    <!-- 退出登录 -->
    <div v-if="authStore.isLoggedIn" class="mt-8 px-4">
      <van-button round block type="danger" plain @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>
