import { http } from '@/utils/http';
import type {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  BookListQuery,
} from '@bingwu-my-monorepo/shared-types';
import type { PageResult } from '@bingwu-my-monorepo/shared';

export const getBookListApi = (params?: BookListQuery) =>
  http.get<PageResult<Book>>('/books', { params });

export const getBookApi = (id: number) => http.get<Book>(`/books/${id}`);

export const createBookApi = (data: CreateBookRequest) => http.post<Book>('/books', data);

export const updateBookApi = (id: number, data: UpdateBookRequest) =>
  http.put<Book>(`/books/${id}`, data);

export const deleteBookApi = (id: number) => http.delete<null>(`/books/${id}`);
