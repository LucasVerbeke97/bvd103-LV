import { formatDiagnostic } from "typescript";
import bookList from "../mcmasteful-book-list.json";

export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};


// If you have multiple filters, a book matching any of them is a match.
async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    const books: Book[] = [];

    for (let n=0; n<bookList.length; n++){
            const book: Book = {name: bookList[n].name, author: bookList[n].author, description: bookList[n].description, price: bookList[n].price, image: bookList[n].image};
            books.push(book);
    }
    
    return new Promise((resolve) => {
        let bookFilter = books;
    
        if (filters && filters.length > 0) {
          bookFilter = bookFilter.filter((book) => {
            return filters.some((filter) => {
              const { from = 0, to = Infinity } = filter;
              return book.price >= from && book.price <= to;
            });
          });
        }
    
        resolve(bookFilter);
      });

}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};