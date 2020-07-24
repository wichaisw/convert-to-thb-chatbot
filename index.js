const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const json = require('koa-json');
const cors = require('@koa/cors');
require('dotenv').config();
const line = require('@line/bot-sdk');

const route = require('koa-router');
const Router = new route();

const { convertToThbConfig }  = require('./config');

app.use(bodyParser());
app.use(json());
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    exposeHeaders: ['X-Request-Id'],
  }),
)

const botRoutes = require('./routes/bot');

// line.middleware(convertToThbConfig);

// app.use(
//   Router.post('/webhook', async(ctx) => {
//     console.log('sometinh')
//     ctx.request.headers = LINE_HEADER
//     Promise
//       .all(ctx.request.body.events.map(handleEvent))
//       .then((result) => {
  
  
//         ctx.response.status = 200
//         ctx.body = result
//       })
//   })
//   .routes()
// )

// const client = new line.Client(convertToThbConfig);
// function handleEvent(event) {
//   if (event.type !== 'message' || event.message.type !== 'text') {
//     return Promise.resolve(null);
//   }

//   console.log('func')

//   return client.replyMessage(event.replyToken, {
//     type: 'text',
//     text: event.message.text
//   });
// }

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