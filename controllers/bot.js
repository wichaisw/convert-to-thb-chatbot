const axios = require('axios');

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
  const defaultCurrency = 'USD'
  let currency;
  let amount;
  let twoDecimalResult;

  function twoDecimalRound(value) {
    return Number(Math.round(value+'e+2')+'e-2');
  }

  // currency converting
  try{
    if(clientMessage.type === 'text') {
      let formattedMessage = clientMessage.text.toUpperCase().replace(/\s|,/g, '')
      console.log('formatted Message', formattedMessage)
      
      // if there's no currency input, default currency is USD
      currency = ( isNaN(formattedMessage.slice(-3)) ) ? formattedMessage.slice(-3) : defaultCurrency;
      amount = parseFloat(formattedMessage);
      let exchangeRate = await axios.get(`https://api.exchangeratesapi.io/latest?base=${currency}&symbols=THB`)
      let thbRate = exchangeRate.data.rates.THB
      console.log(exchangeRate.data)  
      console.log(thbRate) 

      twoDecimalResult = twoDecimalRound(amount * thbRate)
    }
    
    console.log(twoDecimalResult.toLocaleString());
  } catch(err) {
    console.log('error in conversion')
    const currencyErrorMessage = [
      {
        type: 'text',
        text: `โปรดใส่รหัสย่อสกุลเงิน 3 ตัวอักษรให้ถูกต้อง`
      }
    ]
    client.replyMessage(ctx.request.body.events[0].replyToken, currencyErrorMessage)
      .then(() => {
        ctx.response.status = 400;
        ctx.body = currencyErrorMessage;
      })
  }

  const message = [
    {
      type: 'text',
      text: `${amount.toLocaleString()} ${currency} = ${twoDecimalResult.toLocaleString()} THB`
    },
  ];

  console.log('result test', twoDecimalResult)
  if(isNaN(twoDecimalResult)) {
    message[0].text = 'กรุณาใส่ตัวเลขที่ต้องการแปลงสกุลเงิน'
  }

  // reply to a client
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