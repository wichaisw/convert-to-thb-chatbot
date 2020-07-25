# convert-to-thb-chatbot
A Line chatbot that convert any currency to Thai Baht using Line SDK, and Exchange rates API. Built with Koa.js.

# User Guide
You can enter amount of money along with any three-letter currency code and the chatbot will convert it into Thai Baht.
If you don't provide any currencies, it will be set as USD.
You can either have comma(,) or space in your message or neglect them all along.
This service input is case-insensitive.

### input message examples
* 1
* 2JPY
* 200,456eur
* 5.75 usd

# Dependencies
* koa
* koa-bodyparser
* koa-json
* koa-bodyparser
* @koa/cors
* @line/bot-sdk
* axios
* dotenv
