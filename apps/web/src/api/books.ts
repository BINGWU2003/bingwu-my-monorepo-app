import { apiClient } from './client';
type BooksApi = typeof apiClient.books;

/** 获取书籍列表 */
export const getBookList = (...args: Parameters<BooksApi['list']>) => {
  return apiClient.books.list(...args);
};

/** 获取单本书籍 */
export const getBook = (...args: Parameters<BooksApi['get']>) => {
  return apiClient.books.get(...args);
};

/** 创建书籍 */
export const createBook = (...args: Parameters<BooksApi['create']>) => {
  return apiClient.books.create(...args);
};

/** 更新书籍 */
export const updateBook = (...args: Parameters<BooksApi['update']>) => {
  return apiClient.books.update(...args);
};

/** 删除书籍 */
export const deleteBook = (...args: Parameters<BooksApi['remove']>) => {
  return apiClient.books.remove(...args);
};
