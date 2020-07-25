const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const json = require('koa-json');
const cors = require('@koa/cors');
const line = require('@line/bot-sdk');
const crypto = require('crypto');
const { convertToThbConfig }  = require('./config');
const botRoutes = require('./routes/bot');

app.use(bodyParser());
app.use(json());
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'HEAD'],
    exposeHeaders: ['X-Request-Id'],
  }),
)

const channelSecret = convertToThbConfig.channelSecret; // Channel secret string

app.use(async(ctx, next) => {
  line.middleware(convertToThbConfig)
  const stringBody = JSON.stringify(ctx.request.body);
  const body = stringBody; // Request body string
  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(body).digest('base64');

  if(signature !== ctx.request.headers['x-line-signature']) {
    ctx.request.status = 400;
    ctx.body = 'Unauthorized';   
  } else {
    ctx.status = 200;
    ctx.body = ctx.request.method;
    await next();
  }
})

app.use(
  botRoutes.prefix('/bot').routes()
);

const server = app.listen(8000, () => {
  console.log(`server is running on ${server.address().port}`);
})