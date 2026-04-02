type Result = {
  success: boolean;
  data: Array<unknown>;
};

const permissionRouter = {
  path: '/permission',
  meta: {
    title: '权限管理',
    icon: 'ep:lollipop',
    rank: 10,
  },
  children: [
    {
      path: '/permission/page/index',
      name: 'PermissionPage',
      meta: {
        title: '页面权限',
        roles: ['admin', 'user'],
      },
    },
    {
      path: '/permission/button',
      meta: {
        title: '按钮权限',
        roles: ['admin', 'user'],
      },
      children: [
        {
          path: '/permission/button/router',
          component: 'permission/button/index',
          name: 'PermissionButtonRouter',
          meta: {
            title: '路由返回按钮权限',
            auths: ['permission:btn:add', 'permission:btn:edit', 'permission:btn:delete'],
          },
        },
        {
          path: '/permission/button/login',
          component: 'permission/button/perms',
          name: 'PermissionButtonLogin',
          meta: {
            title: '登录接口返回按钮权限',
          },
        },
      ],
    },
  ],
};

/** 返回本地静态路由数据（不再请求后端） */
export const getAsyncRoutes = (): Promise<Result> => {
  return Promise.resolve({
    success: true,
    data: [permissionRouter],
  });
};
