import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginApi } from '@/api/auth';
import type { UserInfo, LoginRequest } from '@bingwu-my-monorepo/shared-schemas';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<UserInfo | null>(
    (() => {
      try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })()
  );

  const isLoggedIn = computed(() => !!token.value);

  async function login(data: LoginRequest) {
    const res = await loginApi(data);
    token.value = res.token;
    user.value = res.user;
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token, user, isLoggedIn, login, logout };
});
