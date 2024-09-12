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
        const Larry: Book = {name: bookList[n].name, author: bookList[n].author, description: bookList[n].description, price: bookList[n].price, image: bookList[n].image};
        books.push(Larry);
    }
    return books;
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};