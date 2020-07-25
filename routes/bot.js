const route = require('koa-router');
const Router = new route();
const botController = require('../controllers/bot');

Router.post('/convert/thb', botController.convertCurrency);

module.exports = Router;