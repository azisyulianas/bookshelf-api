const { nanoid } = require('nanoid');
const { bookshelf } = require('./bookshelf');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    }

    
    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if(readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }else{
        bookshelf.push(newBook);

        const isSuccess = bookshelf.filter((book) => book.id === id);
        
        if (isSuccess.length>0) {
                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id,
                    },
                });
                response.code(201);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan',
            });
            response.code(500);
            return response;
    }



}

const getAllBookHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    // console.log('------------');
    // console.log(books)
    // console.log('------------');

    if (reading !== undefined){
        const readingBool = reading == 1

        const books = bookshelf.filter( n => (n.reading === readingBool)).map( (o) => ({id: o['id'], name: o['name'], publisher: o['publisher']}))
        
        return {
                status: "success",
                data: {
                    books, 
                }
            }
    }

    if (finished !== undefined){
        const finishedBool = finished == 1

        const books = bookshelf.filter( n => (n.finished === finishedBool)).map( o => ({id: o['id'], name: o['name'], publisher: o['publisher']}))
        return {
                status: "success",
                data: {
                    books, 
                }
            }
    }


    if (name !== undefined){
        const searchName = `${name}`
        const books = bookshelf.filter( n => (n.name == searchName)).map( o => ({id: o['id'], name: o['name'], publisher: o['publisher']}))
        return {
                status: "success",
                data: {
                    books, 
                }
            }
    }

    const books = bookshelf.map( (o) => ({id: o['id'], name: o['name'], publisher: o['publisher']}))
        
        return {
                status: "success",
                data: {
                    books, 
                }
            }
    
}

const getBookByIdHandler = (request, h) => {
    const { bookid } = request.params;

    const book = bookshelf.filter((n) => n.id === bookid)[0];

    if (book !== undefined) {
        return {
          status: 'success',
          data: {
            book,
          },
        };
      }
    
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
}

const editBookByIdHandler = (request, h) => {
    const { bookid } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const book = bookshelf.findIndex((n) => n.id === bookid);

    if (pageCount < readPage){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
    }else if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }else{
        if (book !== -1){
            bookshelf[book] = {
                    ...bookshelf[book],
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading,
                    updatedAt,
            };
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
              });
              response.code(200);
              return response;
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;

}

const delBookByIdHandler = (request, h) => {
    const { bookid } = request.params;

    const book = bookshelf.findIndex((n) => n.id === bookid);

    if (book !== -1) {
        bookshelf.splice(book, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
    response.code(404);
    return response;

}

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    delBookByIdHandler,
};
