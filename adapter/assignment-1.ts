import { formatDiagnostic } from "typescript";

require('dotenv').config();

const {MongoClient} = require("mongodb");

const uri = process.env.MONGODB_URI || "";

if (!uri) {
    throw new Error('MongoDB URI not found in environment variables.');
}

const client = new MongoClient(uri);

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};


// If you have multiple filters, a book matching any of them is a match.
async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    const database = client.db('McMasterful-Books');
    const collection = database.collection('Books');

    const bookList = await collection.find({}).toArray();

    const books: Book[] = [];

    for (let n=0; n<bookList.length; n++){
        if(bookList[n].name){
            const book: Book = {name: bookList[n].name, author: bookList[n].author, description: bookList[n].description, price: bookList[n].price, image: bookList[n].image};
            if(bookList[n].id){
                book.id = bookList[n].id;
            }
            if (filters && filters.length>0){
                for (let i=0; i<filters.length; i++){
                    const currentFilter = filters[i];

                    if(currentFilter.from == 0 && currentFilter.to == Infinity){
                        books.push(book);
                    }
                    else if(currentFilter.from && book.price > currentFilter.from || currentFilter.from == 0){
                        if(currentFilter.to && book.price < currentFilter.to){
                            books.push(book);
                        }
                    }
                }
            } 
        }      
    }

    return books;

}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};