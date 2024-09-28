import assignment1 from "./assignment-1";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();//configs the dotenv file

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {MongoClient} = require("mongodb");
const uri = process.env.MONGODB_URI || "";//gets link to db from dotenv

if (!uri) {
    throw new Error('MongoDB URI not found in environment variables.');
}

const client = new MongoClient(uri);//connects to the mongoDB

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

    //connects to db
    const database = client.db('McMasterful-Books');
    const collection = database.collection('Books');

    const bookExists = await collection.findOne({id: book.id});//checks if book existas and stores it in variable

    if(bookExists){//checks if book is not undefined so that it can update
        const bookUpdate = {
            $set: {
                name: book.name,
                author: book.author,
                description: book.description,
                price: book.price,
                image: book.image
            }
        };

        await collection.updateOne({ id: book.id}, bookUpdate);
    }else{//if book is undefine new book is created
        await collection.insertOne(book);
    }
    return book.id || '';
}

async function removeBook(book: BookID): Promise<void> {

    //connects to db
    const database = client.db('McMasterful-Books');
    const collection = database.collection('Books');

    //matches bookid and removes it
    await collection.deleteOne({id: book});
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};