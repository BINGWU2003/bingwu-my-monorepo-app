import type { Book as PrismaBook } from '@prisma/client';

export type BookDto = {
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

export function serializeBook(book: PrismaBook): BookDto {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description,
    price: book.price == null ? null : Number(book.price),
    publishedAt: book.publishedAt ? book.publishedAt.toISOString() : null,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}

export function serializeBooks(books: PrismaBook[]): BookDto[] {
  return books.map(serializeBook);
}
