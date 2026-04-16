import { http } from '@/utils/http';
import type {
  Book as BookModel,
  BookListQuery as BookListQueryModel,
  CreateBookRequest,
  UpdateBookRequest,
} from '@bingwu-my-monorepo/shared-schemas';
import type { ApiResponse, PageResult } from '@bingwu-my-monorepo/shared';

export type Book = BookModel;
export type BookListQuery = BookListQueryModel;
export type BookListResult = ApiResponse<PageResult<Book>>;
export type BookResult = ApiResponse<Book>;
export type DeleteBookResult = ApiResponse<null>;

export type CreateBookData = CreateBookRequest;
export type UpdateBookData = UpdateBookRequest;

/** 获取书籍列表 */
export const getBookList = (params: BookListQuery): Promise<BookListResult> => {
  return http.get('/books', { params }) as Promise<BookListResult>;
};

/** 获取单本书籍 */
export const getBook = (id: number): Promise<BookResult> => {
  return http.get(`/books/${id}`) as Promise<BookResult>;
};

/** 创建书籍 */
export const createBook = (data: CreateBookData): Promise<BookResult> => {
  return http.post('/books', data) as Promise<BookResult>;
};

/** 更新书籍 */
export const updateBook = (id: number, data: UpdateBookData): Promise<BookResult> => {
  return http.put(`/books/${id}`, data) as Promise<BookResult>;
};

/** 删除书籍 */
export const deleteBook = (id: number): Promise<DeleteBookResult> => {
  return http.delete(`/books/${id}`) as Promise<DeleteBookResult>;
};
