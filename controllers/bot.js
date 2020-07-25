const axios = require('axios');
const line = require('@line/bot-sdk');
const { convertToThbConfig } = require('../config');
const crypto = require('crypto');

const convertCurrency = async(ctx) => {
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
      // if there's no currency input, default currency is USD
      currency = ( isNaN(formattedMessage.slice(-3)) ) ? formattedMessage.slice(-3) : defaultCurrency;
      amount = parseFloat(formattedMessage);
      let exchangeRate = await axios.get(`https://api.exchangeratesapi.io/latest?base=${currency}&symbols=THB`)
      let thbRate = exchangeRate.data.rates.THB;
      twoDecimalResult = twoDecimalRound(amount * thbRate)

    }
  } catch(err) {
    console.log('error in conversion')
    const currencyErrorMessage = [
      {
        type: 'text',
        text: `โปรดใส่รหัสย่อสกุลเงิน 3 ตัวอักษรให้ถูกต้อง`
      }
    ]

    // reply nothing when line greet the recent added friend.
    if(ctx.request.body.events[0].type !== 'follow') {
      client.replyMessage(ctx.request.body.events[0].replyToken, currencyErrorMessage)
        .then(() => {
          ctx.response.status = 400;
          ctx.body = currencyErrorMessage;
        })
    }
  }

  try{
    const message = [
      {
        type: 'text',
        text: `${amount.toLocaleString()} ${currency} = ${twoDecimalResult.toLocaleString()} THB`
      },
    ];
  
    // if input only currency
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
        ctx.response.status = 400;
        ctx.body = 'error occured';
      });
  } catch(err) {
    console.log('reply message error', err)
    ctx.response.status = 400;
    ctx.body = 'error occured';
  }
}

module.exports = {
  convertCurrency,
};