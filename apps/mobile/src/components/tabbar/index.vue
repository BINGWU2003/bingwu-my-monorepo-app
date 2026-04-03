<script setup lang="ts">
import { reactive, ref } from 'vue';

const active = ref(0);
const tabbarData = reactive([
  {
    icon: 'wap-home-o',
    title: '主页',
    to: {
      name: 'Demo',
    },
  },
  {
    icon: 'gem-o',
    title: '工具',
    to: {
      name: 'Tools',
    },
  },
  {
    icon: 'notes-o',
    title: '书籍',
    to: {
      name: 'Books',
    },
  },
  {
    icon: 'user-o',
    title: '关于',
    to: {
      name: 'About',
    },
  },
]);
</script>

<template>
  <van-tabbar v-model="active" :placeholder="true" :route="true" fixed>
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :icon="item.icon"
      :to="item.to"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>
