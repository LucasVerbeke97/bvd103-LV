import previous_assignment from './assignment-3'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
  stock?: number
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};



import { MongoClient } from "mongodb"
const uri = process.env.MONGODB_URI || "";//gets link to db from dotenv

if (!uri) {
    throw new Error('MongoDB URI not found in environment variables.');
}

const client = new MongoClient(uri);//connects to the mongoDB

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks (filters?: Filter[]): Promise<Book[]> {
  return previous_assignment.listBooks(filters);
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

async function lookupBookById (book: BookID): Promise<Book | null> {

  const database = client.db('McMasterful-Books');
  const collection = database.collection('Books');

  let bookToFind: Book;

  const bookExists = await collection.findOne({id: book});


  if(bookExists){
      bookToFind = {
        id: bookExists.id,
        name: bookExists.name,
        author: bookExists.author,
        description: bookExists.description,
        price: bookExists.price,
        image: bookExists.image

    };
    return bookToFind;
  }

  return null;

}

export type ShelfId = string
export type OrderId = string

async function placeBooksOnShelf (bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {
  throw new Error("Todo")
}

async function orderBooks (order: BookID[]): Promise<{ orderId: OrderId }> {
  throw new Error("Todo")
}

async function findBookOnShelf (book: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  throw new Error("Todo")
}

async function fulfilOrder (order: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {
  throw new Error("Todo")
}

async function listOrders (): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  throw new Error("Todo")
}

const assignment = 'assignment-4'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById
}