import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import assignment from './assignment-2'; 

const app = new Koa();
const router = new Router();

app.use(bodyParser()); 

router.get('/', async (ctx: { query: { minPrice: string; maxPrice: string; }; body: string; }) => {
    const minPrice = parseFloat(ctx.query.minPrice as string) || 0;
    const maxPrice = parseFloat(ctx.query.maxPrice as string) || Infinity;

    let form = `<h1>Books</h1>
        <form method="get">
        <label for="minPrice">Min Price:</label>
        <input type="number" name="minPrice" step="0.01" value="${minPrice || ''}" />
        <label for="maxPrice">Max Price:</label>
        <input type="number" name="maxPrice" step="0.01" value="${maxPrice || ''}" />
        <button type="submit">Filter</button>
        </form>
    `;

    let bookList = `<table border="1" cellpadding="5" cellspacing="0">
        <thead><tr>
        <th>Title</th><th>Author</th><th>Description</th><th>Cover</th>
        </tr></thead><tbody>`;

    let books = await assignment.listBooks([{ from: minPrice, to: maxPrice }]);
    books.forEach((book) => {
        bookList += `
        <tr>
            <td>${book.name}</td>
            <td>${book.author}</td>
            <td>${book.description}</td>
            <td>
            <img src="${book.image}" alt="Book Cover" width="200" height="300">
            <center>$${book.price}</center></td>
        </tr>`;
        });
    bookList += `</tbody></table>`;

    const addBook = `
        <h1>Add New Book</h1>
        <form action="/add-book" method="post">
            <label for="id">ID:</label><input type="text" id="id" name="id">
            <label for="name">Name:</label><input type="text" id="name" name="name" required>
            <label for="author">Author:</label><input type="text" id="author" name="author" required>
            <label for="description">Description:</label><textarea id="description" name="description" required></textarea>
            <label for="price">Price:</label><input type="number" id="price" name="price" step="0.01" required>
            <label for="link">Link:</label><input type="url" id="link" name="link" required>
            <button type="submit">Add Book</button>
        </form>`;

    const removeBook = `
        <h1>Remove Book</h1>
        <form action="/remove-book" method="post">
            <label for="id">ID:</label><input type="text" id="id" name="id" required>
            <button type="submit">Remove Book</button>
        </form>`;

    ctx.body = form + bookList + addBook + removeBook;
});


router.post('/add-book', async (ctx: { request: { body: { id: any; name: any; author: any; description: any; price: any; link: any; }; }; redirect: (arg0: string) => void; body: string; }) => {
    const { id, name, author, description, price, link } = ctx.request.body;
    try {
        await assignment.createOrUpdateBook({
            id,
            name,
            author,
            description,
            price: parseFloat(price),
            image: link
        });
        ctx.redirect('/');
    } catch (error) {
        ctx.body = 'Error adding the book';
        console.error('Error adding book:', error);
    }
});


router.post('/remove-book', async (ctx: { request: { body: { id: any; }; }; redirect: (arg0: string) => void; body: string; }) => {
    const { id } = ctx.request.body;
    try {
        await assignment.removeBook(id);
        ctx.redirect('/');
    } catch (error) {
        ctx.body = 'Error removing the book';
        console.error('Error removing book:', error);
    }
});

app.use(router.routes());
app.use(router.allowedMethods()); 

app.listen(3000);

export default assignment;