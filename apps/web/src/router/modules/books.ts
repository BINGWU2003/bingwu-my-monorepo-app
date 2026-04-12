export default {
  path: '/books',
  redirect: '/books/index',
  meta: {
    icon: 'ri:book-2-line',
    title: '图书管理',
    rank: 5,
  },
  children: [
    {
      path: '/books/index',
      name: 'Books',
      component: () => import('@/views/books/index.vue'),
      meta: {
        title: '图书管理',
        icon: 'ri:book-2-line',
      },
    },
  ],
} satisfies RouteConfigsTable;
