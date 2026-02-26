import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/LoginView.vue'),
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'books',
          name: 'books',
          component: () => import('../views/BooksView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' };
  }
});

export default router;
