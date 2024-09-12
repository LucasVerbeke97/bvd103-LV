import assignment from "./adapter/assignment-1";

const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    const bookList = await assignment.listBooks();
  ctx.body = 'Hello World '+bookList[1].author;
});

app.listen(3000);