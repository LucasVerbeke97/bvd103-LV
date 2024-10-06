import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import listBooksRoutes from './books/listBooks';
import createOrUpdateBookRoutes from './books/createOrUpdateBook';
import deleteBookRoutes from './books/deleteBook';

const app = new Koa();

// Use body parser middleware
app.use(bodyParser());

app.use(listBooksRoutes.routes());
app.use(listBooksRoutes.allowedMethods());
app.use(createOrUpdateBookRoutes.routes());
app.use(createOrUpdateBookRoutes.allowedMethods());
app.use(deleteBookRoutes.routes());
app.use(deleteBookRoutes.allowedMethods());

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
