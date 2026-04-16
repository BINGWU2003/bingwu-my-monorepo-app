import { apiClient } from './client';

type BooksApi = typeof apiClient.books;

export const getBookListApi = (...args: Parameters<BooksApi['list']>) =>
  apiClient.books.list(...args).then((res) => res.data);

export const getBookApi = (...args: Parameters<BooksApi['get']>) =>
  apiClient.books.get(...args).then((res) => res.data);

export const createBookApi = (...args: Parameters<BooksApi['create']>) =>
  apiClient.books.create(...args).then((res) => res.data);

export const updateBookApi = (...args: Parameters<BooksApi['update']>) =>
  apiClient.books.update(...args).then((res) => res.data);

export const deleteBookApi = (...args: Parameters<BooksApi['remove']>) =>
  apiClient.books.remove(...args).then((res) => res.data);
