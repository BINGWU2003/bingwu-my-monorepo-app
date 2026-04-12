import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      noCache: true,
    },
  },
  {
    path: '/',
    name: 'root',
    component: Layout,
    redirect: { name: 'Demo' },
    children: [
      {
        path: 'demo',
        name: 'Demo',
        component: () => import('@/views/demo/index.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/tools/index.vue'),
        meta: {
          title: '工具',
        },
      },
      {
        path: 'books',
        name: 'Books',
        component: () => import('@/views/books/index.vue'),
        meta: {
          title: '书籍',
          requiresAuth: true,
        },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: {
          title: '关于',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '页面未找到',
      noCache: true,
    },
  },
];

export default routes;
