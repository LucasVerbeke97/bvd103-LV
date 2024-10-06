import Router from 'koa-router';
import assignment from '../../adapter/assignment-4';
import { BookRequestBody } from './types';

const router = new Router();

// Form to add or modify a book
router.get('/add-book', (ctx) => {
    const addBookForm = `
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
    ctx.body = addBookForm;
});

// Route to add or update a book
router.post('/add-book', async (ctx) => {
    const body: BookRequestBody = ctx.request.body as BookRequestBody;
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

export default router;
