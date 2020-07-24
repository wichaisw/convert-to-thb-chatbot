const Koa = require('koa');
const app = new Koa();

const BodyParser = require('koa-bodyparser')
const json = require('koa-json');
const cors = require('@koa/cors');

app.use(BodyParser());
app.use(json());
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    exposeHeaders: ['X-Request-Id'],
  }),
)

// app.use(async ctx => {
//   ctx.body = 'hello world';
//   // console.log(ctx.request)
// });

const server = app.listen(8000, () => {
  console.log(`server is running on ${server.address().port}`);
})