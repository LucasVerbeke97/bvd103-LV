import assignment1 from "./assignment-1";
import * as fs from 'fs';

const {MongoClient} = require("mongodb");

const uri = "mongodb+srv://micluc97:Poop23@mcmasterful-books.s6a4e.mongodb.net/?retryWrites=true&w=majority&appName=mcmasterful-books";

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

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {

    const database = client.db('McMasterful-Books');
    const collection = database.collection('Books');

    const books = await collection.find({}).toArray();

    let hasBook = false;

    for(let i=0; i<books.length; i++){
        if(books[i].id == book.id){
            hasBook = true;            
            let updateBook = {id: book.id, name: book.name, author: book.author, description: book.description, price: book.price, image: book.image};

            //put logic to update book here
            collection.updateOne(updateBook);
            //not working yet >:(
            console.log('book updated');
        }
    }

    if(!hasBook){
        
        collection.insertOne(book);

        console.log('book added');
    }

    if(book.id)
        return book.id;
    else
        return '';
}

async function removeBook(book: BookID): Promise<void> {

    const database = client.db('McMasterful-Books');
    const collection = database.collection('Books');

    const books = await collection.find({}).toArray();
    
    for(let i=0; i<books.length; i++){
        if(books[i].id == book){
            collection.deleteOne({id: book});
            console.log('book removed');
            //logic to remove book here
            break;
        }
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};