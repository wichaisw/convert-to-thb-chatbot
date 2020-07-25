const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const json = require('koa-json');
const cors = require('@koa/cors');
const line = require('@line/bot-sdk');

const { convertToThbConfig }  = require('./config');

app.use(bodyParser());
app.use(json());
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'HEAD'],
    exposeHeaders: ['X-Request-Id'],
  }),
)

const botRoutes = require('./routes/bot');

app.use(async(ctx, next) => {
  ctx.status = 200
  line.middleware(convertToThbConfig)
  await next();
})

app.use(
  botRoutes.prefix('/bot').routes()
);

const server = app.listen(8000, () => {
  console.log(`server is running on ${server.address().port}`);
})