import Router from 'koa-router';
import assignment from '../../adapter/assignment-4';

const router = new Router();

// Form to remove a book
router.get('/remove-book', (ctx) => {
    const removeBookForm = `
        <h1>Remove Book</h1>
        <form action="/remove-book" method="post">
            <label for="id">ID:</label><input type="text" id="id" name="id" required>
            <button type="submit">Remove Book</button>
        </form>`;
    ctx.body = removeBookForm;
});

// Route to remove a book
router.post('/remove-book', async (ctx) => {
    const body = ctx.request.body as { id: string };
    const { id } = body;
    try {
        await assignment.removeBook(id);
        ctx.redirect('/');
    } catch (error) {
        ctx.body = 'Error removing the book';
        console.error('Error removing book:', error);
    }
});

export default router;
