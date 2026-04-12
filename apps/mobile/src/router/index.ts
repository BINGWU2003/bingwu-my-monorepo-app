import { createRouter, createWebHashHistory } from 'vue-router';
import { useCachedViewStore } from '@/store/modules/cached-view';
import { useAuthStore } from '@/store/modules/auth';
import setPageTitle from '@/utils/set-page-title';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  useCachedViewStore().addCachedView(to);
  setPageTitle(to.meta.title);

  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
  }

  next();
});

export default router;
