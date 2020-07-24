// const Koa = require('koa');
// const app = new Koa();
const koaRequest = require('koa-http-request');
const axios = require('axios');
require('dotenv').config();

const line = require('@line/bot-sdk');
const { convertToThbConfig } = require('../config');

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
  console.log('start func')
  const client = new line.Client({
    channelAccessToken: convertToThbConfig.channelAccessToken
  });
  const clientMessage = ctx.request.body.events[0].message
  let result;

  try{
    if(clientMessage.type === 'text') {
      let formattedMessage = clientMessage.text.toLowerCase().replace(/\s|,/g, '')
      console.log('formatted Message', formattedMessage)
      amount = parseFloat(formattedMessage);
      let exchangeRate = await axios.get(`https://api.exchangeratesapi.io/latest?base=USD&symbols=THB`)
      let thbRate = exchangeRate.data.rates.THB
      console.log(exchangeRate.data)  
      console.log(thbRate) 
  
      // make toFixed more accurate
      accurrateResult = Number((String(((amount * thbRate) * 100)) + "1")/100)
      result = Number(accurrateResult.toFixed(2))
    }
    
    console.log(result.toLocaleString());
  
  } catch(err) {
    console.log('error in conversion', err)
    ctx.response.status = 400;
    ctx.body = 'error occured';
  }

  const message = [
    {
      type: 'text',
      text: `${result.toLocaleString()} THB`
    },
  ];

  console.log('result test', result)
  if(isNaN(result)) {
    message[0].text = 'กรุณาใส่ตัวเลขที่ต้องการแปลงสกุลเงิน'
  }

  client.replyMessage(ctx.request.body.events[0].replyToken, message)
    .then(() => {
      ctx.response.status = 200;
      ctx.body = message;
    })
    .catch((err) => {
      console.log('error in replying', err)
      ctx.response.status = 400;
      ctx.body = 'error occured';
    });
}

module.exports = {
  webhook,
  abc,
  convertCurrency,
};