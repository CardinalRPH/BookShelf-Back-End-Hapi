/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import { nanoid } from 'nanoid';
import bookshelf from '../data/bookshelf.js';

export const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(8);

  if (name) {
    if (readPage <= pageCount) {
      const finished = pageCount === readPage;
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      bookshelf.push({
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
      });
      if (bookshelf.filter((book) => book.id == id).length > 0) {
        return h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        }).code(201);
      }
      return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      }).code(500);
    }
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  return h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  }).code(400);
};

export const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    return h.response({
      status: 'success',
      data: {
        books: bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  } if (reading) {
    const ReadingBook = reading === 1 ? bookshelf.filter((book) => book.reading === true) : bookshelf.filter((book) => book.reading === false);
    return h.response({
      status: 'success',
      data: {
        books: ReadingBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  } if (finished) {
    const FinishedBook = finished === 1 ? bookshelf.filter((book) => book.finished === true) : bookshelf.filter((book) => book.finished === false);
    return h.response({
      status: 'success',
      data: {
        books: FinishedBook.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }
  if (bookshelf != '') {
    return h.response({
      status: 'success',
      data: {
        books: bookshelf.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Bookshelf Kosong',
  }).code(404);
};

export const getBookbyId = (request, h) => {
  const { bookId } = request.params;

  const book = bookshelf.filter((book) => book.id === bookId)[0];
  if (book) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

export const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name) {
    if (readPage <= pageCount) {
      const finished = pageCount === readPage;
      const index = bookshelf.findIndex((book) => book.id === bookId);
      if (index >= 0) {
        bookshelf[index].name = name;
        bookshelf[index].year = year;
        bookshelf[index].author = author;
        bookshelf[index].summary = summary;
        bookshelf[index].publisher = publisher;
        bookshelf[index].pageCount = pageCount;
        bookshelf[index].readPage = readPage;
        bookshelf[index].reading = reading;
        bookshelf[index].finished = finished;
        bookshelf[index].updatedAt = new Date().toISOString();
        return h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        }).code(200);
      }
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
    }
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Mohon isi nama buku',
  }).code(400);
};

export const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index >= 0) {
    bookshelf.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

export const getDetailFinishedbyId = (request, h) => {
  const { bookIdWithFinishedReading } = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookIdWithFinishedReading);
  if (index >= 0) {
    if (bookshelf[index].finished == true) {
      return h.response({
        status: 'success',
        data: bookshelf[index],
      }).code(200);
    }
    return h.response({
      status: 'fail',
      message: 'Buku Belum selesai dibaca',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};
