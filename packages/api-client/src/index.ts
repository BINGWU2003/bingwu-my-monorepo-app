import { createAuthApi } from './auth';
import { createBooksApi } from './books';
import type { HttpAdapter } from './types';

export * from './auth';
export * from './books';
export * from './types';

export function createApiClient(http: HttpAdapter) {
  return {
    auth: createAuthApi(http),
    books: createBooksApi(http),
  };
}
