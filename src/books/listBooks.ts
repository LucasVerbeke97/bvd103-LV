import Router from 'koa-router';
import assignment from '../../adapter/assignment-4';

const router = new Router();

// Main route to display and filter books
router.get('/', async (ctx) => {
    const minPrice = parseFloat(ctx.query.minPrice as string) || 0;
    const maxPrice = parseFloat(ctx.query.maxPrice as string) || Infinity;
    const titleFilter = Array.isArray(ctx.query.title) ? ctx.query.title.join(' ').toLowerCase() : (ctx.query.title || '').toLowerCase();
    const authorFilter = Array.isArray(ctx.query.author) ? ctx.query.author.join(' ').toLowerCase() : (ctx.query.author || '').toLowerCase();

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
        </form>`;

    let bookList = `<table border="1" cellpadding="5" cellspacing="0">
        <thead><tr>
            <th>Title</th><th>Author</th><th>Description</th><th>Cover</th>
        </tr></thead><tbody>`;

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
            ${book.id ? `ID: ${book.id}` : ''}
            <img src="${book.image}" alt="Book Cover" width="200" height="300">
            <center>$${book.price}</center></td>
        </tr>`;
    });
    bookList += `</tbody></table>`;

    ctx.body = filterForm + bookList;
});

export default router;
