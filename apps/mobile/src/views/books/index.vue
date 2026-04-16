<script setup lang="ts">
import type { Book, BookListQuery } from '@bingwu-my-monorepo/shared-schemas';
import { showFailToast, showSuccessToast } from 'vant';
import { getBookListApi, deleteBookApi } from '@/api/books';
import 'vant/es/toast/style';

defineOptions({ name: 'Books' });

const bookList = ref<Book[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const query = reactive<Required<BookListQuery>>({
  page: 1,
  pageSize: 10,
  title: '',
  author: '',
});

async function loadBooks() {
  try {
    const res = await getBookListApi({
      page: query.page,
      pageSize: query.pageSize,
      ...(query.title ? { title: query.title } : {}),
      ...(query.author ? { author: query.author } : {}),
    });
    if (query.page === 1) {
      bookList.value = res.list;
    } else {
      bookList.value.push(...res.list);
    }
    finished.value = bookList.value.length >= res.total;
    query.page++;
  } catch (err: any) {
    showFailToast(err?.message || '加载失败');
    finished.value = true;
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

function onRefresh() {
  query.page = 1;
  finished.value = false;
  loadBooks();
}

async function handleDelete(id: number) {
  try {
    await deleteBookApi(id);
    showSuccessToast('删除成功');
    onRefresh();
  } catch (err: any) {
    showFailToast(err?.message || '删除失败');
  }
}

function formatPrice(price: number | null) {
  if (!price) return '-';
  return `¥${price.toFixed(2)}`;
}
</script>

<template>
  <div class="books-page pt-[10px] px-[12px]">
    <div class="pl-[12px] border-l-[3px] border-[color:#41b883] mb-[12px]">
      <h3 class="font-bold text-[18px] my-[4px]">书籍列表</h3>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadBooks"
      >
        <van-swipe-cell v-for="book in bookList" :key="book.id">
          <van-cell :title="book.title" :label="`${book.author} · ${formatPrice(book.price)}`">
            <template #value>
              <van-tag v-if="book.isbn" plain type="primary" class="text-[11px]">
                {{ book.isbn }}
              </van-tag>
            </template>
          </van-cell>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              class="h-full"
              @click="handleDelete(book.id)"
            />
          </template>
        </van-swipe-cell>

        <van-empty v-if="!loading && bookList.length === 0" description="暂无书籍" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
