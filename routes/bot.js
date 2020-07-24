const route = require('koa-router');
const Router = new route();
const botController = require('../controllers/bot');

Router.post('/convert', botController.convertCurrency);
Router.post('/echo', botController.webhook);
Router.get('/abc', botController.abc)

module.exports = Router;