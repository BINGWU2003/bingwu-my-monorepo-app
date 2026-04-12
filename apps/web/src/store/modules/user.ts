import { defineStore } from 'pinia';
import { type userType, store, router, resetRouter, routerArrays, storageLocal } from '../utils';
import { type UserResult, getLogin } from '@/api/user';
import { useMultiTagsStoreHook } from './multiTags';
import { type DataInfo, setToken, removeToken, userKey } from '@/utils/auth';

export const useUserStore = defineStore('pure-user', {
  state: (): userType => ({
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? '',
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? '',
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? '',
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    permissions: storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    isRemembered: false,
    loginDay: 7,
  }),
  actions: {
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data: { email: string; password: string }) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then((data) => {
            if (data?.success) setToken(data.data);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = '';
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      router.push('/login');
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
