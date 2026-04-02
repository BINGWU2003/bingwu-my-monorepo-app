<script setup lang="ts">
import { type CSSProperties, computed } from 'vue';
import { useUserStoreHook } from '@/store/modules/user';

defineOptions({
  name: 'PermissionPage',
});

const elStyle = computed((): CSSProperties => {
  return {
    width: '85vw',
    justifyContent: 'start',
  };
});

const userStore = useUserStoreHook();
const username = computed(() => userStore.username);
const roles = computed(() => userStore.roles);
</script>

<template>
  <div>
    <p class="mb-2!">
      当前登录用户的角色信息（角色由后端分配，如需切换角色请使用对应账号重新登录）
    </p>
    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">
          <span>当前用户：{{ username }}</span>
        </div>
      </template>
      <p>角色：{{ roles.join(', ') }}</p>
    </el-card>
  </div>
</template>
