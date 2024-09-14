import assignment from "./assignment-1";

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx: { query: { minPrice: string; maxPrice: string; }; body: string; }) => {

    const minPrice = parseFloat(ctx.query.minPrice) || 0;
    const maxPrice = parseFloat(ctx.query.maxPrice) || Infinity;

    let form = `    
    <h1>Books</h1>
        <form method="get">
        <label for="minPrice">Min Price:</label>
        <input type="number" name="minPrice" step="0.01" value="${minPrice || ''}" />
        <label for="maxPrice">Max Price:</label>
        <input type="number" name="maxPrice" step="0.01" value="${maxPrice || ''}" />
        <button type="submit">Filter</button>
        </form>
    `

    let bookList = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Description</th>
          <th>Cover</th>
        </tr>
      </thead>
      <tbody>
    `;

    const books = await assignment.listBooks([{from: minPrice, to: maxPrice}]);


    books.forEach((book) => {
        bookList += `
      <tr>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.description}</td>
        <td>
            <img src="${book.image}" alt="Book Cover" width="200" height="300">
            <center>$${book.price}</center>
        </td>
      </tr>
    `
      });
    bookList += `
      </tbody>
    </table>
    `;
    ctx.body = form+bookList;

});

app.listen(3000);

export default assignment;