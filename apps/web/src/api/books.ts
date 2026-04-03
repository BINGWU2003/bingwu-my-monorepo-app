import { http } from '@/utils/http';

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  price: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookListResult = {
  code: number;
  message: string;
  data: {
    list: Book[];
    total: number;
    page: number;
    pageSize: number;
  };
};

export type BookResult = {
  code: number;
  message: string;
  data: Book;
};

export type BookListQuery = {
  page?: number;
  pageSize?: number;
  title?: string;
  author?: string;
};

export type CreateBookData = {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  price?: number;
  publishedAt?: string;
};

export type UpdateBookData = Partial<CreateBookData>;

/** 获取书籍列表 */
export const getBookList = (params: BookListQuery): Promise<BookListResult> => {
  return http.get('/api/books', { params }) as Promise<BookListResult>;
};

/** 获取单本书籍 */
export const getBook = (id: number): Promise<BookResult> => {
  return http.get(`/api/books/${id}`) as Promise<BookResult>;
};

/** 创建书籍 */
export const createBook = (data: CreateBookData): Promise<BookResult> => {
  return http.post('/api/books', data) as Promise<BookResult>;
};

/** 更新书籍 */
export const updateBook = (id: number, data: UpdateBookData): Promise<BookResult> => {
  return http.put(`/api/books/${id}`, data) as Promise<BookResult>;
};

/** 删除书籍 */
export const deleteBook = (id: number): Promise<{ code: number; message: string; data: null }> => {
  return http.delete(`/api/books/${id}`) as Promise<{
    code: number;
    message: string;
    data: null;
  }>;
};
