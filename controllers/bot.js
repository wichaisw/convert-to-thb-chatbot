const line = require('@line/bot-sdk');
const { convertToThbConfig }  = require('../config');


const webhook = async(ctx) => {
  const LINE_HEADER = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${convertToThbConfig.channelAccessToken}`
  };
  
  ctx.request.headers = LINE_HEADER

  const client = new line.Client(convertToThbConfig);
  function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: event.message.text
    });
  }

  Promise
    .all(ctx.request.body.events.map(handleEvent))
    .then((result) => {
      ctx.response.status = 200
      ctx.body = result
    })
    .catch((err) => {
      console.log('my error', err)
    }) 
}

const abc = async ctx => {
  ctx.body = 'abc'
}

const convertCurrency = async(ctx) => {
  const client = new line.Client({
    channelAccessToken: convertToThbConfig.channelAccessToken
  });
  
  const message = {
    type: 'text',
    text: 'Hello World!'
  };
  
  client.replyMessage('<replyToken>', message)
    .then(() => {
    })
    .catch((err) => {
    });

  ctx.response.status = 200;
  ctx.body = 'success'
}

module.exports = {
  webhook,
  abc,
  convertCurrency,
};