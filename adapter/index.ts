import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import assignment from './assignment-4';

const app = new Koa();
const router = new Router();

// Use body parser middleware
app.use(bodyParser());

// Define the structure of the request body for adding/updating a book
interface BookRequestBody {
    id?: string; // id is optional when adding a new book
    name: string;
    author: string;
    description: string;
    price: number;
    link: string; // the URL for the book cover image
}

// Define the main route
router.get('/', async (ctx) => {
    const minPrice = parseFloat(ctx.query.minPrice as string) || 0;
    const maxPrice = parseFloat(ctx.query.maxPrice as string) || Infinity;
    const titleFilter = Array.isArray(ctx.query.title) ? ctx.query.title.join(' ').toLowerCase() : (ctx.query.title || '').toLowerCase();
    const authorFilter = Array.isArray(ctx.query.author) ? ctx.query.author.join(' ').toLowerCase() : (ctx.query.author || '').toLowerCase();

    // Form for filtering books
    const filterForm = `<h1>Books</h1>
        <form method="get">
            <label for="minPrice">Min Price:</label>
            <input type="number" name="minPrice" step="0.01" value="${minPrice || ''}" />
            <label for="maxPrice">Max Price:</label>
            <input type="number" name="maxPrice" step="0.01" value="${maxPrice || ''}" />
            <label for="title">Title:</label>
            <input type="text" name="title" value="${titleFilter || ''}" />
            <label for="author">Author:</label>
            <input type="text" name="author" value="${authorFilter || ''}" />
            <button type="submit">Filter</button>
        </form>
    `;

    // Creating book table
    let bookList = `<table border="1" cellpadding="5" cellspacing="0">
        <thead><tr>
            <th>Title</th><th>Author</th><th>Description</th><th>Cover</th>
        </tr></thead><tbody>`;

    // Fetching and filtering the books based on price, title, and author
    const books = await assignment.listBooks([{ from: minPrice, to: maxPrice }]);
    const filteredBooks = books.filter(book => 
        (book.name.toLowerCase().includes(titleFilter)) && 
        (book.author.toLowerCase().includes(authorFilter))
    );

    filteredBooks.forEach((book) => {
        bookList += `
        <tr>
            <td>${book.name}</td>
            <td>${book.author}</td>
            <td>${book.description}</td>
            <td>
        `;

        // Checks if book id is not undefined then adds it if so
        if (book.id) {
            bookList += `
            ID: ${book.id}
            `;
        }
        bookList += `
            <img src="${book.image}" alt="Book Cover" width="200" height="300">
            <center>$${book.price}</center></td>
        </tr>`;
    });
    bookList += `</tbody></table>`; // Finishing book table

    // Form to add or modify book
    const addBook = `
        <h1>Add New Book</h1>
        <form action="/add-book" method="post">
            <label for="id">ID:</label><input type="text" id="id" name="id">
            <label for="name">Name:</label><input type="text" id="name" name="name" required>
            <label for="author">Author:</label><input type="text" id="author" name="author" required>
            <label for="description">Description:</label><textarea id="description" name="description" required></textarea>
            <label for="price">Price:</label><input type="number" id="price" name="price" step="0.01" required>
            <label for="link">Link:</label><input type="url" id="link" name="link" required>
            <button type="submit">Add/Update Book</button>
        </form>`;

    // Form for removing book
    const removeBook = `
        <h1>Remove Book</h1>
        <form action="/remove-book" method="post">
            <label for="id">ID:</label><input type="text" id="id" name="id" required>
            <button type="submit">Remove Book</button>
        </form>`;

    ctx.body = filterForm + bookList + addBook + removeBook;
});

// Route to add or update a book
router.post('/add-book', async (ctx) => {
    const body: BookRequestBody = ctx.request.body as BookRequestBody; // Cast to the defined interface
    const { id, name, author, description, price, link } = body;
    try {
        await assignment.createOrUpdateBook({
            id,
            name,
            author,
            description,
            price,
            image: link,
        });
        ctx.redirect('/');
    } catch (error) {
        ctx.body = 'Error adding the book';
        console.error('Error adding book:', error);
    }
});

// Route to remove a book
router.post('/remove-book', async (ctx) => {
    const body = ctx.request.body as { id: string }; // Cast to an object with id
    const { id } = body;
    try {
        await assignment.removeBook(id);
        ctx.redirect('/');
    } catch (error) {
        ctx.body = 'Error removing the book';
        console.error('Error removing book:', error);
    }
});

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
