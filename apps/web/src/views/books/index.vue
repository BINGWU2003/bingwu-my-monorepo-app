<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import {
  getBookList,
  createBook,
  updateBook,
  deleteBook,
  type Book,
  type BookListQuery,
  type CreateBookData,
} from '@/api/books';

defineOptions({ name: 'Books' });

// ───────────────────────── 列表 ─────────────────────────
const loading = ref(false);
const tableData = ref<Book[]>([]);
const total = ref(0);

const query = reactive<BookListQuery>({
  page: 1,
  pageSize: 10,
  title: '',
  author: '',
});

async function fetchList() {
  loading.value = true;
  try {
    const res = await getBookList(query);
    if (res.code === 0) {
      tableData.value = res.data.list;
      total.value = res.data.total;
    }
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  query.page = 1;
  fetchList();
}

function handleReset() {
  query.title = '';
  query.author = '';
  query.page = 1;
  fetchList();
}

function handleSizeChange(val: number) {
  query.pageSize = val;
  query.page = 1;
  fetchList();
}

function handleCurrentChange(val: number) {
  query.page = val;
  fetchList();
}

onMounted(fetchList);

// ───────────────────────── 弹窗表单 ─────────────────────────
type DialogMode = 'create' | 'edit';

const dialogVisible = ref(false);
const dialogMode = ref<DialogMode>('create');
const formRef = ref<FormInstance>();
const submitting = ref(false);
const editingId = ref<number | null>(null);

const emptyForm = (): CreateBookData & { id?: number } => ({
  title: '',
  author: '',
  isbn: '',
  description: '',
  price: undefined,
  publishedAt: '',
});

const form = reactive(emptyForm());

const rules: FormRules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  price: [
    {
      validator: (_rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null && Number.isNaN(Number(value))) {
          callback(new Error('价格必须为数字'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

function openCreate() {
  dialogMode.value = 'create';
  editingId.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

function openEdit(row: Book) {
  dialogMode.value = 'edit';
  editingId.value = row.id;
  Object.assign(form, {
    title: row.title,
    author: row.author,
    isbn: row.isbn ?? '',
    description: row.description ?? '',
    price: row.price ?? undefined,
    publishedAt: row.publishedAt ? row.publishedAt.slice(0, 10) : '',
  });
  dialogVisible.value = true;
}

async function handleSubmit() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    const payload: CreateBookData = {
      title: form.title,
      author: form.author,
      ...(form.isbn ? { isbn: form.isbn } : {}),
      ...(form.description ? { description: form.description } : {}),
      ...(form.price !== undefined && form.price !== null ? { price: Number(form.price) } : {}),
      ...(form.publishedAt ? { publishedAt: form.publishedAt } : {}),
    };

    if (dialogMode.value === 'create') {
      const res = await createBook(payload);
      if (res.code === 0) {
        ElMessage.success('创建成功');
        dialogVisible.value = false;
        fetchList();
      } else {
        ElMessage.error(res.message || '创建失败');
      }
    } else {
      const res = await updateBook(editingId.value!, payload);
      if (res.code === 0) {
        ElMessage.success('更新成功');
        dialogVisible.value = false;
        fetchList();
      } else {
        ElMessage.error(res.message || '更新失败');
      }
    }
  } finally {
    submitting.value = false;
  }
}

// ───────────────────────── 删除 ─────────────────────────
async function handleDelete(row: Book) {
  await ElMessageBox.confirm(`确定删除《${row.title}》吗？删除后不可恢复。`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--danger',
  });
  const res = await deleteBook(row.id);
  if (res.code === 0) {
    ElMessage.success('删除成功');
    if (tableData.value.length === 1 && query.page! > 1) {
      query.page! -= 1;
    }
    fetchList();
  } else {
    ElMessage.error(res.message || '删除失败');
  }
}
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <el-card shadow="never" class="mb-4">
      <el-form :inline="true" :model="query" class="flex flex-wrap gap-y-2">
        <el-form-item label="书名">
          <el-input v-model="query.title" placeholder="请输入书名" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input
            v-model="query.author"
            placeholder="请输入作者"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="useRenderIcon('ep:search')" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="useRenderIcon('ep:refresh')" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 + 表格 -->
    <el-card shadow="never">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-base font-medium">图书列表</span>
        <el-button type="primary" :icon="useRenderIcon('ep:plus')" @click="openCreate">
          新增图书
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" border stripe row-key="id">
        <el-table-column type="index" label="#" width="55" align="center" />
        <el-table-column prop="title" label="书名" min-width="160" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" width="120" show-overflow-tooltip />
        <el-table-column prop="isbn" label="ISBN" width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.isbn ?? '—' }}</template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="90" align="right">
          <template #default="{ row }">
            {{ row.price != null ? `¥${Number(row.price).toFixed(2)}` : '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="publishedAt" label="出版日期" width="120" align="center">
          <template #default="{ row }">
            {{ row.publishedAt ? row.publishedAt.slice(0, 10) : '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="简介" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">{{ row.description ?? '—' }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" align="center">
          <template #default="{ row }">
            {{ row.createdAt?.slice(0, 19).replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增 / 编辑 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增图书' : '编辑图书'"
      width="560px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="form.isbn" placeholder="请输入 ISBN（选填）" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="form.price"
            :precision="2"
            :min="0"
            :controls="false"
            placeholder="选填"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="出版日期" prop="publishedAt">
          <el-date-picker
            v-model="form.publishedAt"
            type="date"
            placeholder="选填"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入简介（选填）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ dialogMode === 'create' ? '创建' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
