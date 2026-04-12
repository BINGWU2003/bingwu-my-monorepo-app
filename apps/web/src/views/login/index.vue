<script setup lang="ts">
import Motion from './utils/motion';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import { loginRules, registerRules } from './utils/rule';
import { ref, reactive, toRaw } from 'vue';
import { debounce } from '@pureadmin/utils';
import { useNav } from '@/layout/hooks/useNav';
import { useEventListener } from '@vueuse/core';
import type { FormInstance } from 'element-plus';
import { useLayout } from '@/layout/hooks/useLayout';
import { useUserStoreHook } from '@/store/modules/user';
import { initRouter, getTopMenu } from '@/router/utils';
import { bg, avatar, illustration } from './utils/static';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { getRegister } from '@/api/user';

import dayIcon from '@/assets/svg/day.svg?component';
import darkIcon from '@/assets/svg/dark.svg?component';
import Lock from '~icons/ri/lock-fill';
import User from '~icons/ri/user-3-fill';

defineOptions({
  name: 'Login',
});

const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const activeTab = ref<'login' | 'register'>('login');
const ruleFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  email: 'admin@example.com',
  password: 'Admin123!',
});

const registerForm = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({
          email: ruleForm.email,
          password: ruleForm.password,
        })
        .then((res) => {
          if (res.success) {
            return initRouter().then(() => {
              disabled.value = true;
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message('登录成功', { type: 'success' });
                })
                .finally(() => (disabled.value = false));
            });
          } else {
            message(res.message || '登录失败，请检查邮箱和密码', { type: 'error' });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

const onRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      if (registerForm.password !== registerForm.confirmPassword) {
        message('两次输入的密码不一致', { type: 'error' });
        return;
      }
      loading.value = true;
      getRegister({
        email: registerForm.email,
        username: registerForm.username,
        password: registerForm.password,
      })
        .then((res) => {
          if (res.success) {
            message('注册成功，请登录', { type: 'success' });
            activeTab.value = 'login';
            ruleForm.email = registerForm.email;
            ruleForm.password = '';
            registerForm.email = '';
            registerForm.username = '';
            registerForm.password = '';
            registerForm.confirmPassword = '';
          } else {
            message(res.message || '注册失败', { type: 'error' });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

const immediateDebounce: any = debounce((formRef) => onLogin(formRef), 1000, true);

useEventListener(document, 'keydown', ({ code }) => {
  if (['Enter', 'NumpadEnter'].includes(code) && !disabled.value && !loading.value) {
    if (activeTab.value === 'login') {
      immediateDebounce(ruleFormRef.value);
    }
  }
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>

          <Motion :delay="50">
            <el-tabs v-model="activeTab" class="login-tabs" stretch>
              <el-tab-pane label="登录" name="login" />
              <el-tab-pane label="注册" name="register" />
            </el-tabs>
          </Motion>

          <!-- 登录表单 -->
          <el-form
            v-show="activeTab === 'login'"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item prop="email">
                <el-input
                  v-model="ruleForm.email"
                  clearable
                  placeholder="邮箱"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4!"
                size="default"
                type="primary"
                :loading="loading"
                :disabled="disabled"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>

          <!-- 注册表单 -->
          <el-form
            v-show="activeTab === 'register'"
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item prop="email">
                <el-input
                  v-model="registerForm.email"
                  clearable
                  placeholder="邮箱"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="130">
              <el-form-item prop="username">
                <el-input
                  v-model="registerForm.username"
                  clearable
                  placeholder="用户名"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="160">
              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="190">
              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  clearable
                  show-password
                  placeholder="确认密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4!"
                size="default"
                type="primary"
                :loading="loading"
                @click="onRegister(registerFormRef)"
              >
                注册
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('@/style/login.css');
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
