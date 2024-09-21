import assignment1 from "./assignment-1";
import * as fs from 'fs';


export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    let jsonString = fs.readFileSync('/workspaces/bvd103-ass1/mcmasteful-book-list.json', 'utf-8');

    let books = JSON.parse(jsonString);

    books.push(book);

    let newJson = JSON.stringify(books, null, 2);

    fs.writeFileSync('/workspaces/bvd103-ass1/mcmasteful-book-list.json', newJson, 'utf-8');

    if(book.id)
        return book.id;
    else
        return '';
}

async function removeBook(book: BookID): Promise<void> {
    let jsonString = fs.readFileSync('/workspaces/bvd103-ass1/mcmasteful-book-list.json', 'utf-8');

    let books = JSON.parse(jsonString);

    for(let i=0; i<books.length; i++){
        if(books[i].id == book){
            books.splice(i, 1); 
            break;
        }
    }

    let newJson = JSON.stringify(books, null, 2);

    fs.writeFileSync('/workspaces/bvd103-ass1/mcmasteful-book-list.json', newJson, 'utf-8');
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};