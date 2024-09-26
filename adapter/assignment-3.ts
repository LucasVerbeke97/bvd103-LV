import previous_assignment from './assignment-2'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks (filters?: Filter[]): Promise<Book[]> {
  const books = await previous_assignment.listBooks(filters);

  return books.filter(book => 
    filters.some(filter => 
      (filter.from === undefined || book.price >= filter.from) &&
      (filter.to === undefined || book.price <= filter.to) &&
      (filter.name === undefined || book.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (filter.author === undefined || book.author.toLowerCase().includes(filter.author.toLowerCase()))
    )
  );
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

const assignment = 'assignment-3'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
}
