import type { PageResult } from '@bingwu-my-monorepo/shared';
import type {
  Book,
  BookListQuery,
  CreateBookRequest,
  UpdateBookRequest,
} from '@bingwu-my-monorepo/shared-schemas';
import type { ApiResult, HttpAdapter } from './types';

export interface BooksApi {
  list(params?: BookListQuery): Promise<ApiResult<PageResult<Book>>>;
  get(id: number): Promise<ApiResult<Book>>;
  create(data: CreateBookRequest): Promise<ApiResult<Book>>;
  update(id: number, data: UpdateBookRequest): Promise<ApiResult<Book>>;
  remove(id: number): Promise<ApiResult<null>>;
}

export function createBooksApi(http: HttpAdapter): BooksApi {
  return {
    list(params) {
      return http.get<ApiResult<PageResult<Book>>>('/books', { params });
    },
    get(id) {
      return http.get<ApiResult<Book>>(`/books/${id}`);
    },
    create(data) {
      return http.post<ApiResult<Book>>('/books', data);
    },
    update(id, data) {
      return http.put<ApiResult<Book>>(`/books/${id}`, data);
    },
    remove(id) {
      return http.delete<ApiResult<null>>(`/books/${id}`);
    },
  };
}
